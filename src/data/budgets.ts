// ── Budget & Financial Data ───────────────────────────────────────────────────
// Data is sourced from HM Treasury OSCAR Final Outturn and pre-processed by
// scripts/extract-oscar.mjs into budgets-oscar.json.
//
// To refresh for a new financial year:
//   1. Download the new OSCAR BUD_xx-xx.xlsx from assets.publishing.service.gov.uk
//   2. Update the filename in extract-oscar.mjs
//   3. Run: node scripts/extract-oscar.mjs

import oscarData from './budgets-oscar.json'

export type BudgetUnit = 'thousands' | 'millions'

export interface BudgetLine {
  label: string
  amount: number   // £ thousands; positive = expenditure, negative = income/receipt
  notes?: string
  elementId?: string  // element ID to navigate to when the slice is clicked
}

export interface Budget {
  financialYear: string
  // All figures in £ thousands (matching OSCAR source data)
  totalNetExpenditure: number
  totalGrossExpenditure: number
  totalIncome: number          // sum of income lines — stored as negative
  unit: BudgetUnit
  // DEL / AME split (£ thousands)
  delAdmin?: number
  delProg?: number
  deptAme?: number
  nonDeptAme?: number
  // By economic type (Pay, Goods & Services, Capital, etc.)
  expenditureLines: BudgetLine[]
  incomeLines: BudgetLine[]
  // By named programme / Estimates row (e.g. "State Pension", "Universal Credit")
  programmeLines: BudgetLine[]
  programmeIncomeLines: BudgetLine[]
  // By arm's length body / agency
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

// ── Data — loaded from pre-processed OSCAR JSON ───────────────────────────────
export const budgetProfiles: Record<string, BudgetProfile> = oscarData as Record<string, BudgetProfile>
