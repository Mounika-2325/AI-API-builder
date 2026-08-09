import { useState } from 'react';
import Logo from './Logo';

interface HeaderProps {
  currentTab: string;
  onSearchClick?: () => void;
  onNewProjectClick?: () => void;
}

export default function Header({ currentTab, onSearchClick, onNewProjectClick }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    'api-generator': 'Api Generator',
    settings: 'Documentation',
  };

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo className="h-8" />
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <span className="font-semibold text-lg text-[#c0c1ff] tracking-tight hidden sm:block">
            {titleMap[currentTab] || 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onNewProjectClick && (
            <button 
              onClick={onNewProjectClick}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/20 text-xs font-semibold hover:bg-[#c0c1ff]/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Project
            </button>
          )}

          <button 
            onClick={onSearchClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-white/5 transition-colors cursor-pointer"
            title="Search"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-[#c0c1ff] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#c0c1ff]/50 transition-all"
              title="Developer Profile"
            >
              <span className="material-symbols-outlined text-[#1000a9] text-[18px]">person</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#171f33] border border-white/10 rounded-xl shadow-xl py-2 z-50 glass">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-[#dae2fd]">Developer Account</p>
                  <p className="text-[11px] text-[#c7c4d7] truncate">msunkari894@gmail.com</p>
                </div>
                <div className="py-1">
                  <div className="px-4 py-1.5 text-xs text-[#4edea3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                    PRO Plan • 99.99% Uptime
                  </div>
                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs text-[#c7c4d7] hover:bg-white/5 hover:text-[#dae2fd] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">key</span>
                    API Keys & Tokens
                  </button>
                  <button 
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs text-[#c7c4d7] hover:bg-white/5 hover:text-[#dae2fd] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    Engine Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
