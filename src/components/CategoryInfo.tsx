import { govElements } from '../data/elements'
import { getElementColor } from '../utils/colors'
import './CategoryInfo.css'

interface CategoryInfoProps {
  category: string
  subtype: string
  onClose: () => void
  onSelectElement: (id: string) => void
}

export default function CategoryInfo({ category, subtype, onClose, onSelectElement }: CategoryInfoProps) {
  const categoryDescriptions: Record<string, Record<string, { emoji: string; title: string; description: string }>> = {
    official: {
      'prime-minister': {
        emoji: '👑',
        title: 'Prime Minister',
        description: 'The head of government and chair of the Cabinet. The Prime Minister appoints all other government ministers and is responsible for setting the overall direction of government policy.',
      },
      'cabinet-minister': {
        emoji: '🌟',
        title: 'Cabinet Minister',
        description: 'Senior ministers appointed by the Prime Minister to lead government departments. Cabinet members form the collective decision-making body that directs government policy.',
      },
      'junior-minister': {
        emoji: '👤',
        title: 'Junior Minister',
        description: 'Ministers appointed to support Cabinet members and Secretaries of State in their departments. They handle specific policy areas and represent government in Parliament.',
      },
      'civil-servant': {
        emoji: '👤',
        title: 'Civil Servant',
        description: 'Professional, non-partisan public sector employees who provide impartial advice to government and implement policies. Led by Permanent Secretaries in departments.',
      },
      other: {
        emoji: '👤',
        title: 'Other Official',
        description: 'Independent officials including chairs of public bodies, members of tribunals, and other government representatives not falling into the political or civil service categories.',
      },
    },
    department: {
      ministerial: {
        emoji: '🏛️',
        title: 'Ministerial Department',
        description: 'Government departments led by a Secretary of State who is a minister and member of the Cabinet. These departments implement government policy in their areas of responsibility.',
      },
      'non-ministerial': {
        emoji: '🏛️',
        title: 'Non-Ministerial Department',
        description: 'Government departments run by a non-ministerial politician, such as the Land Registry or the Crown Prosecution Service. They operate with independence from ministerial direction.',
      },
      agency: {
        emoji: '⚙️',
        title: 'Executive Agency',
        description: 'Operational delivery bodies that sit within ministerial departments but have delegated authority to run day-to-day services. Examples include HMRC and the UK Visas and Immigration service.',
      },
      'division-directorate': {
        emoji: '⚙️',
        title: 'Division/Directorate',
        description: 'Divisions and directorates are major sub-divisions within government departments. They organise work into distinct operational areas managed by directors and director-generals. Key public-facing divisions are listed here.',
      },
    },
    body: {
      'executive-ndpb': {
        emoji: '📋',
        title: 'Executive NDPB',
        description: 'Non-Departmental Public Bodies with executive functions — independent organisations at arm\'s length from government that carry out statutory or public functions, such as regulators, inspectorates, and delivery bodies.',
      },
      'advisory-ndpb': {
        emoji: '💡',
        title: 'Advisory NDPB',
        description: 'Non-Departmental Public Bodies that provide independent advice and guidance to ministers and government departments. Examples include pay review bodies, scientific advisory committees, and the Law Commission.',
      },
      'public-corporation': {
        emoji: '🏢',
        title: 'Public Corporation',
        description: 'Government-owned or government-sponsored bodies incorporated as companies or statutory corporations that operate at arm\'s length from the state. Includes broadcasters (BBC, S4C), development banks, government-owned companies, and bodies providing commercial services on behalf of government.',
      },
      'royal-charter-body': {
        emoji: '📜',
        title: 'Royal Charter Body',
        description: 'Bodies incorporated by Royal Charter, conferring a degree of independence from government. These organisations often have historic or ceremonial functions and operate outside normal public body classifications.',
      },
      tribunal: {
        emoji: '⚖️',
        title: 'Tribunal',
        description: 'Statutory bodies that adjudicate disputes and hear appeals in specific areas of law, providing an alternative to the court system. Includes employment, competition, planning, and regulatory tribunals.',
      },
      other: {
        emoji: '🔗',
        title: 'Other Body',
        description: 'Other government-related organisations not falling into the main classifications, including statutory commissioners, cross-cutting units, and bodies with mixed functions.',
      },
    },
    group: {
      cabinet: {
        emoji: '⭐',
        title: 'Cabinet',
        description: 'The collective decision-making body of senior government ministers, chaired by the Prime Minister. Cabinet members lead major departments and set the direction of government policy.',
      },
    },
  }

  const info = (categoryDescriptions[category] as any)?.[subtype]

  // 'other' officials also includes elements with subtype 'independent'
  const effectiveSubtypes = category === 'official' && subtype === 'other'
    ? ['other', 'independent']
    : [subtype]

  const elementsOfType = Object.values(govElements).filter(
    el => el.category === category && effectiveSubtypes.includes(el.subtype)
  )

  if (!info) {
    return (
      <div className="category-info">
        <div className="element-header">
          <h2>Information not available</h2>
          <button 
            className="close-button-header" 
            onClick={onClose}
            aria-label="Close category pane"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="category-info">
      <div className="element-header">
        <div className="header-content">
          <h2>{info.emoji} {info.title}</h2>
        </div>
        <button 
          className="close-button-header" 
          onClick={onClose}
          aria-label="Close category pane"
        >
          ✕
        </button>
      </div>

      <div className="category-description">
        <p>{info.description}</p>
      </div>

      {elementsOfType.length > 0 && (
        <div className="category-section">
          <h3>All {info.title}s ({elementsOfType.length})</h3>
          <ul className="category-elements-list">
            {elementsOfType.sort((a, b) => a.name.localeCompare(b.name)).map(el => (
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
    </div>
  )
}
