interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: 'dashboard' },
    { id: 'api-generator', label: 'GENERATE', icon: 'auto_awesome' },
    { id: 'projects', label: 'PROJECTS', icon: 'folder_open' },
    { id: 'settings', label: 'SETTINGS', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe glass border-t border-white/5">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors cursor-pointer ${
                isActive ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#dae2fd]'
              }`}
            >
              <span className={`material-symbols-outlined transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="font-['Inter'] text-[11px] font-semibold tracking-wider">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#c0c1ff] shadow-[0_0_8px_#c0c1ff]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
