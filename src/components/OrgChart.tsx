import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import { govElements, GovElement } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './OrgChart.css'

interface OrgChartProps {
  onSelectElement: (id: string) => void
  selectedElementId: string | null
  onOpenCategory: (category: string, subtype: string) => void
}

export default function OrgChart({ onSelectElement, selectedElementId, onOpenCategory }: OrgChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const focusIdRef = useRef<string>('cabinet')
  const visibleNodesRef = useRef<Set<string>>(new Set())
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    if (cyRef.current) {
      cyRef.current.destroy()
      cyRef.current = null
    }
    setRefreshKey(k => k + 1)
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Determine focus element (selected or Cabinet by default)
    const focusId = selectedElementId || 'cabinet'
    focusIdRef.current = focusId
    const focusElement = govElements[focusId]
    if (!focusElement) return

    const elements: cytoscape.ElementDefinition[] = []

    // Step 1: Collect all ancestors by BFS upward (level 1 = direct parent, 2 = grandparent, …)
    const ancestorLevels = new Map<string, number>()
    const ancestorQueue: Array<{ id: string; level: number }> = []

    ;[...focusElement.parentIds, ...(focusElement.secondaryParentIds || [])].forEach(pid => {
      if (govElements[pid] && !ancestorLevels.has(pid)) {
        ancestorLevels.set(pid, 1)
        ancestorQueue.push({ id: pid, level: 1 })
      }
    })

    while (ancestorQueue.length > 0) {
      const { id, level } = ancestorQueue.shift()!
      const el = govElements[id]
      if (!el) continue
      el.parentIds.forEach(pid => {
        if (govElements[pid] && !ancestorLevels.has(pid)) {
          ancestorLevels.set(pid, level + 1)
          ancestorQueue.push({ id: pid, level: level + 1 })
        }
      })
    }

    // Step 1.5: For ministerial departments, also surface junior ministers who lead this dept
    // (they have focusId in childIds but are not in the dept's parentIds)
    if (focusElement.category === 'department' && focusElement.subtype === 'ministerial') {
      Object.values(govElements).forEach(el => {
        if (el.subtype === 'junior-minister' && el.childIds.includes(focusId) && !ancestorLevels.has(el.id)) {
          ancestorLevels.set(el.id, 1)
        }
      })
    }

    // Step 2: Collect direct children and grandchildren
    // Also include elements that list focusId as a secondary parent
    const childrenSet = new Set<string>()
    const grandchildrenSet = new Set<string>()

    const directChildIds = [
      ...focusElement.childIds,
      ...Object.values(govElements)
        .filter(el => el.secondaryParentIds?.includes(focusId))
        .map(el => el.id),
    ]

    directChildIds.forEach(cid => {
      if (govElements[cid]) {
        childrenSet.add(cid)
        govElements[cid].childIds.forEach(gcid => {
          if (govElements[gcid] && !childrenSet.has(gcid)) {
            grandchildrenSet.add(gcid)
          }
        })
      }
    })

    // Step 3: Build nodesToShow = focus + all ancestors + children + grandchildren
    // When Cabinet is the focus: show only cabinet members + their ministerial departments
    const nodesToShow = new Set<string>([focusId])
    if (focusId === 'cabinet') {
      childrenSet.forEach(id => nodesToShow.add(id))
      grandchildrenSet.forEach(id => {
        const el = govElements[id]
        if (el && el.category === 'department' && el.subtype === 'ministerial') nodesToShow.add(id)
      })
    } else {
      ancestorLevels.forEach((_, id) => nodesToShow.add(id))
      childrenSet.forEach(id => nodesToShow.add(id))
      grandchildrenSet.forEach(id => nodesToShow.add(id))
    }

    // Step 3.5: Remove group members whose group is not also in view
    const nodesToRemove = new Set<string>()
    nodesToShow.forEach(nodeId => {
      if (nodeId === focusId) return
      const element = govElements[nodeId]
      if (!element) return
      // Keep officials that are directly linked to the focused dept (e.g. cabinet-attending junior ministers)
      if (focusElement.category === 'department' && focusElement.subtype === 'ministerial' &&
          element.childIds.includes(focusId)) return
      const groupParent = element.parentIds.find(pid => {
        const parent = govElements[pid]
        return parent && parent.category === 'group'
      })
      if (groupParent && !nodesToShow.has(groupParent)) {
        nodesToRemove.add(nodeId)
      }
    })
    nodesToRemove.forEach(id => nodesToShow.delete(id))
    visibleNodesRef.current = new Set(nodesToShow)

    // Step 4: Calculate positions
    const nodePositions = new Map<string, { x: number; y: number }>()
    nodePositions.set(focusId, { x: 0, y: 0 })

    // Subtype sort order — nodes on each arc are grouped so similar types cluster together.
    const subtypeOrder: Record<string, number> = {
      // Officials
      'prime-minister': 0, 'cabinet-minister': 1, 'civil-servant': 2, 'independent': 3,
      // Departments
      'ministerial': 10, 'non-ministerial': 11, 'agency': 12, 'division-directorate': 13,
      // Bodies
      'executive-ndpb': 20, 'advisory-ndpb': 21, 'tribunal': 22,
      'public-corporation': 23, 'royal-charter-body': 24, 'other': 25,
      // Groups
      'cabinet': 30, 'other-group': 31,
      // Junior ministers placed last among officials so they sit at the edge
      // of the ancestor arc, furthest from compound-child overlap
      'junior-minister': 5,
    }
    const sortBySubtype = (a: string, b: string) => {
      const ea = govElements[a], eb = govElements[b]
      if (!ea || !eb) return 0
      return (subtypeOrder[ea.subtype] ?? 99) - (subtypeOrder[eb.subtype] ?? 99)
    }

    // D1: true hierarchy ancestors (non-junior-minister) go to the top half;
    // children AND junior ministers go to the bottom half.
    // This keeps junior ministers well clear of compound children inside the dept box.
    const d1Ancestors: string[] = []
    const d1Children: string[] = []

    ancestorLevels.forEach((level, id) => {
      if (level !== 1 || !nodesToShow.has(id)) return
      const el = govElements[id]
      if (el && el.subtype === 'junior-minister') {
        d1Children.push(id) // junior ministers share the bottom arc with children
      } else {
        d1Ancestors.push(id)
      }
    })
    childrenSet.forEach(id => { if (nodesToShow.has(id)) d1Children.push(id) })

    // Sort each group by subtype so similar nodes sit adjacent on the arc
    d1Ancestors.sort(sortBySubtype)
    d1Children.sort(sortBySubtype)

    const d1Set = new Set<string>([...d1Ancestors, ...d1Children])

    const minD1Gap = 130
    const d1AncestorRadius = Math.max(240, (d1Ancestors.length * minD1Gap) / Math.PI)
    const d1ChildRadius = Math.max(240, (d1Children.length * minD1Gap) / Math.PI)

    // Spread ancestors across the top half (-π to 0, i.e. upward arc)
    d1Ancestors.forEach((id, i) => {
      const angle = d1Ancestors.length > 1
        ? -Math.PI + (Math.PI / (d1Ancestors.length - 1)) * i
        : -Math.PI / 2
      nodePositions.set(id, {
        x: d1AncestorRadius * Math.cos(angle),
        y: d1AncestorRadius * Math.sin(angle),
      })
    })

    // Spread children (+ junior ministers) across the bottom half (0 to π)
    d1Children.forEach((id, i) => {
      const angle = d1Children.length > 1
        ? (Math.PI / (d1Children.length - 1)) * i
        : Math.PI / 2
      nodePositions.set(id, {
        x: d1ChildRadius * Math.cos(angle),
        y: d1ChildRadius * Math.sin(angle),
      })
    })

    // Helper: spread D2 nodes in an arc outward from their D1 parent.
    // Arc width and radius both grow with node count to keep min spacing.
    // nodes array should already be sorted by subtype before calling.
    const minD2Gap = 110
    const positionInArc = (nodes: string[], parentId: string) => {
      const parentPos = nodePositions.get(parentId)
      if (!parentPos || nodes.length === 0) return
      const outwardAngle = Math.atan2(parentPos.y, parentPos.x)
      // Widen arc as count grows; cap at 240°
      const arcWidth = Math.min(4 * Math.PI / 3, Math.max(Math.PI / 2, (nodes.length * minD2Gap) / 220))
      // Push radius out so min arc-chord spacing is maintained
      const radius = Math.max(220, (nodes.length * minD2Gap) / arcWidth)
      nodes.forEach((id, i) => {
        const relAngle = nodes.length > 1
          ? (arcWidth / (nodes.length - 1)) * i - arcWidth / 2
          : 0
        nodePositions.set(id, {
          x: parentPos.x + radius * Math.cos(outwardAngle + relAngle),
          y: parentPos.y + radius * Math.sin(outwardAngle + relAngle),
        })
      })
    }

    // D2: grandparents (ancestorLevel 2) — arc outward from their D1 child
    const d2AncestorsByParent = new Map<string, string[]>()
    ancestorLevels.forEach((level, id) => {
      if (level !== 2 || !nodesToShow.has(id)) return
      const el = govElements[id]
      if (!el) return
      const d1Parent = el.childIds.find(cid => d1Set.has(cid))
      if (d1Parent) {
        if (!d2AncestorsByParent.has(d1Parent)) d2AncestorsByParent.set(d1Parent, [])
        d2AncestorsByParent.get(d1Parent)!.push(id)
      }
    })

    // D2: grandchildren — arc outward from their D1 parent, sorted by subtype
    const gcByParent = new Map<string, string[]>()
    grandchildrenSet.forEach(gcId => {
      if (!nodesToShow.has(gcId)) return
      const el = govElements[gcId]
      if (!el) return
      const d1Parent = el.parentIds.find(pid => d1Set.has(pid))
      if (d1Parent) {
        if (!gcByParent.has(d1Parent)) gcByParent.set(d1Parent, [])
        gcByParent.get(d1Parent)!.push(gcId)
      }
    })

    d2AncestorsByParent.forEach((nodes, parentId) => {
      nodes.sort(sortBySubtype)
      positionInArc(nodes, parentId)
    })
    gcByParent.forEach((nodes, parentId) => {
      nodes.sort(sortBySubtype)
      positionInArc(nodes, parentId)
    })

    // D3+: deeper ancestors — each level fans outward from its immediate child
    const maxAncestorLevel = ancestorLevels.size > 0 ? Math.max(...ancestorLevels.values()) : 0
    for (let level = 3; level <= maxAncestorLevel; level++) {
      const prevLevelSet = new Set(
        [...ancestorLevels.entries()]
          .filter(([id, l]) => l === level - 1 && nodesToShow.has(id))
          .map(([id]) => id)
      )
      const byParent = new Map<string, string[]>()
      ancestorLevels.forEach((l, id) => {
        if (l !== level || !nodesToShow.has(id)) return
        const el = govElements[id]
        if (!el) return
        const parent = el.childIds.find(cid => prevLevelSet.has(cid))
        if (parent) {
          if (!byParent.has(parent)) byParent.set(parent, [])
          byParent.get(parent)!.push(id)
        }
      })
      byParent.forEach((nodes, parentId) => {
        nodes.sort(sortBySubtype)
        positionInArc(nodes, parentId)
      })
    }

    // Step 4: Add nodes with POSITION property (not in data)
    // Check if cabinet is in nodes to show for compound node support
    const cabinetInView = nodesToShow.has('cabinet')

    // Find departments that have division-directorate or agency children in view
    const departmentsWithDivisions = new Set<string>()
    const departmentsWithAgencies = new Set<string>()
    nodesToShow.forEach(nodeId => {
      const element = govElements[nodeId]
      if (element && element.category === 'department') {
        element.childIds.forEach(childId => {
          if (nodesToShow.has(childId)) {
            const child = govElements[childId]
            if (child && child.subtype === 'division-directorate') {
              departmentsWithDivisions.add(element.id)
            }
            if (child && child.subtype === 'agency') {
              departmentsWithAgencies.add(element.id)
            }
          }
        })
      }
    })

    // Compound child nodes — their position is managed by Cytoscape inside the compound container,
    // so we exclude them from the positional ring calculations entirely.
    const compoundChildNodes = new Set<string>()
    nodesToShow.forEach(nodeId => {
      const element = govElements[nodeId]
      if (!element) return
      // Cabinet members are compound children of cabinet
      if (cabinetInView && nodeId !== 'cabinet') {
        const attendsCabinet = element.subtype === 'junior-minister' && element.parentIds.includes('cabinet')
        if (element.subtype === 'cabinet-minister' || element.id === 'pm' || attendsCabinet) {
          compoundChildNodes.add(nodeId)
        }
      }
      // Divisions/directorates are compound children of their parent department
      if (element.subtype === 'division-directorate' && element.parentIds.length > 0) {
        const parentDept = element.parentIds[0]
        if (departmentsWithDivisions.has(parentDept)) {
          compoundChildNodes.add(nodeId)
        }
      }
      // Agencies are compound children of their parent department
      if (element.subtype === 'agency' && element.parentIds.length > 0) {
        const parentDept = element.parentIds[0]
        if (departmentsWithAgencies.has(parentDept)) {
          compoundChildNodes.add(nodeId)
        }
      }
    })

    // Assign clustered positions for compound children grouped by their compound parent.
    // Children are placed in a tight horizontal row centred on their parent's ring position,
    // so the preset layout renders siblings side-by-side inside the compound container.
    const compoundParentOf = new Map<string, string>() // childId -> parentId
    compoundChildNodes.forEach(nodeId => {
      const element = govElements[nodeId]
      if (!element) return
      if (cabinetInView && (element.subtype === 'cabinet-minister' || element.id === 'pm' ||
          (element.subtype === 'junior-minister' && element.parentIds.includes('cabinet')))) {
        compoundParentOf.set(nodeId, 'cabinet')
      } else if (element.subtype === 'division-directorate' && element.parentIds.length > 0) {
        compoundParentOf.set(nodeId, element.parentIds[0])
      } else if (element.subtype === 'agency' && element.parentIds.length > 0) {
        compoundParentOf.set(nodeId, element.parentIds[0])
      }
    })

    // Group children by their compound parent
    const childrenByCompoundParent = new Map<string, string[]>()
    compoundParentOf.forEach((parentId, childId) => {
      if (!childrenByCompoundParent.has(parentId)) childrenByCompoundParent.set(parentId, [])
      childrenByCompoundParent.get(parentId)!.push(childId)
    })

    // Arrange siblings in a grid (as-square-as-possible) centred on their parent's position
    const childSpacing = 120
    childrenByCompoundParent.forEach((children, parentId) => {
      const parentPos = nodePositions.get(parentId) ?? { x: 0, y: 0 }
      const n = children.length
      const cols = Math.ceil(Math.sqrt(n))
      const rows = Math.ceil(n / cols)
      const gridW = (cols - 1) * childSpacing
      const gridH = (rows - 1) * childSpacing
      children.forEach((childId, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        nodePositions.set(childId, {
          x: parentPos.x - gridW / 2 + col * childSpacing,
          y: parentPos.y - gridH / 2 + row * childSpacing,
        })
      })
    })

    nodesToShow.forEach(nodeId => {
      const element = govElements[nodeId]
      if (!element) return

      const pos = nodePositions.get(nodeId)!

      let size: number
      let opacity = 1

      if (nodeId === focusId) {
        size = 110
      } else if (childrenSet.has(nodeId)) {
        size = 110
      } else if (grandchildrenSet.has(nodeId)) {
        size = 85
      } else {
        const ancestorLevel = ancestorLevels.get(nodeId) ?? 3
        size = ancestorLevel === 1 ? 110 : ancestorLevel === 2 ? 90 : 75
      }

      const color = getElementColor(element.category, element.subtype)
      
      // Calculate lighter fill color for better readability
      const getRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return { r, g, b }
      }
      
      const lightenColor = (hex: string, factor = 0.65) => {
        const { r, g, b } = getRgb(hex)
        const lightR = Math.round(r + (255 - r) * factor)
        const lightG = Math.round(g + (255 - g) * factor)
        const lightB = Math.round(b + (255 - b) * factor)
        const toHex = (val: number) => val.toString(16).padStart(2, '0')
        return `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`
      }
      
      const isFocus = nodeId === focusId
      const isFocusCompound = isFocus && (
        (focusId === 'cabinet' && cabinetInView) ||
        departmentsWithDivisions.has(focusId) ||
        departmentsWithAgencies.has(focusId)
      )
      const fillColor = (isFocus && !isFocusCompound) ? color : lightenColor(color)

      const nodeData: any = {
        id: element.id,
        label: element.name,
        title: element.name,
        category: element.category,
        subtype: element.subtype,
        size,
        color: fillColor,
        opacity,
        isFocus: (isFocus && !isFocusCompound) ? 1 : 0,
      }

      // If Cabinet is in view and this is a cabinet minister, PM, or cabinet-attending junior minister
      const attendsCabinet = element.subtype === 'junior-minister' && element.parentIds.includes('cabinet')
      if (cabinetInView && (element.subtype === 'cabinet-minister' || element.id === 'pm' || attendsCabinet)) {
        nodeData.parent = 'cabinet'
      }
      
      // If this is a division-directorate and its parent department is in view, make it a child of department compound node
      if (element.subtype === 'division-directorate' && element.parentIds.length > 0) {
        const parentDept = element.parentIds[0]
        if (departmentsWithDivisions.has(parentDept)) {
          nodeData.parent = parentDept
        }
      }

      // If this is an agency and its parent department is in view, make it a child of department compound node
      if (element.subtype === 'agency' && element.parentIds.length > 0) {
        const parentDept = element.parentIds[0]
        if (departmentsWithAgencies.has(parentDept)) {
          nodeData.parent = parentDept
        }
      }

      elements.push({
        data: nodeData,
        position: element.category === 'group' ? undefined : pos,
      })
    })

    // If Cabinet is in view, add it as a compound parent node (not positioned)
    if (cabinetInView) {
      const cabinetElement = govElements['cabinet']
      if (cabinetElement) {
        const cabinetColor = getElementColor(cabinetElement.category, cabinetElement.subtype)
        const lightenColor = (hex: string, factor = 0.65) => {
          const getRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16)
            const g = parseInt(hex.slice(3, 5), 16)
            const b = parseInt(hex.slice(5, 7), 16)
            return { r, g, b }
          }
          const { r, g, b } = getRgb(hex)
          const lightR = Math.round(r + (255 - r) * factor)
          const lightG = Math.round(g + (255 - g) * factor)
          const lightB = Math.round(b + (255 - b) * factor)
          const toHex = (val: number) => val.toString(16).padStart(2, '0')
          return `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`
        }
        
        elements.push({
          data: {
            id: 'cabinet',
            label: 'Cabinet',
            title: 'Cabinet',
            category: 'group',
            subtype: 'cabinet',
            color: lightenColor(cabinetColor),
            opacity: 1,
          },
        })
      }
    }

    // Add compound parent nodes for departments with divisions/directorates
    // Note: The department node itself is already added in the main node loop.
    // The compound structure is created by setting the division nodes' parent property to the department ID.
    // departmentsWithDivisions set is used to hide the edges between them.

    // Helper function to determine relationship from parent to child
    const getRelationshipLabel = (parent: GovElement, child: GovElement): { forward: string; reverse: string } => {
      // Prime Minister > appoints > Cabinet ministers and all other ministers
      if (parent.subtype === 'prime-minister' && 
          (child.subtype === 'cabinet-minister' || child.subtype === 'junior-minister')) {
        return { forward: 'appoints', reverse: 'appointed by' }
      }
      
      // Cabinet Minister > oversees > junior ministers
      if ((parent.subtype === 'cabinet-minister') &&
          (child.subtype === 'junior-minister')) {
        return { forward: 'oversees', reverse: 'overseen by' }
      }
      
      // Cabinet Minister > manages > Cabinet (group membership)
      if ((parent.subtype === 'cabinet-minister' || parent.subtype === 'prime-minister') && 
          child.category === 'group' && child.subtype === 'cabinet') {
        return { forward: 'member of', reverse: 'includes' }
      }

      // Civil servant (perm sec) > runs > Ministerial Department
      if (parent.category === 'official' && parent.subtype === 'civil-servant' &&
          child.category === 'department' && child.subtype === 'ministerial') {
        return { forward: 'runs', reverse: 'run by' }
      }

      // Cabinet Minister > leads > Ministerial Department
      if ((parent.subtype === 'cabinet-minister' || parent.subtype === 'junior-minister' || parent.subtype === 'prime-minister') &&
          child.category === 'department' && child.subtype === 'ministerial') {
        return { forward: 'leads', reverse: 'led by' }
      }
      
      // Minister > sponsors > Non-ministerial Department
      if ((parent.subtype === 'cabinet-minister' || parent.subtype === 'junior-minister' || parent.subtype === 'prime-minister') &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'sponsors', reverse: 'sponsored by' }
      }

      // Civil servant runs non-ministerial department
      if (parent.category === 'official' && parent.subtype === 'civil-servant' &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'runs', reverse: 'run by' }
      }

      // Other official chairs non-ministerial department
      if (parent.category === 'official' && parent.subtype === 'independent' &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'chairs', reverse: 'chaired by' }
      }

      // Non-ministerial department > has head > civil servant (reverse of runs)
      if (parent.category === 'department' && parent.subtype === 'non-ministerial' &&
          child.category === 'official' && child.subtype === 'civil-servant') {
        return { forward: 'run by', reverse: 'runs' }
      }

      // Non-ministerial department > has chair > other official (reverse of chairs)
      if (parent.category === 'department' && parent.subtype === 'non-ministerial' &&
          child.category === 'official' && child.subtype === 'independent') {
        return { forward: 'chaired by', reverse: 'chairs' }
      }

      // Ministerial Department > is parent of > Executive Agency
      if (parent.category === 'department' && 
          child.category === 'department' && child.subtype === 'agency') {
        return { forward: 'is parent of', reverse: 'is child of' }
      }
      
      // Ministerial Department > supports > Non-ministerial department
      if (parent.subtype === 'ministerial' &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'supports', reverse: 'supported by' }
      }
      
      // Department > sponsors > NDPB / tribunal
      if (parent.category === 'department' && child.category === 'body' &&
          (child.subtype === 'executive-ndpb' || child.subtype === 'advisory-ndpb' || child.subtype === 'tribunal')) {
        return { forward: 'sponsors', reverse: 'sponsored by' }
      }
      
      // Civil servant runs non-ministerial department
      if (parent.category === 'official' && parent.subtype === 'civil-servant' &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'runs', reverse: 'run by' }
      }

      // Other official chairs non-ministerial department
      if (parent.category === 'official' && parent.subtype === 'independent' &&
          child.category === 'department' && child.subtype === 'non-ministerial') {
        return { forward: 'chairs', reverse: 'chaired by' }
      }

      // Non-ministerial department > has head > civil servant (reverse of runs)
      if (parent.category === 'department' && parent.subtype === 'non-ministerial' &&
          child.category === 'official' && child.subtype === 'civil-servant') {
        return { forward: 'run by', reverse: 'runs' }
      }

      // Non-ministerial department > has chair > other official (reverse of chairs)
      if (parent.category === 'department' && parent.subtype === 'non-ministerial' &&
          child.category === 'official' && child.subtype === 'independent') {
        return { forward: 'chaired by', reverse: 'chairs' }
      }

      // Group membership
      if (parent.category === 'group') {
        return { forward: 'includes', reverse: 'member of' }
      }

      // Default fallback
      return { forward: 'works with', reverse: 'works with' }
    }

    Object.values(govElements).forEach(element => {
      if (!nodesToShow.has(element.id)) return

      element.childIds.forEach(childId => {
        if (!nodesToShow.has(childId)) return
        
        const targetElement = govElements[childId]
        if (targetElement) {
          // Skip edges for compound node membership (Cabinet and its members)
          // When Cabinet is in the view and this is a Cabinet member, the edge will be implicit in the compound structure
          const targetAttendsCabinet = targetElement.subtype === 'junior-minister' && targetElement.parentIds.includes('cabinet')
          if (cabinetInView && element.id === 'cabinet' && (targetElement.subtype === 'cabinet-minister' || targetElement.id === 'pm' || targetAttendsCabinet)) {
            return // Skip adding the edge for compound node membership
          }
          
          // Skip edges between departments and their divisions/directorates
          // When a department has divisions, the edge will be implicit in the compound structure
          if (departmentsWithDivisions.has(element.id) && targetElement.subtype === 'division-directorate') {
            return // Skip adding the edge for department compound structure
          }

          // Skip edges between departments and their agencies
          if (departmentsWithAgencies.has(element.id) && targetElement.subtype === 'agency') {
            return // Skip adding the edge for agency compound structure
          }
          
          const { forward: relationshipType } = getRelationshipLabel(element, targetElement)

          elements.push({
            data: {
              id: `${element.id}-${childId}`,
              source: element.id,
              target: childId,
              label: relationshipType,
            },
          })
        }
      })

      // Secondary parent edges (dashed lines)
      ;(element.secondaryParentIds || []).forEach(pid => {
        if (!nodesToShow.has(pid)) return
        elements.push({
          data: {
            id: `${pid}-${element.id}-secondary`,
            source: pid,
            target: element.id,
            label: 'also sponsors',
            secondary: 1,
          },
        })
      })
    })

    const layoutOptions = {
      name: 'preset',
      animate: true,
      animationDuration: 700,
      animationEasing: 'ease-in-out',
      padding: 80,
    }

    // Create cytoscape instance
    if (!cyRef.current) {
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
              'color': '#333',
              'font-size': 'mapData(size, 35, 110, 10px, 14px)',
              'font-weight': 'bold',
            'width': 'mapData(size, 35, 110, 35px, 110px)',
            'height': 'mapData(size, 35, 110, 35px, 110px)',
              'text-wrap': 'wrap',
              'text-max-width': 'mapData(size, 35, 110, 30px, 100px)',
              'background-color': 'data(color)',
              'opacity': 'data(opacity)' as any,
              'border-width': '2px',
              'padding': '8px',
              'z-index': '1',
            } as any,
          },
          // Official nodes
          {
            selector: 'node[category="official"]',
            style: {
              'shape': 'ellipse',
              'border-color': '#c0392b',
            },
          },
          {
            selector: 'node[category="official"][subtype="prime-minister"]',
            style: {
              'shape': 'heptagon',
              'border-color': '#5c0000',
            },
          },
          {
            selector: 'node[category="official"][subtype="cabinet-minister"]',
            style: {
              'shape': 'octagon',
              'border-color': '#922b21',
            },
          },
          {
            selector: 'node[category="official"][subtype="junior-minister"]',
            style: {
              'shape': 'ellipse',
              'border-color': '#cd6155',
            },
          },
          {
            selector: 'node[category="official"][subtype="civil-servant"]',
            style: {
              'shape': 'ellipse',
              'border-color': '#2980b9',
            },
          },
          {
            selector: 'node[category="official"][subtype="independent"]',
            style: {
              'shape': 'ellipse',
              'border-color': '#229954',
            },
          },
          // Department nodes
          {
            selector: 'node[category="department"]',
            style: {
              'shape': 'rectangle',
              'border-color': '#e74c3c',
            },
          },
          {
            selector: 'node[category="department"][subtype="non-ministerial"]',
            style: {
              'shape': 'rectangle',
              'border-color': '#2980b9',
            },
          },
          {
            selector: 'node[category="department"][subtype="agency"]',
            style: {
              'shape': 'roundrectangle',
              'corner-radius': '20px',
              'border-color': '#7d3c98',
            },
          },
          {
            selector: 'node[category="department"][subtype="division-directorate"]',
            style: {
              'shape': 'roundrectangle',
              'corner-radius': '20px',
              'border-color': '#e74c3c',
            },
          },
          // Body nodes
          {
            selector: 'node[category="body"]',
            style: {
              'shape': 'diamond',
              'border-color': '#95a5a6',
            },
          },
          {
            selector: 'node[category="body"][subtype="executive-ndpb"]',
            style: {
              'shape': 'diamond',
              'border-color': '#229954',
            },
          },
          {
            selector: 'node[category="body"][subtype="advisory-ndpb"]',
            style: {
              'shape': 'diamond',
              'border-color': '#f1c40f',
            },
          },
          {
            selector: 'node[category="body"][subtype="public-corporation"]',
            style: {
              'shape': 'rhomboid',
              'border-color': '#e67e22',
            },
          },
          {
            selector: 'node[category="body"][subtype="royal-charter-body"]',
            style: {
              'shape': 'rhomboid',
              'border-color': '#8e44ad',
            },
          },
          {
            selector: 'node[category="body"][subtype="tribunal"]',
            style: {
              'shape': 'diamond',
              'border-color': '#d35400',
            },
          },
          {
            selector: 'node[category="body"][subtype="other"]',
            style: {
              'shape': 'rhomboid',
              'border-color': '#95a5a6',
            },
          },
          // Group nodes
          {
            selector: 'node[category="group"]',
            style: {
              'shape': 'hexagon',
              'border-color': '#922b21',
              'background-opacity': 0.1,
            },
          },
          // Compound nodes (parents)
          {
            selector: 'node:parent',
            style: {
              'text-valign': 'top',
              'text-margin-y': '12px',
              'font-size': '12px',
              'font-weight': 'bold',
              'padding': '20px',
              'compound-sizing-wrt-labels': 'include',
              'z-index': '1',
            } as any,
          },
          // Focus node — full colour fill, white text, thick border
          {
            selector: 'node[isFocus = 1]',
            style: {
              'color': '#ffffff',
              'border-width': '4px',
              'z-index': 10,
            } as any,
          },
          {
            selector: 'node:hover',
            style: {
              'z-index': 999,
              'border-width': '3px',
              'overlay-opacity': 0,
            } as any,
          },
          // Edge styling
          {
            selector: 'edge',
            style: {
              'line-color': '#bdc3c7',
              'target-arrow-color': '#95a5a6',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'width': '2px',
              'opacity': 0.6,
              'label': 'data(label)',
              'font-size': '10px',
              'text-background-color': '#ffffff',
              'text-background-opacity': 0.8,
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle',
              'text-valign': 'center',
              'text-halign': 'center',
              'control-point-distance': '80px',
              'control-point-step': '25px',
            },
          },
          {
            selector: 'edge[secondary = 1]',
            style: {
              'line-style': 'dashed',
              'line-dash-pattern': [6, 4],
              'opacity': 0.45,
            } as any,
          },
        ],
        layout: layoutOptions,
      })

      // Add click handler
      cyRef.current.on('tap', 'node', (event: any) => {
        onSelectElement(event.target.id())
      })

      // BFS through govElements (bounded to visible nodes) returning node + edge ID arrays
      const findPath = (fromId: string, toId: string, visible: Set<string>) => {
        const visited = new Set<string>()
        const queue: Array<{ id: string; nodeIds: string[]; edgeIds: string[] }> = [
          { id: fromId, nodeIds: [fromId], edgeIds: [] },
        ]
        while (queue.length > 0) {
          const { id, nodeIds, edgeIds } = queue.shift()!
          if (id === toId) return { nodeIds, edgeIds }
          if (visited.has(id)) continue
          visited.add(id)
          const el = govElements[id]
          if (!el) continue
          // Traverse upward (to parents)
          el.parentIds.forEach(pid => {
            if (visible.has(pid) && !visited.has(pid)) {
              queue.push({ id: pid, nodeIds: [...nodeIds, pid], edgeIds: [...edgeIds, `${pid}-${id}`] })
            }
          })
          // Traverse downward (to children)
          el.childIds.forEach(cid => {
            if (visible.has(cid) && !visited.has(cid)) {
              queue.push({ id: cid, nodeIds: [...nodeIds, cid], edgeIds: [...edgeIds, `${id}-${cid}`] })
            }
          })
        }
        return null
      }

      // BFS upward to collect all ancestors of a node within visible set
      const getAllAncestors = (startId: string, visible: Set<string>): Set<string> => {
        const ancestors = new Set<string>()
        const queue = [startId]
        const visited = new Set<string>()
        while (queue.length > 0) {
          const id = queue.shift()!
          if (visited.has(id)) continue
          visited.add(id)
          const el = govElements[id]
          if (!el) continue
          el.parentIds.forEach(pid => {
            if (visible.has(pid) && !visited.has(pid)) {
              ancestors.add(pid)
              queue.push(pid)
            }
          })
        }
        return ancestors
      }

      // On hover: highlight lineage path to the focus node
      cyRef.current.on('mouseover', 'node', (event: any) => {
        const cy = cyRef.current
        if (!cy) return
        const hoveredId = event.target.id()

        const currentFocusId = focusIdRef.current

        // Ancestors of both the hovered and focus nodes always stay fully visible
        const hoveredAncestors = getAllAncestors(hoveredId, visibleNodesRef.current)
        const focusAncestors = getAllAncestors(currentFocusId, visibleNodesRef.current)

        if (hoveredId === currentFocusId) {
          // Hovering the focus node: bold all ancestor edges, dim everything else
          const fullyVisibleIds = new Set([hoveredId, ...focusAncestors])
          cy.nodes().forEach((n: any) => {
            if (fullyVisibleIds.has(n.id())) {
              const p = n.parent()
              if (p && p.length > 0) fullyVisibleIds.add(p.id())
            }
          })
          cy.nodes().forEach((n: any) => {
            if (!fullyVisibleIds.has(n.id())) n.style({ 'opacity': 0.2, 'z-index': 0 })
          })
          cy.edges().forEach((e: any) => {
            if (!fullyVisibleIds.has(e.source().id()) || !fullyVisibleIds.has(e.target().id()))
              e.style({ 'opacity': 0.1 })
          })
          focusAncestors.forEach(aid => cy.getElementById(aid).style({ 'opacity': 1 }))
          cy.nodes().forEach((n: any) => {
            if (fullyVisibleIds.has(n.id())) {
              const p = n.parent()
              if (p && p.length > 0) p.style({ 'opacity': 1 })
            }
          })
          cy.getElementById(hoveredId).style({ 'opacity': 1, 'z-index': 9999, 'border-width': '3px' })
          const boldEdges = new Set<string>()
          const collectEdges = (nodeId: string, ancestors: Set<string>) => {
            const el = govElements[nodeId]
            if (!el) return
            el.parentIds.forEach(pid => {
              if (ancestors.has(pid) || fullyVisibleIds.has(pid)) {
                boldEdges.add(`${pid}-${nodeId}`)
                collectEdges(pid, ancestors)
              }
            })
          }
          collectEdges(hoveredId, focusAncestors)
          boldEdges.forEach(eid => cy.getElementById(eid).style({
            'line-color': '#111', 'target-arrow-color': '#111', 'width': '4px', 'opacity': 1, 'z-index': 500,
          }))
          return
        }

        const path = findPath(currentFocusId, hoveredId, visibleNodesRef.current)

        const pathNodeIds = path ? path.nodeIds : [currentFocusId, hoveredId]
        const pathEdgeIds = path ? path.edgeIds : []

        const fullyVisibleIds = new Set([...pathNodeIds, ...hoveredAncestors, ...focusAncestors, hoveredId, currentFocusId])

        // Also keep compound parents of any fully-visible node visible, otherwise the compound
        // container dims and overrides the opacity of its children
        cy.nodes().forEach((n: any) => {
          if (fullyVisibleIds.has(n.id())) {
            const parent = n.parent()
            if (parent && parent.length > 0) fullyVisibleIds.add(parent.id())
          }
        })

        // Dim all non-highlighted nodes and edges
        cy.nodes().forEach((n: any) => {
          if (!fullyVisibleIds.has(n.id())) {
            n.style({ 'opacity': 0.2, 'z-index': 0 })
          }
        })
        cy.edges().forEach((e: any) => {
          const sourceVisible = fullyVisibleIds.has(e.source().id())
          const targetVisible = fullyVisibleIds.has(e.target().id())
          if (!sourceVisible || !targetVisible) {
            e.style({ 'opacity': 0.1 })
          }
        })

        // Path nodes get bold border and raised z-index
        pathNodeIds.forEach((nid, i) => {
          cy.getElementById(nid).style({ 'opacity': 1, 'z-index': 100 + i, 'border-width': '3px' })
        })

        // Ancestors and compound parents stay fully visible (no bold border — they're context, not path)
        hoveredAncestors.forEach(aid => {
          cy.getElementById(aid).style({ 'opacity': 1 })
        })
        focusAncestors.forEach(aid => {
          cy.getElementById(aid).style({ 'opacity': 1 })
        })
        // Ensure compound parents of visible nodes are explicitly opaque
        cy.nodes().forEach((n: any) => {
          if (fullyVisibleIds.has(n.id())) {
            const parent = n.parent()
            if (parent && parent.length > 0) {
              parent.style({ 'opacity': 1 })
            }
          }
        })

        // Hovered node gets the highest z-index
        cy.getElementById(hoveredId).style({ 'opacity': 1, 'z-index': 9999, 'border-width': '3px' })

        // Collect edges along the ancestor chains of both hovered and focus nodes
        const ancestorEdgeIds = new Set<string>(pathEdgeIds)
        const collectAncestorEdges = (nodeId: string, ancestors: Set<string>) => {
          const el = govElements[nodeId]
          if (!el) return
          el.parentIds.forEach(pid => {
            if (ancestors.has(pid) || fullyVisibleIds.has(pid)) {
              ancestorEdgeIds.add(`${pid}-${nodeId}`)
              collectAncestorEdges(pid, ancestors)
            }
          })
        }
        collectAncestorEdges(hoveredId, hoveredAncestors)
        collectAncestorEdges(currentFocusId, focusAncestors)

        // Highlight path and ancestor chain edges
        ancestorEdgeIds.forEach(eid => {
          cy.getElementById(eid).style({
            'line-color': '#111',
            'target-arrow-color': '#111',
            'width': '4px',
            'opacity': 1,
            'z-index': 500,
          })
        })
      })

      // On mouseout: remove all inline style overrides
      cyRef.current.on('mouseout', 'node', () => {
        const cy = cyRef.current
        if (!cy) return
        cy.nodes().removeStyle('opacity z-index border-width')
        cy.edges().removeStyle('line-color target-arrow-color width opacity z-index')
      })
    } else {
      const cy = cyRef.current

      // Diff update: preserve existing nodes/edges so preset layout can animate
      // them from their current positions to new positions smoothly.
      const newIds = new Set(elements.map(e => e.data.id as string))
      const oldIds = new Set(cy.elements().map((e: any) => e.id() as string))

      // Snapshot to-remove IDs first, then remove in batch to avoid mutating
      // the live collection while iterating it (causes Cytoscape crashes).
      const toRemove = cy.elements().filter((e: any) => !newIds.has(e.id()))
      toRemove.remove()

      // Add new elements in correct order (nodes before edges, parents before children)
      const toAdd = elements.filter(el => !oldIds.has(el.data.id as string))
      const newNodes = toAdd.filter(el => !el.data.source)
      const newEdges = toAdd.filter(el => !!el.data.source)
      // Add parent nodes before child nodes
      const parentNodes = newNodes.filter(el => !el.data.parent)
      const childNodes = newNodes.filter(el => !!el.data.parent)
      if (parentNodes.length) cy.add(parentNodes)
      if (childNodes.length) cy.add(childNodes)
      if (newEdges.length) cy.add(newEdges)

      // Update data on existing elements
      elements.forEach(el => {
        const id = el.data.id as string
        if (oldIds.has(id)) {
          cy.getElementById(id).data(el.data)
        }
      })

      const layout = cy.layout(layoutOptions)
      layout.run()

      // Cancel any pending fit and schedule a new one
      if ((cy as any)._fitTimer) clearTimeout((cy as any)._fitTimer)
      ;(cy as any)._fitTimer = setTimeout(() => {
        if (cyRef.current) cyRef.current.fit(undefined, 80)
      }, 850)
    }
  }, [selectedElementId, onSelectElement, refreshKey])

  return (
    <div className="org-chart-wrapper">
      <div ref={containerRef} className="org-chart" />
      <button className="org-chart-refresh" onClick={handleRefresh} title="Reset layout" aria-label="Reset layout">↺</button>
      <div className="legend">
        <div className="legend-section">
          <h4>Officials</h4>
          <div className="legend-item" onClick={() => onOpenCategory('official', 'prime-minister')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('official', 'prime-minister')}>
            <div className="legend-shape heptagon"><div className="shape-inner" style={{ backgroundColor: '#5c0000' }}><div className="shape-inner" style={{ backgroundColor: '#c97070', transform: 'scale(0.78)' }}></div></div></div>
            <span>Prime Minister</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('official', 'cabinet-minister')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('official', 'cabinet-minister')}>
            <div className="legend-shape octagon"><div className="shape-inner" style={{ backgroundColor: '#922b21' }}><div className="shape-inner" style={{ backgroundColor: '#e8a09a', transform: 'scale(0.78)' }}></div></div></div>
            <span>Cabinet Minister</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('official', 'junior-minister')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('official', 'junior-minister')}>
            <div className="legend-shape circle" style={{ backgroundColor: '#fadbd8', borderColor: '#cd6155' }}></div>
            <span>Junior Minister</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('official', 'civil-servant')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('official', 'civil-servant')}>
            <div className="legend-shape circle" style={{ backgroundColor: '#a9d8f5', borderColor: '#2980b9' }}></div>
            <span>Civil Servant</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('official', 'other')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('official', 'other')}>
            <div className="legend-shape circle" style={{ backgroundColor: '#a9d8ab', borderColor: '#229954' }}></div>
            <span>Other Official</span>
          </div>
        </div>

        <div className="legend-section">
          <h4>Departments</h4>
          <div className="legend-item" onClick={() => onOpenCategory('department', 'ministerial')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('department', 'ministerial')}>
            <div className="legend-shape square" style={{ backgroundColor: '#f4a6a0', borderColor: '#e74c3c' }}></div>
            <span>Ministerial Dept</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('department', 'division-directorate')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('department', 'division-directorate')}>
            <div className="legend-shape rounded-square" style={{ backgroundColor: '#f4a6a0', borderColor: '#e74c3c' }}></div>
            <span>Division/Directorate</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('department', 'non-ministerial')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('department', 'non-ministerial')}>
            <div className="legend-shape square" style={{ backgroundColor: '#a9d8f5', borderColor: '#2980b9' }}></div>
            <span>Non-Ministerial</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('department', 'agency')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('department', 'agency')}>
            <div className="legend-shape rounded-square" style={{ backgroundColor: '#d7b8e8', borderColor: '#7d3c98' }}></div>
            <span>Executive Agency</span>
          </div>
        </div>

        <div className="legend-section legend-section-two-col">
          <h4>Public Bodies</h4>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'executive-ndpb')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'executive-ndpb')}>
            <div className="legend-shape diamond"><div className="diamond-inner" style={{ backgroundColor: '#a9d8ab', borderColor: '#229954' }}></div></div>
            <span>Executive NDPB</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'advisory-ndpb')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'advisory-ndpb')}>
            <div className="legend-shape diamond"><div className="diamond-inner" style={{ backgroundColor: '#fef5d4', borderColor: '#f1c40f' }}></div></div>
            <span>Advisory NDPB</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'tribunal')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'tribunal')}>
            <div className="legend-shape diamond"><div className="diamond-inner" style={{ backgroundColor: '#f5cba7', borderColor: '#d35400' }}></div></div>
            <span>Tribunal</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'public-corporation')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'public-corporation')}>
            <div className="legend-shape parallelogram" style={{ backgroundColor: '#fad7a0', borderColor: '#e67e22' }}></div>
            <span>Public Corporation</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'royal-charter-body')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'royal-charter-body')}>
            <div className="legend-shape parallelogram" style={{ backgroundColor: '#d7b8e8', borderColor: '#8e44ad' }}></div>
            <span>Royal Charter Body</span>
          </div>
          <div className="legend-item" onClick={() => onOpenCategory('body', 'other')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('body', 'other')}>
            <div className="legend-shape parallelogram" style={{ backgroundColor: '#dae0e0', borderColor: '#7f8c8d' }}></div>
            <span>Other Body</span>
          </div>
        </div>

        <div className="legend-section">
          <h4>Groups</h4>
          <div className="legend-item" onClick={() => onOpenCategory('group', 'cabinet')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpenCategory('group', 'cabinet')}>
            <div className="legend-shape square" style={{ backgroundColor: '#e8a09a', borderColor: '#922b21' }}></div>
            <span>Cabinet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
