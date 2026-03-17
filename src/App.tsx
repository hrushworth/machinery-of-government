import { useState } from 'react'
import OrgChart from './components/OrgChart'
import ElementDetails from './components/ElementDetails'
import CategoryInfo from './components/CategoryInfo'
import TagInfo from './components/TagInfo'
import SearchPane from './components/SearchPane'
import InfoPane from './components/InfoPane'
import CategoriesPane from './components/CategoriesPane'
import './App.css'

function App() {
  const [selectedElementId, setSelectedElementId] = useState<string | null>('cabinet')
  const [selectedCategory, setSelectedCategory] = useState<{ category: string; subtype: string } | null>(null)
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-text">
          <h1>Machinery of Government</h1>
          <p>Explore the organisation and relationships within the UK Government</p>
        </div>
        <div className="header-buttons">
          <button
            className="header-button"
            onClick={() => { setInfoOpen(o => !o); setSearchOpen(false); setCategoriesOpen(false) }}
            aria-label="Toggle info panel"
            aria-pressed={infoOpen}
          >
            ? Help
          </button>
          <button
            className="header-button"
            onClick={() => { setCategoriesOpen(o => !o); setSearchOpen(false); setInfoOpen(false) }}
            aria-label="Toggle categories"
            aria-pressed={categoriesOpen}
          >
            🗂️ Categories
          </button>
          <button
            className="header-button"
            onClick={() => { setSearchOpen(o => !o); setInfoOpen(false); setCategoriesOpen(false) }}
            aria-label="Toggle search"
            aria-pressed={searchOpen}
          >
            🔍 Search
          </button>
        </div>
      </header>

      <div className="app-container">
        {selectedCategory && (
          <aside className="details-panel category-pane">
            <CategoryInfo
              category={selectedCategory.category}
              subtype={selectedCategory.subtype}
              onClose={() => setSelectedCategory(null)}
              onSelectElement={(id) => {
                setSelectedElementId(id)
              }}
            />
          </aside>
        )}

        {selectedTagId && (
          <aside className="details-panel category-pane">
            <TagInfo
              tagId={selectedTagId}
              onClose={() => setSelectedTagId(null)}
              onSelectElement={(id) => setSelectedElementId(id)}
            />
          </aside>
        )}

        {selectedElementId && (
          <aside className="details-panel element-pane">
            <ElementDetails
              elementId={selectedElementId}
              onSelectElement={(newId) => {
                setSelectedElementId(newId)
              }}
              onClose={() => setSelectedElementId(null)}
              onOpenCategory={(category, subtype) => setSelectedCategory({ category, subtype })}
              onOpenTag={(tagId) => setSelectedTagId(tagId)}
            />
          </aside>
        )}

        <div className="chart-container">
          <OrgChart
            onSelectElement={setSelectedElementId}
            selectedElementId={selectedElementId}
            onOpenCategory={(category, subtype) => setSelectedCategory({ category, subtype })}
          />
        </div>

        {searchOpen && (
          <aside className="details-panel search-panel">
            <SearchPane
              onSelectElement={(id) => {
                setSelectedElementId(id)
              }}
              onClose={() => setSearchOpen(false)}
            />
          </aside>
        )}

        {infoOpen && (
          <aside className="details-panel info-panel">
            <InfoPane onClose={() => setInfoOpen(false)} />
          </aside>
        )}

        {categoriesOpen && (
          <aside className="details-panel search-panel">
            <CategoriesPane
              onOpenCategory={(category, subtype) => {
                setSelectedCategory({ category, subtype })
                setCategoriesOpen(false)
              }}
              onClose={() => setCategoriesOpen(false)}
            />
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
