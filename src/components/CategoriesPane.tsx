import { govElements } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './CategoriesPane.css'

interface CategoriesPaneProps {
  onOpenCategory: (category: string, subtype: string) => void
  onClose: () => void
}

const categorySubtypes = [
  { category: 'official',   subtype: 'prime-minister',       label: '👑 Prime Minister' },
  { category: 'official',   subtype: 'cabinet-minister',     label: '🌟 Cabinet Minister' },
  { category: 'official',   subtype: 'junior-minister',      label: '👤 Junior Minister' },
  { category: 'official',   subtype: 'civil-servant',        label: '👤 Civil Servant' },
  { category: 'official',   subtype: 'other',                label: '👤 Other Official' },
  { category: 'department', subtype: 'ministerial',          label: '🏛️ Ministerial Department' },
  { category: 'department', subtype: 'non-ministerial',      label: '🏛️ Non-Ministerial Department' },
  { category: 'department', subtype: 'agency',               label: '⚙️ Executive Agency' },
  { category: 'department', subtype: 'division-directorate', label: '⚙️ Division / Directorate' },
  { category: 'body',       subtype: 'executive-ndpb',       label: '📋 Executive NDPB' },
  { category: 'body',       subtype: 'advisory-ndpb',        label: '💡 Advisory NDPB' },
  { category: 'body',       subtype: 'public-corporation',   label: '🏢 Public Corporation' },
  { category: 'body',       subtype: 'royal-charter-body',   label: '📜 Royal Charter Body' },
  { category: 'body',       subtype: 'tribunal',             label: '⚖️ Tribunal' },
  { category: 'body',       subtype: 'other',                label: '🔗 Other Body' },
  { category: 'group',      subtype: 'cabinet',              label: '⭐ Cabinet' },
]

const sectionHeadings: Record<string, string> = {
  official: 'Officials',
  department: 'Departments',
  body: 'Public Bodies',
  group: 'Groups',
}

export default function CategoriesPane({ onOpenCategory, onClose }: CategoriesPaneProps) {
  const allElements = Object.values(govElements)

  const sections = ['official', 'department', 'body', 'group']

  return (
    <div className="categories-pane">
      <div className="categories-header">
        <div className="element-header">
          <div className="header-content">
            <h2>Categories</h2>
          </div>
          <button
            className="close-button-header"
            onClick={onClose}
            aria-label="Close categories pane"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="categories-content">
        {sections.map(section => {
          const items = categorySubtypes.filter(ct => ct.category === section)
          return (
            <div key={section} className="categories-section">
              <h3 className="categories-section-heading">{sectionHeadings[section]}</h3>
              {items.map(ct => {
                const count = allElements.filter(
                  el => el.category === ct.category && el.subtype === ct.subtype
                ).length
                const color = getElementColor(ct.category, ct.subtype)
                return (
                  <div
                    key={`${ct.category}-${ct.subtype}`}
                    className="category-item"
                    onClick={() => onOpenCategory(ct.category, ct.subtype)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && onOpenCategory(ct.category, ct.subtype)}
                    style={{ borderLeftColor: color }}
                  >
                    <span className="category-item-label">{ct.label}</span>
                    {count > 0 && <span className="category-item-count">{count}</span>}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
