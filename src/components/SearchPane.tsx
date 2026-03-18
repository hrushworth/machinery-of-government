import { useState, useRef, useEffect } from 'react'
import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './SearchPane.css'

interface SearchPaneProps {
  onSelectElement: (id: string) => void
  onClose: () => void
}

export default function SearchPane({ onSelectElement, onClose }: SearchPaneProps) {
  const [query, setQuery] = useState('')
  const [activeTagIds, setActiveTagIds] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const allElements = Object.values(govElements)
  const q = query.toLowerCase().trim()

  // Tags: match label against query, show only tags that have at least one element
  const allTags = Object.values(tagDefinitions)
  const matchedTags = allTags.filter(tag =>
    tag.label.toLowerCase().includes(q) || tag.id.toLowerCase().includes(q)
  ).filter(tag =>
    allElements.some(el => el.tags?.includes(tag.id))
  ).sort((a, b) => {
    // Sort: type tags first, then sector; alphabetical within each group
    if (a.tagCategory !== b.tagCategory) return a.tagCategory === 'type' ? -1 : 1
    return a.label.localeCompare(b.label)
  })

  const toggleTag = (tagId: string) => {
    setActiveTagIds(prev => {
      const next = new Set(prev)
      next.has(tagId) ? next.delete(tagId) : next.add(tagId)
      return next
    })
  }

  // Elements: filter by query AND all active tags (AND logic)
  const matchedElements = allElements
    .filter(el => {
      const nameMatch = el.name.toLowerCase().includes(q) || el.id.toLowerCase().includes(q)
      const tagMatch = activeTagIds.size === 0 || [...activeTagIds].every(tid => el.tags?.includes(tid))
      return nameMatch && tagMatch
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const noResults = matchedTags.length === 0 && matchedElements.length === 0

  return (
    <div className="search-pane">
      <div className="search-sticky">
        <div className="element-header">
          <div className="header-content">
            <h2>Search</h2>
          </div>
          <button
            className="close-button-header"
            onClick={onClose}
            aria-label="Close search pane"
          >
            ✕
          </button>
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
        {matchedTags.length > 0 && (
          <div className="search-section">
            <div className="search-section-label">
              Tags
              {activeTagIds.size > 0 && (
                <button className="tag-clear-btn" onClick={() => setActiveTagIds(new Set())}>
                  Clear filters
                </button>
              )}
            </div>
            <div className="tag-group">
              <div className="tag-group-heading">Type</div>
              <div className="tag-pill-row">
                {matchedTags.filter(t => t.tagCategory === 'type').map(tag => {
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
            <div className="tag-group">
              <div className="tag-group-heading">Sector</div>
              <div className="tag-pill-row">
                {matchedTags.filter(t => t.tagCategory === 'sector').map(tag => {
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
          </div>
        )}

        {matchedElements.length > 0 && (
          <div className="search-section">
            <div className="search-section-label">
              Elements{q || activeTagIds.size > 0
                ? ` — ${matchedElements.length} result${matchedElements.length !== 1 ? 's' : ''}`
                : ` (${matchedElements.length})`}
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

        {noResults && (
          <div className="search-no-results">No results for "{query}"</div>
        )}
      </div>
    </div>
  )
}
