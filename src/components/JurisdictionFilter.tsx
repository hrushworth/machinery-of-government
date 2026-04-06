import { useEffect, useRef } from 'react'
import type { Jurisdiction } from '../data/jurisdictions'
import { jurisdictionInfo } from '../data/jurisdictions'
import './JurisdictionFilter.css'

interface JurisdictionFilterProps {
  active: Jurisdiction | null
  onChange: (j: Jurisdiction | null) => void
  onClose: () => void
  darkMode?: boolean
}

// Estonia is a unitary state — single jurisdiction
const GROUPS: { label: string; items: Jurisdiction[] }[] = [
  { label: 'National', items: ['estonia'] },
]

export default function JurisdictionFilter({ active, onChange, onClose, darkMode }: JurisdictionFilterProps) {
  const panelRef = useRef<HTMLDivElement>(null)

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
      {GROUPS.map(group => (
        <div key={group.label} className="jurisdiction-group">
          <div className="jurisdiction-group-label">{group.label}</div>
          {group.items.map(j => {
            const info = jurisdictionInfo[j]
            return (
              <button
                key={j}
                className={`jurisdiction-item${active === j ? ' jurisdiction-item-active' : ''}`}
                onClick={() => { onChange(active === j ? null : j); onClose() }}
                title={info.description}
                aria-pressed={active === j}
              >
                {info.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
