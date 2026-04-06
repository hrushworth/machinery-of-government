// ── Budget & Financial Data ───────────────────────────────────────────────────
// Estonian 2025 State Budget data.
// Source: 2025 State Budget Act + 2026 budget explanatory note
// https://www.fin.ee/riigi-rahandus-ja-maksud/riigieelarve-ja-eelarvestrateegia/riigieelarved
//
// All figures in EUR thousands. Figures marked as approximate (~) are from
// budget explanatory notes and government press releases.

export type BudgetUnit = 'thousands' | 'millions'

export interface BudgetLine {
  label: string
  amount: number   // EUR thousands; positive = expenditure
  notes?: string
  elementId?: string
}

export interface Budget {
  financialYear: string
  totalNetExpenditure: number
  totalGrossExpenditure: number
  totalIncome: number
  unit: BudgetUnit
  expenditureLines: BudgetLine[]
  incomeLines: BudgetLine[]
  programmeLines: BudgetLine[]
  programmeIncomeLines: BudgetLine[]
  bodyLines: BudgetLine[]
  bodyIncomeLines: BudgetLine[]
  annualReportUrl?: string | null
  sourceLabel?: string
  notes?: string
}

export interface BudgetProfile {
  elementId: string
  oscarDeptGroupCode?: string | null
  budgets: Budget[]
}

// ── Data ─────────────────────────────────────────────────────────────────────

function makeSimpleBudget(elementId: string, totalExpenditure: number, notes?: string): BudgetProfile {
  return {
    elementId,
    budgets: [{
      financialYear: '2025',
      totalNetExpenditure: totalExpenditure,
      totalGrossExpenditure: totalExpenditure,
      totalIncome: 0,
      unit: 'thousands',
      expenditureLines: [{ label: 'Total expenditure', amount: totalExpenditure }],
      incomeLines: [],
      programmeLines: [],
      programmeIncomeLines: [],
      bodyLines: [],
      bodyIncomeLines: [],
      sourceLabel: '2025 State Budget Act',
      notes: notes ?? 'Source: 2025 riigieelarve seadus. Approximate figures from budget explanatory note.',
    }],
  }
}

export const budgetProfiles: Record<string, BudgetProfile> = {
  // Ministry of Social Affairs — largest (~EUR 7.5B, 41% of total)
  'ministry_social': makeSimpleBudget('ministry_social', 7500000, 'Includes pass-through transfers: pensions (~EUR 2.9B), Tervisekassa health insurance (~EUR 2.3B), family benefits (~EUR 0.8B).'),

  // Ministry of Education and Research
  'ministry_education': makeSimpleBudget('ministry_education', 1195212, 'Includes higher education, school transition to Estonian.'),

  // Ministry of Defence
  'ministry_defence': makeSimpleBudget('ministry_defence', 1300000, '3.3% of GDP. Rises to 5% GDP in 2026 (+EUR 844.5M).'),

  // Ministry of Climate (Environment and Energetics)
  'ministry_climate': makeSimpleBudget('ministry_climate', 900000, 'Includes Rail Baltica, roads, energy, environment.'),

  // Ministry of the Interior
  'ministry_interior': makeSimpleBudget('ministry_interior', 700000, 'Police, border guard, rescue, KAPO.'),

  // Ministry of Economic Affairs
  'ministry_economy': makeSimpleBudget('ministry_economy', 600000, 'Includes transport, innovation, labour.'),

  // Ministry of Finance
  'ministry_finance': makeSimpleBudget('ministry_finance', 487000, '58% financial costs, 21% labour, 8% admin.'),

  // Ministry of Regional Affairs and Agriculture
  'ministry_regional_agriculture': makeSimpleBudget('ministry_regional_agriculture', 450000, 'EU agricultural subsidies, rural development.'),

  // Ministry of Justice and Digital Affairs
  'ministry_justice_digital': makeSimpleBudget('ministry_justice_digital', 350000, 'Courts, prisons, prosecution, RIA, digital.'),

  // Ministry of Culture
  'ministry_culture': makeSimpleBudget('ministry_culture', 300000, 'Culture, sport, heritage, media.'),

  // Ministry of Foreign Affairs
  'ministry_foreign': makeSimpleBudget('ministry_foreign', 200000, 'Diplomacy, embassies, development aid.'),

  // Government Office (Riigikantselei)
  'riigikantselei': makeSimpleBudget('riigikantselei', 26978, 'PM office, strategy, EU coordination.'),

  // Chancellery of the Riigikogu
  'riigikogu_chancellery': makeSimpleBudget('riigikogu_chancellery', 32461, 'Parliament operations.'),

  // Supreme Court
  'riigikohus': makeSimpleBudget('riigikohus', 6907, 'Court operations (Tartu).'),

  // National Audit Office
  'riigikontroll': makeSimpleBudget('riigikontroll', 6560, 'Audit institution.'),

  // Office of the President
  'office_of_president': makeSimpleBudget('office_of_president', 7064, 'Presidential office.'),

  // Office of the Chancellor of Justice
  'oiguskantsleri_kantselei': makeSimpleBudget('oiguskantsleri_kantselei', 3726, 'Ombudsman / constitutional review.'),
}
