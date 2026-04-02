import { useState, useEffect, useRef, useCallback } from 'react'
import OrgChart from './components/OrgChart'
import FullView from './components/FullView'
import ElementDetails from './components/ElementDetails'
import CategoryInfo from './components/CategoryInfo'
import TagInfo from './components/TagInfo'
import SearchPane from './components/SearchPane'
import InfoPane from './components/InfoPane'
import CategoriesPane from './components/CategoriesPane'
import './App.css'

function App() {
  const [selectedElementId, setSelectedElementId] = useState<string | null>('cabinet')
  const [elementPaneVisible, setElementPaneVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{ category: string; subtype: string } | null>(null)
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'focus' | 'full'>('focus')
  const [darkMode, setDarkMode] = useState(false)
  const [searchHighlightIds, setSearchHighlightIds] = useState<string[] | null>(null)

  // Mobile detection — only touch devices, not narrow desktop windows
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px) and (pointer: coarse)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Bottom sheet state: 'closed' | 'partial' | 'full'
  type SheetState = 'closed' | 'partial' | 'full'
  const [sheetState, setSheetState] = useState<SheetState>('closed')

  // Drag gesture state for bottom sheet
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef(0)
  const dragStartTranslate = useRef(0)
  const isDragging = useRef(false)

  const selectElement = useCallback((id: string) => {
    setSelectedElementId(id)
    setElementPaneVisible(true)
    if (isMobile) setSheetState('partial')
  }, [isMobile])

  const closeElementPane = useCallback(() => {
    setElementPaneVisible(false)
    if (isMobile) setSheetState('closed')
    // selectedElementId is kept — chart stays focused on last element
  }, [isMobile])

  // Sheet height helpers
  const getTranslateForState = (state: SheetState): number => {
    if (!sheetRef.current) return 0
    const vh = window.innerHeight
    if (state === 'closed') return vh
    if (state === 'partial') return vh * 0.55   // show 45vh
    return vh * 0.10                             // show 90vh
  }

  // Drag handlers (attached to handle only)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!sheetRef.current) return
    isDragging.current = true
    dragStartY.current = e.clientY
    const currentTranslate = getTranslateForState(sheetState)
    dragStartTranslate.current = currentTranslate
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    // Disable transition during drag
    sheetRef.current.style.transition = 'none'
  }, [sheetState])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return
    const delta = e.clientY - dragStartY.current
    const newTranslate = Math.max(0, dragStartTranslate.current + delta)
    sheetRef.current.style.transform = `translateY(${newTranslate}px)`
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !sheetRef.current) return
    isDragging.current = false
    sheetRef.current.style.transition = ''
    sheetRef.current.style.transform = ''

    const delta = e.clientY - dragStartY.current
    if (delta > 80) {
      // Dragged down — close if partial, go partial if full
      if (sheetState === 'full') setSheetState('partial')
      else closeElementPane()
    } else if (delta < -60 && sheetState === 'partial') {
      // Dragged up from partial — go full
      setSheetState('full')
    }
    // else snap back to current state (CSS transition handles it)
  }, [sheetState, closeElementPane])

  return (
    <div className={`app${darkMode ? ' app-dark' : ''}`}>
      <header className="app-header">
        <div className="app-header-text">
          <h1>Machinery of Government</h1>
          <p>Explore the organisation and relationships within the UK Government · by <a href="https://x.com/Hrushworth" target="_blank" rel="noopener noreferrer">@hrushworth</a></p>
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
              onSelectElement={selectElement}
            />
          </aside>
        )}

        {selectedTagId && (
          <aside className="details-panel category-pane">
            <TagInfo
              tagId={selectedTagId}
              onClose={() => setSelectedTagId(null)}
              onSelectElement={selectElement}
            />
          </aside>
        )}

        {/* Desktop element pane — hidden on mobile (bottom sheet used instead) */}
        {!isMobile && selectedElementId && elementPaneVisible && (
          <aside className="details-panel element-pane">
            <ElementDetails
              elementId={selectedElementId}
              onSelectElement={selectElement}
              onClose={closeElementPane}
              onOpenCategory={(category, subtype) => setSelectedCategory({ category, subtype })}
              onOpenTag={(tagId) => setSelectedTagId(tagId)}
            />
          </aside>
        )}

        <div className="chart-container" style={{ position: 'relative' }}>
          {viewMode === 'focus' ? (
            <OrgChart
              onSelectElement={selectElement}
              selectedElementId={selectedElementId}
              onOpenCategory={(category, subtype) => setSelectedCategory({ category, subtype })}
              darkMode={darkMode}
            />
          ) : (
            <FullView
              onSelectElement={selectElement}
              selectedElementId={selectedElementId}
              darkMode={darkMode}
              highlightIds={searchOpen ? searchHighlightIds : null}
            />
          )}
          <div className="chart-overlay-buttons">
            <button
              className={`view-toggle-btn${viewMode === 'full' ? ' view-toggle-btn-active' : ''}`}
              onClick={() => setViewMode(m => m === 'focus' ? 'full' : 'focus')}
              title={viewMode === 'focus' ? 'Switch to full network view' : 'Switch to focus view'}
              aria-label={viewMode === 'focus' ? 'Full view' : 'Focus view'}
            >
              {viewMode === 'focus' ? '⊞ Full' : '⊡ Focus'}
            </button>
            <button
              className="view-toggle-btn"
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀' : '☾'}
            </button>
          </div>
        </div>

        {searchOpen && (
          <aside className="details-panel search-panel">
            <SearchPane
              onSelectElement={selectElement}
              onClose={() => { setSearchOpen(false); setSearchHighlightIds(null) }}
              onResultsChange={setSearchHighlightIds}
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
              isMobile={isMobile}
            />
          </aside>
        )}
      </div>

      {/* Mobile bottom sheet — rendered outside app-container to avoid overflow:hidden clipping */}
      {isMobile && selectedElementId && (
        <>
          {sheetState !== 'closed' && (
            <div
              className="bottom-sheet-backdrop"
              onClick={closeElementPane}
              aria-hidden="true"
            />
          )}
          <div
            className="bottom-sheet"
            data-state={sheetState}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Element details"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className="bottom-sheet-handle"
              onClick={() => {
                if (sheetState === 'closed') setSheetState('partial')
                else if (sheetState === 'partial') setSheetState('full')
              }}
              aria-label={sheetState === 'partial' ? 'Expand panel' : 'Collapse panel'}
              role="button"
              tabIndex={0}
            />
            <div className="bottom-sheet-content">
              <ElementDetails
                elementId={selectedElementId}
                onSelectElement={selectElement}
                onClose={closeElementPane}
                onOpenCategory={(category, subtype) => setSelectedCategory({ category, subtype })}
                onOpenTag={(tagId) => setSelectedTagId(tagId)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </>
      )}

      {/* Mobile bottom nav bar */}
      {isMobile && (
        <nav className="mobile-bottom-nav" aria-label="Main navigation">
          {selectedElementId && (
            <button
              className={`mobile-nav-tab${elementPaneVisible && sheetState !== 'closed' ? ' mobile-nav-tab-active' : ''}`}
              onClick={() => {
                if (sheetState === 'closed') {
                  setElementPaneVisible(true)
                  setSheetState('partial')
                } else {
                  closeElementPane()
                }
              }}
              aria-label="Selected element"
            >
              <span className="mobile-nav-icon">📋</span>
              <span className="mobile-nav-label">Details</span>
            </button>
          )}
          <button
            className={`mobile-nav-tab${searchOpen ? ' mobile-nav-tab-active' : ''}`}
            onClick={() => { setSearchOpen(o => !o); setInfoOpen(false); setCategoriesOpen(false) }}
            aria-label="Search"
          >
            <span className="mobile-nav-icon">🔍</span>
            <span className="mobile-nav-label">Search</span>
          </button>
          <button
            className={`mobile-nav-tab${categoriesOpen ? ' mobile-nav-tab-active' : ''}`}
            onClick={() => { setCategoriesOpen(o => !o); setSearchOpen(false); setInfoOpen(false) }}
            aria-label="Categories"
          >
            <span className="mobile-nav-icon">🗂️</span>
            <span className="mobile-nav-label">Categories</span>
          </button>
          <button
            className={`mobile-nav-tab${infoOpen ? ' mobile-nav-tab-active' : ''}`}
            onClick={() => { setInfoOpen(o => !o); setSearchOpen(false); setCategoriesOpen(false) }}
            aria-label="Help"
          >
            <span className="mobile-nav-icon">❓</span>
            <span className="mobile-nav-label">Help</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export default App
