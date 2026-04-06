import type { Jurisdiction } from './jurisdictions'
export type ElementCategory = 'official' | 'department' | 'body' | 'group'
export type OfficialType = 'prime-minister' | 'cabinet-minister' | 'head-of-state' | 'independent-official' | 'civil-servant'
export type DepartmentType = 'ministerial' | 'agency' | 'portfolio'
export type BodyType = 'constitutional-body' | 'executive-agency' | 'regulator' | 'public-law-body' | 'security-agency' | 'military' | 'state-enterprise' | 'public-corporation' | 'training-institution' | 'research-institute' | 'inspectorate' | 'other'
export type GroupType = 'cabinet' | 'other-group'

export interface TagDefinition {
  id: string
  label: string
  tagCategory: 'type' | 'sector'
  colour: string
}

export const tagDefinitions: Record<string, TagDefinition> = {
  'regulator':       { id: 'regulator',       label: 'Regulator',              tagCategory: 'type',   colour: '#c0392b' },
  'inspectorate':    { id: 'inspectorate',    label: 'Inspectorate',           tagCategory: 'type',   colour: '#16a085' },
  'intelligence':    { id: 'intelligence',    label: 'Intelligence Service',   tagCategory: 'type',   colour: '#2e4057' },
  'prosecution':     { id: 'prosecution',     label: 'Prosecution Service',    tagCategory: 'type',   colour: '#922b21' },
  'armed-forces':    { id: 'armed-forces',    label: 'Armed Forces / Military', tagCategory: 'type',  colour: '#2e4057' },
  'police':          { id: 'police',          label: 'Police / Law Enforcement', tagCategory: 'type', colour: '#1a5276' },
  'ombudsman':       { id: 'ombudsman',       label: 'Ombudsman',              tagCategory: 'type',   colour: '#e67e22' },
  'sector-defence':       { id: 'sector-defence',       label: 'Defence',                tagCategory: 'sector', colour: '#2c3e50' },
  'sector-health':        { id: 'sector-health',        label: 'Health',                 tagCategory: 'sector', colour: '#27ae60' },
  'sector-education':     { id: 'sector-education',     label: 'Education',              tagCategory: 'sector', colour: '#f1c40f' },
  'sector-finance':       { id: 'sector-finance',       label: 'Finance / Economy',      tagCategory: 'sector', colour: '#f39c12' },
  'sector-justice':       { id: 'sector-justice',       label: 'Justice',                tagCategory: 'sector', colour: '#8e44ad' },
  'sector-digital':       { id: 'sector-digital',       label: 'Digital / Technology',   tagCategory: 'sector', colour: '#1abc9c' },
  'sector-environment':   { id: 'sector-environment',   label: 'Environment',            tagCategory: 'sector', colour: '#2ecc71' },
  'sector-energy':        { id: 'sector-energy',        label: 'Energy',                 tagCategory: 'sector', colour: '#ff9800' },
  'sector-culture':       { id: 'sector-culture',       label: 'Culture / Arts / Sport', tagCategory: 'sector', colour: '#e91e63' },
  'sector-transport':     { id: 'sector-transport',     label: 'Transport',              tagCategory: 'sector', colour: '#3498db' },
  'sector-agriculture':   { id: 'sector-agriculture',   label: 'Agriculture / Food',     tagCategory: 'sector', colour: '#8bc34a' },
  'sector-security':      { id: 'sector-security',      label: 'Security / Intelligence', tagCategory: 'sector', colour: '#37474f' },
  'sector-social':        { id: 'sector-social',        label: 'Social Protection',      tagCategory: 'sector', colour: '#4caf50' },
  'sector-foreign-policy': { id: 'sector-foreign-policy', label: 'Foreign Policy',       tagCategory: 'sector', colour: '#009688' },
  'sector-labour':        { id: 'sector-labour',        label: 'Labour Market',          tagCategory: 'sector', colour: '#607d8b' },
  'sector-science':       { id: 'sector-science',       label: 'Science / Research',     tagCategory: 'sector', colour: '#673ab7' },
}

export interface GovElement {
  id: string
  name: string
  category: ElementCategory
  subtype: OfficialType | DepartmentType | BodyType | GroupType
  description: string
  role?: string
  currentHolder?: string
  infoUrl?: string
  parentIds: string[]
  secondaryParentIds?: string[]
  tags?: string[]
  jurisdictions?: Jurisdiction[]
}

export interface ElementRelationship {
  id: string
  label: string
  type: 'reports-to' | 'oversees' | 'member-of'
}

export const govElements: Record<string, GovElement> = {

  // ── GROUP ─────────────────────────────────────────────────────────────────
  'cabinet': {
    id: 'cabinet', name: 'Cabinet (Government of the Republic)', category: 'group', subtype: 'cabinet',
    description: 'The collegial executive body of Estonia. 54th Government. PM + 12 ministers. Coalition: Reform Party and Eesti 200.',
    infoUrl: 'https://valitsus.ee', parentIds: [],
  },

  // ── OFFICIALS: Head of State ──────────────────────────────────────────────
  'president': {
    id: 'president', name: 'President of the Republic', category: 'official', subtype: 'head-of-state',
    description: 'Head of state. Represents Estonia in international relations. Mostly ceremonial role. Supreme commander of armed forces. Proposes PM candidate.',
    currentHolder: 'Alar Karis', infoUrl: 'https://president.ee', parentIds: [],
  },

  // ── OFFICIALS: Independent Officials ──────────────────────────────────────
  'riigikogu_speaker': {
    id: 'riigikogu_speaker', name: 'Speaker of the Riigikogu', category: 'official', subtype: 'independent-official',
    description: 'Presides over parliamentary sessions. Represents the Riigikogu.',
    currentHolder: 'Lauri Hussar', infoUrl: 'https://riigikogu.ee', parentIds: [],
  },
  'chief_justice': {
    id: 'chief_justice', name: 'Chief Justice of the Supreme Court', category: 'official', subtype: 'independent-official',
    description: 'Heads the Supreme Court (Riigikohus), which also serves as the constitutional review court.',
    currentHolder: 'Villu Kõve', infoUrl: 'https://riigikohus.ee', parentIds: [], tags: ['sector-justice'],
  },
  'oiguskantsler': {
    id: 'oiguskantsler', name: 'Chancellor of Justice', category: 'official', subtype: 'independent-official',
    description: 'Constitutional review and ombudsman functions. Reviews legality of legislation. Supervises fundamental rights.',
    currentHolder: 'Ülle Madise', infoUrl: 'https://oiguskantsler.ee', parentIds: [], tags: ['ombudsman', 'sector-justice'],
  },
  'auditor_general': {
    id: 'auditor_general', name: 'Auditor General', category: 'official', subtype: 'independent-official',
    description: 'Heads the National Audit Office. Audits state budget implementation and use of state assets.',
    currentHolder: 'Janar Holm', infoUrl: 'https://riigikontroll.ee', parentIds: [], tags: ['sector-finance'],
  },
  'eesti_pank_governor': {
    id: 'eesti_pank_governor', name: 'Governor of the Bank of Estonia', category: 'official', subtype: 'independent-official',
    description: 'Heads the central bank. Eurosystem member. Independent of government.',
    currentHolder: 'Madis Müller', infoUrl: 'https://eestipank.ee', parentIds: [], tags: ['sector-finance'],
  },
  'prosecutor_general': {
    id: 'prosecutor_general', name: 'Prosecutor General', category: 'official', subtype: 'independent-official',
    description: 'Heads the Prosecution Service. Responsible for criminal prosecution in Estonia.',
    currentHolder: 'Astrid Asi', parentIds: ['ministry_justice_digital'], tags: ['prosecution', 'sector-justice'],
  },

  // ── OFFICIALS: Prime Minister ─────────────────────────────────────────────
  'pm': {
    id: 'pm', name: 'Prime Minister', category: 'official', subtype: 'prime-minister',
    description: 'Head of government (Peaminister). Leads the cabinet and coordinates government policy. Nominated by President, confirmed by Riigikogu.',
    currentHolder: 'Kristen Michal', infoUrl: 'https://valitsus.ee', parentIds: ['cabinet'],
  },

  // ── OFFICIALS: Cabinet Ministers ──────────────────────────────────────────
  'min_foreign': {
    id: 'min_foreign', name: 'Minister of Foreign Affairs', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads foreign policy, diplomacy, and development cooperation.',
    currentHolder: 'Margus Tsahkna', parentIds: ['cabinet'], tags: ['sector-foreign-policy'],
  },
  'min_defence': {
    id: 'min_defence', name: 'Minister of Defence', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads national defence policy, military planning, and defence procurement.',
    currentHolder: 'Hanno Pevkur', parentIds: ['cabinet'], tags: ['sector-defence'],
  },
  'min_finance': {
    id: 'min_finance', name: 'Minister of Finance', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads state budget, tax policy, public finance, and economic forecasting.',
    currentHolder: 'Jürgen Ligi', parentIds: ['cabinet'], tags: ['sector-finance'],
  },
  'min_justice_digital': {
    id: 'min_justice_digital', name: 'Minister of Justice and Digital Affairs', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads justice system, courts administration, digital affairs, e-governance, and data protection.',
    currentHolder: 'Liisa-Ly Pakosta', parentIds: ['cabinet'], tags: ['sector-justice', 'sector-digital'],
  },
  'min_education': {
    id: 'min_education', name: 'Minister of Education and Research', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads education policy from pre-school through higher education, research, youth, and language policy.',
    currentHolder: 'Kristina Kallas', parentIds: ['cabinet'], tags: ['sector-education', 'sector-science'],
  },
  'min_economy': {
    id: 'min_economy', name: 'Minister of Economic Affairs and Industry', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads economic policy, industrial policy, innovation, labour market, and transport.',
    currentHolder: 'Erkki Keldo', parentIds: ['cabinet'], tags: ['sector-transport', 'sector-labour'],
  },
  'min_environment_energy': {
    id: 'min_environment_energy', name: 'Minister of Environment and Energetics', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads environmental, climate, and energy policy, forestry, and water management.',
    currentHolder: 'Andres Sutt', parentIds: ['cabinet'], tags: ['sector-environment', 'sector-energy'],
  },
  'min_culture': {
    id: 'min_culture', name: 'Minister of Culture', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads culture, arts, heritage protection, media policy, sport, and creative industries.',
    currentHolder: 'Heidy Purga', parentIds: ['cabinet'], tags: ['sector-culture'],
  },
  'min_interior': {
    id: 'min_interior', name: 'Minister of the Interior', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads internal security, public order, border security, migration, rescue, and civil protection.',
    currentHolder: 'Igor Taro', parentIds: ['cabinet'], tags: ['sector-security'],
  },
  'min_social': {
    id: 'min_social', name: 'Minister of Social Affairs', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads health policy, social protection, welfare, pensions, disability, and labour market.',
    currentHolder: 'Karmen Joller', parentIds: ['cabinet'], tags: ['sector-health', 'sector-social'],
  },
  'min_infrastructure': {
    id: 'min_infrastructure', name: 'Minister of Infrastructure', category: 'official', subtype: 'cabinet-minister',
    description: 'Minister without own ministry. Portfolio managed through Ministry of Economic Affairs. Covers roads, railways, Rail Baltica, aviation, ports.',
    currentHolder: 'Kuldar Leis', parentIds: ['cabinet'], tags: ['sector-transport'],
  },
  'min_regional_agriculture': {
    id: 'min_regional_agriculture', name: 'Minister of Regional Affairs and Agriculture', category: 'official', subtype: 'cabinet-minister',
    description: 'Leads agricultural policy, food safety, rural development, fisheries, and regional policy.',
    currentHolder: 'Hendrik Johannes Terras', parentIds: ['cabinet'], tags: ['sector-agriculture'],
  },

  // ── CONSTITUTIONAL BODIES ─────────────────────────────────────────────────
  'riigikohus': {
    id: 'riigikohus', name: 'Supreme Court', category: 'body', subtype: 'constitutional-body',
    description: 'Highest court of Estonia. Functions as court of cassation and constitutional review court. Based in Tartu.',
    infoUrl: 'https://riigikohus.ee', parentIds: ['chief_justice'], tags: ['sector-justice'],
  },
  'riigikogu': {
    id: 'riigikogu', name: 'Riigikogu (Parliament)', category: 'body', subtype: 'constitutional-body',
    description: 'Unicameral parliament. 101 members elected for 4-year terms. Passes laws, approves budget, exercises parliamentary supervision.',
    infoUrl: 'https://riigikogu.ee', parentIds: ['riigikogu_speaker'],
  },
  'riigikontroll': {
    id: 'riigikontroll', name: 'National Audit Office', category: 'body', subtype: 'constitutional-body',
    description: 'Supreme audit institution. Audits state budget implementation, use of state assets, and local government finances.',
    infoUrl: 'https://riigikontroll.ee', parentIds: ['auditor_general'], tags: ['sector-finance'],
  },
  'eesti_pank': {
    id: 'eesti_pank', name: 'Bank of Estonia', category: 'body', subtype: 'constitutional-body',
    description: 'Central bank. Member of the Eurosystem and ESCB. Manages monetary policy, financial stability, payments infrastructure.',
    infoUrl: 'https://eestipank.ee', parentIds: ['eesti_pank_governor'], tags: ['sector-finance'],
  },

  // ── DEPARTMENTS: Offices & Chancelleries ──────────────────────────────────
  'office_of_president': {
    id: 'office_of_president', name: 'Office of the President', category: 'department', subtype: 'agency',
    description: 'Administrative support for the President of the Republic.',
    infoUrl: 'https://president.ee', parentIds: ['president'],
  },
  'riigikogu_chancellery': {
    id: 'riigikogu_chancellery', name: 'Chancellery of the Riigikogu', category: 'department', subtype: 'agency',
    description: 'Administrative support for Parliament.',
    infoUrl: 'https://riigikogu.ee', parentIds: ['riigikogu'],
  },
  'oiguskantsleri_kantselei': {
    id: 'oiguskantsleri_kantselei', name: 'Office of the Chancellor of Justice', category: 'department', subtype: 'agency',
    description: 'Administrative support for the Chancellor of Justice.',
    infoUrl: 'https://oiguskantsler.ee', parentIds: ['oiguskantsler'],
  },
  'riigikantselei': {
    id: 'riigikantselei', name: 'Government Office', category: 'department', subtype: 'agency',
    description: 'Organises government work. Coordinates Estonia 2035 strategy, EU affairs, national security, government communication.',
    currentHolder: 'Secretary of State: Keit Kasemets', infoUrl: 'https://riigikantselei.ee', parentIds: ['pm'],
  },

  // ── DEPARTMENTS: Ministries ───────────────────────────────────────────────
  'ministry_foreign': {
    id: 'ministry_foreign', name: 'Ministry of Foreign Affairs', category: 'department', subtype: 'ministerial',
    description: 'Foreign policy, diplomacy, consular services, development cooperation, EU coordination.',
    infoUrl: 'https://vm.ee', parentIds: ['min_foreign'], tags: ['sector-foreign-policy'],
  },
  'ministry_defence': {
    id: 'ministry_defence', name: 'Ministry of Defence', category: 'department', subtype: 'ministerial',
    description: 'National defence policy, military planning, defence procurement coordination.',
    infoUrl: 'https://kaitseministeerium.ee', parentIds: ['min_defence'], tags: ['sector-defence'],
  },
  'ministry_finance': {
    id: 'ministry_finance', name: 'Ministry of Finance', category: 'department', subtype: 'ministerial',
    description: 'State budget, tax policy, public finance, economic forecasting, local government finances, EU funds.',
    infoUrl: 'https://rahandusministeerium.ee', parentIds: ['min_finance'], tags: ['sector-finance'],
  },
  'ministry_justice_digital': {
    id: 'ministry_justice_digital', name: 'Ministry of Justice and Digital Affairs', category: 'department', subtype: 'ministerial',
    description: 'Justice system, courts administration, legislation drafting, digital affairs, e-governance, data protection, prisons.',
    infoUrl: 'https://justdigi.ee', parentIds: ['min_justice_digital'], tags: ['sector-justice', 'sector-digital'],
  },
  'ministry_education': {
    id: 'ministry_education', name: 'Ministry of Education and Research', category: 'department', subtype: 'ministerial',
    description: 'Education policy (pre-school through higher education), research, youth policy, language policy.',
    infoUrl: 'https://hm.ee', parentIds: ['min_education'], tags: ['sector-education', 'sector-science'],
  },
  'ministry_economy': {
    id: 'ministry_economy', name: 'Ministry of Economic Affairs and Communications', category: 'department', subtype: 'ministerial',
    description: 'Economic policy, industrial policy, innovation, labour market, transport policy, maritime affairs, consumer protection.',
    infoUrl: 'https://mkm.ee', parentIds: ['min_economy'], tags: ['sector-transport', 'sector-labour'],
  },
  'ministry_climate': {
    id: 'ministry_climate', name: 'Ministry of Climate (Environment and Energetics)', category: 'department', subtype: 'ministerial',
    description: 'Environmental policy, climate policy, energy policy, forestry, water management, waste management, spatial planning.',
    infoUrl: 'https://kliimaministeerium.ee', parentIds: ['min_environment_energy'], tags: ['sector-environment', 'sector-energy'],
  },
  'ministry_culture': {
    id: 'ministry_culture', name: 'Ministry of Culture', category: 'department', subtype: 'ministerial',
    description: 'Culture, arts, heritage protection, media policy, sport, creative industries.',
    infoUrl: 'https://kul.ee', parentIds: ['min_culture'], tags: ['sector-culture'],
  },
  'ministry_interior': {
    id: 'ministry_interior', name: 'Ministry of the Interior', category: 'department', subtype: 'ministerial',
    description: 'Internal security, public order, border security, migration, rescue, civil protection, religious affairs.',
    infoUrl: 'https://siseministeerium.ee', parentIds: ['min_interior'], tags: ['sector-security'],
  },
  'ministry_social': {
    id: 'ministry_social', name: 'Ministry of Social Affairs', category: 'department', subtype: 'ministerial',
    description: 'Health policy, social protection, welfare, pensions, disability, child protection, labour market, gender equality.',
    infoUrl: 'https://sm.ee', parentIds: ['min_social'], tags: ['sector-health', 'sector-social'],
  },
  'ministry_regional_agriculture': {
    id: 'ministry_regional_agriculture', name: 'Ministry of Regional Affairs and Agriculture', category: 'department', subtype: 'ministerial',
    description: 'Agricultural policy, food safety, veterinary policy, rural development, fisheries, regional policy.',
    infoUrl: 'https://agri.ee', parentIds: ['min_regional_agriculture'], tags: ['sector-agriculture'],
  },
  'ministry_infrastructure_note': {
    id: 'ministry_infrastructure_note', name: 'Infrastructure portfolio (under MKM)', category: 'department', subtype: 'portfolio',
    description: 'Infrastructure portfolio managed through the Ministry of Economic Affairs and Communications. The Minister of Infrastructure has no separate ministry.',
    parentIds: ['min_infrastructure'], tags: ['sector-transport'],
  },

  // ── BODIES: Under Ministry of Foreign Affairs ─────────────────────────────
  'agency_foreign_intel': {
    id: 'agency_foreign_intel', name: 'Estonian Foreign Intelligence Service', category: 'body', subtype: 'security-agency',
    description: 'Foreign intelligence gathering and analysis (Välisluureamet).',
    parentIds: ['ministry_foreign'], tags: ['intelligence', 'sector-security'],
  },

  // ── BODIES: Under Ministry of Defence ─────────────────────────────────────
  'agency_defence_forces': {
    id: 'agency_defence_forces', name: 'Estonian Defence Forces', category: 'body', subtype: 'military',
    description: 'Armed forces of Estonia (Kaitsevägi). Includes Army, Navy, Air Force.',
    currentHolder: 'Commander: Lt Gen Andrus Merilo', parentIds: ['ministry_defence'], tags: ['armed-forces', 'sector-defence'],
  },
  'agency_defence_resources': {
    id: 'agency_defence_resources', name: 'Defence Resources Agency', category: 'body', subtype: 'executive-agency',
    description: 'Conscription management, mobilization planning, military service records (Kaitseressursside Amet).',
    parentIds: ['ministry_defence'], tags: ['sector-defence'],
  },
  'agency_defence_league': {
    id: 'agency_defence_league', name: 'Estonian Defence League', category: 'body', subtype: 'public-corporation',
    description: 'Voluntary national defence organisation (Kaitseliit). Includes Women’s Home Defence and youth organisations.',
    parentIds: ['ministry_defence'], tags: ['armed-forces', 'sector-defence'],
  },
  'agency_defence_investment': {
    id: 'agency_defence_investment', name: 'Centre for Defence Investment', category: 'body', subtype: 'executive-agency',
    description: 'Defence procurement, infrastructure investment, host nation support (Riigi Kaitseinvesteeringute Keskus, RKIK).',
    parentIds: ['ministry_defence'], tags: ['sector-defence'],
  },

  // ── BODIES: Under Ministry of Finance ─────────────────────────────────────
  'agency_tax_customs': {
    id: 'agency_tax_customs', name: 'Tax and Customs Board', category: 'body', subtype: 'executive-agency',
    description: 'Tax collection, customs enforcement, gambling supervision (Maksu- ja Tolliamet, MTA).',
    infoUrl: 'https://emta.ee', parentIds: ['ministry_finance'], tags: ['sector-finance'],
  },
  'agency_statistics': {
    id: 'agency_statistics', name: 'Statistics Estonia', category: 'body', subtype: 'executive-agency',
    description: 'Official statistics production and dissemination (Statistikaamet).',
    infoUrl: 'https://stat.ee', parentIds: ['ministry_finance'], tags: ['sector-finance'],
  },
  'agency_rtk': {
    id: 'agency_rtk', name: 'State Shared Service Centre', category: 'body', subtype: 'executive-agency',
    description: 'Administers EU structural funds, state grants, and shared services (Riigi Tugiteenuste Keskus, RTK).',
    parentIds: ['ministry_finance'], tags: ['sector-finance'],
  },
  'agency_finantsinspektsioon': {
    id: 'agency_finantsinspektsioon', name: 'Financial Supervision and Resolution Authority', category: 'body', subtype: 'regulator',
    description: 'Financial market supervision. Supervises banks, insurers, fund managers, securities market (Finantsinspektsioon).',
    infoUrl: 'https://fi.ee', parentIds: ['ministry_finance'], tags: ['regulator', 'sector-finance'],
  },

  // ── BODIES: Under Ministry of Justice and Digital Affairs ─────────────────
  'agency_prokuratuur': {
    id: 'agency_prokuratuur', name: 'Prosecution Service', category: 'body', subtype: 'executive-agency',
    description: 'Criminal prosecution. Headed by Prosecutor General Astrid Asi (Prokuratuur).',
    parentIds: ['ministry_justice_digital'], tags: ['prosecution', 'sector-justice'],
  },
  'agency_ria': {
    id: 'agency_ria', name: 'Information System Authority', category: 'body', subtype: 'executive-agency',
    description: 'State information systems, cybersecurity (CERT-EE), e-governance infrastructure, digital identity (Riigi Infosüsteemi Amet, RIA).',
    infoUrl: 'https://ria.ee', parentIds: ['ministry_justice_digital'], tags: ['sector-digital'],
  },
  'agency_aki': {
    id: 'agency_aki', name: 'Data Protection Inspectorate', category: 'body', subtype: 'regulator',
    description: 'Personal data protection supervision. Freedom of information oversight. GDPR enforcement (Andmekaitse Inspektsioon, AKI).',
    infoUrl: 'https://aki.ee', parentIds: ['ministry_justice_digital'], tags: ['regulator', 'sector-digital'],
  },
  'agency_patendiamet': {
    id: 'agency_patendiamet', name: 'Patent Office', category: 'body', subtype: 'executive-agency',
    description: 'Registration and protection of patents, trademarks, industrial designs (Patendiamet).',
    parentIds: ['ministry_justice_digital'], tags: ['sector-justice'],
  },
  'agency_ekei': {
    id: 'agency_ekei', name: 'Estonian Forensic Science Institute', category: 'body', subtype: 'executive-agency',
    description: 'Forensic science analysis for criminal proceedings (Eesti Kohtuekspertiisi Instituut, EKEI).',
    parentIds: ['ministry_justice_digital'], tags: ['sector-justice'],
  },

  // ── BODIES: Under Ministry of Education and Research ──────────────────────
  'agency_harno': {
    id: 'agency_harno', name: 'Education and Youth Board', category: 'body', subtype: 'executive-agency',
    description: 'Implements education and youth policy. Quality assurance, curriculum development, Erasmus+ (Haridus- ja Noorteamet, HARNO).',
    infoUrl: 'https://harno.ee', parentIds: ['ministry_education'], tags: ['sector-education'],
  },
  'agency_etag': {
    id: 'agency_etag', name: 'Estonian Research Council', category: 'body', subtype: 'executive-agency',
    description: 'Research funding, international research cooperation, science communication (Eesti Teadusagentuur, ETAg).',
    infoUrl: 'https://etag.ee', parentIds: ['ministry_education'], tags: ['sector-science'],
  },
  'agency_rahvusarhiiv': {
    id: 'agency_rahvusarhiiv', name: 'National Archives of Estonia', category: 'body', subtype: 'executive-agency',
    description: 'Preserves and provides access to archival records of national significance (Rahvusarhiiv).',
    infoUrl: 'https://ra.ee', parentIds: ['ministry_education'], tags: ['sector-culture'],
  },
  'agency_keeleinspektsioon': {
    id: 'agency_keeleinspektsioon', name: 'Language Inspectorate', category: 'body', subtype: 'inspectorate',
    description: 'Supervises compliance with Language Act requirements (Keeleinspektsioon).',
    parentIds: ['ministry_education'], tags: ['inspectorate', 'sector-education'],
  },

  // ── BODIES: Under Ministry of Economic Affairs ────────────────────────────
  'agency_ttja': {
    id: 'agency_ttja', name: 'Consumer Protection and Technical Regulatory Authority', category: 'body', subtype: 'regulator',
    description: 'Consumer protection, market surveillance, technical safety, communications regulation (Tarbijakaitse ja Tehnilise Järelevalve Amet, TTJA).',
    infoUrl: 'https://ttja.ee', parentIds: ['ministry_economy'], tags: ['regulator', 'sector-transport'],
  },
  'agency_tooinspektsioon': {
    id: 'agency_tooinspektsioon', name: 'Labour Inspectorate', category: 'body', subtype: 'inspectorate',
    description: 'Occupational health and safety supervision. Labour dispute resolution (Tööinspektsioon).',
    infoUrl: 'https://ti.ee', parentIds: ['ministry_economy'], tags: ['inspectorate', 'sector-labour'],
  },
  'agency_veeteede_amet': {
    id: 'agency_veeteede_amet', name: 'Maritime Administration', category: 'body', subtype: 'executive-agency',
    description: 'Maritime safety, vessel registration, hydrography, pilotage (Veeteede Amet).',
    parentIds: ['ministry_economy'], tags: ['sector-transport'],
  },

  // ── BODIES: Under Ministry of Climate ─────────────────────────────────────
  'agency_keskkonnaamet': {
    id: 'agency_keskkonnaamet', name: 'Environmental Board', category: 'body', subtype: 'executive-agency',
    description: 'Environmental permits, nature conservation, waste management oversight, environmental supervision (Keskkonnaamet).',
    infoUrl: 'https://keskkonnaamet.ee', parentIds: ['ministry_climate'], tags: ['sector-environment'],
  },
  'agency_keskkonnaagentuur': {
    id: 'agency_keskkonnaagentuur', name: 'Environment Agency', category: 'body', subtype: 'executive-agency',
    description: 'Environmental monitoring, data management, biodiversity assessment, weather service (Keskkonnaagentuur).',
    parentIds: ['ministry_climate'], tags: ['sector-environment'],
  },
  'agency_rmk': {
    id: 'agency_rmk', name: 'State Forest Management Centre', category: 'body', subtype: 'state-enterprise',
    description: 'Manages state forests (approx. 47% of Estonian forest). Recreation areas, nature conservation (Riigimetsa Majandamise Keskus, RMK).',
    infoUrl: 'https://rmk.ee', parentIds: ['ministry_climate'], tags: ['sector-environment'],
  },

  // ── BODIES: Under Ministry of Culture ─────────────────────────────────────
  'agency_muinsuskaitseamet': {
    id: 'agency_muinsuskaitseamet', name: 'National Heritage Board', category: 'body', subtype: 'executive-agency',
    description: 'Protection and preservation of cultural heritage, archaeological sites, historic buildings (Muinsuskaitseamet).',
    infoUrl: 'https://muinsuskaitseamet.ee', parentIds: ['ministry_culture'], tags: ['sector-culture'],
  },

  // ── BODIES: Under Ministry of the Interior ────────────────────────────────
  'agency_ppa': {
    id: 'agency_ppa', name: 'Police and Border Guard Board', category: 'body', subtype: 'executive-agency',
    description: 'Policing, criminal investigation, border security, migration and asylum, citizenship, identity documents (Politsei- ja Piirivalveamet, PPA).',
    infoUrl: 'https://politsei.ee', parentIds: ['ministry_interior'], tags: ['police', 'sector-security'],
  },
  'agency_paasteamet': {
    id: 'agency_paasteamet', name: 'Rescue Board', category: 'body', subtype: 'executive-agency',
    description: 'Fire and rescue services, civil protection, crisis preparedness, bomb disposal (Päästeamet).',
    infoUrl: 'https://rescue.ee', parentIds: ['ministry_interior'], tags: ['sector-security'],
  },
  'agency_kapo': {
    id: 'agency_kapo', name: 'Estonian Internal Security Service', category: 'body', subtype: 'security-agency',
    description: 'Counter-intelligence, counter-terrorism, protection of constitutional order, state secrets (Kaitsepolitseiamet, KAPO).',
    infoUrl: 'https://kapo.ee', parentIds: ['ministry_interior'], tags: ['intelligence', 'sector-security'],
  },
  'agency_smit': {
    id: 'agency_smit', name: 'IT and Development Centre of the MoI', category: 'body', subtype: 'executive-agency',
    description: 'IT services and systems for Ministry of the Interior agencies (Siseministeeriumi infotehnoloogia- ja arenduskeskus, SMIT).',
    parentIds: ['ministry_interior'], tags: ['sector-digital'],
  },
  'agency_ska_interior': {
    id: 'agency_ska_interior', name: 'Estonian Academy of Security Sciences', category: 'body', subtype: 'training-institution',
    description: 'Higher education for police, border guard, rescue, corrections, and tax/customs officers (Sisekaitseakadeemia, SKA).',
    infoUrl: 'https://sisekaitse.ee', parentIds: ['ministry_interior'], tags: ['sector-education', 'sector-security'],
  },

  // ── BODIES: Under Ministry of Social Affairs ──────────────────────────────
  'agency_sotsiaalkindlustusamet': {
    id: 'agency_sotsiaalkindlustusamet', name: 'Social Insurance Board', category: 'body', subtype: 'executive-agency',
    description: 'Pensions, family benefits, social services, child protection, disability assessment, victim support (Sotsiaalkindlustusamet, SKA).',
    infoUrl: 'https://sotsiaalkindlustusamet.ee', parentIds: ['ministry_social'], tags: ['sector-social'],
  },
  'agency_terviseamet': {
    id: 'agency_terviseamet', name: 'Health Board', category: 'body', subtype: 'executive-agency',
    description: 'Public health protection, communicable disease surveillance, health service regulation (Terviseamet).',
    infoUrl: 'https://terviseamet.ee', parentIds: ['ministry_social'], tags: ['sector-health'],
  },
  'agency_ravimiamet': {
    id: 'agency_ravimiamet', name: 'State Agency of Medicines', category: 'body', subtype: 'regulator',
    description: 'Pharmaceutical regulation, drug safety, clinical trials oversight, medical devices (Ravimiamet).',
    infoUrl: 'https://ravimiamet.ee', parentIds: ['ministry_social'], tags: ['regulator', 'sector-health'],
  },
  'agency_tai': {
    id: 'agency_tai', name: 'National Institute for Health Development', category: 'body', subtype: 'research-institute',
    description: 'Health research, health statistics, disease prevention, health promotion (Tervise Arengu Instituut, TAI).',
    infoUrl: 'https://tai.ee', parentIds: ['ministry_social'], tags: ['sector-health', 'sector-science'],
  },
  'body_tervisekassa': {
    id: 'body_tervisekassa', name: 'Estonian Health Insurance Fund', category: 'body', subtype: 'public-law-body',
    description: 'Universal health insurance. Funds healthcare services, pharmaceuticals, medical devices, sick leave. Independent public law body (Eesti Tervisekassa).',
    infoUrl: 'https://tervisekassa.ee', parentIds: ['ministry_social'], tags: ['sector-health'],
  },
  'body_tootukassa': {
    id: 'body_tootukassa', name: 'Estonian Unemployment Insurance Fund', category: 'body', subtype: 'public-law-body',
    description: 'Unemployment benefits, active labour market services, employment mediation, career counselling. Independent public law body (Eesti Töötukassa).',
    infoUrl: 'https://tootukassa.ee', parentIds: ['ministry_social'], tags: ['sector-labour', 'sector-social'],
  },

  // ── BODIES: Under Ministry of Regional Affairs and Agriculture ────────────
  'agency_pta': {
    id: 'agency_pta', name: 'Agriculture and Food Board', category: 'body', subtype: 'executive-agency',
    description: 'Food safety, veterinary supervision, plant protection, animal health, phytosanitary (Põllumajandus- ja Toiduamet, PTA).',
    infoUrl: 'https://pta.agri.ee', parentIds: ['ministry_regional_agriculture'], tags: ['sector-agriculture'],
  },
  'agency_pria': {
    id: 'agency_pria', name: 'Agricultural Registers and Information Board', category: 'body', subtype: 'executive-agency',
    description: 'Administers EU Common Agricultural Policy subsidies, maintains agricultural registers (Põllumajanduse Registrite ja Informatsiooni Amet, PRIA).',
    infoUrl: 'https://pria.ee', parentIds: ['ministry_regional_agriculture'], tags: ['sector-agriculture'],
  },

  // ── BODIES: Under Infrastructure portfolio ────────────────────────────────
  'agency_transpordiamet': {
    id: 'agency_transpordiamet', name: 'Transport Administration', category: 'body', subtype: 'executive-agency',
    description: 'Road management, traffic management, vehicle registration, driver licensing, aviation authority, railway supervision (Transpordiamet).',
    infoUrl: 'https://transpordiamet.ee', parentIds: ['ministry_infrastructure_note'], tags: ['sector-transport'],
  },
}

// ── Derived look-ups ──────────────────────────────────────────────────────────
const _childrenByParent = new Map<string, string[]>()
for (const el of Object.values(govElements)) {
  for (const pid of el.parentIds) {
    if (!_childrenByParent.has(pid)) _childrenByParent.set(pid, [])
    _childrenByParent.get(pid)!.push(el.id)
  }
}

const _secondaryChildrenByParent = new Map<string, string[]>()
for (const el of Object.values(govElements)) {
  for (const pid of (el.secondaryParentIds ?? [])) {
    if (!_secondaryChildrenByParent.has(pid)) _secondaryChildrenByParent.set(pid, [])
    _secondaryChildrenByParent.get(pid)!.push(el.id)
  }
}

export function getChildIds(id: string): string[] {
  return _childrenByParent.get(id) ?? []
}

export function getSecondaryChildIds(id: string): string[] {
  return _secondaryChildrenByParent.get(id) ?? []
}

export function getElement(id: string): GovElement | undefined {
  return govElements[id]
}

export function getConnectedElements(id: string): { parents: GovElement[]; children: GovElement[]; secondaryParents: GovElement[]; secondaryChildren: GovElement[] } {
  const element = govElements[id]
  if (!element) return { parents: [], children: [], secondaryParents: [], secondaryChildren: [] }

  const secondaryParents = (element.secondaryParentIds ?? [])
    .map(pid => govElements[pid])
    .filter(Boolean) as GovElement[]

  const secondaryChildren = getSecondaryChildIds(id)
    .map(cid => govElements[cid])
    .filter(Boolean) as GovElement[]

  return {
    parents: element.parentIds.map(pid => govElements[pid]).filter(Boolean) as GovElement[],
    secondaryParents,
    children: getChildIds(id).map(cid => govElements[cid]).filter(Boolean) as GovElement[],
    secondaryChildren,
  }
}
