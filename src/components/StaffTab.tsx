import { useState } from 'react'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import type { StaffProfile } from '../data/staffing'
import './StaffTab.css'

interface StaffTabProps {
  staffProfile: StaffProfile | undefined
  onSelectElement?: (id: string) => void
}

type View = 'grade' | 'org'

const GRADE_COLOURS: Record<string, string> = {
  scs:   '#8e44ad',
  g67:   '#2980b9',
  sheo:  '#27ae60',
  eo:    '#e67e22',
  aaao:  '#c0392b',
  other: '#7f8c8d',
}

const GRADE_LABELS: Record<string, string> = {
  scs:   'Senior Civil Service',
  g67:   'Grade 6 / 7',
  sheo:  'SEO / HEO',
  eo:    'Executive Officer',
  aaao:  'AA / AO',
  other: 'Unreported Grade',
}

const ORG_COLOURS = [
  '#2980b9', '#27ae60', '#e67e22', '#8e44ad', '#c0392b',
  '#16a085', '#d35400', '#2c3e50', '#f39c12', '#1abc9c', '#e91e63',
]

function formatHeadcount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}

interface PieEntry { name: string; value: number; fill: string; elementId?: string }

export default function StaffTab({ staffProfile, onSelectElement }: StaffTabProps) {
  const [view, setView] = useState<View>('grade')

  if (!staffProfile) {
    return (
      <div className="tab-empty">
        <p>No staffing data has been recorded for this organisation yet.</p>
      </div>
    )
  }

  const { grades, orgs, year } = staffProfile

  // ── Grade pie data ──────────────────────────────────────────────────────
  const gradeKeys: (keyof typeof GRADE_LABELS)[] = ['scs', 'g67', 'sheo', 'eo', 'aaao', 'other']
  const gradePieData: PieEntry[] = gradeKeys
    .filter(k => grades[k as keyof typeof grades] > 0)
    .map(k => ({
      name: GRADE_LABELS[k],
      value: grades[k as keyof typeof grades] as number,
      fill: GRADE_COLOURS[k],
    }))

  // ── Org pie data ────────────────────────────────────────────────────────
  const orgPieData: PieEntry[] = orgs.map((org, i) => ({
    name: org.label,
    value: org.grades.total,
    fill: ORG_COLOURS[i % ORG_COLOURS.length],
    elementId: org.orgId || undefined,
  })).filter(e => e.value > 0)

  // Fall back to grade view if org view has no data (e.g. sub-org with no children)
  const effectiveView: View = (view === 'org' && orgs.length === 0) ? 'grade' : view
  const activePieData = effectiveView === 'grade' ? gradePieData : orgPieData

  const renderTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const { name, value } = payload[0]
    const pct = ((value / grades.total) * 100).toFixed(1)
    return (
      <div className="staff-tooltip">
        <div className="staff-tooltip-label">{name}</div>
        <div className="staff-tooltip-value">{value.toLocaleString()} ({pct}%)</div>
      </div>
    )
  }

  return (
    <div className="staff-tab">
      {/* Summary */}
      <div className="staff-summary">
        <div className="staff-summary-year">Civil Service Statistics — {year}</div>
        <div className="staff-summary-total">
          <span className="staff-total-value">{grades.total.toLocaleString()}</span>
          <span className="staff-total-label"> civil servants (headcount)</span>
        </div>
      </div>

      {/* View switcher — only show if there are sub-orgs */}
      {orgs.length > 0 && (
        <div className="breakdown-bar">
          <button
            className={`breakdown-btn${effectiveView === 'grade' ? ' breakdown-btn-active' : ''}`}
            onClick={() => setView('grade')}
          >
            By Grade
          </button>
          <button
            className={`breakdown-btn${effectiveView === 'org' ? ' breakdown-btn-active' : ''}`}
            onClick={() => setView('org')}
          >
            By Organisation
          </button>
        </div>
      )}

      {/* Pie chart */}
      <div className="staff-chart-section">
        <div className="budget-section-label">
          {effectiveView === 'grade' ? 'Breakdown by grade' : 'Breakdown by organisation'}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={activePieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              onClick={(data: any) => data?.elementId && onSelectElement?.(data.elementId)}
              style={{ cursor: effectiveView === 'org' ? 'pointer' : 'default' }}
            />
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend table */}
        <table className="staff-breakdown-table">
          <tbody>
            {activePieData.map(entry => (
              <tr key={entry.name}>
                <td className="bbt-swatch">
                  <span className="bbt-dot" style={{ backgroundColor: entry.fill }} />
                </td>
                <td className="bbt-label">{entry.name}</td>
                <td className="bbt-amount">{entry.value.toLocaleString()}</td>
                <td className="bbt-pct">{((entry.value / grades.total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Org detail table — visible in grade view too, showing each sub-org's grade breakdown */}
      {orgs.length > 0 && effectiveView === 'grade' && (
        <div className="staff-chart-section">
          <div className="budget-section-label">Grade breakdown by organisation</div>
          <table className="staff-org-table">
            <thead>
              <tr>
                <th className="sot-org">Organisation</th>
                <th className="sot-num">Total</th>
                <th className="sot-num">SCS</th>
                <th className="sot-num">G6/7</th>
                <th className="sot-num">SEO/HEO</th>
                <th className="sot-num">EO</th>
                <th className="sot-num">AA/AO</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map(org => (
                <tr
                  key={org.label}
                  className={org.orgId && onSelectElement ? 'sot-row-clickable' : ''}
                  onClick={() => org.orgId && onSelectElement && onSelectElement(org.orgId)}
                >
                  <td className="sot-org">{org.label}</td>
                  <td className="sot-num sot-total">{formatHeadcount(org.grades.total)}</td>
                  <td className="sot-num">{org.grades.scs || '–'}</td>
                  <td className="sot-num">{formatHeadcount(org.grades.g67)}</td>
                  <td className="sot-num">{formatHeadcount(org.grades.sheo)}</td>
                  <td className="sot-num">{org.grades.eo ? formatHeadcount(org.grades.eo) : '–'}</td>
                  <td className="sot-num">{org.grades.aaao ? formatHeadcount(org.grades.aaao) : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="staff-footer">
        <a
          className="staff-source-link"
          href="https://www.gov.uk/government/statistics/civil-service-statistics-2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          Civil Service Statistics 2025 ↗
        </a>
        <p className="staff-notes">
          Headcount as at 31 March 2025. Figures rounded to nearest 5.
          Cells with fewer than 5 staff are suppressed (shown as 0).
          'Other' grade includes unclassified and unreported grades.
        </p>
        <p className="staff-ogl">
          Contains public sector information licensed under the{' '}
          <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">
            Open Government Licence v3.0
          </a>
        </p>
      </div>
    </div>
  )
}
