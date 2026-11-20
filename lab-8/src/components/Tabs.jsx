import { createContext, use, useState } from 'react'

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

  return (
    <div className="tabs">
      <TabsContext value={{ activeTab, setActiveTab }}>{children}</TabsContext>
    </div>
  )
}

Tabs.List = function TabsList({ children, ...props }) {
  return (
    <div className="tab-list" {...props}>
      {children}
    </div>
  )
}

Tabs.Tab = function TabsTab({ value, children }) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      type="button"
      className={isActive ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = function TabsPanel({ value, children }) {
  const { activeTab } = useTabsContext()

  return <div hidden={activeTab !== value}>{children}</div>
}
