import { useState, useRef, useEffect } from 'react'
import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './SearchPane.css'

interface SearchPaneProps {
  onSelectElement: (id: string) => void
  onClose: () => void
  onResultsChange?: (ids: string[]) => void
}

// ── Tiny shape swatch (mirrors CategoriesPane) ────────────────────────────────
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

// ── Subtype filter data ───────────────────────────────────────────────────────
const subtypeGroups = [
  {
    heading: 'Officials',
    items: [
      { category: 'official', subtype: 'prime-minister',   emoji: '👑', label: 'Prime Minister',      shape: 'heptagon' },
      { category: 'official', subtype: 'cabinet-minister', emoji: '🌟', label: 'Cabinet Minister',    shape: 'octagon' },
      { category: 'official', subtype: 'junior-minister',  emoji: '👤', label: 'Junior Minister',     shape: 'circle' },
      { category: 'official', subtype: 'civil-servant',    emoji: '👤', label: 'Civil Servant',       shape: 'circle' },
      { category: 'official', subtype: 'independent',      emoji: '👤', label: 'Independent Official', shape: 'circle' },
    ],
  },
  {
    heading: 'Departments',
    items: [
      { category: 'department', subtype: 'ministerial',          emoji: '🏛️', label: 'Ministerial Dept',     shape: 'square' },
      { category: 'department', subtype: 'non-ministerial',      emoji: '🏛️', label: 'Non-Ministerial Dept', shape: 'square' },
      { category: 'department', subtype: 'agency',               emoji: '⚙️', label: 'Executive Agency',     shape: 'rounded-square' },
      { category: 'department', subtype: 'division-directorate', emoji: '⚙️', label: 'Division / Directorate', shape: 'rounded-square' },
    ],
  },
  {
    heading: 'Public Bodies',
    items: [
      { category: 'body', subtype: 'executive-ndpb',     emoji: '📋', label: 'Executive NDPB',    shape: 'diamond' },
      { category: 'body', subtype: 'advisory-ndpb',      emoji: '💡', label: 'Advisory NDPB',     shape: 'diamond' },
      { category: 'body', subtype: 'tribunal',           emoji: '⚖️', label: 'Tribunal',           shape: 'diamond' },
      { category: 'body', subtype: 'public-corporation', emoji: '🏢', label: 'Public Corporation', shape: 'parallelogram' },
      { category: 'body', subtype: 'royal-charter-body', emoji: '📜', label: 'Royal Charter Body', shape: 'parallelogram' },
      { category: 'body', subtype: 'other',              emoji: '🔗', label: 'Other Body',          shape: 'parallelogram' },
    ],
  },
  {
    heading: 'Groups',
    items: [
      { category: 'group', subtype: 'cabinet', emoji: '⭐', label: 'Cabinet', shape: 'square' },
    ],
  },
]

export default function SearchPane({ onSelectElement, onClose, onResultsChange }: SearchPaneProps) {
  const [query, setQuery] = useState('')
  const [activeTagIds, setActiveTagIds] = useState<Set<string>>(new Set())
  const [activeSubtypes, setActiveSubtypes] = useState<Set<string>>(new Set())
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [typeTagsOpen, setTypeTagsOpen] = useState(false)
  const [sectorTagsOpen, setSectorTagsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const allElements = Object.values(govElements)
  const allTags = Object.values(tagDefinitions)
  const typeTags  = allTags.filter(t => t.tagCategory === 'type').sort((a, b) => a.label.localeCompare(b.label))
  const sectorTags = allTags.filter(t => t.tagCategory === 'sector').sort((a, b) => a.label.localeCompare(b.label))

  const q = query.toLowerCase().trim()

  const toggleTag = (tagId: string) =>
    setActiveTagIds(prev => { const n = new Set(prev); n.has(tagId) ? n.delete(tagId) : n.add(tagId); return n })

  const toggleSubtype = (key: string) =>
    setActiveSubtypes(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })

  const clearAll = () => { setActiveTagIds(new Set()); setActiveSubtypes(new Set()) }

  const matchedElements = allElements
    .filter(el => {
      const nameMatch = !q || el.name.toLowerCase().includes(q) || el.id.toLowerCase().includes(q)
      const tagMatch = activeTagIds.size === 0 || [...activeTagIds].every(tid => el.tags?.includes(tid))
      const subtypeMatch = activeSubtypes.size === 0 || activeSubtypes.has(`${el.category}/${el.subtype}`)
      return nameMatch && tagMatch && subtypeMatch
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const hasActiveFilter = q.length > 0 || activeTagIds.size > 0 || activeSubtypes.size > 0
  const noResults = hasActiveFilter && matchedElements.length === 0
  const totalActiveFilters = activeTagIds.size + activeSubtypes.size

  useEffect(() => {
    onResultsChange?.(matchedElements.map(el => el.id))
  }, [matchedElements.map(el => el.id).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="search-pane">
      <div className="search-sticky">
        <div className="element-header">
          <div className="header-content"><h2>Search</h2></div>
          <button className="close-button-header" onClick={onClose} aria-label="Close search pane">✕</button>
        </div>
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search organisations, bodies…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="search-results">

        {/* ── Category filter ─────────────────────────────────────────────── */}
        <div className="search-filter-section">
          <button
            className={`search-filter-header${activeSubtypes.size > 0 ? ' search-filter-header-active' : ''}`}
            onClick={() => setCategoryOpen(p => !p)}
            aria-expanded={categoryOpen}
          >
            <span>Category</span>
            {activeSubtypes.size > 0 && (
              <>
                <span className="filter-active-badge">{activeSubtypes.size}</span>
                <button className="tag-clear-btn" onClick={e => { e.stopPropagation(); setActiveSubtypes(new Set()) }}>
                  Clear
                </button>
              </>
            )}
            <span className={`filter-chevron${categoryOpen ? ' open' : ''}`}>▾</span>
          </button>

          {categoryOpen && (
            <div className="search-filter-content">
              {subtypeGroups.map(group => (
                <div key={group.heading} className="filter-subtype-group">
                  <div className="filter-subtype-group-heading">{group.heading}</div>
                  <div className="filter-subtype-pill-row">
                    {group.items.map(item => {
                      const key = `${item.category}/${item.subtype}`
                      const active = activeSubtypes.has(key)
                      const color = getElementColor(item.category, item.subtype)
                      return (
                        <button
                          key={key}
                          className={`filter-subtype-pill${active ? ' active' : ''}`}
                          style={{ '--pill-colour': color } as React.CSSProperties}
                          onClick={() => toggleSubtype(key)}
                        >
                          <ShapeSwatch shape={item.shape} color={active ? '#fff' : color} />
                          <span>{item.emoji} {item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Type Tags filter ─────────────────────────────────────────────── */}
        <div className="search-filter-section">
          <button
            className={`search-filter-header${activeTagIds.size > 0 && typeTags.some(t => activeTagIds.has(t.id)) ? ' search-filter-header-active' : ''}`}
            onClick={() => setTypeTagsOpen(p => !p)}
            aria-expanded={typeTagsOpen}
          >
            <span>Type Tags</span>
            {typeTags.filter(t => activeTagIds.has(t.id)).length > 0 && (
              <>
                <span className="filter-active-badge">{typeTags.filter(t => activeTagIds.has(t.id)).length}</span>
                <button className="tag-clear-btn" onClick={e => {
                  e.stopPropagation()
                  setActiveTagIds(prev => {
                    const n = new Set(prev)
                    typeTags.forEach(t => n.delete(t.id))
                    return n
                  })
                }}>Clear</button>
              </>
            )}
            <span className={`filter-chevron${typeTagsOpen ? ' open' : ''}`}>▾</span>
          </button>

          {typeTagsOpen && (
            <div className="search-filter-content">
              <div className="tag-pill-row">
                {typeTags.filter(tag => allElements.some(el => el.tags?.includes(tag.id))).map(tag => {
                  const count = allElements.filter(el => el.tags?.includes(tag.id)).length
                  const active = activeTagIds.has(tag.id)
                  return (
                    <button
                      key={tag.id}
                      className={`tag-pill tag-pill-type${active ? ' tag-pill-active' : ''}`}
                      style={{ '--tag-colour': tag.colour } as React.CSSProperties}
                      onClick={() => toggleTag(tag.id)}
                      title={`${count} element${count !== 1 ? 's' : ''}`}
                    >
                      {tag.label}
                      <span className="tag-pill-count">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Sector Tags filter ───────────────────────────────────────────── */}
        <div className="search-filter-section">
          <button
            className={`search-filter-header${sectorTags.some(t => activeTagIds.has(t.id)) ? ' search-filter-header-active' : ''}`}
            onClick={() => setSectorTagsOpen(p => !p)}
            aria-expanded={sectorTagsOpen}
          >
            <span>Sector Tags</span>
            {sectorTags.filter(t => activeTagIds.has(t.id)).length > 0 && (
              <>
                <span className="filter-active-badge">{sectorTags.filter(t => activeTagIds.has(t.id)).length}</span>
                <button className="tag-clear-btn" onClick={e => {
                  e.stopPropagation()
                  setActiveTagIds(prev => {
                    const n = new Set(prev)
                    sectorTags.forEach(t => n.delete(t.id))
                    return n
                  })
                }}>Clear</button>
              </>
            )}
            <span className={`filter-chevron${sectorTagsOpen ? ' open' : ''}`}>▾</span>
          </button>

          {sectorTagsOpen && (
            <div className="search-filter-content">
              <div className="tag-pill-row">
                {sectorTags.filter(tag => allElements.some(el => el.tags?.includes(tag.id))).map(tag => {
                  const count = allElements.filter(el => el.tags?.includes(tag.id)).length
                  const active = activeTagIds.has(tag.id)
                  return (
                    <button
                      key={tag.id}
                      className={`tag-pill${active ? ' tag-pill-active' : ''}`}
                      style={{ '--tag-colour': tag.colour } as React.CSSProperties}
                      onClick={() => toggleTag(tag.id)}
                      title={`${count} element${count !== 1 ? 's' : ''}`}
                    >
                      {tag.label}
                      <span className="tag-pill-count">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Results ──────────────────────────────────────────────────────── */}
        {matchedElements.length > 0 && (
          <div className="search-section">
            <div className="search-section-label">
              Elements{hasActiveFilter
                ? ` — ${matchedElements.length} result${matchedElements.length !== 1 ? 's' : ''}`
                : ` (${matchedElements.length})`}
              {totalActiveFilters > 0 && (
                <button className="tag-clear-btn" onClick={clearAll}>Clear all</button>
              )}
            </div>
            {matchedElements.map(el => {
              const color = getElementColor(el.category, el.subtype)
              return (
                <div
                  key={el.id}
                  className="search-result-item search-result-element"
                  onClick={() => onSelectElement(el.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && onSelectElement(el.id)}
                  style={{ borderLeftColor: color }}
                >
                  <span className="search-result-name">{el.name}</span>
                </div>
              )
            })}
          </div>
        )}

        {noResults && <div className="search-no-results">No results</div>}
      </div>
    </div>
  )
}
