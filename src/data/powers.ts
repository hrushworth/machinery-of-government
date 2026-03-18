// ── Powers, Duties & Responsibilities ────────────────────────────────────────
// Keyed by element ID from elements.ts.
// Not every element needs an entry — absence simply means no data yet.

export type PowerType = 'power' | 'duty' | 'function' | 'responsibility'
export type SourceType = 'act' | 'statutory-instrument' | 'prerogative' | 'case-law' | 'convention'

export interface LegislativeSource {
  type: SourceType
  title: string          // e.g. "Constitutional Reform and Governance Act 2010"
  section?: string       // e.g. "s.3(1)"
  year?: number
  legislationUrl?: string // deep-link to legislation.gov.uk
  caseRef?: string        // for case-law: full neutral citation
}

export interface Power {
  id: string
  title: string
  description: string
  powerType: PowerType
  inForceFrom?: string         // ISO date or year string, e.g. "2010" or "1997-05-02"
  amendedDate?: string
  sources: LegislativeSource[]
  notes?: string
}

export interface PowerProfile {
  elementId: string
  powers: Power[]
  lastReviewed?: string        // ISO date — flag for data freshness
}

// ── Data ──────────────────────────────────────────────────────────────────────
export const powerProfiles: Record<string, PowerProfile> = {

  'pm': {
    elementId: 'pm',
    lastReviewed: '2025-01-01',
    powers: [
      {
        id: 'pm-appoint-ministers',
        title: 'Appointment of Ministers',
        description: 'The Prime Minister advises the Sovereign on the appointment and dismissal of all Ministers of the Crown, including Cabinet ministers, Ministers of State, and Parliamentary Under-Secretaries of State.',
        powerType: 'power',
        inForceFrom: '1900',
        sources: [
          {
            type: 'convention',
            title: 'Constitutional convention',
            section: undefined,
            notes: 'Formally a prerogative of the Crown exercised on the advice of the Prime Minister.'
          } as LegislativeSource & { notes?: string },
          {
            type: 'act',
            title: 'Ministers of the Crown Act 1975',
            year: 1975,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/1975/26',
          },
        ],
        notes: 'In practice this extends to all senior public appointments where the PM has an advisory or direct role.',
      },
      {
        id: 'pm-request-dissolution',
        title: 'Requesting Dissolution of Parliament',
        description: 'The Prime Minister may request that the Sovereign dissolve Parliament, triggering a general election. Since the Dissolution and Calling of Parliament Act 2022, this restored the prerogative power following the fixed-term Parliament regime.',
        powerType: 'power',
        inForceFrom: '2022',
        sources: [
          {
            type: 'act',
            title: 'Dissolution and Calling of Parliament Act 2022',
            year: 2022,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2022/11',
          },
          {
            type: 'prerogative',
            title: 'Royal Prerogative — dissolution of Parliament',
          },
        ],
      },
      {
        id: 'pm-civil-service-management',
        title: 'Management of the Civil Service',
        description: 'The Prime Minister is Minister for the Civil Service and holds overall responsibility for the organisation, management, and terms and conditions of the Civil Service.',
        powerType: 'responsibility',
        inForceFrom: '1968',
        sources: [
          {
            type: 'act',
            title: 'Constitutional Reform and Governance Act 2010',
            year: 2010,
            section: 'Part 1',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2010/25/part/1',
          },
        ],
        notes: 'Day-to-day management of the Civil Service is delegated to the Cabinet Secretary and Permanent Secretaries.',
      },
      {
        id: 'pm-national-security',
        title: 'Chair of the National Security Council',
        description: 'The Prime Minister chairs the National Security Council (NSC), which coordinates across government on national security, intelligence, defence, and foreign policy.',
        powerType: 'function',
        inForceFrom: '2010',
        sources: [
          {
            type: 'convention',
            title: 'Cabinet committee structure — NSC Terms of Reference',
          },
        ],
      },
      {
        id: 'pm-appoint-senior-officials',
        title: 'Appointment of Senior Officials',
        description: 'The Prime Minister approves the appointment and removal of the Cabinet Secretary, all Permanent Secretaries, and the heads of the intelligence and security agencies. These appointments are formally made by the Crown on ministerial advice.',
        powerType: 'power',
        inForceFrom: '1968',
        sources: [
          {
            type: 'act',
            title: 'Constitutional Reform and Governance Act 2010',
            year: 2010,
            section: 'Part 1',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2010/25/part/1',
          },
          {
            type: 'convention',
            title: 'Constitutional convention — Prime Ministerial prerogative over senior appointments',
          },
        ],
        notes: 'Permanent Secretary appointments are subject to a Civil Service Commission-led process; the PM retains final approval.',
      },
      {
        id: 'pm-honours-peerages',
        title: 'Recommendation of Honours and Peerages',
        description: 'The Prime Minister advises the Sovereign on the award of most state honours and the creation of life peerages under the Life Peerages Act 1958. The Prime Minister also nominates dissolution peerages on the advice of party leaders.',
        powerType: 'power',
        inForceFrom: '1958',
        sources: [
          {
            type: 'prerogative',
            title: 'Royal Prerogative — grant of honours',
          },
          {
            type: 'act',
            title: 'Life Peerages Act 1958',
            year: 1958,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/1958/21',
          },
        ],
        notes: 'Political honours are scrutinised by the House of Lords Appointments Commission, though its recommendations are advisory.',
      },
      {
        id: 'pm-treaty-ratification',
        title: 'Treaty Ratification Oversight',
        description: 'The Prime Minister and Cabinet are responsible for ratifying international treaties. The Constitutional Reform and Governance Act 2010 introduced a statutory duty to lay treaties before Parliament for 21 sitting days before ratification, giving Parliament the opportunity to object.',
        powerType: 'duty',
        inForceFrom: '2010',
        sources: [
          {
            type: 'act',
            title: 'Constitutional Reform and Governance Act 2010',
            year: 2010,
            section: 'ss.20–25',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2010/25/part/2',
          },
          {
            type: 'prerogative',
            title: 'Royal Prerogative — treaty-making',
          },
        ],
      },
      {
        id: 'pm-armed-forces-deployment',
        title: 'Deployment of Armed Forces',
        description: 'The Prime Minister exercises the royal prerogative to commit armed forces to military action overseas. Since 2003 a constitutional convention has developed that significant deployments should be subject to a prior vote of the House of Commons, though this is not legally binding.',
        powerType: 'power',
        inForceFrom: '1689',
        sources: [
          {
            type: 'prerogative',
            title: 'Royal Prerogative — command of armed forces',
          },
          {
            type: 'convention',
            title: 'Parliamentary convention — prior Commons approval for significant overseas deployments',
          },
        ],
        notes: 'The convention was established following the Iraq War vote of March 2003 and reaffirmed in Syria debates (2013, 2015).',
      },
      {
        id: 'pm-intelligence-warrants',
        title: 'Authorisation of Intelligence Warrants',
        description: 'The Prime Minister may personally issue or authorise certain intrusive intelligence and surveillance warrants, including bulk interception, bulk equipment interference, and bulk personal dataset warrants under the Investigatory Powers Act 2016.',
        powerType: 'power',
        inForceFrom: '2016',
        sources: [
          {
            type: 'act',
            title: 'Investigatory Powers Act 2016',
            year: 2016,
            section: 'ss.138–140 (bulk interception), s.176 (bulk equipment interference)',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2016/25',
          },
        ],
        notes: 'Warrants issued by the PM are subject to approval by a Judicial Commissioner under the "double lock" mechanism.',
      },
      {
        id: 'pm-civil-contingencies',
        title: 'Chairing COBR and Civil Contingencies Oversight',
        description: 'The Prime Minister chairs the Cabinet Office Briefing Rooms (COBR) during national emergencies and oversees the government\'s response to civil contingencies. The Civil Contingencies Act 2004 provides the statutory framework for emergency powers, including the declaration of a state of emergency and the making of emergency regulations.',
        powerType: 'function',
        inForceFrom: '2004',
        sources: [
          {
            type: 'act',
            title: 'Civil Contingencies Act 2004',
            year: 2004,
            section: 'Part 2',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2004/36/part/2',
          },
          {
            type: 'convention',
            title: 'Cabinet Office — COBR operational framework',
          },
        ],
      },
      {
        id: 'pm-ministerial-code',
        title: 'Issuing and Enforcing the Ministerial Code',
        description: 'The Prime Minister is personally responsible for issuing, amending, and enforcing the Ministerial Code, which sets out the standards of conduct expected of all Ministers of the Crown. The Prime Minister is the final arbiter of the Code and may refer alleged breaches to the Independent Adviser on Ministers\' Interests.',
        powerType: 'duty',
        inForceFrom: '1945',
        sources: [
          {
            type: 'convention',
            title: 'Ministerial Code (Cabinet Office)',
          },
          {
            type: 'prerogative',
            title: 'Royal Prerogative — Prime Ministerial authority over ministers',
          },
        ],
        notes: 'The Code was previously known as Questions of Procedure for Ministers. Its legal status is conventional rather than statutory.',
      },
      {
        id: 'pm-nuclear-release',
        title: 'Nuclear Release Authority',
        description: 'The Prime Minister holds sole authority to authorise the use of the United Kingdom\'s nuclear weapons. Each Prime Minister writes four identical "letters of last resort" to the commanders of the Vanguard-class submarines, to be opened only if the government has been destroyed. The authority to release is a prerogative power.',
        powerType: 'power',
        inForceFrom: '1969',
        sources: [
          {
            type: 'prerogative',
            title: 'Royal Prerogative — command of nuclear forces',
          },
          {
            type: 'convention',
            title: 'Nuclear weapons use — Prime Ministerial sole authority',
          },
        ],
        notes: 'The letters of last resort are destroyed unread on a change of Prime Minister. Their contents are never disclosed.',
      },
      {
        id: 'pm-sovereign-audience',
        title: 'Weekly Audience with the Sovereign',
        description: 'The Prime Minister has a constitutional duty to hold a regular private audience with the Sovereign, typically weekly when Parliament is sitting, to report on government business, advise on the exercise of the royal prerogative, and consult on matters of state.',
        powerType: 'duty',
        inForceFrom: '1689',
        sources: [
          {
            type: 'convention',
            title: 'Constitutional convention — Prime Ministerial audience with the Sovereign',
          },
          {
            type: 'act',
            title: 'Bill of Rights 1689',
            year: 1689,
            legislationUrl: 'https://www.legislation.gov.uk/aep/WillandMarSess2/1/2',
          },
        ],
      },
      {
        id: 'pm-parliamentary-accountability',
        title: 'Accountability to Parliament',
        description: 'The Prime Minister is accountable to the House of Commons and must maintain its confidence to remain in office. This includes answering Prime Minister\'s Questions (PMQs) each Wednesday when the House is sitting, making statements on major government decisions, and appearing before select committees.',
        powerType: 'duty',
        inForceFrom: '1689',
        sources: [
          {
            type: 'act',
            title: 'Bill of Rights 1689',
            year: 1689,
            section: 'Article 9 — freedom of parliamentary proceedings',
            legislationUrl: 'https://www.legislation.gov.uk/aep/WillandMarSess2/1/2',
          },
          {
            type: 'convention',
            title: 'Constitutional convention — ministerial responsibility and confidence',
          },
        ],
        notes: 'PMQs was established in its current Wednesday format in 1997. The convention of confidence dates to the 18th century.',
      },
      {
        id: 'pm-isc-oversight',
        title: 'Intelligence and Security Committee Oversight',
        description: 'The Prime Minister is responsible for laying the Intelligence and Security Committee\'s reports before Parliament and for approving the Committee\'s membership in consultation with the leaders of the opposition parties. The PM may redact parts of reports on national security grounds before publication.',
        powerType: 'function',
        inForceFrom: '2013',
        sources: [
          {
            type: 'act',
            title: 'Justice and Security Act 2013',
            year: 2013,
            section: 'ss.1–3, Schedule 1',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2013/18/part/1',
          },
        ],
      },
      {
        id: 'pm-prorogation',
        title: 'Prorogation of Parliament',
        description: 'The Prime Minister advises the Sovereign to prorogue Parliament, bringing a parliamentary session to an end. The power is a royal prerogative exercised on ministerial advice. Its lawful limits were clarified in R (Miller) v The Prime Minister [2019] UKSC 41, in which the Supreme Court held that prorogation is unlawful if it has the effect of frustrating or preventing Parliament from carrying out its constitutional functions without reasonable justification.',
        powerType: 'power',
        inForceFrom: '1689',
        sources: [
          {
            type: 'prerogative',
            title: 'Royal Prerogative — prorogation of Parliament',
          },
          {
            type: 'case-law',
            title: 'R (Miller) v The Prime Minister',
            year: 2019,
            caseRef: '[2019] UKSC 41',
          },
          {
            type: 'act',
            title: 'Bill of Rights 1689',
            year: 1689,
            legislationUrl: 'https://www.legislation.gov.uk/aep/WillandMarSess2/1/2',
          },
        ],
        notes: 'The 2019 Miller judgment established that the prerogative power to prorogue is justiciable and subject to judicial review. A five-week prorogation sought by Prime Minister Johnson was declared unlawful and void.',
      },
      {
        id: 'pm-chair-cabinet',
        title: 'Chairing Cabinet',
        description: 'The Prime Minister chairs all meetings of the Cabinet, controls the agenda, and determines which matters are brought before it. The Prime Minister also decides the composition of Cabinet committees and chairs the most significant of them. Through this function the PM directs the collective decision-making of Her Majesty\'s Government.',
        powerType: 'function',
        inForceFrom: '1900',
        sources: [
          {
            type: 'convention',
            title: 'Constitutional convention — Prime Minister as Chair of Cabinet',
          },
          {
            type: 'convention',
            title: 'Cabinet Manual (Cabinet Office, 2011)',
          },
        ],
      },
      {
        id: 'pm-collective-responsibility',
        title: 'Enforcing Collective Cabinet Responsibility',
        description: 'The Prime Minister is responsible for maintaining and enforcing the convention of collective Cabinet responsibility, under which all Cabinet ministers are bound by and must publicly support decisions of the Cabinet. The Prime Minister may grant dispensations from the convention — as occurred for the 1975 EEC referendum and the 2016 EU referendum — and may require the resignation of ministers who breach it.',
        powerType: 'responsibility',
        inForceFrom: '1782',
        sources: [
          {
            type: 'convention',
            title: 'Constitutional convention — collective Cabinet responsibility',
          },
          {
            type: 'convention',
            title: 'Cabinet Manual (Cabinet Office, 2011), Chapter 4',
          },
        ],
        notes: 'The convention is described in the Cabinet Manual as meaning that ministers "can express their views frankly in Cabinet... but decisions reached by the Cabinet must be supported by all members of the Cabinet." Dispensations have been granted on three occasions: the 1975 EEC membership referendum, the 2016 EU referendum, and during the 2010 coalition government on certain agreed policy disagreements.',
      },
      {
        id: 'pm-appoint-lord-chancellor',
        title: 'Appointment of the Lord Chancellor',
        description: 'The Prime Minister recommends to the Sovereign the appointment of the Lord Chancellor, who must be a person of experience in law. The Constitutional Reform Act 2005 removed the requirement that the Lord Chancellor be a lawyer and a peer, but requires that the PM consult the Lord Chief Justice before recommending an appointment.',
        powerType: 'power',
        inForceFrom: '2005',
        sources: [
          {
            type: 'act',
            title: 'Constitutional Reform Act 2005',
            year: 2005,
            section: 's.2',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2005/4/section/2',
          },
          {
            type: 'prerogative',
            title: 'Royal Prerogative — appointment of Lord Chancellor',
          },
        ],
      },
      {
        id: 'pm-appoint-law-officers',
        title: 'Appointment of Law Officers',
        description: 'The Prime Minister advises the Sovereign on the appointment of the Attorney General for England and Wales and the Solicitor General. Law Officers are the chief legal advisers to the Crown and to the government, responsible for the superintendence of the Crown Prosecution Service and the Serious Fraud Office, and for providing legal advice to Cabinet.',
        powerType: 'power',
        inForceFrom: '1461',
        sources: [
          {
            type: 'prerogative',
            title: 'Royal Prerogative — appointment of Law Officers of the Crown',
          },
          {
            type: 'act',
            title: 'Law Officers Act 1997',
            year: 1997,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/1997/60',
          },
        ],
      },
      {
        id: 'pm-appoint-ipco',
        title: 'Appointment of the Investigatory Powers Commissioner',
        description: 'The Prime Minister appoints the Investigatory Powers Commissioner (IPCO), who heads the Judicial Commissioners and provides independent oversight of the use of investigatory powers by intelligence agencies, law enforcement, and other public authorities under the Investigatory Powers Act 2016.',
        powerType: 'power',
        inForceFrom: '2017',
        sources: [
          {
            type: 'act',
            title: 'Investigatory Powers Act 2016',
            year: 2016,
            section: 's.227',
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2016/25/section/227',
          },
        ],
        notes: 'The appointment must be of a person who holds or has held high judicial office. The IPCO must be consulted before appointment.',
      },
      {
        id: 'pm-cabinet-manual',
        title: 'Issuing the Cabinet Manual',
        description: 'The Prime Minister is responsible for issuing and updating the Cabinet Manual, which describes the laws, conventions, and rules that govern the operation of government. It is authoritative on how the Prime Minister, Cabinet, and ministers conduct their business, though it is not legally binding.',
        powerType: 'responsibility',
        inForceFrom: '2011',
        sources: [
          {
            type: 'convention',
            title: 'Cabinet Manual (Cabinet Office, 2011)',
          },
        ],
        notes: 'The Cabinet Manual was first published in full in October 2011. It codified previously unwritten conventions. It is updated at the start of each new Parliament.',
      },
      {
        id: 'pm-domestic-economic-councils',
        title: 'Chairing the Domestic and Economic Councils',
        description: 'The Prime Minister chairs the Cabinet\'s Domestic and Economic Councils, through which the government\'s domestic policy priorities and economic strategy are coordinated across departments. The composition and terms of reference of these Councils are determined by the Prime Minister.',
        powerType: 'function',
        inForceFrom: '2010',
        sources: [
          {
            type: 'convention',
            title: 'Cabinet committee structure — Domestic and Economic Councils',
          },
        ],
        notes: 'The specific names and structure of these councils vary between administrations. Under the Blair and Brown governments they were known as the Domestic Affairs and Economic Affairs Committees; subsequent PMs have restructured them differently.',
      },
    ],
  },

  'treasury': {
    elementId: 'treasury',
    lastReviewed: '2025-01-01',
    powers: [
      {
        id: 'hmt-financial-management',
        title: 'Control of Public Expenditure',
        description: 'HM Treasury is responsible for managing public spending, setting departmental expenditure limits, and authorising Supply from the Consolidated Fund.',
        powerType: 'function',
        inForceFrom: '1866',
        sources: [
          {
            type: 'act',
            title: 'Exchequer and Audit Departments Act 1866',
            year: 1866,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/Vict/29-30/39',
          },
          {
            type: 'act',
            title: 'Government Resources and Accounts Act 2000',
            year: 2000,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2000/20',
          },
        ],
      },
      {
        id: 'hmt-taxation',
        title: 'Taxation Policy',
        description: 'HM Treasury is responsible for taxation policy and strategy, working with HMRC on the administration and collection of taxes.',
        powerType: 'responsibility',
        inForceFrom: '1849',
        sources: [
          {
            type: 'prerogative',
            title: 'Treasury prerogative — consolidated fund',
          },
          {
            type: 'act',
            title: 'Finance Acts (annual)',
            notes: 'Each year\'s Finance Act implements budget tax changes.',
          } as LegislativeSource & { notes?: string },
        ],
      },
      {
        id: 'hmt-fiscal-framework',
        title: 'Setting the Fiscal Framework',
        description: 'The Chancellor, through HM Treasury, sets the UK\'s fiscal rules, including debt and deficit targets, and presents the annual Budget and Spending Reviews to Parliament.',
        powerType: 'duty',
        inForceFrom: '1998',
        sources: [
          {
            type: 'act',
            title: 'Budget Responsibility and National Audit Act 2011',
            year: 2011,
            legislationUrl: 'https://www.legislation.gov.uk/ukpga/2011/4',
          },
        ],
      },
    ],
  },

}
