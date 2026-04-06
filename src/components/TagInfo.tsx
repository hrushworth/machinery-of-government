import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import { professionProfiles } from '../data/professions'
import './CategoryInfo.css'
import './TagInfo.css'

interface TagInfoProps {
  tagId: string
  onClose: () => void
  onSelectElement: (id: string) => void
}

const typeTagDescriptions: Record<string, string> = {
  'regulator':
    'Bodies exercising regulatory and supervisory functions — including financial supervision, data protection, consumer protection, and pharmaceutical regulation.',
  'inspectorate':
    'Inspectorates and inspection bodies that monitor compliance with legal requirements, such as the Language Inspectorate (Keeleinspektsioon) and Labour Inspectorate (Tööinspektsioon).',
  'intelligence':
    'Intelligence and security services responsible for foreign intelligence gathering and domestic counter-intelligence, including the Foreign Intelligence Service (Välisluureamet) and the Internal Security Service (Kaitsepolitseiamet, KAPO).',
  'prosecution':
    'The Prosecution Service (Prokuratuur), headed by the Prosecutor General, responsible for criminal prosecution in Estonia.',
  'armed-forces':
    'The Estonian Defence Forces (Kaitsevägi) and related defence organisations, including the voluntary Estonian Defence League (Kaitseliit).',
  'police':
    'Law enforcement bodies, principally the Police and Border Guard Board (Politsei- ja Piirivalveamet, PPA), which handles policing, border security, and migration.',
  'ombudsman':
    'The Chancellor of Justice (Õiguskantsler) serves as Estonia\'s national ombudsman, reviewing the constitutionality of legislation and supervising fundamental rights.',
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

  const description = tag.tagCategory === 'type' ? typeTagDescriptions[tagId] : undefined

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

      {description && (
        <div className="category-description">
          <p>{description}</p>
        </div>
      )}

      {elementsWithTag.length > 0 && (
        <div className="category-section">
          <h3>{elementsWithTag.length} {elementsWithTag.length === 1 ? 'organisation' : 'organisations'}</h3>
          <ul className="category-elements-list">
            {elementsWithTag.map(el => {
              const profProfile = tagId === 'professional-regulator'
                ? professionProfiles[el.id]
                : undefined
              return (
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
                  {profProfile && profProfile.professions.length > 0 && (
                    <p className="tag-item-professions">
                      {profProfile.professions.map(p => p.name).join(' · ')}
                    </p>
                  )}
                </li>
              )
            })}
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
