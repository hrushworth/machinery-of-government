import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './CategoriesPane.css'

interface CategoriesPaneProps {
  onOpenCategory: (category: string, subtype: string) => void
  onOpenTag: (tagId: string) => void
  onClose: () => void
  isMobile?: boolean
}

const categorySubtypes = [
  { category: 'official',   subtype: 'prime-minister',       label: '👑 Prime Minister' },
  { category: 'official',   subtype: 'cabinet-minister',     label: '🌟 Cabinet Minister' },
  { category: 'official',   subtype: 'head-of-state',        label: '🏛️ Head of State' },
  { category: 'official',   subtype: 'independent-official', label: '👤 Independent Official' },
  { category: 'official',   subtype: 'civil-servant',        label: '👤 Civil Servant' },
  { category: 'department', subtype: 'ministerial',          label: '🏛️ Ministry' },
  { category: 'department', subtype: 'agency',               label: '⚙️ Government Office / Chancellery' },
  { category: 'department', subtype: 'portfolio',            label: '📁 Portfolio (no own ministry)' },
  { category: 'body',       subtype: 'constitutional-body',  label: '⚖️ Constitutional Body' },
  { category: 'body',       subtype: 'executive-agency',     label: '📋 Executive Agency' },
  { category: 'body',       subtype: 'regulator',            label: '🔍 Regulator' },
  { category: 'body',       subtype: 'public-law-body',      label: '🏢 Public Law Body' },
  { category: 'body',       subtype: 'security-agency',      label: '🛡️ Security Agency' },
  { category: 'body',       subtype: 'military',             label: '⚔️ Military' },
  { category: 'body',       subtype: 'state-enterprise',     label: '🏭 State Enterprise' },
  { category: 'body',       subtype: 'public-corporation',   label: '🏢 Public Corporation' },
  { category: 'body',       subtype: 'training-institution', label: '🎓 Training Institution' },
  { category: 'body',       subtype: 'research-institute',   label: '🔬 Research Institute' },
  { category: 'body',       subtype: 'inspectorate',         label: '🔎 Inspectorate' },
  { category: 'group',      subtype: 'cabinet',              label: '⭐ Cabinet' },
]

const sectionHeadings: Record<string, string> = {
  official: 'Officials',
  department: 'Departments',
  body: 'Public Bodies',
  group: 'Groups',
}

// Maps category/subtype → chart shape name
const subtypeShape: Record<string, string> = {
  'official/prime-minister':        'heptagon',
  'official/cabinet-minister':      'octagon',
  'official/head-of-state':         'circle',
  'official/independent-official':  'circle',
  'official/civil-servant':         'circle',
  'department/ministerial':         'square',
  'department/agency':              'rounded-square',
  'department/portfolio':           'square',
  'body/constitutional-body':       'diamond',
  'body/executive-agency':          'diamond',
  'body/regulator':                 'diamond',
  'body/public-law-body':           'diamond',
  'body/security-agency':           'diamond',
  'body/military':                  'diamond',
  'body/state-enterprise':          'diamond',
  'body/public-corporation':        'diamond',
  'body/training-institution':      'diamond',
  'body/research-institute':        'diamond',
  'body/inspectorate':              'diamond',
  'body/other':                     'diamond',
  'group/cabinet':                  'square',
}

function ShapeSwatch({ shape, color }: { shape: string; color: string }) {
  const style = { backgroundColor: color, borderColor: color }
  if (shape === 'diamond') {
    return (
      <span className="cat-shape-swatch cat-shape-diamond" aria-hidden="true">
        <span className="cat-shape-diamond-inner" style={style} />
      </span>
    )
  }
  if (shape === 'parallelogram') {
    return (
      <span className="cat-shape-swatch cat-shape-diamond" aria-hidden="true">
        <span className="cat-shape-parallelogram-inner" style={style} />
      </span>
    )
  }
  return <span className={`cat-shape-swatch cat-shape-${shape}`} style={style} aria-hidden="true" />
}

export default function CategoriesPane({ onOpenCategory, onOpenTag, onClose, isMobile }: CategoriesPaneProps) {
  const allElements = Object.values(govElements)
  const allTags = Object.values(tagDefinitions)
  const typeTags = allTags.filter(t => t.tagCategory === 'type').sort((a, b) => a.label.localeCompare(b.label))
  const sectorTags = allTags.filter(t => t.tagCategory === 'sector').sort((a, b) => a.label.localeCompare(b.label))

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
                const shape = subtypeShape[`${ct.category}/${ct.subtype}`]
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
                    {isMobile && shape && <ShapeSwatch shape={shape} color={color} />}
                    <span className="category-item-label">{ct.label}</span>
                    {count > 0 && <span className="category-item-count">{count}</span>}
                  </div>
                )
              })}
            </div>
          )
        })}

        <div className="categories-section">
          <h3 className="categories-section-heading">Type Tags</h3>
          {typeTags.map(tag => {
            const count = allElements.filter(el => el.tags?.includes(tag.id)).length
            if (count === 0) return null
            return (
              <div
                key={tag.id}
                className="tag-item"
                onClick={() => onOpenTag(tag.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onOpenTag(tag.id)}
                style={{ borderLeftColor: tag.colour }}
              >
                <span className="category-item-label">{tag.label}</span>
                <span className="category-item-count">{count}</span>
              </div>
            )
          })}
        </div>

        <div className="categories-section">
          <h3 className="categories-section-heading">Sector Tags</h3>
          {sectorTags.map(tag => {
            const count = allElements.filter(el => el.tags?.includes(tag.id)).length
            if (count === 0) return null
            return (
              <div
                key={tag.id}
                className="tag-item"
                onClick={() => onOpenTag(tag.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onOpenTag(tag.id)}
                style={{ borderLeftColor: tag.colour }}
              >
                <span className="category-item-label">{tag.label}</span>
                <span className="category-item-count">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
