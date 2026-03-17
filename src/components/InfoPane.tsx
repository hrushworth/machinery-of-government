import './InfoPane.css'

interface InfoPaneProps {
  onClose: () => void
}

export default function InfoPane({ onClose }: InfoPaneProps) {
  return (
    <div className="info-pane">
      <div className="info-pane-header">
        <h2>About this application</h2>
        <button className="close-button-header" onClick={onClose} aria-label="Close info panel">✕</button>
      </div>

      <p className="info-intro">
        <strong>Machinery of Government</strong> is an interactive map of UK central government — showing
        how departments, ministers, agencies, public bodies, and other organisations relate to and
        oversee one another.
      </p>

      <section className="info-section">
        <h3>How to navigate</h3>
        <dl className="info-controls">
          <dt>Select an element</dt>
          <dd>Click any node on the chart. The element pane opens on the left with details, relationships, and tabs for Powers, Budget, and Staff.</dd>

          <dt>Navigate relationships</dt>
          <dd>Click any parent or child entry in the element pane to jump to that element and re-centre the chart around it.</dd>

          <dt>Pan the chart</dt>
          <dd>Click and drag on the background.</dd>

          <dt>Zoom</dt>
          <dd>Scroll wheel, or pinch on a trackpad.</dd>

          <dt>Search</dt>
          <dd>Click <strong>Search</strong> in the header to open a search panel. You can search by name or filter by one or more tags.</dd>

          <dt>Browse by category</dt>
          <dd>Click the category badge (e.g. "Ministerial Department") on any element to see all elements of that type.</dd>

          <dt>Browse by tag</dt>
          <dd>Click a tag pill (e.g. "Regulator" or "Health") on any element to see all organisations sharing that tag.</dd>
        </dl>
      </section>

      <section className="info-section">
        <h3>Element detail tabs</h3>
        <dl className="info-controls">
          <dt>Info</dt>
          <dd>Description, role, current holder, tags, and all parent / child relationships.</dd>

          <dt>Powers</dt>
          <dd>Powers, duties, functions, and responsibilities — with the underpinning legislation, statutory instrument, prerogative, case law, or constitutional convention, and a link to the source text on legislation.gov.uk where available. Shown where data has been entered.</dd>

          <dt>Budget</dt>
          <dd>2024–25 final outturn spending from HM Treasury OSCAR data — net and gross expenditure, income, DEL/AME split, and a breakdown by economic type, programme, or arm's-length body (where available). Links to the body's annual report collection on GOV.UK.</dd>

          <dt>Staff</dt>
          <dd>Civil Service headcount as at 31 March 2025 from the Cabinet Office Civil Service Statistics. Shows a grade breakdown (SCS, Grade 6/7, SEO/HEO, EO, AA/AO) and, for departments, a breakdown by sub-organisation. Clicking a sub-organisation row navigates to that element.</dd>
        </dl>
      </section>

      <section className="info-section">
        <h3>Classification</h3>
        <p>Every element has a <strong>category</strong> and <strong>subtype</strong>:</p>
        <table className="info-table">
          <thead>
            <tr><th>Category</th><th>Subtypes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Official</td>
              <td>Prime Minister, Cabinet Minister, Junior Minister, Civil Servant, Independent Official</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>Ministerial Department, Non-Ministerial Department, Executive Agency, Division / Directorate</td>
            </tr>
            <tr>
              <td>Body</td>
              <td>Executive NDPB, Advisory NDPB, Public Corporation, Royal Charter Body, Tribunal, Other Body</td>
            </tr>
            <tr>
              <td>Group</td>
              <td>Cabinet, Other Group</td>
            </tr>
          </tbody>
        </table>
        <p className="info-note">
          Elements also carry <strong>type tags</strong> (e.g. Regulator, Tribunal, NHS Body) and
          <strong> sector tags</strong> (e.g. Health, Defence, Digital / Technology) for cross-cutting
          search and filtering.
        </p>
      </section>

      <section className="info-section">
        <h3>Budget data</h3>
        <p>
          Budget figures are drawn from HM Treasury's{' '}
          <a href="https://www.gov.uk/government/publications/oscar-publications" target="_blank" rel="noopener noreferrer">
            OSCAR (Online System for Central Accounting and Reporting)
          </a>{' '}
          2024–25 final outturn dataset. Figures are in £ thousands and represent actual spend
          for the full financial year. Negative values represent income or receipts.
        </p>
        <dl className="info-controls">
          <dt>DEL (Departmental Expenditure Limit)</dt>
          <dd>Day-to-day spending within fixed limits set at Spending Reviews. Split into Admin DEL (running costs) and Programme DEL (frontline delivery).</dd>

          <dt>AME (Annually Managed Expenditure)</dt>
          <dd>Demand-driven spending outside fixed limits — primarily benefits, pensions, and debt interest.</dd>

          <dt>Income</dt>
          <dd>Some departments receive income that offsets their gross expenditure — for example, fee-funded bodies such as Companies House, DVLA, and the Intellectual Property Office charge for their services; departments running shared services (e.g. Cabinet Office, FCDO) receive income from other government bodies; and some departments historically received EU or international reimbursements. Where material income exists, the chart section shows an <em>Expenditure / Income</em> toggle so both can be explored.</dd>
        </dl>
      </section>

      <section className="info-section">
        <h3>Data coverage</h3>
        <ul className="info-list">
          <li>All Cabinet ministers with current role holders</li>
          <li>All junior ministers across every department</li>
          <li>Permanent Secretaries for all major departments</li>
          <li>All 20+ ministerial departments and non-ministerial departments</li>
          <li>40+ executive agencies</li>
          <li>100+ executive and advisory NDPBs</li>
          <li>Tribunals, ombudsmen, regulators, and public corporations</li>
          <li>Government professions and cross-cutting Cabinet Office functions</li>
          <li>Budget data for 37 department groups (2024–25 outturn)</li>
          <li>Staff headcount for all ministerial and non-ministerial departments and their agencies (31 March 2025)</li>
          <li>Powers and legislation data for selected high-profile elements</li>
        </ul>
        <p className="info-note">
          Data reflects the UK government structure as of early 2025. Role holders and
          organisational structures change frequently; always verify against{' '}
          <a href="https://www.gov.uk/government/organisations" target="_blank" rel="noopener noreferrer">GOV.UK</a>{' '}
          for the most current position.
        </p>
      </section>

      <section className="info-section">
        <h3>Limitations</h3>
        <ul className="info-list">
          <li>Powers and legislation data is currently only entered for a small number of high-profile elements.</li>
          <li>Budget data covers department-level groups; individual agencies and NDPBs do not yet have their own budget entries unless they appear as a separate OSCAR organisation.</li>
          <li>OSCAR body-level spend figures aggregate all transactions attributed to an organisation code and may differ from figures in individual annual reports.</li>
          <li>The chart shows up to two levels of children and all ancestors for any selected element; deeper relationships are accessible by navigating through the chart.</li>
        </ul>
      </section>

      <footer className="info-footer">
        <p className="info-copyright">© MMXXV Harry C. Rushworth. All rights reserved.</p>
        <p className="info-ogl">
          Contains public sector information licensed under the{' '}
          <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank" rel="noopener noreferrer">
            Open Government Licence v3.0
          </a>
          , including HM Treasury OSCAR data and Cabinet Office Civil Service Statistics.
        </p>
      </footer>
    </div>
  )
}
