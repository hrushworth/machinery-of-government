import { govElements, tagDefinitions } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './CategoryInfo.css'
import './TagInfo.css'

interface TagInfoProps {
  tagId: string
  onClose: () => void
  onSelectElement: (id: string) => void
}

const typeTagDescriptions: Record<string, string> = {
  'statutory-regulator':
    'Bodies exercising statutory regulatory functions conferred by Parliament — including standard-setting, licensing, compliance monitoring, and enforcement. Listed in the Cabinet Office register of UK regulators.',
  'professional-regulator':
    'Bodies that regulate specific professions in the public interest, maintaining registers of qualified practitioners, setting standards for education and conduct, and taking fitness-to-practise action where needed.',
  'high-profile-group':
    'Cross-cutting government units, high-profile operational groups, and functions that span multiple departments or sit at the centre of government.',
  'research-council':
    'Non-departmental public bodies that fund and coordinate scientific research, innovation, and knowledge exchange across academic and industrial disciplines.',
  'museum-gallery':
    'National museums, galleries, and heritage institutions that hold collections in trust for the nation and make them accessible to the public.',
  'tribunal':
    'Statutory bodies that adjudicate disputes and hear appeals in specific areas of law, providing an accessible alternative to the ordinary courts. Most are part of the Tribunals Service.',
  'ombudsman':
    'Independent bodies that investigate complaints about public services, maladministration, and injustice. Ombudsmen are typically a final resort after internal complaints procedures have been exhausted.',
  'inspector':
    'Inspectorates and inspection bodies that independently assess, audit, or report on the quality and performance of public services. Reports are usually published and laid before Parliament.',
  'adviser':
    'Independent advisory committees, scientific advisory bodies, pay review bodies, and expert panels that provide advice to ministers and departments. They operate at arm\'s length from policy-makers.',
  'profession':
    'Cross-government professional networks and functional communities that set standards, provide leadership, and coordinate capability across the Civil Service (e.g. the Government Finance Function, the Government Legal Profession).',
  'police':
    'Police forces, law enforcement agencies, and bodies responsible for policing functions and public order across the UK.',
  'trading-fund':
    'Government bodies that operate on a commercial basis within departments, funding their activities largely from fees charged to users rather than direct Exchequer grant.',
  'nhs-body':
    'NHS organisations including commissioners, special health authorities, NHS England arms, and NHS foundation trusts that form part of the National Health Service in England.',
  'review-body':
    'Independent pay review bodies that make annual recommendations to government on the remuneration of public sector workforces including the Armed Forces, NHS staff, teachers, and the judiciary.',
  'prosecution':
    'Prosecution services responsible for making charging decisions and presenting criminal cases on behalf of the Crown in England and Wales.',
  'lottery':
    'Distributor bodies that allocate National Lottery and heritage fund proceeds to arts, sports, heritage, and community causes.',
  'development-corp':
    'Development corporations and urban regeneration bodies with statutory powers to acquire land, build infrastructure, and promote economic development in defined areas.',
  'national-park':
    'National Park Authorities that conserve and enhance the natural beauty, wildlife, and cultural heritage of England\'s national parks, while promoting opportunities for public understanding and enjoyment.',
  'armed-forces':
    'The Armed Forces of the United Kingdom — the Royal Navy, British Army, and Royal Air Force — together with their associated commands, units, and supporting defence bodies.',
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
