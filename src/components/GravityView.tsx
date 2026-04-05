import React, { useEffect, useRef, useCallback } from 'react'
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import { govElements } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './GravityView.css'

cytoscape.use(cola)

interface GravityViewProps {
  onSelectElement: (id: string) => void
  onDeselect: () => void
  onReset?: () => void
  selectedElementId: string | null
  previewedElementId: string | null
  darkMode: boolean
  highlightIds: string[] | null
  jurisdictionIds: string[] | null
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

// Tier assignment — used to weight edge lengths so the layout reflects hierarchy
function assignTier(id: string): number {
  const el = govElements[id]
  if (!el) return 99
  if (id === 'pm') return 0
  if (el.category === 'official' && el.subtype === 'cabinet-minister') return 1
  if (el.category === 'official' && el.subtype === 'junior-minister') return 2
  if (el.category === 'department' && (el.subtype === 'ministerial' || el.subtype === 'non-ministerial')) return 3
  if (el.category === 'department' && (el.subtype === 'agency' || el.subtype === 'division-directorate')) return 4
  return -1
}

function computeTiers(includedIds?: Set<string>): Map<string, number> {
  const include = (id: string) => !includedIds || includedIds.has(id)
  const tiers = new Map<string, number>()

  for (const id of Object.keys(govElements)) {
    if (!include(id)) continue
    const t = assignTier(id)
    if (t >= 0) tiers.set(id, t)
  }

  const queue: Array<{ id: string; tier: number }> = []
  for (const [id, t] of tiers) {
    if (t >= 1 && t <= 4) queue.push({ id, tier: t })
  }

  while (queue.length > 0) {
    const { id, tier } = queue.shift()!
    const neighbours = [
      ...(_allChildren.get(id) ?? []),
      ...(_allParents.get(id) ?? []),
    ]
    for (const nid of neighbours) {
      if (!include(nid)) continue
      const nel = govElements[nid]
      if (!nel || tiers.has(nid) || nel.category === 'group') continue
      if (nel.category === 'official' && (nel.subtype === 'civil-servant' || nel.subtype === 'independent')) continue
      const newTier = Math.max(5, tier + 1)
      tiers.set(nid, newTier)
      queue.push({ id: nid, tier: newTier })
    }
  }

  for (const id of Object.keys(govElements)) {
    if (!include(id)) continue
    const el = govElements[id]
    if (el.category !== 'official') continue
    if (el.subtype !== 'civil-servant' && el.subtype !== 'independent') continue
    if (tiers.has(id)) continue
    const children = _allChildren.get(id) ?? new Set()
    let minChildTier = Infinity
    for (const cid of children) {
      if (!include(cid)) continue
      const ct = tiers.get(cid)
      if (ct != null && ct < minChildTier) minChildTier = ct
    }
    if (minChildTier < Infinity) tiers.set(id, minChildTier - 0.5)
  }

  for (const id of Object.keys(govElements)) {
    if (!include(id)) continue
    if (!tiers.has(id)) tiers.set(id, 12)
  }

  return tiers
}

const tierMap = computeTiers()

// ── Compound node membership (computed once at module level) ──────────────────

function lightenColor(hex: string, factor = 0.65): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lr = Math.round(r + (255 - r) * factor)
  const lg = Math.round(g + (255 - g) * factor)
  const lb = Math.round(b + (255 - b) * factor)
  const h = (v: number) => v.toString(16).padStart(2, '0')
  return `#${h(lr)}${h(lg)}${h(lb)}`
}

// Cabinet members: PM, cabinet ministers, junior ministers who attend cabinet
const cabinetMemberIds = new Set<string>()
for (const el of Object.values(govElements)) {
  if (el.category === 'group') continue
  const attendsCabinet = el.subtype === 'junior-minister' && el.parentIds.includes('cabinet')
  if (el.subtype === 'cabinet-minister' || el.id === 'pm' || attendsCabinet) {
    cabinetMemberIds.add(el.id)
  }
}

// Agencies and division-directorates that are compound children of their dept
const compoundChildParent = new Map<string, string>() // childId -> parentDeptId
const compoundDeptIds = new Set<string>()
for (const el of Object.values(govElements)) {
  if (el.subtype !== 'agency' && el.subtype !== 'division-directorate') continue
  const parentDeptId = el.parentIds[0]
  if (!parentDeptId) continue
  const parent = govElements[parentDeptId]
  if (!parent || (parent.subtype !== 'ministerial' && parent.subtype !== 'non-ministerial')) continue
  compoundChildParent.set(el.id, parentDeptId)
  compoundDeptIds.add(parentDeptId)
}

function makeColaLayout(cy: cytoscape.Core) {
  return cy.layout({
    name: 'cola',
    animate: true,
    infinite: false,
    nodeSpacing: 8,
    edgeLength: (edge: any) => {
      const srcTier = tierMap.get(edge.source().id()) ?? 10
      const tgtTier = tierMap.get(edge.target().id()) ?? 10
      return 80 + Math.abs(srcTier - tgtTier) * 20
    },
    flow: { axis: 'y', minSeparation: 60 },
    padding: 80,
    fit: true,
  } as any)
}

export default function GravityView({ onSelectElement, onDeselect, onReset, selectedElementId, previewedElementId, darkMode, highlightIds, jurisdictionIds, isMobile }: GravityViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const layoutRef = useRef<cytoscape.Layouts | null>(null)
  const pinnedIdRef = useRef<string | null>(null)
  const searchActiveRef = useRef(false)
  const highlightIdsRef = useRef<string[] | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipActiveRef = useRef(false)
  const prevSelectedIdRef = useRef<string | null>(null)
  const prevPreviewedIdRef = useRef<string | null>(null)
  const previewedElementIdRef = useRef<string | null>(null)
  const isMobileRef = useRef(isMobile)
  const removedElementsRef = useRef<cytoscape.CollectionReturnValue | null>(null)

  const highlightNode = useCallback((cy: cytoscape.Core, hoveredId: string | null, _pinned: boolean) => {
    if (!hoveredId) {
      cy.nodes().removeStyle('opacity z-index border-width')
      cy.edges().removeStyle('opacity line-color target-arrow-color width z-index')
      return
    }

    const highlight = new Set<string>([hoveredId])

    const ancestorQueue = [...(_allParents.get(hoveredId) ?? [])]
    while (ancestorQueue.length > 0) {
      const pid = ancestorQueue.shift()!
      if (!govElements[pid] || highlight.has(pid)) continue
      highlight.add(pid)
      ;(_allParents.get(pid) ?? new Set()).forEach(gid => {
        if (!highlight.has(gid)) ancestorQueue.push(gid)
      })
    }

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
    cy.edges().forEach((e: any) => {
      if (idSet.has(e.source().id()) && idSet.has(e.target().id())) {
        e.style({ 'opacity': 0.4, 'line-color': '', 'target-arrow-color': '', 'width': '' })
      } else {
        e.style({ 'opacity': 0.03 })
      }
    })
  }, [])

  const handleReCentre = () => {
    const cy = cyRef.current
    if (!cy) return
    cy.fit(undefined, 80)
    pinnedIdRef.current = null
    highlightNode(cy, null, false)
    onDeselect()
    onReset?.()
  }

  const handleRandom = () => {
    const all = Object.values(govElements).filter(el => el.category !== 'group')
    const pick = all[Math.floor(Math.random() * all.length)]
    onSelectElement(pick.id)
  }

  useEffect(() => {
    if (!containerRef.current) return
    if (cyRef.current) return

    const elements: cytoscape.ElementDefinition[] = []

    // Cabinet compound container node
    const cabinetEl = govElements['cabinet']
    if (cabinetEl) {
      elements.push({
        data: {
          id: 'cabinet',
          label: 'Cabinet',
          category: 'group',
          subtype: 'cabinet',
          color: lightenColor(getElementColor('group', 'cabinet'), 0.5),
        },
      })
    }

    for (const el of Object.values(govElements)) {
      if (el.category === 'group') continue
      const color = getElementColor(el.category, el.subtype)
      // Compound parents get a lightened fill so children are legible inside them
      const isCompoundParent = compoundDeptIds.has(el.id)
      const nodeData: any = {
        id: el.id,
        label: '',
        category: el.category,
        subtype: el.subtype,
        color: isCompoundParent ? lightenColor(color) : color,
      }
      if (cabinetMemberIds.has(el.id)) {
        nodeData.parent = 'cabinet'
      } else if (compoundChildParent.has(el.id)) {
        nodeData.parent = compoundChildParent.get(el.id)
      }
      elements.push({ data: nodeData })
    }

    for (const el of Object.values(govElements)) {
      if (el.category === 'group') continue
      for (const pid of el.parentIds) {
        const parent = govElements[pid]
        if (!parent) continue
        // Skip edges implicit in compound structure
        if (pid === 'cabinet' && cabinetMemberIds.has(el.id)) continue
        if (compoundDeptIds.has(pid) && compoundChildParent.get(el.id) === pid) continue
        if (parent.category === 'group') continue
        elements.push({
          data: { id: `${pid}-${el.id}`, source: pid, target: el.id },
        })
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
        {
          selector: 'node[category="group"]',
          style: {
            'shape': 'roundrectangle',
            'border-color': '#922b21',
            'border-width': '1.5px',
            'background-opacity': 0.35,
            'label': 'data(label)',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'top',
            'text-margin-y': '8px',
            'color': '#922b21',
          } as any,
        },
        {
          selector: 'node:parent',
          style: {
            'text-valign': 'top',
            'text-margin-y': '8px',
            'font-size': '11px',
            'font-weight': 'bold',
            'padding': '20px',
            'compound-sizing-wrt-labels': 'include',
          } as any,
        },
        {
          selector: 'node.gv-previewed',
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
        {
          selector: 'node.gv-selected',
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
        {
          selector: 'edge',
          style: {
            'width': '1px',
            'line-color': darkMode ? '#555' : '#aaa',
            'target-arrow-color': darkMode ? '#555' : '#aaa',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.3,
            'events': 'no',
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

    // Run Cola layout
    const layout = makeColaLayout(cyRef.current)
    layoutRef.current = layout
    cyRef.current.one('layoutstop', () => {
      cyRef.current?.fit(undefined, 80)
    })
    layout.run()

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

    cyRef.current.on('tap', 'node', (event: any) => {
      const cy = cyRef.current
      if (!cy) return
      const hid = event.target.id()
      if (isMobileRef.current) {
        onSelectElement(hid)
      } else {
        pinnedIdRef.current = hid
        highlightNode(cy, hid, true)
        onSelectElement(hid)
      }
    })

    cyRef.current.on('tap', (event: any) => {
      if (event.target === cyRef.current) {
        pinnedIdRef.current = null
        highlightNode(cyRef.current!, null, false)
      }
    })

    return () => {
      layoutRef.current?.stop()
      if (cyRef.current) {
        cyRef.current.destroy()
        cyRef.current = null
      }
    }
  }, [onSelectElement, highlightNode, applyHighlightFilter])

  // Update edge colour when dark mode toggles
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

  // Search highlight
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    searchActiveRef.current = highlightIds !== null
    highlightIdsRef.current = highlightIds

    if (highlightIds === null) {
      if (pinnedIdRef.current) {
        highlightNode(cy, pinnedIdRef.current, true)
      } else {
        highlightNode(cy, null, false)
      }
      return
    }

    applyHighlightFilter(cy, highlightIds)
  }, [highlightIds, darkMode, highlightNode, applyHighlightFilter])

  // Jurisdiction filter: deselect if the selected element is not in the filtered set
  useEffect(() => {
    if (jurisdictionIds !== null && selectedElementId && !jurisdictionIds.includes(selectedElementId)) {
      onDeselect()
    }
  }, [jurisdictionIds, selectedElementId, onDeselect])

  // Jurisdiction filter: remove non-matching nodes and re-run Cola
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    layoutRef.current?.stop()

    if (removedElementsRef.current) {
      cy.add(removedElementsRef.current)
      removedElementsRef.current = null
    }

    if (jurisdictionIds !== null) {
      const idSet = new Set(jurisdictionIds)
      const toRemove = cy.nodes().filter((n: any) => !idSet.has(n.id()))
      removedElementsRef.current = toRemove.remove()
    }

    const layout = makeColaLayout(cy)
    layoutRef.current = layout
    layout.run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdictionIds])

  // Previewed element highlight (mobile)
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    if (prevPreviewedIdRef.current) {
      const prev = cy.getElementById(prevPreviewedIdRef.current)
      prev.removeClass('gv-previewed')
      if (prevPreviewedIdRef.current !== selectedElementId) {
        prev.data('label', '')
      }
    }
    if (previewedElementId && previewedElementId !== selectedElementId) {
      const node = cy.getElementById(previewedElementId)
      node.addClass('gv-previewed')
      node.data('label', govElements[previewedElementId]?.name ?? previewedElementId)
    }
    prevPreviewedIdRef.current = previewedElementId
    previewedElementIdRef.current = previewedElementId

    if (searchActiveRef.current && highlightIdsRef.current !== null) {
      applyHighlightFilter(cy, highlightIdsRef.current)
    } else if (pinnedIdRef.current) {
      highlightNode(cy, pinnedIdRef.current, true)
    } else {
      highlightNode(cy, null, false)
    }
  }, [previewedElementId, selectedElementId, highlightNode, applyHighlightFilter])

  // Selection indicator
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    if (prevSelectedIdRef.current && prevSelectedIdRef.current !== selectedElementId) {
      const prev = cy.getElementById(prevSelectedIdRef.current)
      if (prev.length) {
        prev.removeClass('gv-selected')
        prev.data('label', '')
      }
    }

    if (!selectedElementId) {
      prevSelectedIdRef.current = null
      return
    }
    if (!cy.getElementById(selectedElementId).length) return

    const node = cy.getElementById(selectedElementId)
    node.addClass('gv-selected')
    node.data('label', govElements[selectedElementId]?.name ?? selectedElementId)
    prevSelectedIdRef.current = selectedElementId

    pinnedIdRef.current = selectedElementId
    highlightNode(cy, selectedElementId, true)
  }, [selectedElementId, highlightNode])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipActiveRef.current && tooltipRef.current) {
      tooltipRef.current.style.left = `${e.clientX + 14}px`
      tooltipRef.current.style.top = `${e.clientY + 14}px`
    }
  }

  return (
    <div
      className={`gravity-view-wrapper${darkMode ? ' gravity-view-dark' : ' gravity-view-light'}`}
      onMouseMove={handleMouseMove}
    >
      <div ref={containerRef} className="gravity-view-canvas" />
      <div className="gravity-view-buttons">
        <button className="gravity-view-btn" onClick={handleRandom} title="Random element" aria-label="Random element" style={{ fontSize: '18px', lineHeight: 1 }}>⚄</button>
        <button className="gravity-view-btn" onClick={handleReCentre} title="Re-centre" aria-label="Re-centre">↺</button>
      </div>
      <div className="gravity-view-hint">Hover to explore · Click to select · Scroll to zoom</div>
      <div
        ref={tooltipRef}
        className={`gravity-view-tooltip${darkMode ? ' gravity-view-tooltip-dark' : ''}`}
        style={{ display: 'none' }}
      />
    </div>
  )
}
