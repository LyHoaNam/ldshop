import { useState, type ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabPanelProps {
  tabs: Tab[];
  initialIndex?: number;
}

export function TabPanel({ tabs, initialIndex = 0 }: TabPanelProps) {
  const [active, setActive] = useState(initialIndex);

  return (
    <>
      <div className="section-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`section-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-pane active">{tabs[active].content}</div>
    </>
  );
}
