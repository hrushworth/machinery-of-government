import { readFileSync, writeFileSync } from 'fs'

const filePath = new URL('../src/data/elements.ts', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

const raw = readFileSync(filePath, 'utf8')

// Detect EOL
const eol = raw.includes('\r\n') ? '\r\n' : '\n'

// ── New entries to add ────────────────────────────────────────────────────────
// Each entry: { id, block } where block is the TS object literal (with trailing comma+eol)
// We also track which parent dept childIds arrays need updating.

const newEntries = [

  // ── DSIT ──────────────────────────────────────────────────────────────────
  {
    id: 'ai-security-institute',
    section: 'DEPARTMENTS: Divisions & Directorates',
    block: `  'ai-security-institute': {
    id: 'ai-security-institute',
    name: 'AI Security Institute',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Equips governments with scientific understanding of AI risks through research and developing mitigations.',
    infoUrl: 'https://www.gov.uk/government/organisations/ai-security-institute',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'govt-chemist',
    block: `  'govt-chemist': {
    id: 'govt-chemist',
    name: 'Government Chemist',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Resolves scientific disputes mainly in the food and feed sectors and advises regulators and industry.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-chemist',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'govt-digital-service',
    block: `  'govt-digital-service': {
    id: 'govt-digital-service',
    name: 'Government Digital Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The digital centre of government, transforming public services through digital platforms and technology.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-digital-service',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'govt-office-tech-transfer',
    block: `  'govt-office-tech-transfer': {
    id: 'govt-office-tech-transfer',
    name: 'Government Office for Technology Transfer',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Helps public sector bodies commercialise their innovations by accelerating them towards the market.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-office-for-technology-transfer',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'office-digital-identities',
    block: `  'office-digital-identities': {
    id: 'office-digital-identities',
    name: 'Office for Digital Identities and Attributes',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Enables the use of trusted digital identity services across the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-digital-identities-and-attributes',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'regulatory-innovation-office',
    block: `  'regulatory-innovation-office': {
    id: 'regulatory-innovation-office',
    name: 'Regulatory Innovation Office',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Updates regulation, speeds up approval times, and ensures regulatory bodies work together to support innovation.',
    infoUrl: 'https://www.gov.uk/government/organisations/regulatory-innovation-office',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },
  {
    id: 'research-collab-advice',
    block: `  'research-collab-advice': {
    id: 'research-collab-advice',
    name: 'Research Collaboration Advice Team',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides advice to research institutions on national security risks linked to international research collaborations.',
    infoUrl: 'https://www.gov.uk/government/organisations/research-collaboration-advice-team',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },

  // ── Cabinet Office ─────────────────────────────────────────────────────────
  {
    id: 'cabinet-office-board',
    block: `  'cabinet-office-board': {
    id: 'cabinet-office-board',
    name: 'Cabinet Office Board',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides collective strategic and operational leadership of the Cabinet Office.',
    infoUrl: 'https://www.gov.uk/government/organisations/cabinet-office-board',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'civil-service-fast-stream',
    block: `  'civil-service-fast-stream': {
    id: 'civil-service-fast-stream',
    name: 'Civil Service Fast Stream',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Runs the government\'s flagship graduate recruitment and development programme for the Civil Service.',
    infoUrl: 'https://www.gov.uk/government/organisations/civil-service-fast-stream',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'civil-service-group',
    block: `  'civil-service-group': {
    id: 'civil-service-group',
    name: 'Civil Service Group',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A Cabinet Office group that supports the running and reform of the Civil Service.',
    infoUrl: 'https://www.gov.uk/government/organisations/civil-service-group',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'disability-unit',
    block: `  'disability-unit': {
    id: 'disability-unit',
    name: 'Disability Unit',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works across government to break down barriers faced by disabled people in the UK and improve their lives.',
    infoUrl: 'https://www.gov.uk/government/organisations/disability-unit',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-analysis-function',
    block: `  'govt-analysis-function': {
    id: 'govt-analysis-function',
    name: 'Government Analysis Function',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides professional standards, guidance, and resources to support analytical work conducted across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-analysis-function',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-commercial-function',
    block: `  'govt-commercial-function': {
    id: 'govt-commercial-function',
    name: 'Government Commercial Function',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A cross-government network responsible for procuring or supporting the procurement of goods and services for government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-commercial-function',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-communication-service',
    block: `  'govt-communication-service': {
    id: 'govt-communication-service',
    name: 'Government Communication Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Supports all professional communicators across government to gain the skills and knowledge they need.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-communication-service',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-data-quality-hub',
    block: `  'govt-data-quality-hub': {
    id: 'govt-data-quality-hub',
    name: 'Government Data Quality Hub',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works across government to improve data quality standards across the public sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-data-quality-hub',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-finance-function',
    block: `  'govt-finance-function': {
    id: 'govt-finance-function',
    name: 'Government Finance Function',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Enables delivery of high-quality public services and ensures public money is spent efficiently and effectively.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-finance-function',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-legal-profession',
    block: `  'govt-legal-profession': {
    id: 'govt-legal-profession',
    name: 'Government Legal Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional body for government lawyers who provide legal advice to government and represent it in court.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-legal-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-occupational-psych',
    block: `  'govt-occupational-psych': {
    id: 'govt-occupational-psych',
    name: 'Government Occupational Psychology Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The government profession concerned with the performance of people at work and organisational behaviour.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-occupational-psychology-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-operational-research',
    block: `  'govt-operational-research': {
    id: 'govt-operational-research',
    name: 'Government Operational Research Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Uses scientific and mathematical techniques to find better solutions to complex management problems in government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-operational-research-service',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-people-group',
    block: `  'govt-people-group': {
    id: 'govt-people-group',
    name: 'Government People Group',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The strategic and functional centre for the Government People Function and HR in the Civil Service.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-people-group',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-project-delivery',
    block: `  'govt-project-delivery': {
    id: 'govt-project-delivery',
    name: 'Government Project Delivery',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The function and profession for portfolio, programme and project delivery across UK government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-project-delivery',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-recruitment-service',
    block: `  'govt-recruitment-service': {
    id: 'govt-recruitment-service',
    name: 'Government Recruitment Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Delivers recruitment services across the Civil Service, supporting the hiring of civil servants.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-recruitment-service',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-security-profession',
    block: `  'govt-security-profession': {
    id: 'govt-security-profession',
    name: 'Government Security Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Unites security professionals across government to support professional development in security roles.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-security-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-skills',
    block: `  'govt-skills': {
    id: 'govt-skills',
    name: 'Government Skills',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Helps civil servants and public sector leaders develop the skills, knowledge and networks needed to deliver for citizens.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-skills',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'intelligence-analysis',
    block: `  'intelligence-analysis': {
    id: 'intelligence-analysis',
    name: 'Intelligence Analysis',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides intelligence analysis to support national security and foreign policy decision-making.',
    infoUrl: 'https://www.gov.uk/government/organisations/intelligence-analysis',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'leadership-college-govt',
    block: `  'leadership-college-govt': {
    id: 'leadership-college-govt',
    name: 'Leadership College for Government',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Equips public and Civil Service leaders with skills, knowledge and networks to solve complex problems.',
    infoUrl: 'https://www.gov.uk/government/organisations/leadership-college-for-government',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'modernisation-reform',
    block: `  'modernisation-reform': {
    id: 'modernisation-reform',
    name: 'Modernisation and Reform',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Leads reform of government operations and enhances Civil Service capability to better deliver for the public.',
    infoUrl: 'https://www.gov.uk/government/organisations/modernisation-and-reform',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'national-security-intelligence',
    block: `  'national-security-intelligence': {
    id: 'national-security-intelligence',
    name: 'National Security and Intelligence',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Coordinates national security policy and intelligence across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-security-and-intelligence',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'office-parliamentary-counsel',
    block: `  'office-parliamentary-counsel': {
    id: 'office-parliamentary-counsel',
    name: 'Office of the Parliamentary Counsel',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Government legal specialists who draft primary legislation, translating government policy into Bills for Parliament.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-of-the-parliamentary-counsel',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'open-public-services',
    block: `  'open-public-services': {
    id: 'open-public-services',
    name: 'Open Public Services',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works across government and civil society to ensure everyone has access to the best possible public services.',
    infoUrl: 'https://www.gov.uk/government/organisations/open-public-services',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'public-sector-fraud-authority',
    block: `  'public-sector-fraud-authority': {
    id: 'public-sector-fraud-authority',
    name: 'Public Sector Fraud Authority',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works with departments and public bodies to understand and reduce the impact of fraud on the public sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/public-sector-fraud-authority',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'race-equality-unit',
    block: `  'race-equality-unit': {
    id: 'race-equality-unit',
    name: 'Race Equality Unit',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works across government to identify and tackle racial and ethnic inequalities through legislation, policy and data.',
    infoUrl: 'https://www.gov.uk/government/organisations/race-equality-unit',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'uk-integrated-security-fund',
    block: `  'uk-integrated-security-fund': {
    id: 'uk-integrated-security-fund',
    name: 'UK Integrated Security Fund',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A government-wide fund addressing the highest-priority threats to UK national security at home and abroad.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-integrated-security-fund',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'uk-resilience-academy',
    block: `  'uk-resilience-academy': {
    id: 'uk-resilience-academy',
    name: 'UK Resilience Academy',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Delivers education and development programmes to officials and professionals working in government and the resilience sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-resilience-academy',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'uk-security-vetting',
    block: `  'uk-security-vetting': {
    id: 'uk-security-vetting',
    name: 'United Kingdom Security Vetting',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The single government provider of National Security Vetting, managing personnel security risks across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/united-kingdom-security-vetting',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'women-equalities-unit',
    block: `  'women-equalities-unit': {
    id: 'women-equalities-unit',
    name: 'Women and Equalities Unit',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Leads policy on gender equality, LGBT+ people and the overall framework of equality legislation in the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/women-and-equalities-unit',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-property-function',
    block: `  'govt-property-function': {
    id: 'govt-property-function',
    name: 'Government Property Function',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A network of over 5,000 property professionals managing government\'s property-related activities across departments.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-property-function',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },
  {
    id: 'govt-partnerships-intl',
    block: `  'govt-partnerships-intl': {
    id: 'govt-partnerships-intl',
    name: 'Government Partnerships International',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Part of the Stabilisation Unit, focused on building international partnerships and delivering technical assistance.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-partnerships-international',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Home Office ────────────────────────────────────────────────────────────
  {
    id: 'accel-capability-env',
    block: `  'accel-capability-env': {
    id: 'accel-capability-env',
    name: 'Accelerated Capability Environment',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A Home Office innovation unit that takes a highly innovative approach to solving public sector technology and data challenges.',
    infoUrl: 'https://www.gov.uk/government/organisations/accelerated-capability-environment',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'border-force',
    block: `  'border-force': {
    id: 'border-force',
    name: 'Border Force',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Secures the UK border by carrying out immigration and customs controls for people and goods entering the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/border-force',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'border-security-command',
    block: `  'border-security-command': {
    id: 'border-security-command',
    name: 'Border Security Command',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides strategic leadership across the border security system to disrupt organised crime groups facilitating irregular migration.',
    infoUrl: 'https://www.gov.uk/government/organisations/border-security-command',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'hm-passport-office',
    block: `  'hm-passport-office': {
    id: 'hm-passport-office',
    name: 'HM Passport Office',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The sole issuer of UK passports and responsible for civil registration services through the General Register Office.',
    infoUrl: 'https://www.gov.uk/government/organisations/hm-passport-office',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'immigration-enforcement',
    block: `  'immigration-enforcement': {
    id: 'immigration-enforcement',
    name: 'Immigration Enforcement',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Conducts enforcement operations against illegal working and immigration crime, including raids, arrests and removals.',
    infoUrl: 'https://www.gov.uk/government/organisations/immigration-enforcement',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'national-protective-security',
    block: `  'national-protective-security': {
    id: 'national-protective-security',
    name: 'National Protective Security Authority',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The UK\'s National Technical Authority for physical and personnel protective security, helping reduce national vulnerabilities.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-protective-security-authority',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },
  {
    id: 'office-independent-examiner',
    block: `  'office-independent-examiner': {
    id: 'office-independent-examiner',
    name: 'Office for the Independent Examiner of Complaints',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Delivers a free, independent complaint resolution and investigation service for those unhappy with the Home Office\'s final complaint response.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-the-independent-examiner-of-complaints',
    parentIds: ['home-office'],
    childIds: [],
  },`,
    parentId: 'home-office',
  },

  // ── Ministry of Defence ────────────────────────────────────────────────────
  {
    id: 'cyber-specialist-ops',
    block: `  'cyber-specialist-ops': {
    id: 'cyber-specialist-ops',
    name: 'Cyber & Specialist Operations Command',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Unites Defence\'s cyber and specialist capabilities under a single military command, operating continuously to detect and respond to threats.',
    infoUrl: 'https://www.gov.uk/government/organisations/cyber-and-specialist-operations-command',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'defence-academy',
    block: `  'defence-academy': {
    id: 'defence-academy',
    name: 'Defence Academy of the United Kingdom',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides world-class professional defence and security education to students from the UK Armed Forces, Civil Service, industry, and overseas.',
    infoUrl: 'https://www.gov.uk/government/organisations/defence-academy',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'defence-infrastructure-org',
    block: `  'defence-infrastructure-org': {
    id: 'defence-infrastructure-org',
    name: 'Defence Infrastructure Organisation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The military\'s real estate and infrastructure specialist, responsible for planning, building, maintaining, and operating defence facilities.',
    infoUrl: 'https://www.gov.uk/government/organisations/defence-infrastructure-organisation',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'defence-nuclear-org',
    block: `  'defence-nuclear-org': {
    id: 'defence-nuclear-org',
    name: 'Defence Nuclear Organisation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Maintains safe and capable submarines at sea, manages nuclear warheads, and delivers the UK\'s nuclear deterrent.',
    infoUrl: 'https://www.gov.uk/government/organisations/defence-nuclear-organisation',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'defence-safety-authority',
    block: `  'defence-safety-authority': {
    id: 'defence-safety-authority',
    name: 'Defence Safety Authority',
    category: 'department',
    subtype: 'division-directorate',
    description: 'An autonomous regulator and investigator overseeing health, safety, and environmental protection across the defence sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/defence-safety-authority',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'defence-sixth-form',
    block: `  'defence-sixth-form': {
    id: 'defence-sixth-form',
    name: 'Defence Sixth Form College',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Offers a programme of personal, physical, and intellectual development to prepare students for technical careers in the Armed Forces.',
    infoUrl: 'https://www.gov.uk/government/organisations/defence-sixth-form-college',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'kings-harbour-master',
    block: `  'kings-harbour-master': {
    id: 'kings-harbour-master',
    name: "King's Harbour Master",
    category: 'department',
    subtype: 'division-directorate',
    description: 'Protects Royal Navy ports, vessels and other government assets within designated harbour areas.',
    infoUrl: 'https://www.gov.uk/government/organisations/kings-harbour-master',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'military-aviation-authority',
    block: `  'military-aviation-authority': {
    id: 'military-aviation-authority',
    name: 'Military Aviation Authority',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Responsible for the regulation, assurance and enforcement of the defence air operating and technical domains.',
    infoUrl: 'https://www.gov.uk/government/organisations/military-aviation-authority',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'national-cyber-force',
    block: `  'national-cyber-force': {
    id: 'national-cyber-force',
    name: 'National Cyber Force',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A partnership between defence and intelligence that conducts offensive and defensive cyber operations to protect UK national security.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-cyber-force',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'national-space-ops-centre',
    block: `  'national-space-ops-centre': {
    id: 'national-space-ops-centre',
    name: 'National Space Operations Centre',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Develops and operates the UK\'s space surveillance and protection capabilities across defence, the UK Space Agency and the Met Office.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-space-operations-centre',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'office-veterans-affairs',
    block: `  'office-veterans-affairs': {
    id: 'office-veterans-affairs',
    name: "Office for Veterans' Affairs",
    category: 'department',
    subtype: 'division-directorate',
    description: 'Leads the UK government\'s efforts to ensure veterans receive the respect, support and recognition they are owed for their service.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-veterans-affairs',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'uk-defence-innovation',
    block: `  'uk-defence-innovation': {
    id: 'uk-defence-innovation',
    name: 'UK Defence Innovation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Fosters technological innovation to deliver defence and security advantage for the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-defence-innovation',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'uk-reserve-forces-assoc',
    block: `  'uk-reserve-forces-assoc': {
    id: 'uk-reserve-forces-assoc',
    name: 'United Kingdom Reserve Forces Association',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Promotes the efficiency of reserve forces by providing opportunities for education, personal development and international experiences.',
    infoUrl: 'https://www.gov.uk/government/organisations/united-kingdom-reserve-forces-association',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'veterans-uk',
    block: `  'veterans-uk': {
    id: 'veterans-uk',
    name: 'Veterans UK',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Delivers welfare support, compensation payments and transition assistance to former armed forces personnel and their families.',
    infoUrl: 'https://www.gov.uk/government/organisations/veterans-uk',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },
  {
    id: 'jhub-defence-innovation',
    block: `  'jhub-defence-innovation': {
    id: 'jhub-defence-innovation',
    name: 'jHub Defence Innovation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The innovation team for Cyber & Specialist Operations Command, connecting cutting-edge technology with users across Defence.',
    infoUrl: 'https://www.gov.uk/government/organisations/jhub-defence-innovation',
    parentIds: ['mod'],
    childIds: [],
  },`,
    parentId: 'mod',
  },

  // ── MoJ ───────────────────────────────────────────────────────────────────
  {
    id: 'gov-facility-services',
    block: `  'gov-facility-services': {
    id: 'gov-facility-services',
    name: 'Gov Facility Services Limited',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides facility maintenance services to prisons across the South of England.',
    infoUrl: 'https://www.gov.uk/government/organisations/gov-facility-services-limited',
    parentIds: ['moj'],
    childIds: [],
  },`,
    parentId: 'moj',
  },

  // ── DfT ───────────────────────────────────────────────────────────────────
  {
    id: 'office-zero-emission-vehicles',
    block: `  'office-zero-emission-vehicles': {
    id: 'office-zero-emission-vehicles',
    name: 'Office for Zero Emission Vehicles',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A cross-government unit facilitating the shift to zero-emission vehicles through subsidies and investment in charging infrastructure.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-zero-emission-vehicles',
    parentIds: ['dft'],
    childIds: [],
  },`,
    parentId: 'dft',
  },

  // ── Defra ─────────────────────────────────────────────────────────────────
  {
    id: 'flood-coastal-erosion-rnd',
    block: `  'flood-coastal-erosion-rnd': {
    id: 'flood-coastal-erosion-rnd',
    name: 'Flood and Coastal Erosion Risk Management R&D Programme',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A collaborative R&D programme between Defra, the Environment Agency, Welsh Government and Natural Resources Wales on flood risk.',
    infoUrl: 'https://www.gov.uk/government/organisations/flood-and-coastal-erosion-risk-management-research-and-development-programme',
    parentIds: ['defra'],
    childIds: [],
  },`,
    parentId: 'defra',
  },
  {
    id: 'govt-veterinary-services',
    block: `  'govt-veterinary-services': {
    id: 'govt-veterinary-services',
    name: 'Government Veterinary Services',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides veterinary policy, advice and professional support to government departments and agencies.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-veterinary-services',
    parentIds: ['defra'],
    childIds: [],
  },`,
    parentId: 'defra',
  },
  {
    id: 'offshore-petroleum-regulator',
    block: `  'offshore-petroleum-regulator': {
    id: 'offshore-petroleum-regulator',
    name: 'Offshore Petroleum Regulator for Environment and Decommissioning',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Regulates environmental and decommissioning activity for offshore oil, gas and carbon capture operations on the UK continental shelf.',
    infoUrl: 'https://www.gov.uk/government/organisations/offshore-petroleum-regulator-for-environment-and-decommissioning',
    parentIds: ['desnz'],
    childIds: [],
  },`,
    parentId: 'desnz',
  },

  // ── DfE ───────────────────────────────────────────────────────────────────
  {
    id: 'further-education-commissioner',
    block: `  'further-education-commissioner': {
    id: 'further-education-commissioner',
    name: 'Further Education Commissioner',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works with further education colleges to improve their quality and financial resilience.',
    infoUrl: 'https://www.gov.uk/government/organisations/further-education-commissioner',
    parentIds: ['dfe'],
    childIds: [],
  },`,
    parentId: 'dfe',
  },
  {
    id: 'regional-dfe-directors',
    block: `  'regional-dfe-directors': {
    id: 'regional-dfe-directors',
    name: 'Regional Department for Education Directors',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Regional directors work locally across children\'s social care, SEND and schools to improve outcomes for children and families.',
    infoUrl: 'https://www.gov.uk/government/organisations/regional-department-for-education-dfe-directors',
    parentIds: ['dfe'],
    childIds: [],
  },`,
    parentId: 'dfe',
  },

  // ── DHSC ──────────────────────────────────────────────────────────────────
  {
    id: 'office-health-improvement',
    block: `  'office-health-improvement': {
    id: 'office-health-improvement',
    name: 'Office for Health Improvement and Disparities',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Works to improve the nation\'s health and address health inequalities so everyone can expect to live more of life in good health.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-health-improvement-and-disparities',
    parentIds: ['dhsc'],
    childIds: [],
  },`,
    parentId: 'dhsc',
  },
  {
    id: 'office-life-sciences',
    block: `  'office-life-sciences': {
    id: 'office-life-sciences',
    name: 'Office for Life Sciences',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Champions research, innovation and technology to transform health and care services and support the life sciences sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-life-sciences',
    parentIds: ['dhsc'],
    childIds: [],
  },`,
    parentId: 'dhsc',
  },
  {
    id: 'uk-national-screening',
    block: `  'uk-national-screening': {
    id: 'uk-national-screening',
    name: 'UK National Screening Committee',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Advises ministers and the NHS across all four UK nations on all aspects of population screening programmes.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-national-screening-committee',
    parentIds: ['dhsc'],
    childIds: [],
  },`,
    parentId: 'dhsc',
  },

  // ── DBT ───────────────────────────────────────────────────────────────────
  {
    id: 'centre-connected-vehicles',
    block: `  'centre-connected-vehicles': {
    id: 'centre-connected-vehicles',
    name: 'Centre for Connected and Autonomous Vehicles',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Develops regulatory frameworks and policy to enable the safe deployment of self-driving vehicles in the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/centre-for-connected-and-autonomous-vehicles',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'employment-agency-standards',
    block: `  'employment-agency-standards': {
    id: 'employment-agency-standards',
    name: 'Employment Agency Standards Inspectorate',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Protects the rights of agency workers by ensuring employment agencies and businesses treat their workers fairly.',
    infoUrl: 'https://www.gov.uk/government/organisations/employment-agency-standards-inspectorate',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'export-control-joint-unit',
    block: `  'export-control-joint-unit': {
    id: 'export-control-joint-unit',
    name: 'Export Control Joint Unit',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Administers the UK\'s system of export controls and licensing for military and dual-use items.',
    infoUrl: 'https://www.gov.uk/government/organisations/export-control-joint-unit',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-investment',
    block: `  'office-investment': {
    id: 'office-investment',
    name: 'Office for Investment',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Sources and secures transformational investment to drive growth, job creation and productivity across the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-investment',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-investment-fs',
    block: `  'office-investment-fs': {
    id: 'office-investment-fs',
    name: 'Office for Investment: Financial Services',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The single front door for international financial services firms wishing to set up or expand operations in the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-investment-financial-services',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-product-safety',
    block: `  'office-product-safety': {
    id: 'office-product-safety',
    name: 'Office for Product Safety and Standards',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Protects people and places from product-related harm, ensuring consumers and businesses can buy and sell products with confidence.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-product-safety-and-standards',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-responsible-business',
    block: `  'office-responsible-business': {
    id: 'office-responsible-business',
    name: 'Office for Responsible Business Conduct',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Promotes and upholds responsible and sustainable business practices across the UK economy.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-responsible-business-conduct',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-pay-review-bodies',
    block: `  'office-pay-review-bodies': {
    id: 'office-pay-review-bodies',
    name: 'Office for the Pay Review Bodies',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides an independent secretariat to 8 Pay Review Bodies making recommendations affecting around 2.5 million public sector workers.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-the-pay-review-bodies',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'office-trade-sanctions',
    block: `  'office-trade-sanctions': {
    id: 'office-trade-sanctions',
    name: 'Office of Trade Sanctions Implementation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Strengthens the UK\'s implementation and enforcement of trade sanctions.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-of-trade-sanctions-implementation',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'uk-defence-security-exports',
    block: `  'uk-defence-security-exports': {
    id: 'uk-defence-security-exports',
    name: 'UK Defence and Security Exports',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Helps UK defence, cyber and security companies export and assists overseas defence companies in investing in the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-defence-and-security-exports',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },
  {
    id: 'uk-national-contact-point',
    block: `  'uk-national-contact-point': {
    id: 'uk-national-contact-point',
    name: 'UK National Contact Point',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Promotes OECD guidelines for multinational enterprises on responsible business conduct and operates the associated complaints mechanism.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-national-contact-point',
    parentIds: ['dbt'],
    childIds: [],
  },`,
    parentId: 'dbt',
  },

  // ── FCDO ──────────────────────────────────────────────────────────────────
  {
    id: 'preventing-sexual-violence',
    block: `  'preventing-sexual-violence': {
    id: 'preventing-sexual-violence',
    name: 'Preventing Sexual Violence in Conflict Initiative',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Increases global awareness and mobilises international efforts to prevent and end sexual violence in armed conflicts.',
    infoUrl: 'https://www.gov.uk/government/organisations/preventing-sexual-violence-in-conflict-initiative',
    parentIds: ['fcdo'],
    childIds: [],
  },`,
    parentId: 'fcdo',
  },
  {
    id: 'uk-national-auth-counter-eaves',
    block: `  'uk-national-auth-counter-eaves': {
    id: 'uk-national-auth-counter-eaves',
    name: 'UK National Authority for Counter-Eavesdropping',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides technical security expertise to government and critical national infrastructure to protect against eavesdropping threats.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-national-authority-for-counter-eavesdropping',
    parentIds: ['fcdo'],
    childIds: [],
  },`,
    parentId: 'fcdo',
  },

  // ── HM Treasury ───────────────────────────────────────────────────────────
  {
    id: 'bona-vacantia',
    block: `  'bona-vacantia': {
    id: 'bona-vacantia',
    name: 'Bona Vacantia',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Administers ownerless property passing to the Crown, including estates of people who die intestate and assets of dissolved companies.',
    infoUrl: 'https://www.gov.uk/government/organisations/bona-vacantia',
    parentIds: ['gld'],
    childIds: [],
  },`,
    parentId: 'gld',
  },
  {
    id: 'office-financial-sanctions',
    block: `  'office-financial-sanctions': {
    id: 'office-financial-sanctions',
    name: 'Office of Financial Sanctions Implementation',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Helps ensure financial sanctions are properly understood, implemented and enforced in the United Kingdom.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-of-financial-sanctions-implementation',
    parentIds: ['treasury'],
    childIds: [],
  },`,
    parentId: 'treasury',
  },
  {
    id: 'govt-corporate-finance',
    block: `  'govt-corporate-finance': {
    id: 'govt-corporate-finance',
    name: 'Government Corporate Finance Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Brings together those working in corporate finance from across government to share learning and experience.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-corporate-finance-profession',
    parentIds: ['treasury'],
    childIds: [],
  },`,
    parentId: 'treasury',
  },

  // ── DLUHC ─────────────────────────────────────────────────────────────────
  {
    id: 'windrush-commemoration',
    block: `  'windrush-commemoration': {
    id: 'windrush-commemoration',
    name: 'Windrush Commemoration Committee',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Advises on how best to create a permanent and fitting tribute to the Windrush generation and their descendants.',
    infoUrl: 'https://www.gov.uk/government/organisations/windrush-commemoration-committee',
    parentIds: ['dluhc'],
    childIds: [],
  },`,
    parentId: 'dluhc',
  },
  {
    id: 'district-valuer-services',
    block: `  'district-valuer-services': {
    id: 'district-valuer-services',
    name: 'District Valuer Services',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Delivers independent property valuation and professional advice to the public sector where public money or functions are involved.',
    infoUrl: 'https://www.gov.uk/government/organisations/district-valuer-services-dvs',
    parentIds: ['voa'],
    childIds: [],
  },`,
    parentId: 'voa',
  },

  // ── DESNZ ─────────────────────────────────────────────────────────────────
  {
    id: 'centre-climate-health-security',
    block: `  'centre-climate-health-security': {
    id: 'centre-climate-health-security',
    name: 'Centre for Climate and Health Security',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides scientific guidance to ensure public health considerations related to climate change are incorporated into planning and infrastructure.',
    infoUrl: 'https://www.gov.uk/government/organisations/the-centre-for-climate-health-security',
    parentIds: ['uk-health-security'],
    childIds: [],
  },`,
    parentId: 'uk-health-security',
  },
  {
    id: 'health-equity-initiative',
    block: `  'health-equity-initiative': {
    id: 'health-equity-initiative',
    name: 'Health Equity in Health Protection Initiative',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A central platform bringing together UKHSA\'s key health equity resources, data, research and community insights.',
    infoUrl: 'https://www.gov.uk/government/organisations/health-equity-in-health-protection-initiative',
    parentIds: ['uk-health-security'],
    childIds: [],
  },`,
    parentId: 'uk-health-security',
  },

  // ── UKRI children ──────────────────────────────────────────────────────────
  {
    id: 'ahrc',
    block: `  'ahrc': {
    id: 'ahrc',
    name: 'Arts and Humanities Research Council',
    category: 'body',
    subtype: 'other',
    description: 'Funds outstanding original research across the whole range of the arts and humanities.',
    infoUrl: 'https://www.gov.uk/government/organisations/arts-and-humanities-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'bbsrc',
    block: `  'bbsrc': {
    id: 'bbsrc',
    name: 'Biotechnology and Biological Sciences Research Council',
    category: 'body',
    subtype: 'other',
    description: 'Invests in biological sciences research to push back the frontiers of biology and deliver a healthy, prosperous and sustainable future.',
    infoUrl: 'https://www.gov.uk/government/organisations/biotechnology-biological-sciences-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'esrc',
    block: `  'esrc': {
    id: 'esrc',
    name: 'Economic and Social Research Council',
    category: 'body',
    subtype: 'other',
    description: 'The UK\'s largest funder of economic, social, behavioural, and human data science research.',
    infoUrl: 'https://www.gov.uk/government/organisations/economic-and-social-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'epsrc',
    block: `  'epsrc': {
    id: 'epsrc',
    name: 'Engineering and Physical Sciences Research Council',
    category: 'body',
    subtype: 'other',
    description: 'Creates knowledge in engineering and physical sciences to build UK capability and benefit society and the economy.',
    infoUrl: 'https://www.gov.uk/government/organisations/engineering-and-physical-sciences-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'mrc',
    block: `  'mrc': {
    id: 'mrc',
    name: 'Medical Research Council',
    category: 'body',
    subtype: 'other',
    description: 'Funds world-leading discovery and translational research to accelerate diagnosis, advance treatment and prevent human illness.',
    infoUrl: 'https://www.gov.uk/government/organisations/medical-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'nerc',
    block: `  'nerc': {
    id: 'nerc',
    name: 'Natural Environment Research Council',
    category: 'body',
    subtype: 'other',
    description: 'The driving force of investment in environmental science in the UK.',
    infoUrl: 'https://www.gov.uk/government/organisations/natural-environment-research-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'stfc',
    block: `  'stfc': {
    id: 'stfc',
    name: 'Science and Technology Facilities Council',
    category: 'body',
    subtype: 'other',
    description: 'Delivers world-leading national and international research and innovation capabilities to discover the secrets of the universe.',
    infoUrl: 'https://www.gov.uk/government/organisations/science-and-technology-facilities-council',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'innovate-uk',
    block: `  'innovate-uk': {
    id: 'innovate-uk',
    name: 'Innovate UK',
    category: 'body',
    subtype: 'other',
    description: 'The UK\'s national innovation agency, supporting business-led innovation across all sectors, technologies and regions.',
    infoUrl: 'https://www.gov.uk/government/organisations/innovate-uk',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },
  {
    id: 'research-england',
    block: `  'research-england': {
    id: 'research-england',
    name: 'Research England',
    category: 'body',
    subtype: 'other',
    description: 'Handles research funding and knowledge exchange support for universities and higher education institutions across England.',
    infoUrl: 'https://www.gov.uk/government/organisations/research-england',
    parentIds: ['ukri'],
    childIds: [],
  },`,
    parentId: 'ukri',
  },

  // ── CMA children ──────────────────────────────────────────────────────────
  {
    id: 'office-internal-market',
    block: `  'office-internal-market': {
    id: 'office-internal-market',
    name: 'Office for the Internal Market',
    category: 'body',
    subtype: 'other',
    description: 'Supports the effective operation of the UK\'s internal market and provides independent advice to UK and devolved governments.',
    infoUrl: 'https://www.gov.uk/government/organisations/office-for-the-internal-market',
    parentIds: ['cma'],
    childIds: [],
  },`,
    parentId: 'cma',
  },
  {
    id: 'subsidy-advice-unit',
    block: `  'subsidy-advice-unit': {
    id: 'subsidy-advice-unit',
    name: 'Subsidy Advice Unit',
    category: 'body',
    subtype: 'other',
    description: 'Provides independent, non-binding advice to public authorities on certain subsidies under the UK Subsidy Control Regime.',
    infoUrl: 'https://www.gov.uk/government/organisations/subsidy-advice-unit',
    parentIds: ['cma'],
    childIds: [],
  },`,
    parentId: 'cma',
  },

  // ── HMPPS children ────────────────────────────────────────────────────────
  {
    id: 'hm-prison-service',
    block: `  'hm-prison-service': {
    id: 'hm-prison-service',
    name: 'HM Prison Service',
    category: 'body',
    subtype: 'other',
    description: 'Keeps those sentenced to prison in custody and helps them lead law-abiding lives both inside and after release.',
    infoUrl: 'https://www.gov.uk/government/organisations/hm-prison-service',
    parentIds: ['hmpps'],
    childIds: [],
  },`,
    parentId: 'hmpps',
  },
  {
    id: 'probation-service',
    block: `  'probation-service': {
    id: 'probation-service',
    name: 'Probation Service',
    category: 'body',
    subtype: 'other',
    description: 'A statutory criminal justice service that supervises offenders serving community sentences or released from prison.',
    infoUrl: 'https://www.gov.uk/government/organisations/probation-service',
    parentIds: ['hmpps'],
    childIds: [],
  },`,
    parentId: 'hmpps',
  },
  {
    id: 'youth-custody-service',
    block: `  'youth-custody-service': {
    id: 'youth-custody-service',
    name: 'Youth Custody Service',
    category: 'body',
    subtype: 'other',
    description: 'Creates safe, decent and nurturing custodial environments providing outstanding care and support for children in custody.',
    infoUrl: 'https://www.gov.uk/government/organisations/youth-custody-service',
    parentIds: ['hmpps'],
    childIds: [],
  },`,
    parentId: 'hmpps',
  },

  // ── UKHO child ────────────────────────────────────────────────────────────
  {
    id: 'hm-nautical-almanac',
    block: `  'hm-nautical-almanac': {
    id: 'hm-nautical-almanac',
    name: 'HM Nautical Almanac Office',
    category: 'body',
    subtype: 'other',
    description: 'A specialist group providing solutions to astronomical and celestial navigation problems.',
    infoUrl: 'https://www.gov.uk/government/organisations/hm-nautical-almanac-office',
    parentIds: ['uk-hydrographic'],
    childIds: [],
  },`,
    parentId: 'uk-hydrographic',
  },

  // ── NMRN children ─────────────────────────────────────────────────────────
  {
    id: 'fleet-air-arm-museum',
    block: `  'fleet-air-arm-museum': {
    id: 'fleet-air-arm-museum',
    name: 'Fleet Air Arm Museum',
    category: 'body',
    subtype: 'other',
    description: 'The world\'s second largest naval aviation museum, holding over 90 aircraft and more than 2 million records related to naval aviation history.',
    infoUrl: 'https://www.gov.uk/government/organisations/fleet-air-arm-museum',
    parentIds: ['nmrn'],
    childIds: [],
  },`,
    parentId: 'nmrn',
  },
  {
    id: 'royal-marines-museum',
    block: `  'royal-marines-museum': {
    id: 'royal-marines-museum',
    name: 'Royal Marines Museum',
    category: 'body',
    subtype: 'other',
    description: 'Preserves over a million archival items and objects chronicling the Royal Marines\' heritage from 1664 to the present.',
    infoUrl: 'https://www.gov.uk/government/organisations/royal-marines-museum',
    parentIds: ['nmrn'],
    childIds: [],
  },`,
    parentId: 'nmrn',
  },
  {
    id: 'royal-navy-submarine-museum',
    block: `  'royal-navy-submarine-museum': {
    id: 'royal-navy-submarine-museum',
    name: 'Royal Navy Submarine Museum',
    category: 'body',
    subtype: 'other',
    description: 'Documents the history and development of submarines, with particular focus on the Royal Navy\'s submarine service.',
    infoUrl: 'https://www.gov.uk/government/organisations/royal-navy-submarine-museum',
    parentIds: ['nmrn'],
    childIds: [],
  },`,
    parentId: 'nmrn',
  },

  // ── CQC child ─────────────────────────────────────────────────────────────
  {
    id: 'national-guardians-office',
    block: `  'national-guardians-office': {
    id: 'national-guardians-office',
    name: "National Guardian's Office",
    category: 'body',
    subtype: 'other',
    description: 'Supports freedom to speak up in health and care organisations by overseeing and improving whistleblowing culture.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-guardians-office',
    parentIds: ['cqc'],
    childIds: [],
  },`,
    parentId: 'cqc',
  },

  // ── UKAEA child ───────────────────────────────────────────────────────────
  {
    id: 'uk-industrial-fusion',
    block: `  'uk-industrial-fusion': {
    id: 'uk-industrial-fusion',
    name: 'UK Industrial Fusion Solutions',
    category: 'body',
    subtype: 'other',
    description: 'A limited company leading delivery of the STEP programme to design and build the UK\'s first prototype fusion energy plant.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-industrial-fusion-solutions',
    parentIds: ['ukaea'],
    childIds: [],
  },`,
    parentId: 'ukaea',
  },

  // ── RPA child ─────────────────────────────────────────────────────────────
  {
    id: 'british-cattle-movement',
    block: `  'british-cattle-movement': {
    id: 'british-cattle-movement',
    name: 'British Cattle Movement Service',
    category: 'body',
    subtype: 'other',
    description: 'Maintains the Cattle Tracing System (CTS), an online database of all bovine animals in Great Britain.',
    infoUrl: 'https://www.gov.uk/government/organisations/british-cattle-movement-service',
    parentIds: ['rpa'],
    childIds: [],
  },`,
    parentId: 'rpa',
  },

  // ── Civil Nuclear Police Authority child ──────────────────────────────────
  {
    id: 'civil-nuclear-constabulary',
    block: `  'civil-nuclear-constabulary': {
    id: 'civil-nuclear-constabulary',
    name: 'Civil Nuclear Constabulary',
    category: 'body',
    subtype: 'other',
    description: 'Protects civil nuclear sites and nuclear materials in England and Scotland, and provides policing for other critical national infrastructure.',
    infoUrl: 'https://www.gov.uk/government/organisations/civil-nuclear-constabulary',
    parentIds: ['civil-nuclear-police'],
    childIds: [],
  },`,
    parentId: 'civil-nuclear-police',
  },

  // ── National Cyber Security Centre (under GCHQ - not in model, use home-office) ──
  {
    id: 'national-cyber-security',
    block: `  'national-cyber-security': {
    id: 'national-cyber-security',
    name: 'National Cyber Security Centre',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides a unified source of advice, guidance and support on cyber security, bridging industry and government.',
    infoUrl: 'https://www.gov.uk/government/organisations/national-cyber-security-centre',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── UK Council for Internet Safety (joint DfE/Home/DSIT) ─────────────────
  {
    id: 'uk-council-internet-safety',
    block: `  'uk-council-internet-safety': {
    id: 'uk-council-internet-safety',
    name: 'UK Council for Internet Safety',
    category: 'department',
    subtype: 'division-directorate',
    description: 'A collaborative forum for government, industry and the third sector to make the UK the safest place to be online.',
    infoUrl: 'https://www.gov.uk/government/organisations/uk-council-for-internet-safety',
    parentIds: ['dfe'],
    childIds: [],
  },`,
    parentId: 'dfe',
  },

  // ── Government Geography Profession (civil service) ───────────────────────
  {
    id: 'govt-geography-profession',
    block: `  'govt-geography-profession': {
    id: 'govt-geography-profession',
    name: 'Government Geography Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Established in 2018 to support and develop geographical expertise across the public sector.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-geography-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Government Knowledge & Information Mgmt Profession ────────────────────
  {
    id: 'govt-knowledge-mgmt',
    block: `  'govt-knowledge-mgmt': {
    id: 'govt-knowledge-mgmt',
    name: 'Government Knowledge & Information Management Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Supports civil servants who enable the creation, organisation, and exploitation of information and knowledge across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-knowledge-and-information-management-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Government Economic Service (civil service) ────────────────────────────
  {
    id: 'govt-economic-service',
    block: `  'govt-economic-service': {
    id: 'govt-economic-service',
    name: 'Government Economic Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional body for economists in the UK Civil Service, supporting economists working across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-economic-service',
    parentIds: ['treasury'],
    childIds: [],
  },`,
    parentId: 'treasury',
  },

  // ── Government Statistical Service (ONS) ─────────────────────────────────
  {
    id: 'govt-statistical-service',
    block: `  'govt-statistical-service': {
    id: 'govt-statistical-service',
    name: 'Government Statistical Service',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional network for statisticians and data scientists working across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-statistical-service',
    parentIds: ['ons'],
    childIds: [],
  },`,
    parentId: 'ons',
  },

  // ── Government Planning Profession / Inspectors (DLUHC/Planning Inspectorate) ──
  {
    id: 'govt-planning-profession',
    block: `  'govt-planning-profession': {
    id: 'govt-planning-profession',
    name: 'Government Planning Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Provides professional support to planners and planning inspectors working across government departments.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-planning-profession',
    parentIds: ['dluhc'],
    childIds: [],
  },`,
    parentId: 'dluhc',
  },
  {
    id: 'govt-planning-inspectors',
    block: `  'govt-planning-inspectors': {
    id: 'govt-planning-inspectors',
    name: 'Government Planning Inspectors',
    category: 'department',
    subtype: 'division-directorate',
    description: 'Handles planning appeals, national infrastructure planning applications, and specialist planning casework in England and Wales.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-planning-inspectors',
    parentIds: ['planning-inspectorate'],
    childIds: [],
  },`,
    parentId: 'planning-inspectorate',
  },

  // ── Internal Audit Profession (GIAA) ──────────────────────────────────────
  {
    id: 'internal-audit-profession',
    block: `  'internal-audit-profession': {
    id: 'internal-audit-profession',
    name: 'Internal Audit Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional community for internal auditors across government, supporting standards and capability development.',
    infoUrl: 'https://www.gov.uk/government/organisations/internal-audit-profession',
    parentIds: ['giaa'],
    childIds: [],
  },`,
    parentId: 'giaa',
  },

  // ── Medical Profession (DHSC) ─────────────────────────────────────────────
  {
    id: 'medical-profession',
    block: `  'medical-profession': {
    id: 'medical-profession',
    name: 'Medical Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The government\'s professional network for medical and clinical staff working across government departments and agencies.',
    infoUrl: 'https://www.gov.uk/government/organisations/medical-profession',
    parentIds: ['dhsc'],
    childIds: [],
  },`,
    parentId: 'dhsc',
  },

  // ── Operational Delivery Profession (Cabinet Office) ─────────────────────
  {
    id: 'operational-delivery-profession',
    block: `  'operational-delivery-profession': {
    id: 'operational-delivery-profession',
    name: 'Operational Delivery Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional network for operational delivery staff who deliver direct services to the public across government.',
    infoUrl: 'https://www.gov.uk/government/organisations/operational-delivery-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Policy Profession (Cabinet Office) ────────────────────────────────────
  {
    id: 'policy-profession',
    block: `  'policy-profession': {
    id: 'policy-profession',
    name: 'Policy Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional community for policy professionals across government, supporting standards and capability.',
    infoUrl: 'https://www.gov.uk/government/organisations/policy-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Government Science & Engineering Profession (DSIT/GO-Science) ─────────
  {
    id: 'govt-science-engineering',
    block: `  'govt-science-engineering': {
    id: 'govt-science-engineering',
    name: 'Government Science & Engineering Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional community for scientists and engineers in government, supporting capability and career development.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-science-and-engineering-profession',
    parentIds: ['dsit'],
    childIds: [],
  },`,
    parentId: 'dsit',
  },

  // ── Government Social Research Profession (Cabinet Office/HMT) ────────────
  {
    id: 'govt-social-research',
    block: `  'govt-social-research': {
    id: 'govt-social-research',
    name: 'Government Social Research Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional community for social researchers working across government departments and agencies.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-social-research-profession',
    parentIds: ['co'],
    childIds: [],
  },`,
    parentId: 'co',
  },

  // ── Government Tax Profession (HMRC) ──────────────────────────────────────
  {
    id: 'govt-tax-profession',
    block: `  'govt-tax-profession': {
    id: 'govt-tax-profession',
    name: 'Government Tax Profession',
    category: 'department',
    subtype: 'division-directorate',
    description: 'The professional network for tax professionals working across government departments and agencies.',
    infoUrl: 'https://www.gov.uk/government/organisations/government-tax-profession',
    parentIds: ['hmrc'],
    childIds: [],
  },`,
    parentId: 'hmrc',
  },

  // ── UK Defence Innovation (MoD) - additional entry
  // Already added above as uk-defence-innovation under mod

  // ── Civil Service (Cabinet Office) professions ──────────────────────────
  // Government Planning Profession - already added above under dluhc

]

// ── Build the new entries block ───────────────────────────────────────────────
const newBlock = newEntries.map(e => e.block).join(eol + eol) + eol

// ── Insert before the GROUPS section ──────────────────────────────────────────
const insertMarker = `  // ── GROUPS: Cabinet`

if (!raw.includes(insertMarker)) {
  console.error('Could not find insertion marker:', insertMarker)
  process.exit(1)
}

// ── Update parent childIds arrays ─────────────────────────────────────────────
// Gather new children for each parent
const parentUpdates = {}
for (const entry of newEntries) {
  if (!parentUpdates[entry.parentId]) parentUpdates[entry.parentId] = []
  parentUpdates[entry.parentId].push(entry.id)
}

let updated = raw

// Insert new entry block before GROUPS section
updated = updated.replace(
  insertMarker,
  `${newBlock}${eol}${eol}  // ── GROUPS: Cabinet`
)

// Update each parent's childIds
for (const [parentId, newChildren] of Object.entries(parentUpdates)) {
  // Match the childIds line for this parent - find the parent block first
  // We need to find: id: 'parentId' ... childIds: [...]
  // Use a targeted approach: find the block containing this id and update its childIds

  // Pattern: find childIds array within the block that has this id
  // We'll do a simpler search: find 'id: \'parentId\'' then find the next childIds
  const idPattern = `id: '${parentId}'`
  const idIdx = updated.indexOf(idPattern)
  if (idIdx === -1) {
    console.warn(`Parent ID not found: ${parentId}`)
    continue
  }

  // Find childIds after this id
  const childIdsIdx = updated.indexOf('childIds: [', idIdx)
  const nextIdIdx = updated.indexOf("id: '", idIdx + 1)

  if (childIdsIdx === -1 || (nextIdIdx !== -1 && childIdsIdx > nextIdIdx)) {
    console.warn(`childIds not found for parent: ${parentId}`)
    continue
  }

  const childIdsEnd = updated.indexOf(']', childIdsIdx)
  const currentChildIds = updated.substring(childIdsIdx + 'childIds: ['.length, childIdsEnd).trim()

  let newChildIds
  if (currentChildIds === '') {
    newChildIds = newChildren.map(c => `'${c}'`).join(', ')
  } else {
    newChildIds = currentChildIds + ', ' + newChildren.map(c => `'${c}'`).join(', ')
  }

  updated = updated.substring(0, childIdsIdx + 'childIds: ['.length) +
            newChildIds +
            updated.substring(childIdsEnd)
}

writeFileSync(filePath, updated, 'utf8')
console.log('Done! Added', newEntries.length, 'high profile group entries.')
console.log('Updated childIds for parents:', Object.keys(parentUpdates).join(', '))
