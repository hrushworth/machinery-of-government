import { useEffect, useRef } from 'react'
import type { Jurisdiction } from '../data/jurisdictions'
import { jurisdictionInfo, JURISDICTION_COVERS } from '../data/jurisdictions'
import './JurisdictionFilter.css'

interface JurisdictionFilterProps {
  active: Jurisdiction | null
  onChange: (j: Jurisdiction | null) => void
  onClose: () => void
  darkMode?: boolean
}

// Grouped display order
const GROUPS: { label: string; items: Jurisdiction[] }[] = [
  { label: 'National', items: ['uk', 'gb', 'england-wales', 'england', 'wales', 'scotland', 'northern-ireland'] },
  { label: 'Territories', items: ['crown-dependencies', 'overseas-territories'] },
]

export default function JurisdictionFilter({ active, onChange, onClose, darkMode }: JurisdictionFilterProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className={`jurisdiction-panel${darkMode ? ' jurisdiction-panel-dark' : ''}`}
      role="dialog"
      aria-label="Filter by jurisdiction"
    >
      <div className="jurisdiction-panel-header">
        <span>Filter by Jurisdiction</span>
        {active && (
          <button className="jurisdiction-clear" onClick={() => onChange(null)} aria-label="Clear filter">
            ✕ Clear
          </button>
        )}
      </div>
      <div className="jurisdiction-group">
        <button
          className={`jurisdiction-item${active === null ? ' jurisdiction-item-active' : ''}`}
          onClick={() => { onChange(null); onClose() }}
          title="Show all bodies regardless of jurisdiction"
          aria-pressed={active === null}
        >
          Any / All UK
        </button>
      </div>
      {GROUPS.map(group => (
        <div key={group.label} className="jurisdiction-group">
          <div className="jurisdiction-group-label">{group.label}</div>
          {group.items.map(j => {
            const info = jurisdictionInfo[j]
            const indent = (JURISDICTION_COVERS[j].length - 1) * 12
            return (
              <button
                key={j}
                className={`jurisdiction-item${active === j ? ' jurisdiction-item-active' : ''}`}
                onClick={() => { onChange(active === j ? null : j); onClose() }}
                title={info.description}
                aria-pressed={active === j}
                style={{ paddingLeft: `${8 + indent}px` }}
              >
                {info.filterLabel ?? info.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
