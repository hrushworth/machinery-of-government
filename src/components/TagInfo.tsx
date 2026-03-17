import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './CategoryInfo.css'
import './TagInfo.css'

interface TagInfoProps {
  tagId: string
  onClose: () => void
  onSelectElement: (id: string) => void
}

export default function TagInfo({ tagId, onClose, onSelectElement }: TagInfoProps) {
  const tag = tagDefinitions[tagId]

  if (!tag) {
    return (
      <div className="category-info">
        <div className="element-header">
          <h2>Tag not found</h2>
          <button className="close-button-header" onClick={onClose} aria-label="Close tag pane">✕</button>
        </div>
      </div>
    )
  }

  const elementsWithTag = Object.values(govElements)
    .filter(el => el.tags?.includes(tagId))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="category-info">
      <div className="element-header">
        <div className="header-content">
          <div className="tag-info-badge-row">
            {tag.tagCategory === 'type' ? (
              <span
                className="tag-info-badge"
                style={{ '--tag-colour': tag.colour } as React.CSSProperties}
              >
                {tag.label}
              </span>
            ) : (
              <span
                className="tag-info-badge tag-info-badge-sector"
                style={{ '--tag-colour': tag.colour } as React.CSSProperties}
              >
                {tag.label}
              </span>
            )}
            <span className="tag-info-category-label">
              {tag.tagCategory === 'type' ? 'Type tag' : 'Sector tag'}
            </span>
          </div>
        </div>
        <button className="close-button-header" onClick={onClose} aria-label="Close tag pane">✕</button>
      </div>

      {elementsWithTag.length > 0 && (
        <div className="category-section">
          <h3>{elementsWithTag.length} {elementsWithTag.length === 1 ? 'organisation' : 'organisations'}</h3>
          <ul className="category-elements-list">
            {elementsWithTag.map(el => (
              <li
                key={el.id}
                className="category-element-item"
                onClick={() => onSelectElement(el.id)}
                style={{ borderLeftColor: getElementColor(el.category, el.subtype) }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectElement(el.id)}
              >
                <strong>{el.name}</strong>
                <p>{el.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {elementsWithTag.length === 0 && (
        <div className="category-description">
          <p>No organisations currently tagged with this label.</p>
        </div>
      )}
    </div>
  )
}
