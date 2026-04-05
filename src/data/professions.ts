// ── Professional Regulation Data ────────────────────────────────────────────
// Source: UK Regulated Professions and their Regulators (GOV.UK)
//
// onBehalfOf: set only where the delegating principal is a private professional
// association not represented as a parentId in the graph. Secretary of State
// delegation is already captured via parentIds and is not repeated here.

export interface RegulatedProfession {
  name: string
  jurisdictionNote?: string
}

export interface ProfessionProfile {
  elementId: string
  professions: RegulatedProfession[]
  onBehalfOf?: string
}

export const professionProfiles: Record<string, ProfessionProfile> = {

  // ── Healthcare ─────────────────────────────────────────────────────────────

  'gmc': {
    elementId: 'gmc',
    professions: [
      { name: 'Anaesthesia Associate' },
      { name: 'Medical Practitioner' },
      { name: 'Physician Associate' },
    ],
  },

  'hcpc': {
    elementId: 'hcpc',
    professions: [
      { name: 'Arts Therapist' },
      { name: 'Biomedical Scientist' },
      { name: 'Chiropodist / Podiatrist' },
      { name: 'Clinical Scientist' },
      { name: 'Dietitian' },
      { name: 'Hearing Aid Dispenser' },
      { name: 'Occupational Therapist' },
      { name: 'Operating Department Practitioner' },
      { name: 'Orthoptist' },
      { name: 'Paramedic' },
      { name: 'Physiotherapist' },
      { name: 'Practitioner Psychologist' },
      { name: 'Prosthetist / Orthotist' },
      { name: 'Radiographer' },
      { name: 'Speech and Language Therapist' },
    ],
  },

  'gdc': {
    elementId: 'gdc',
    professions: [
      { name: 'Clinical Dental Technician' },
      { name: 'Dental Hygienist' },
      { name: 'Dental Nurse' },
      { name: 'Dental Technician' },
      { name: 'Dental Therapist' },
      { name: 'Dentist' },
      { name: 'Orthodontic Therapist' },
    ],
  },

  'nmc': {
    elementId: 'nmc',
    professions: [
      { name: 'Midwife' },
      { name: 'Nursing Associate' },
      { name: 'Registered Nurse' },
    ],
  },

  'goc': {
    elementId: 'goc',
    professions: [
      { name: 'Dispensing Optician' },
      { name: 'Optometrist' },
    ],
  },

  'gphc': {
    elementId: 'gphc',
    professions: [
      { name: 'Pharmacist', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Pharmacy Technician', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'psni-pharmacy': {
    elementId: 'psni-pharmacy',
    professions: [
      { name: 'Pharmaceutical Chemist', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'gcc': {
    elementId: 'gcc',
    professions: [
      { name: 'Chiropractor' },
    ],
  },

  'gosc': {
    elementId: 'gosc',
    professions: [
      { name: 'Osteopath' },
    ],
  },

  // ── Education ──────────────────────────────────────────────────────────────

  'tra': {
    elementId: 'tra',
    professions: [
      { name: 'School Teacher', jurisdictionNote: 'England' },
    ],
  },

  'gtcs': {
    elementId: 'gtcs',
    professions: [
      { name: 'College Lecturer', jurisdictionNote: 'Scotland' },
      { name: 'School Teacher', jurisdictionNote: 'Scotland' },
    ],
  },

  'gtcni': {
    elementId: 'gtcni',
    professions: [
      { name: 'School Teacher', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'ewc': {
    elementId: 'ewc',
    professions: [
      { name: 'Further Education Teacher', jurisdictionNote: 'Wales' },
      { name: 'School Teacher', jurisdictionNote: 'Wales' },
      { name: 'Youth Support Worker', jurisdictionNote: 'Wales' },
      { name: 'Youth Worker', jurisdictionNote: 'Wales' },
    ],
  },

  // ── Legal ──────────────────────────────────────────────────────────────────

  'faculty-of-advocates': {
    elementId: 'faculty-of-advocates',
    professions: [
      { name: 'Advocate', jurisdictionNote: 'Scotland' },
    ],
  },

  'bar-council-ni': {
    elementId: 'bar-council-ni',
    professions: [
      { name: 'Barrister', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'bsb': {
    elementId: 'bsb',
    professions: [
      { name: 'Barrister', jurisdictionNote: 'England and Wales' },
    ],
    onBehalfOf: 'General Council of the Bar',
  },

  'sra': {
    elementId: 'sra',
    professions: [
      { name: 'Solicitor', jurisdictionNote: 'England and Wales' },
    ],
    onBehalfOf: 'Law Society of England and Wales',
  },

  'law-society-scotland': {
    elementId: 'law-society-scotland',
    professions: [
      { name: 'Conveyancing Practitioner', jurisdictionNote: 'Scotland' },
      { name: 'Executry Practitioner', jurisdictionNote: 'Scotland' },
      { name: 'Notary Public', jurisdictionNote: 'Scotland' },
      { name: 'Solicitor', jurisdictionNote: 'Scotland' },
    ],
  },

  'law-society-ni': {
    elementId: 'law-society-ni',
    professions: [
      { name: 'Solicitor', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'clc': {
    elementId: 'clc',
    professions: [
      { name: 'Licensed Conveyancer', jurisdictionNote: 'England and Wales' },
      { name: 'Licensed Probate Practitioner', jurisdictionNote: 'England and Wales' },
    ],
  },

  'cilex-regulation': {
    elementId: 'cilex-regulation',
    professions: [
      { name: 'Chartered Legal Executive', jurisdictionNote: 'England and Wales' },
      { name: 'CILEx Practitioner', jurisdictionNote: 'England and Wales' },
    ],
    onBehalfOf: 'Chartered Institute of Legal Executives',
  },

  'clsb': {
    elementId: 'clsb',
    professions: [
      { name: 'Costs Lawyer', jurisdictionNote: 'England and Wales' },
    ],
    onBehalfOf: 'Association of Costs Lawyers',
  },

  'ipreg': {
    elementId: 'ipreg',
    professions: [
      { name: 'Patent Attorney' },
      { name: 'Registered Trade Mark Attorney' },
    ],
    onBehalfOf: 'Chartered Institute of Patent Attorneys and Chartered Institute of Trade Mark Attorneys',
  },

  'icaew': {
    elementId: 'icaew',
    professions: [
      { name: 'Administration of Oaths', jurisdictionNote: 'England and Wales' },
      { name: 'Probate Practitioner', jurisdictionNote: 'England and Wales' },
    ],
  },

  'icas': {
    elementId: 'icas',
    professions: [
      { name: 'Probate Practitioner', jurisdictionNote: 'Scotland' },
    ],
  },

  // ── Professional Services ──────────────────────────────────────────────────

  'arb': {
    elementId: 'arb',
    professions: [
      { name: 'Architect' },
    ],
  },

  'insolvency-service': {
    elementId: 'insolvency-service',
    professions: [
      { name: 'Insolvency Practitioner', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'insolvency-service-ni': {
    elementId: 'insolvency-service-ni',
    professions: [
      { name: 'Insolvency Practitioner', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'frc': {
    elementId: 'frc',
    professions: [
      { name: 'Local Public Auditor' },
      { name: 'Statutory Auditor' },
    ],
  },

  // ── Social Care ────────────────────────────────────────────────────────────

  'social-work-england': {
    elementId: 'social-work-england',
    professions: [
      { name: 'Social Worker', jurisdictionNote: 'England' },
    ],
  },

  'social-care-wales': {
    elementId: 'social-care-wales',
    professions: [
      { name: 'Adoption and Fostering Service Manager', jurisdictionNote: 'Wales' },
      { name: 'Adoption and Fostering Service Supervisor', jurisdictionNote: 'Wales' },
      { name: 'Adult Care Home Manager', jurisdictionNote: 'Wales' },
      { name: 'Adult Care Home Worker', jurisdictionNote: 'Wales' },
      { name: 'Adult Day Care Worker', jurisdictionNote: 'Wales' },
      { name: 'Domiciliary Care Manager', jurisdictionNote: 'Wales' },
      { name: 'Domiciliary Care Worker', jurisdictionNote: 'Wales' },
      { name: 'Residential Child Care Worker', jurisdictionNote: 'Wales' },
      { name: 'Residential Family Centre Worker', jurisdictionNote: 'Wales' },
      { name: 'Social Worker', jurisdictionNote: 'Wales' },
      { name: 'Youth Support Worker', jurisdictionNote: 'Wales' },
    ],
  },

  'sssc': {
    elementId: 'sssc',
    professions: [
      { name: 'Care Home Manager', jurisdictionNote: 'Scotland' },
      { name: 'Day Care of Children Worker', jurisdictionNote: 'Scotland' },
      { name: 'Housing Support Worker', jurisdictionNote: 'Scotland' },
      { name: 'Residential Childcare Worker', jurisdictionNote: 'Scotland' },
      { name: 'Social Worker', jurisdictionNote: 'Scotland' },
      { name: 'Support Worker', jurisdictionNote: 'Scotland' },
    ],
  },

  'niscc': {
    elementId: 'niscc',
    professions: [
      { name: 'Day Care Worker', jurisdictionNote: 'Northern Ireland' },
      { name: 'Domiciliary Care Worker', jurisdictionNote: 'Northern Ireland' },
      { name: 'Early Years Worker', jurisdictionNote: 'Northern Ireland' },
      { name: 'Foster Carer', jurisdictionNote: 'Northern Ireland' },
      { name: 'Home Care Worker', jurisdictionNote: 'Northern Ireland' },
      { name: 'Residential Care Worker', jurisdictionNote: 'Northern Ireland' },
      { name: 'Social Worker', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  // ── Transport ──────────────────────────────────────────────────────────────

  'caa': {
    elementId: 'caa',
    professions: [
      { name: 'Air Traffic Controller' },
      { name: 'Aircraft Maintenance Engineer' },
      { name: 'Airline Transport Pilot' },
      { name: 'Cabin Crew' },
      { name: 'Commercial Pilot' },
      { name: 'Flight Information Service Officer' },
      { name: 'Flight Instructor' },
      { name: 'Ground Instructor' },
      { name: 'Parachutist / Parachuting Instructor' },
      { name: 'Private Pilot' },
      { name: 'Remote Pilot (Drone Operator)' },
    ],
  },

  'maritime-coastguard': {
    elementId: 'maritime-coastguard',
    professions: [
      { name: 'Chief Mate' },
      { name: 'Chief Mechanician Watchkeeper' },
      { name: 'Deck Officer' },
      { name: 'Deck Rating' },
      { name: 'Engineer Officer' },
      { name: 'Fishing Vessel Master' },
      { name: 'Marine Engine Operator' },
      { name: 'Officer of the Watch' },
      { name: 'Skipper' },
    ],
  },

  'dvsa': {
    elementId: 'dvsa',
    professions: [
      { name: 'Approved Driving Instructor', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Certified Motorcycle Instructor', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Large Goods Vehicle Driver', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Passenger Carrying Vehicle Driver', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'dva-ni': {
    elementId: 'dva-ni',
    professions: [
      { name: 'Approved Driving Instructor', jurisdictionNote: 'Northern Ireland' },
      { name: 'Approved Motorcycle Instructor', jurisdictionNote: 'Northern Ireland' },
      { name: 'Large Goods Vehicle Driver', jurisdictionNote: 'Northern Ireland' },
      { name: 'Passenger Carrying Vehicle Driver', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'orr': {
    elementId: 'orr',
    professions: [
      { name: 'Train Driver', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'traffic-commissioners': {
    elementId: 'traffic-commissioners',
    professions: [
      { name: 'Transport Manager', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'trinity-house': {
    elementId: 'trinity-house',
    professions: [
      { name: 'Maritime Pilot' },
    ],
  },

  // ── Other ──────────────────────────────────────────────────────────────────

  'sia': {
    elementId: 'sia',
    professions: [
      { name: 'CCTV Operative (Public Space Surveillance)' },
      { name: 'CCTV Operative (Vehicle Immobiliser)' },
      { name: 'Close Protection Operative' },
      { name: 'Door Supervisor' },
      { name: 'Key Holder' },
      { name: 'Security Guard' },
    ],
  },

  'hse': {
    elementId: 'hse',
    professions: [
      { name: 'Explosives Supervisor', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Professional Diver', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Radiation Protection Adviser', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Registered Gas Engineer', jurisdictionNote: 'England, Scotland, Wales' },
      { name: 'Shotfirer', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },

  'hseni': {
    elementId: 'hseni',
    professions: [
      { name: 'Explosives Supervisor', jurisdictionNote: 'Northern Ireland' },
      { name: 'Professional Diver', jurisdictionNote: 'Northern Ireland' },
      { name: 'Radiation Protection Adviser', jurisdictionNote: 'Northern Ireland' },
      { name: 'Registered Gas Engineer', jurisdictionNote: 'Northern Ireland' },
    ],
  },

  'farriers-registration-council': {
    elementId: 'farriers-registration-council',
    professions: [
      { name: 'Farrier' },
    ],
  },

  'rcvs': {
    elementId: 'rcvs',
    professions: [
      { name: 'Registered Veterinary Nurse' },
      { name: 'Veterinary Surgeon' },
    ],
  },

  'fsa': {
    elementId: 'fsa',
    professions: [
      { name: 'Agricultural Analyst', jurisdictionNote: 'England, Wales, Northern Ireland' },
      { name: 'Food Analyst', jurisdictionNote: 'England, Wales, Northern Ireland' },
      { name: 'Meat Hygiene Inspector', jurisdictionNote: 'England, Wales, Northern Ireland' },
      { name: 'Public Analyst', jurisdictionNote: 'England, Wales, Northern Ireland' },
      { name: 'Slaughterer', jurisdictionNote: 'England, Wales, Northern Ireland' },
    ],
  },

  'food-standards-scotland': {
    elementId: 'food-standards-scotland',
    professions: [
      { name: 'Agricultural Analyst', jurisdictionNote: 'Scotland' },
      { name: 'Food Analyst', jurisdictionNote: 'Scotland' },
      { name: 'Meat Hygiene Inspector', jurisdictionNote: 'Scotland' },
      { name: 'Public Analyst', jurisdictionNote: 'Scotland' },
      { name: 'Slaughterer', jurisdictionNote: 'Scotland' },
    ],
    onBehalfOf: 'Scottish Ministers',
  },

  'apha': {
    elementId: 'apha',
    professions: [
      { name: 'Professional Driver / Attendant in Livestock Transport', jurisdictionNote: 'England, Scotland, Wales' },
    ],
  },
}
