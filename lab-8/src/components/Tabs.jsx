import { createContext, use, useId, useState } from 'react'

const TabsContext = createContext(null)

function useTabsContext() {
  const context = use(TabsContext)
  if (!context) {
    throw new Error('Tabs compound components must be used inside <Tabs>')
  }
  return context
}

export default function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const baseId = useId()

  return (
    <div className="tabs">
      <TabsContext value={{ activeTab, setActiveTab, baseId }}>
        {children}
      </TabsContext>
    </div>
  )
}

Tabs.List = function TabsList({ children, onKeyDown, ...props }) {
  function handleKeyDown(event) {
    onKeyDown?.(event)

    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const tabs = Array.from(
      event.currentTarget.querySelectorAll('[role="tab"]'),
    )
    const currentIndex = tabs.indexOf(document.activeElement)
    if (currentIndex === -1) return

    event.preventDefault()

    let nextIndex = currentIndex
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const nextTab = tabs[nextIndex]
    nextTab.focus()
    nextTab.click()
  }

  return (
    <div
      role="tablist"
      className="tab-list"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

Tabs.Tab = function TabsTab({ value, children }) {
  const { activeTab, setActiveTab, baseId } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ value, children }) {
  const { activeTab, baseId } = useTabsContext()

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={activeTab !== value}
    >
      {children}
    </div>
  )
}
