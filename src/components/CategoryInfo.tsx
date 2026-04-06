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
        description: 'Head of government (Peaminister). Nominated by the President, confirmed by the Riigikogu. Leads the cabinet and coordinates government policy.',
      },
      'cabinet-minister': {
        emoji: '🌟',
        title: 'Cabinet Minister',
        description: 'Ministers appointed by the Prime Minister to lead government ministries. Together with the PM, they form the Government of the Republic (Vabariigi Valitsus).',
      },
      'head-of-state': {
        emoji: '🏛️',
        title: 'Head of State',
        description: 'The President of the Republic (Vabariigi President). Largely ceremonial role in Estonia\'s parliamentary system. Represents Estonia internationally and is the supreme commander of national defence.',
      },
      'independent-official': {
        emoji: '👤',
        title: 'Independent Official',
        description: 'Constitutional officeholders who exercise their functions independently of the government. Includes the Speaker of the Riigikogu, Chief Justice, Chancellor of Justice, Auditor General, and Governor of the Bank of Estonia.',
      },
      'civil-servant': {
        emoji: '👤',
        title: 'Civil Servant',
        description: 'Senior civil servants heading government offices or agencies, such as the Secretary of State (head of the Government Office).',
      },
    },
    department: {
      ministerial: {
        emoji: '🏛️',
        title: 'Ministry',
        description: 'Government ministries (ministeeriumid) headed by a minister. Estonia has 11 ministries that implement government policy in their respective areas.',
      },
      agency: {
        emoji: '⚙️',
        title: 'Government Office / Chancellery',
        description: 'Administrative offices and chancelleries that support constitutional institutions or the government. Includes the Government Office (Riigikantselei), Office of the President, and parliamentary chancellery.',
      },
      portfolio: {
        emoji: '📁',
        title: 'Portfolio (no own ministry)',
        description: 'A ministerial portfolio managed through another ministry. The Minister of Infrastructure, for example, has no separate ministry and operates through the Ministry of Economic Affairs and Communications.',
      },
    },
    body: {
      'constitutional-body': {
        emoji: '⚖️',
        title: 'Constitutional Body',
        description: 'Independent institutions established by the Constitution of the Republic of Estonia. Includes the Riigikogu (Parliament), Supreme Court (Riigikohus), National Audit Office (Riigikontroll), and Bank of Estonia (Eesti Pank).',
      },
      'executive-agency': {
        emoji: '📋',
        title: 'Executive Agency',
        description: 'Government agencies (ametid) operating under ministries that implement policy and deliver public services. Examples include the Tax and Customs Board, Police and Border Guard Board, and Education and Youth Board.',
      },
      regulator: {
        emoji: '🔍',
        title: 'Regulator',
        description: 'Regulatory bodies exercising supervisory and enforcement functions. Examples include the Financial Supervision Authority (Finantsinspektsioon), Data Protection Inspectorate, and the Consumer Protection and Technical Regulatory Authority.',
      },
      'public-law-body': {
        emoji: '🏢',
        title: 'Public Law Body',
        description: 'Independent legal entities under public law that operate at arm\'s length from government. Includes the Estonian Health Insurance Fund (Tervisekassa) and Unemployment Insurance Fund (Töötukassa).',
      },
      'security-agency': {
        emoji: '🛡️',
        title: 'Security Agency',
        description: 'Intelligence and security services. Includes the Estonian Internal Security Service (KAPO) and the Foreign Intelligence Service (Välisluureamet).',
      },
      military: {
        emoji: '⚔️',
        title: 'Military',
        description: 'The Estonian Defence Forces (Kaitsevägi) — the armed forces of the Republic of Estonia, commanded by the Commander of the Defence Forces.',
      },
      'state-enterprise': {
        emoji: '🏭',
        title: 'State Enterprise',
        description: 'State-owned enterprises that operate on a commercial basis. Example: the State Forest Management Centre (RMK), which manages state forests.',
      },
      'public-corporation': {
        emoji: '🏢',
        title: 'Public Corporation',
        description: 'Government-related organisations incorporated as public corporations. Includes the Estonian Defence League (Kaitseliit), a voluntary national defence organisation.',
      },
      'training-institution': {
        emoji: '🎓',
        title: 'Training Institution',
        description: 'Specialised higher education and training institutions under government ministries, such as the Estonian Academy of Security Sciences (Sisekaitseakadeemia).',
      },
      'research-institute': {
        emoji: '🔬',
        title: 'Research Institute',
        description: 'Government research institutes conducting research, analysis, and development in their respective fields. Example: the National Institute for Health Development (TAI).',
      },
      inspectorate: {
        emoji: '🔎',
        title: 'Inspectorate',
        description: 'Inspection and compliance bodies that monitor adherence to legal requirements. Includes the Language Inspectorate and Labour Inspectorate.',
      },
      other: {
        emoji: '🔗',
        title: 'Other Body',
        description: 'Other government-related organisations not falling into the main classifications.',
      },
    },
    group: {
      cabinet: {
        emoji: '⭐',
        title: 'Cabinet',
        description: 'The Government of the Republic (Vabariigi Valitsus) — the collegial executive body consisting of the Prime Minister and ministers. The 54th Government is a coalition of Reform Party and Eesti 200.',
      },
    },
  }

  const info = (categoryDescriptions[category] as any)?.[subtype]

  const elementsOfType = Object.values(govElements).filter(
    el => el.category === category && el.subtype === subtype
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
