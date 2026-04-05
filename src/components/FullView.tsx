import React, { useEffect, useRef, useCallback } from 'react'
import cytoscape from 'cytoscape'
import { govElements } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './FullView.css'

interface FullViewProps {
  onSelectElement: (id: string) => void
  onDeselect: () => void
  onReset?: () => void  // extra reset callback (e.g. clear jurisdiction filter)
  selectedElementId: string | null
  previewedElementId: string | null
  darkMode: boolean
  highlightIds: string[] | null  // when set (search/jurisdiction filter active), these nodes are highlighted
  isMobile: boolean
}

// Build adjacency sets for all elements once at module level
const _allParents = new Map<string, Set<string>>()
const _allChildren = new Map<string, Set<string>>()
for (const el of Object.values(govElements)) {
  if (!_allChildren.has(el.id)) _allChildren.set(el.id, new Set())
  if (!_allParents.has(el.id)) _allParents.set(el.id, new Set())
  for (const pid of el.parentIds) {
    if (!_allChildren.has(pid)) _allChildren.set(pid, new Set())
    _allChildren.get(pid)!.add(el.id)
    _allParents.get(el.id)!.add(pid)
  }
  for (const pid of el.secondaryParentIds ?? []) {
    if (!_allChildren.has(pid)) _allChildren.set(pid, new Set())
    _allChildren.get(pid)!.add(el.id)
    _allParents.get(el.id)!.add(pid)
  }
}

// ── Tier assignment ──────────────────────────────────────────────────────────
// Ring 0 : PM
// Ring 1 : Cabinet ministers
// Ring 2 : Junior ministers
// Ring 3 : Ministerial departments (+ non-ministerial departments)
// Ring 4 : Executive agencies + division-directorates
// Ring 5+ : Everything else, by BFS distance from any ring-1-to-4 node

function assignTier(id: string): number {
  const el = govElements[id]
  if (!el) return 99
  if (id === 'pm') return 0
  if (el.category === 'official' && el.subtype === 'cabinet-minister') return 1
  if (el.category === 'official' && el.subtype === 'junior-minister') return 2
  if (el.category === 'department' && (el.subtype === 'ministerial' || el.subtype === 'non-ministerial')) return 3
  if (el.category === 'department' && (el.subtype === 'agency' || el.subtype === 'division-directorate')) return 4
  return -1 // needs BFS
}

function computeTiers(): Map<string, number> {
  const tiers = new Map<string, number>()

  // Pass 1: assign fixed tiers
  for (const id of Object.keys(govElements)) {
    const t = assignTier(id)
    if (t >= 0) tiers.set(id, t)
  }

  // Pass 2: BFS from all tier-1-to-4 nodes outward for the remainder,
  // starting at distance 1 from the outermost fixed ring (ring 4)
  // so ring 5 = directly connected to a ring-4 node, etc.
  const queue: Array<{ id: string; tier: number }> = []
  for (const [id, t] of tiers) {
    if (t >= 1 && t <= 4) {
      queue.push({ id, tier: t })
    }
  }

  while (queue.length > 0) {
    const { id, tier } = queue.shift()!
    const neighbours = [
      ...(_allChildren.get(id) ?? []),
      ...(_allParents.get(id) ?? []),
    ]
    for (const nid of neighbours) {
      const nel = govElements[nid]
      if (!nel || tiers.has(nid) || nel.category === 'group') continue
      // Civil servants and independents are placed in pass 3 (half-rings), not BFS
      if (nel.category === 'official' && (nel.subtype === 'civil-servant' || nel.subtype === 'independent')) continue
      const newTier = Math.max(5, tier + 1)
      tiers.set(nid, newTier)
      queue.push({ id: nid, tier: newTier })
    }
  }

  // Pass 3: place civil servants and independents on a half-ring between their
  // youngest child's ring and the ring inside it. e.g. a perm sec whose department
  // is on ring 3 goes on ring 2.5 — its own dedicated ring between 2 and 3.
  for (const id of Object.keys(govElements)) {
    const el = govElements[id]
    if (el.category !== 'official') continue
    if (el.subtype !== 'civil-servant' && el.subtype !== 'independent') continue
    if (tiers.has(id)) continue

    const children = _allChildren.get(id) ?? new Set()
    let minChildTier = Infinity
    for (const cid of children) {
      const ct = tiers.get(cid)
      if (ct != null && ct < minChildTier) minChildTier = ct
    }

    if (minChildTier < Infinity) {
      tiers.set(id, minChildTier - 0.5)
    }
    // else: still unassigned — falls through to disconnected catch-all below
  }

  // Anything still unassigned (completely disconnected) goes on a far ring
  for (const id of Object.keys(govElements)) {
    if (!tiers.has(id)) tiers.set(id, 12)
  }

  return tiers
}

const tierMap = computeTiers()

// ── Position building ─────────────────────────────────────────────────────────
// Nodes in each ring are placed near their parents' angular positions so that
// children cluster angularly below their parents rather than being spread randomly.

// Normalise an angle into [0, 2π)
function normaliseAngle(a: number): number {
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
}

// Mean angle of a list of angles, handling the wraparound discontinuity at 0/2π
function meanAngle(angles: number[]): number {
  if (angles.length === 0) return 0
  const sinSum = angles.reduce((s, a) => s + Math.sin(a), 0)
  const cosSum = angles.reduce((s, a) => s + Math.cos(a), 0)
  return Math.atan2(sinSum / angles.length, cosSum / angles.length)
}

// Per-ring metadata used both for initial placement and for selection rotation
interface RingData {
  tier: number
  radius: number
  // Nodes in their sorted order around the ring (index 0 = base rotation offset 0)
  orderedIds: string[]
  // Base angle for slot i: step * i  (rotation offset is added on top)
  step: number
  // The rotation offset chosen at build time (index of slot 0 in the full circle)
  baseRotation: number
}

const ringRadius = (tier: number) => {
  // Integer tiers have fixed radii; fractional tiers (e.g. 2.5) interpolate between neighbours
  const integerRadii = (t: number) => {
    const baseRadii: Record<number, number> = { 1: 180, 2: 330, 3: 520, 4: 720 }
    return baseRadii[t] ?? 720 + (t - 4) * 220
  }
  const floor = Math.floor(tier)
  if (tier === floor) return integerRadii(floor)
  const frac = tier - floor
  return integerRadii(floor) + frac * (integerRadii(floor + 1) - integerRadii(floor))
}

function buildPositions(): {
  positions: Map<string, { x: number; y: number }>
  nodeAngles: Map<string, number>
  rings: Map<number, RingData>
} {
  const byTier = new Map<number, string[]>()
  for (const [id, t] of tierMap) {
    if (!byTier.has(t)) byTier.set(t, [])
    byTier.get(t)!.push(id)
  }

  const positions = new Map<string, { x: number; y: number }>()
  const nodeAngles = new Map<string, number>()
  const rings = new Map<number, RingData>()

  positions.set('pm', { x: 0, y: 0 })
  nodeAngles.set('pm', 0)

  const sortedTiers = [...byTier.keys()].sort((a, b) => a - b)

  for (const t of sortedTiers) {
    const ids = (byTier.get(t) ?? []).filter(id => id !== 'pm')
    const n = ids.length
    if (n === 0) continue
    const radius = ringRadius(t)

    // Target angle for each node = mean angle of already-placed parents
    const targetAngles = new Map<string, number>()
    for (const id of ids) {
      const parentAngles: number[] = []
      for (const pid of (_allParents.get(id) ?? [])) {
        if (nodeAngles.has(pid)) parentAngles.push(nodeAngles.get(pid)!)
      }
      targetAngles.set(id, parentAngles.length > 0 ? meanAngle(parentAngles) : -Math.PI / 2)
    }

    // Sort by target angle so clusters are adjacent
    ids.sort((a, b) => {
      const ta = normaliseAngle(targetAngles.get(a)!)
      const tb = normaliseAngle(targetAngles.get(b)!)
      return ta - tb
    })

    const step = (2 * Math.PI) / n

    // Find the rotation that minimises total angular deviation from targets
    let bestRotation = 0
    let bestCost = Infinity
    for (let r = 0; r < n; r++) {
      let cost = 0
      for (let i = 0; i < n; i++) {
        const placed = normaliseAngle(step * ((i + r) % n))
        const target = normaliseAngle(targetAngles.get(ids[i])!)
        let diff = Math.abs(placed - target)
        if (diff > Math.PI) diff = 2 * Math.PI - diff
        cost += diff
      }
      if (cost < bestCost) { bestCost = cost; bestRotation = r }
    }

    for (let i = 0; i < n; i++) {
      const angle = step * ((i + bestRotation) % n)
      const id = ids[i]
      positions.set(id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })
      nodeAngles.set(id, angle)
    }

    rings.set(t, { tier: t, radius, orderedIds: [...ids], step, baseRotation: bestRotation })
  }

  return { positions, nodeAngles, rings }
}

const { positions: nodePositions, nodeAngles: baseNodeAngles, rings: ringData } = buildPositions()

// ── Ring rotation for selection ───────────────────────────────────────────────
// Given a selected node, compute new positions for all nodes by rotating each
// ring so the selected node sits at angle +π/2 (bottom), then rotating every
// other ring tier-by-tier (outward from selected tier) to minimise angular
// distance between nodes and their parents' new positions.

const TARGET_ANGLE = Math.PI / 2  // selected node sits at the bottom

function computeRotatedPositions(selectedId: string): {
  positions: Map<string, { x: number; y: number }>
  ringDeltas: Map<number, number>
} | null {
  const selectedTier = tierMap.get(selectedId)
  if (selectedTier == null || selectedTier === 0) return null

  const effectiveAngles = new Map<string, number>(baseNodeAngles)
  const rotationOffsets = new Map<number, number>()

  // Step 1: rotate the selected node's ring so it lands at TARGET_ANGLE
  const selectedRing = ringData.get(selectedTier)
  if (!selectedRing) return null

  const selectedIndex = selectedRing.orderedIds.indexOf(selectedId)
  if (selectedIndex === -1) return null

  const baseAngle = selectedRing.step * ((selectedIndex + selectedRing.baseRotation) % selectedRing.orderedIds.length)
  // Shortest-arc delta so the ring rotates the least possible distance
  let delta = normaliseAngle(TARGET_ANGLE - baseAngle)
  if (delta > Math.PI) delta -= 2 * Math.PI
  rotationOffsets.set(selectedTier, delta)

  for (let i = 0; i < selectedRing.orderedIds.length; i++) {
    const id = selectedRing.orderedIds[i]
    const base = selectedRing.step * ((i + selectedRing.baseRotation) % selectedRing.orderedIds.length)
    effectiveAngles.set(id, base + delta)
  }

  // Step 2: rotate every other ring to align ancestors/descendants with the selected element.
  // Inner rings (< selectedTier): rotate so the ancestor of the selected element points
  //   at TARGET_ANGLE — i.e. the same direction as the selected node.
  // Outer rings (> selectedTier): rotate toward their parents (which are already rotated).
  const maxTier = Math.max(...ringData.keys())

  // Build the ancestor chain of the selected element (one per tier)
  const ancestorAtTier = new Map<number, string>()
  let current = selectedId
  while (true) {
    const parents = [...(_allParents.get(current) ?? [])]
    if (parents.length === 0) break
    // Pick the parent with the lowest tier (most direct ancestor chain toward PM)
    let bestParent = parents[0]
    let bestTier = tierMap.get(parents[0]) ?? 99
    for (const p of parents.slice(1)) {
      const pt = tierMap.get(p) ?? 99
      if (pt < bestTier) { bestTier = pt; bestParent = p }
    }
    if (bestTier >= (tierMap.get(current) ?? 99)) break // avoid cycles
    ancestorAtTier.set(bestTier, bestParent)
    current = bestParent
  }

  for (let t = selectedTier - 1; t >= 1; t--) {
    const ring = ringData.get(t)
    if (!ring) continue
    const ancestorId = ancestorAtTier.get(t)
    applyRotationTowardTarget(ring, ancestorId ?? null, TARGET_ANGLE, effectiveAngles, rotationOffsets)
  }
  for (let t = selectedTier + 1; t <= maxTier; t++) {
    const ring = ringData.get(t)
    if (!ring) continue
    applyBestRotation(ring, effectiveAngles, rotationOffsets)
  }

  // Step 3: build final position map
  const positions = new Map<string, { x: number; y: number }>()
  positions.set('pm', { x: 0, y: 0 })
  for (const [tier, ring] of ringData) {
    const offset = rotationOffsets.get(tier) ?? 0
    for (let i = 0; i < ring.orderedIds.length; i++) {
      const id = ring.orderedIds[i]
      const angle = ring.step * ((i + ring.baseRotation) % ring.orderedIds.length) + offset
      positions.set(id, { x: Math.cos(angle) * ring.radius, y: Math.sin(angle) * ring.radius })
    }
  }

  return { positions, ringDeltas: rotationOffsets }
}

// Rotate an inner ring so that a specific node (the ancestor of the selected element)
// ends up at targetAngle. If no specific ancestor is known, fall back to no rotation.
function applyRotationTowardTarget(
  ring: RingData,
  ancestorId: string | null,
  targetAngle: number,
  effectiveAngles: Map<string, number>,
  rotationOffsets: Map<number, number>,
) {
  const { orderedIds, step, baseRotation } = ring
  const n = orderedIds.length
  if (n === 0) return

  if (ancestorId === null || !orderedIds.includes(ancestorId)) {
    rotationOffsets.set(ring.tier, 0)
    return
  }

  const idx = orderedIds.indexOf(ancestorId)
  const baseAngle = step * ((idx + baseRotation) % n)
  let delta = normaliseAngle(targetAngle - baseAngle)
  if (delta > Math.PI) delta -= 2 * Math.PI

  rotationOffsets.set(ring.tier, delta)

  for (let i = 0; i < n; i++) {
    const id = orderedIds[i]
    const angle = step * ((i + baseRotation) % n) + delta
    effectiveAngles.set(id, angle)
  }
}

function applyBestRotation(
  ring: RingData,
  effectiveAngles: Map<string, number>,
  rotationOffsets: Map<number, number>,
) {
  const { orderedIds, step, baseRotation } = ring
  const n = orderedIds.length
  if (n === 0) return

  // For each node, get the mean angle of its parents' effective positions
  const targetAngles = orderedIds.map(id => {
    const parentAngles: number[] = []
    for (const pid of (_allParents.get(id) ?? [])) {
      if (effectiveAngles.has(pid)) parentAngles.push(effectiveAngles.get(pid)!)
    }
    return parentAngles.length > 0 ? meanAngle(parentAngles) : null
  })

  // If no node on this ring has a parent with a known angle, leave the ring unchanged
  if (targetAngles.every(a => a === null)) {
    rotationOffsets.set(ring.tier, 0)
    return
  }

  // Find continuous rotation offset (not just integer steps) that minimises cost.
  // We only try n candidate offsets (shifting by one slot each time) — sufficient
  // because the inter-node spacing is fixed.
  let bestDelta = 0
  let bestCost = Infinity
  for (let r = 0; r < n; r++) {
    const candidateDelta = step * r
    let cost = 0
    for (let i = 0; i < n; i++) {
      const target = targetAngles[i]
      if (target === null) continue
      const placed = normaliseAngle(step * ((i + baseRotation) % n) + candidateDelta)
      let diff = Math.abs(normaliseAngle(placed) - normaliseAngle(target))
      if (diff > Math.PI) diff = 2 * Math.PI - diff
      cost += diff
    }
    if (cost < bestCost) { bestCost = cost; bestDelta = candidateDelta }
  }

  rotationOffsets.set(ring.tier, bestDelta)

  // Update effective angles so downstream rings see the rotated positions
  for (let i = 0; i < n; i++) {
    const id = orderedIds[i]
    const angle = normaliseAngle(step * ((i + baseRotation) % n) + bestDelta)
    effectiveAngles.set(id, angle)
  }
}

export default function FullView({ onSelectElement, onDeselect, onReset, selectedElementId, previewedElementId, darkMode, highlightIds, isMobile }: FullViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const pinnedIdRef = useRef<string | null>(null)
  const searchActiveRef = useRef(false)
  const highlightIdsRef = useRef<string[] | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipActiveRef = useRef(false)
  const prevSelectedIdRef = useRef<string | null>(null)
  const prevPreviewedIdRef = useRef<string | null>(null)
  const previewedElementIdRef = useRef<string | null>(null)
  const isMobileRef = useRef(isMobile)

  // Animate all nodes in a ring by rotating them along their arc.
  // Uses requestAnimationFrame-based interpolation so nodes arc around the centre.
  const animateRingRotation = useCallback((
    _cy: cytoscape.Core,
    idsAndDeltas: Array<{ id: string; fromAngle: number; toAngle: number; radius: number; node: cytoscape.NodeSingular }>,
    duration: number,
  ) => {
    const ease = (t: number) => t * t * (3 - 2 * t)
    const start = performance.now()

    // Compute shortest-arc deltas once
    const moves = idsAndDeltas.map(({ fromAngle, toAngle, radius, node }) => {
      let delta = normaliseAngle(toAngle - fromAngle)
      if (delta > Math.PI) delta -= 2 * Math.PI
      return { node, fromAngle, delta, radius }
    })

    function step(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const t = ease(progress)

      for (const { node, fromAngle, delta, radius } of moves) {
        if (!node.length) continue
        const angle = fromAngle + delta * t
        node.position({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius })
      }

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [])

  const handleReCentre = () => {
    const cy = cyRef.current
    if (!cy) return
    // Rotate every ring back to its base rotation
    const moves: Array<{ id: string; fromAngle: number; toAngle: number; radius: number; node: cytoscape.NodeSingular }> = []
    for (const ring of ringData.values()) {
      for (let i = 0; i < ring.orderedIds.length; i++) {
        const id = ring.orderedIds[i]
        const node = cy.getElementById(id)
        if (!node.length) continue
        const toAngle = ring.step * ((i + ring.baseRotation) % ring.orderedIds.length)
        const pos = node.position()
        const fromAngle = Math.atan2(pos.y, pos.x)
        moves.push({ id, fromAngle, toAngle, radius: ring.radius, node })
      }
    }
    animateRingRotation(cy, moves, 500)
    setTimeout(() => {
      const c = cyRef.current
      if (!c) return
      const pmNode = c.getElementById('pm')
      if (pmNode.length) {
        c.animate({ center: { eles: pmNode }, zoom: 0.35 } as any, { duration: 300 })
      }
    }, 520)
    pinnedIdRef.current = null
    highlightNode(cy, null, false)
    onDeselect()
    onReset?.()
  }

  const handleRandom = () => {
    const all = Object.values(govElements)
    if (!all.length) return
    const pick = all[Math.floor(Math.random() * all.length)]
    onSelectElement(pick.id)
  }

  const rotateToSelection = useCallback((cy: cytoscape.Core, selectedId: string) => {
    // Skip group nodes and anything not rendered in the graph
    if (!cy.getElementById(selectedId).length) return
    const result = computeRotatedPositions(selectedId)
    if (!result) return

    const { ringDeltas } = result

    // For each ring, animate its nodes along the arc by the ring's delta angle
    const moves: Array<{ id: string; fromAngle: number; toAngle: number; radius: number; node: cytoscape.NodeSingular }> = []
    for (const [tier, delta] of ringDeltas) {
      const ring = ringData.get(tier)
      if (!ring || Math.abs(delta) < 0.001) continue
      for (let i = 0; i < ring.orderedIds.length; i++) {
        const id = ring.orderedIds[i]
        const node = cy.getElementById(id)
        if (!node.length) continue
        const baseAngle = ring.step * ((i + ring.baseRotation) % ring.orderedIds.length)
        const fromAngle = Math.atan2(node.position().y, node.position().x)
        const toAngle = baseAngle + delta
        moves.push({ id, fromAngle, toAngle, radius: ring.radius, node })
      }
    }
    animateRingRotation(cy, moves, 600)
  }, [animateRingRotation])

  const highlightNode = useCallback((cy: cytoscape.Core, hoveredId: string | null, _pinned: boolean) => {
    if (!hoveredId) {
      // Restore everything
      cy.nodes().removeStyle('opacity z-index border-width')
      cy.edges().removeStyle('opacity line-color target-arrow-color width z-index')
      return
    }

    // Collect nodes to highlight: hovered + full ancestor chain + direct children
    const highlight = new Set<string>([hoveredId])

    // BFS upward through all ancestors
    const ancestorQueue = [...(_allParents.get(hoveredId) ?? [])]
    while (ancestorQueue.length > 0) {
      const pid = ancestorQueue.shift()!
      if (!govElements[pid] || highlight.has(pid)) continue
      highlight.add(pid)
      ;(_allParents.get(pid) ?? new Set()).forEach(gid => {
        if (!highlight.has(gid)) ancestorQueue.push(gid)
      })
    }

    // Direct children only (not grandchildren — keeps the view readable)
    ;(_allChildren.get(hoveredId) ?? new Set()).forEach(cid => { if (govElements[cid]) highlight.add(cid) })

    const previewedId = previewedElementIdRef.current
    cy.nodes().forEach((n: any) => {
      const nid = n.id()
      if (highlight.has(nid)) {
        const isHovered = nid === hoveredId
        n.style({
          'opacity': 1,
          'z-index': isHovered ? 9999 : 100,
          'border-width': isHovered ? '3px' : '2px',
        })
      } else if (previewedId && nid === previewedId) {
        // Previewed node: keep fully visible so fv-previewed class shows through
        n.style({ 'opacity': 1, 'z-index': 450 })
      } else {
        n.style({ 'opacity': 0.12, 'z-index': 0 })
      }
    })

    cy.edges().forEach((e: any) => {
      const src = e.source().id()
      const tgt = e.target().id()
      if (highlight.has(src) && highlight.has(tgt)) {
        e.style({ 'opacity': 1, 'line-color': '#333', 'target-arrow-color': '#333', 'width': '2px', 'z-index': 200 })
      } else {
        e.style({ 'opacity': 0.04 })
      }
    })
  }, [])

  // Apply the highlight filter state (used both on filter change and on mouseout)
  const applyHighlightFilter = useCallback((cy: cytoscape.Core, ids: string[]) => {
    const idSet = new Set(ids)
    cy.nodes().forEach((n: any) => {
      const nid = n.id()
      if (idSet.has(nid)) {
        n.style({ 'opacity': 1, 'z-index': 100, 'border-width': '2px' })
      } else {
        n.style({ 'opacity': 0.07, 'z-index': 0 })
      }
    })
    // Show edges where both endpoints are in the filter set
    cy.edges().forEach((e: any) => {
      if (idSet.has(e.source().id()) && idSet.has(e.target().id())) {
        e.style({ 'opacity': 0.4, 'line-color': '', 'target-arrow-color': '', 'width': '' })
      } else {
        e.style({ 'opacity': 0.03 })
      }
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    if (cyRef.current) return // Already initialised — don't re-build

    // Build all nodes
    const elements: cytoscape.ElementDefinition[] = []

    for (const el of Object.values(govElements)) {
      if (el.category === 'group') continue // Skip group nodes — too abstract at full scale
      const pos = nodePositions.get(el.id) ?? { x: 0, y: 0 }
      const color = getElementColor(el.category, el.subtype)
      elements.push({
        data: {
          id: el.id,
          label: '', // Hidden by default — revealed on hover
          category: el.category,
          subtype: el.subtype,
          color,
        },
        position: pos,
      })
    }

    // Build all edges
    for (const el of Object.values(govElements)) {
      if (el.category === 'group') continue
      for (const pid of el.parentIds) {
        if (govElements[pid] && govElements[pid].category !== 'group') {
          elements.push({
            data: {
              id: `${pid}-${el.id}`,
              source: pid,
              target: el.id,
            },
          })
        }
      }
      for (const pid of el.secondaryParentIds ?? []) {
        if (govElements[pid] && govElements[pid].category !== 'group') {
          elements.push({
            data: {
              id: `${pid}-${el.id}-sec`,
              source: pid,
              target: el.id,
              secondary: 1,
            },
          })
        }
      }
    }

    const NODE_SIZE = 22

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#222',
            'font-size': '10px',
            'min-zoomed-font-size': '10px',
            'font-weight': 'bold',
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            'width': `${NODE_SIZE}px`,
            'height': `${NODE_SIZE}px`,
            'background-color': 'data(color)',
            'border-width': '1.5px',
            'opacity': 0.85,
            'z-index': 1,
          } as any,
        },
        // Official shapes
        {
          selector: 'node[category="official"]',
          style: { 'shape': 'ellipse', 'border-color': '#c0392b' },
        },
        {
          selector: 'node[category="official"][subtype="prime-minister"]',
          style: { 'shape': 'heptagon', 'border-color': '#5c0000' },
        },
        {
          selector: 'node[category="official"][subtype="cabinet-minister"]',
          style: { 'shape': 'octagon', 'border-color': '#922b21' },
        },
        {
          selector: 'node[category="official"][subtype="junior-minister"]',
          style: { 'shape': 'ellipse', 'border-color': '#cd6155' },
        },
        {
          selector: 'node[category="official"][subtype="civil-servant"]',
          style: { 'shape': 'ellipse', 'border-color': '#2980b9' },
        },
        {
          selector: 'node[category="official"][subtype="independent"]',
          style: { 'shape': 'ellipse', 'border-color': '#229954' },
        },
        // Department shapes
        {
          selector: 'node[category="department"]',
          style: { 'shape': 'rectangle', 'border-color': '#e74c3c' },
        },
        {
          selector: 'node[category="department"][subtype="non-ministerial"]',
          style: { 'shape': 'rectangle', 'border-color': '#2980b9' },
        },
        {
          selector: 'node[category="department"][subtype="agency"]',
          style: { 'shape': 'roundrectangle', 'border-color': '#7d3c98' },
        },
        {
          selector: 'node[category="department"][subtype="division-directorate"]',
          style: { 'shape': 'roundrectangle', 'border-color': '#e74c3c' },
        },
        // Body shapes
        {
          selector: 'node[category="body"]',
          style: { 'shape': 'diamond', 'border-color': '#229954' },
        },
        {
          selector: 'node[category="body"][subtype="advisory-ndpb"]',
          style: { 'shape': 'diamond', 'border-color': '#b7950b' },
        },
        {
          selector: 'node[category="body"][subtype="tribunal"]',
          style: { 'shape': 'diamond', 'border-color': '#5d6d7e' },
        },
        {
          selector: 'node[category="body"][subtype="public-corporation"]',
          style: { 'shape': 'diamond', 'border-color': '#1a5276' },
        },
        {
          selector: 'node[category="body"][subtype="royal-charter-body"]',
          style: { 'shape': 'diamond', 'border-color': '#6c3483' },
        },
        {
          selector: 'node[category="body"][subtype="other"]',
          style: { 'shape': 'diamond', 'border-color': '#616a6b' },
        },
        // Previewed node indicator (mobile: tapped but not yet selected)
        {
          selector: 'node.fv-previewed',
          style: {
            'border-width': '3px',
            'border-color': '#2980b9',
            'opacity': 1,
            'z-index': 450,
            'font-size': '13px',
            'font-weight': 'bold',
            'min-zoomed-font-size': '8px',
            'color': '#1a1a1a',
            'text-background-color': 'white',
            'text-background-opacity': 0.95,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
            'text-max-width': '140px',
            'text-wrap': 'wrap',
            'text-valign': 'top',
            'text-margin-y': '-6',
          } as any,
        },
        // Selected node indicator
        {
          selector: 'node.fv-selected',
          style: {
            'border-width': '4px',
            'border-color': '#f39c12',
            'opacity': 1,
            'z-index': 500,
            'font-size': '13px',
            'font-weight': 'bold',
            'min-zoomed-font-size': '8px',
            'color': '#1a1a1a',
            'text-background-color': 'white',
            'text-background-opacity': 0.95,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
            'text-max-width': '140px',
            'text-wrap': 'wrap',
          } as any,
        },
        // Edges
        {
          selector: 'edge',
          style: {
            'width': '1px',
            'line-color': darkMode ? '#555' : '#aaa',
            'target-arrow-color': darkMode ? '#555' : '#aaa',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.3,
          } as any,
        },
        {
          selector: 'edge[secondary = 1]',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [4, 3],
            'opacity': 0.18,
          } as any,
        },
      ],
      layout: { name: 'preset' },
      minZoom: 0.02,
      maxZoom: 3,
    })

    // Centre on PM initially
    const pmNode = cyRef.current.getElementById('pm')
    if (pmNode.length) {
      cyRef.current.center(pmNode)
      cyRef.current.zoom({ level: 0.35, position: pmNode.position() })
    }

    // Hover: highlight connected neighbourhood
    cyRef.current.on('mouseover', 'node', (event: any) => {
      const cy = cyRef.current
      if (!cy) return
      const hid = event.target.id()
      if (pinnedIdRef.current && pinnedIdRef.current !== hid) {
        highlightNode(cy, hid, false)
      } else if (!pinnedIdRef.current) {
        highlightNode(cy, hid, false)
      }
      if (tooltipRef.current) {
        tooltipRef.current.textContent = govElements[hid]?.name ?? hid
        tooltipRef.current.style.display = 'block'
      }
      tooltipActiveRef.current = true
    })

    cyRef.current.on('mouseout', 'node', () => {
      const cy = cyRef.current
      if (!cy) return
      // Restore to filter state if active, otherwise to pinned/clear state
      if (searchActiveRef.current && highlightIdsRef.current !== null) {
        applyHighlightFilter(cy, highlightIdsRef.current)
      } else if (pinnedIdRef.current) {
        highlightNode(cy, pinnedIdRef.current, true)
      } else {
        highlightNode(cy, null, false)
      }
      if (tooltipRef.current) tooltipRef.current.style.display = 'none'
      tooltipActiveRef.current = false
    })

    // Tap: on mobile, just preview (chip shows name); on desktop, select + pin + rotate
    cyRef.current.on('tap', 'node', (event: any) => {
      const cy = cyRef.current
      if (!cy) return
      const hid = event.target.id()
      if (isMobileRef.current) {
        onSelectElement(hid)
      } else {
        pinnedIdRef.current = hid
        highlightNode(cy, hid, true)
        rotateToSelection(cy, hid)
        onSelectElement(hid)
      }
    })

    // Click on background: unpin
    cyRef.current.on('tap', (event: any) => {
      if (event.target === cyRef.current) {
        pinnedIdRef.current = null
        highlightNode(cyRef.current!, null, false)
      }
    })

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy()
        cyRef.current = null
      }
    }
  }, [onSelectElement, highlightNode, rotateToSelection])

  // Update edge colour when dark mode toggles (node label colour is handled via CSS class)
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.style()
      .selector('edge')
      .style({
        'line-color': darkMode ? '#555' : '#aaa',
        'target-arrow-color': darkMode ? '#555' : '#aaa',
      })
      .update()
  }, [darkMode])

  useEffect(() => { isMobileRef.current = isMobile }, [isMobile])

  // Search pane highlight: when highlightIds is set, dim everything else and show
  // those nodes at full opacity with their labels — no edges shown between them.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    searchActiveRef.current = highlightIds !== null
    highlightIdsRef.current = highlightIds

    if (highlightIds === null) {
      // Filter cleared — restore to pinned state or clear
      if (pinnedIdRef.current) {
        highlightNode(cy, pinnedIdRef.current, true)
      } else {
        highlightNode(cy, null, false)
      }
      return
    }

    applyHighlightFilter(cy, highlightIds)
  }, [highlightIds, darkMode, highlightNode, applyHighlightFilter])

  // Previewed element highlight (mobile: tapped node before "Select")
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    // Clear previous preview class and label (unless it's the selected node)
    if (prevPreviewedIdRef.current) {
      const prev = cy.getElementById(prevPreviewedIdRef.current)
      prev.removeClass('fv-previewed')
      if (prevPreviewedIdRef.current !== selectedElementId) {
        prev.data('label', '')
      }
    }
    // Apply to new previewed node (skip if it's the selected node — fv-selected handles that)
    if (previewedElementId && previewedElementId !== selectedElementId) {
      const node = cy.getElementById(previewedElementId)
      node.addClass('fv-previewed')
      node.data('label', govElements[previewedElementId]?.name ?? previewedElementId)
    }
    prevPreviewedIdRef.current = previewedElementId
    previewedElementIdRef.current = previewedElementId

    // Refresh highlight so the newly-previewed node is treated as fully visible
    if (searchActiveRef.current && highlightIdsRef.current !== null) {
      applyHighlightFilter(cy, highlightIdsRef.current)
    } else if (pinnedIdRef.current) {
      highlightNode(cy, pinnedIdRef.current, true)
    } else {
      highlightNode(cy, null, false)
    }
  }, [previewedElementId, selectedElementId, highlightNode, applyHighlightFilter])

  // When selectedElementId changes, update selection indicator and pin/rotate
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    // Clear previous selection indicator
    if (prevSelectedIdRef.current && prevSelectedIdRef.current !== selectedElementId) {
      const prev = cy.getElementById(prevSelectedIdRef.current)
      if (prev.length) {
        prev.removeClass('fv-selected')
        prev.data('label', '')
      }
    }

    if (!selectedElementId) {
      prevSelectedIdRef.current = null
      return
    }
    if (!cy.getElementById(selectedElementId).length) return

    // Apply selection indicator
    const node = cy.getElementById(selectedElementId)
    node.addClass('fv-selected')
    node.data('label', govElements[selectedElementId]?.name ?? selectedElementId)
    prevSelectedIdRef.current = selectedElementId

    pinnedIdRef.current = selectedElementId
    highlightNode(cy, selectedElementId, true)
    rotateToSelection(cy, selectedElementId)
  }, [selectedElementId, highlightNode, rotateToSelection])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipActiveRef.current && tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 14}px`
      tooltipRef.current.style.top = `${e.clientY + 14}px`
    }
  }

  return (
    <div
      className={`full-view-wrapper${darkMode ? ' full-view-dark' : ' full-view-light'}`}
      onMouseMove={handleMouseMove}
    >
      <div ref={containerRef} className="full-view-canvas" />
      <div className="full-view-buttons">
        <button className="full-view-btn" onClick={handleRandom} title="Random element" aria-label="Random element" style={{ fontSize: '18px', lineHeight: 1 }}>⚄</button>
        <button className="full-view-btn" onClick={handleReCentre} title="Re-centre on PM" aria-label="Re-centre on PM">↺</button>
      </div>
      <div className="full-view-hint">Hover to explore · Click to select · Scroll to zoom</div>
      <div
        ref={tooltipRef}
        className={`full-view-tooltip${darkMode ? ' full-view-tooltip-dark' : ''}`}
        style={{ display: 'none' }}
      />
    </div>
  )
}
