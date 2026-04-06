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
        <strong>Machinery of Government — Estonia</strong> is an interactive map of Estonian central government — showing
        how ministries, ministers, agencies, constitutional bodies, and other organisations relate to and
        oversee one another.
      </p>

      <section className="info-section">
        <h3>Views</h3>
        <dl className="info-controls">
          <dt>Full view</dt>
          <dd>The default view. Shows every element in the network simultaneously, arranged in concentric rings by constitutional distance from the Prime Minister. Hover any node to see its name in a tooltip beside the cursor. Click to select an element — it is highlighted with an amber border and its name is shown as a label. Click <strong>⊡ Focus</strong> in the chart toolbar to switch to focus view.</dd>

          <dt>Focus view</dt>
          <dd>Shows the selected element at the centre, with its parents, grandparents, children, and grandchildren arranged radially. Click any node to re-focus the chart on it. Click <strong>⊞ Full</strong> to return to full view.</dd>

          <dt>Dark / Light mode</dt>
          <dd>Toggle between light and dark appearances using the <strong>☾</strong> / <strong>☀</strong> button in the chart toolbar.</dd>

          <dt>Legend</dt>
          <dd>Click <strong>☰ Legend</strong> in the chart toolbar to show or hide the key. The legend is visible on desktop only; on mobile, use <strong>Categories</strong> in the navigation bar instead.</dd>
        </dl>
      </section>

      <section className="info-section">
        <h3>How to navigate</h3>
        <dl className="info-controls">
          <dt>Select an element</dt>
          <dd>Click any node on the chart. On desktop, the element pane opens with details, relationships, and tabs for Powers, Budget, and Staff. On mobile, the element's name and type appear in a bar at the bottom — tap <strong>Select</strong> to update the chart, then <strong>Details →</strong> to open the full pane.</dd>

          <dt>Random element</dt>
          <dd>Click the <strong>⚄</strong> button (top-right of the chart) to jump to a randomly selected element.</dd>

          <dt>Navigate relationships</dt>
          <dd>Click any parent or child entry in the element pane to jump to that element and re-centre the chart around it.</dd>

          <dt>Pan the chart</dt>
          <dd>Click and drag on the background.</dd>

          <dt>Zoom</dt>
          <dd>Scroll wheel, or pinch on a trackpad / touchscreen.</dd>

          <dt>Reset / re-centre</dt>
          <dd>Click the <strong>↺</strong> button (top-right of the chart) to reset the layout, re-centre on the PM, and clear the current selection.</dd>

          <dt>Search</dt>
          <dd>Click <strong>Search</strong> in the header to open a search panel. Search by name, or filter by one or more tags. In full view, matching elements are highlighted across the whole network.</dd>

          <dt>Browse by category</dt>
          <dd>Click the category badge (e.g. "Ministry") on any element to see all elements of that type.</dd>

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
          <dd>Powers, duties, functions, and responsibilities — with references to the Constitution of the Republic of Estonia and other legislation, linked to Riigi Teataja where available.</dd>

          <dt>Budget</dt>
          <dd>2025 State Budget expenditure by governance area. Figures are in EUR thousands. Source: 2025 State Budget Act and 2026 budget explanatory note from the Ministry of Finance.</dd>

          <dt>Staff</dt>
          <dd>Approximate headcount by governance area, from the Public Service Yearbook 2023 and salary surveys published by the Ministry of Finance.</dd>
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
              <td>Prime Minister, Cabinet Minister, Head of State, Independent Official, Civil Servant</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>Ministry, Government Office / Chancellery, Portfolio</td>
            </tr>
            <tr>
              <td>Body</td>
              <td>Constitutional Body, Executive Agency, Regulator, Public Law Body, Security Agency, Military, State Enterprise, Public Corporation, Training Institution, Research Institute, Inspectorate</td>
            </tr>
            <tr>
              <td>Group</td>
              <td>Cabinet</td>
            </tr>
          </tbody>
        </table>
        <p className="info-note">
          Elements also carry <strong>type tags</strong> (e.g. Regulator, Inspectorate, Police) and
          <strong> sector tags</strong> (e.g. Health, Defence, Digital) for cross-cutting search and filtering.
        </p>
      </section>

      <section className="info-section">
        <h3>Budget data</h3>
        <p>
          Budget figures are from the{' '}
          <a href="https://www.fin.ee/riigi-rahandus-ja-maksud/riigieelarve-ja-eelarvestrateegia/riigieelarved" target="_blank" rel="noopener noreferrer">
            2025 State Budget Act
          </a>{' '}
          and the 2026 budget explanatory note published by the Ministry of Finance.
          Total revenue: EUR 17.7 billion. Total expenditure: EUR 18.2 billion.
          Military defence: 3.3% of GDP.
        </p>
      </section>

      <section className="info-section">
        <h3>Data coverage</h3>
        <ul className="info-list">
          <li>The Prime Minister and all 12 cabinet ministers (54th Government)</li>
          <li>Constitutional officials: President, Speaker, Chief Justice, Chancellor of Justice, Auditor General, Bank of Estonia Governor</li>
          <li>All 11 ministries and the Government Office (Riigikantselei)</li>
          <li>30+ executive agencies, regulators, and other bodies</li>
          <li>Constitutional bodies: Riigikogu, Supreme Court, National Audit Office, Bank of Estonia</li>
          <li>Powers and legislation data for key officials and the cabinet</li>
          <li>Budget data for all governance areas (2025 State Budget)</li>
          <li>Approximate staffing data by governance area</li>
        </ul>
        <p className="info-note">
          Data reflects the Estonian government structure as of March 2025 (54th Government, post-coalition reshuffle).
          Always verify against{' '}
          <a href="https://valitsus.ee" target="_blank" rel="noopener noreferrer">valitsus.ee</a>{' '}
          and{' '}
          <a href="https://www.riigiteataja.ee" target="_blank" rel="noopener noreferrer">Riigi Teataja</a>{' '}
          for the most current position.
        </p>
      </section>

      <section className="info-section">
        <h3>Data sources</h3>
        <ul className="info-list">
          <li><a href="https://valitsus.ee" target="_blank" rel="noopener noreferrer">valitsus.ee</a> — Government of Estonia</li>
          <li><a href="https://www.riigiteataja.ee" target="_blank" rel="noopener noreferrer">riigiteataja.ee</a> — Riigi Teataja (State Gazette / legislation)</li>
          <li><a href="https://www.fin.ee" target="_blank" rel="noopener noreferrer">fin.ee</a> — Ministry of Finance (budget, civil service data)</li>
          <li><a href="https://www.stat.ee" target="_blank" rel="noopener noreferrer">stat.ee</a> — Statistics Estonia</li>
          <li><a href="https://avaandmed.eesti.ee" target="_blank" rel="noopener noreferrer">avaandmed.eesti.ee</a> — Estonian Open Data portal</li>
        </ul>
      </section>

      <section className="info-section">
        <h3>Disclaimer</h3>
        <p className="info-disclaimer">
          The information in this application is provided for general reference purposes only. While every effort has been made to ensure accuracy, the data may be incomplete, incorrect, or out of date. Government structures, ministerial appointments, and organisational relationships change frequently. Always verify against official sources such as{' '}
          <a href="https://valitsus.ee" target="_blank" rel="noopener noreferrer">valitsus.ee</a>{' '}
          and{' '}
          <a href="https://www.riigiteataja.ee" target="_blank" rel="noopener noreferrer">Riigi Teataja</a>.
        </p>
      </section>

      <footer className="info-footer">
        <p className="info-ogl">
          Adapted from the UK Machinery of Government project. Contains public sector information from Estonian government sources.
        </p>
      </footer>
    </div>
  )
}
