import React, { useState } from 'react';
import {
  Search,
  Settings,
  PanelLeft,
  PanelBottom,
  PanelRight,
  Minus,
  Square,
  X,
  Sparkles,
  Bot,
  Zap,
  ChevronDown
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface HeaderProps {
  onOpenGitHubModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  const {
    activeFile,
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isRightAssistantOpen,
    setIsRightAssistantOpen,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    user,
    credits,
    activeMainTab,
    setActiveMainTab,
    selectedModel,
    setSelectedModel
  } = useWorkspace();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    { label: 'File', items: ['New File (Ctrl+N)', 'Open File (Ctrl+O)', 'Save (Ctrl+S)', 'Export Project (ZIP)', 'Close Editor'] },
    { label: 'Edit', items: ['Undo (Ctrl+Z)', 'Redo (Ctrl+Y)', 'Cut', 'Copy', 'Paste', 'Find (Ctrl+F)'] },
    { label: 'Selection', items: ['Select All (Ctrl+A)', 'Expand Selection', 'Shrink Selection', 'Add Cursor Above', 'Add Cursor Below'] },
    { label: 'View', items: ['Explorer', 'Search', 'Source Control', 'Multi-Agent Swarm', 'Database Studio', 'Live Sandbox', 'Terminal'] },
    { label: 'Go', items: ['Go to File... (Ctrl+P)', 'Go to Symbol...', 'Go to Line...'] },
    { label: 'Run', items: ['Start Debugging (F5)', 'Run Without Debugging', 'Build Fullstack Application', 'Run Unit Tests'] },
    { label: 'Terminal', items: ['New Terminal (Ctrl+`)', 'Split Terminal', 'Run Active Task', 'Clear Logs'] },
    { label: 'Help', items: ['Welcome', 'Documentation', 'Keyboard Shortcuts', 'About Antigravity IDE'] }
  ];

  return (
    <header className="h-[35px] bg-[#181818] border-b border-[#2b2b2b] px-2 flex items-center justify-between select-none z-40 text-xs text-[#cccccc] font-sans">
      {/* Left: Antigravity Logo & Top File Menus */}
      <div className="flex items-center gap-1.5 h-full">
        {/* Antigravity Logo */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#2a2a2a] cursor-pointer transition mr-1">
          <div className="w-4 h-4 rounded bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-[10px] shadow-sm shadow-cyan-500/30">
            A
          </div>
        </div>

        {/* Menu Bar Items */}
        <div className="flex items-center text-[12px] text-[#cccccc]">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                onMouseEnter={() => {
                  if (activeMenu) setActiveMenu(menu.label);
                }}
                className={`px-2 py-0.5 rounded text-[12px] hover:bg-[#2a2a2a] hover:text-white transition ${
                  activeMenu === menu.label ? 'bg-[#2a2a2a] text-white' : ''
                }`}
              >
                {menu.label}
              </button>

              {activeMenu === menu.label && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute left-0 top-full mt-0.5 w-52 bg-[#1f1f1f] border border-[#3c3c3c] rounded-md shadow-2xl py-1 z-50 animate-fade-in text-[12px]">
                    {menu.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMenu(null)}
                        className="w-full text-left px-3 py-1 text-slate-300 hover:bg-[#094771] hover:text-white flex items-center justify-between transition"
                      >
                        <span>{item.split(' (')[0]}</span>
                        {item.includes('(') && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.split('(')[1].replace(')', '')}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Workspace Folder & Active File Title Bar */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#999999] truncate font-sans max-w-[40%] justify-center">
        <span className="truncate hover:text-white cursor-pointer transition">
          New folder (2) &nbsp;—&nbsp; Antigravity IDE &nbsp;—&nbsp; {activeFile ? activeFile.name : 'models.ts'}
        </span>
      </div>

      {/* Right: Layout Controls, Search, Profile, Window Buttons */}
      <div className="flex items-center gap-1 h-full">
        {/* Layout Toggles */}
        <div className="flex items-center gap-0.5 mr-2">
          {/* Toggle Primary Sidebar */}
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`p-1 rounded hover:bg-[#2a2a2a] transition ${
              isLeftSidebarOpen ? 'text-cyan-400' : 'text-[#858585] hover:text-white'
            }`}
            title="Toggle Primary Side Bar (Ctrl+B)"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Bottom Panel */}
          <button
            onClick={() => setIsBottomTerminalOpen(!isBottomTerminalOpen)}
            className={`p-1 rounded hover:bg-[#2a2a2a] transition ${
              isBottomTerminalOpen ? 'text-cyan-400' : 'text-[#858585] hover:text-white'
            }`}
            title="Toggle Panel (Ctrl+J)"
          >
            <PanelBottom className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Secondary / Multi-Agent Assistant Panel */}
          <button
            onClick={() => setIsRightAssistantOpen(!isRightAssistantOpen)}
            className={`p-1 rounded hover:bg-[#2a2a2a] transition ${
              isRightAssistantOpen ? 'text-cyan-400' : 'text-[#858585] hover:text-white'
            }`}
            title="Toggle Antigravity AI Assistant & Swarm"
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Search / Command Palette Shortcut */}
        <button
          onClick={() => {}}
          className="p-1 rounded hover:bg-[#2a2a2a] text-[#858585] hover:text-white transition"
          title="Search (Ctrl+Shift+F)"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Settings */}
        <button
          onClick={() => onOpenAuthModal && onOpenAuthModal()}
          className="p-1 rounded hover:bg-[#2a2a2a] text-[#858585] hover:text-white transition"
          title="Google Account & Swarm Credits"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* User Avatar / Profile */}
        <div
          onClick={() => onOpenAuthModal && onOpenAuthModal()}
          className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-[#2a2a2a] cursor-pointer transition"
          title={user ? `${user.name} (${user.email})` : 'Sign in to Google Account'}
        >
          {user ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-4 h-4 rounded-full border border-cyan-400/80 object-cover"
            />
          ) : (
            <div className="w-4 h-4 rounded-full bg-cyan-700 flex items-center justify-center text-[10px] text-white font-bold">
              D
            </div>
          )}
        </div>

        <div className="h-3 w-[1px] bg-[#333333] mx-1" />

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center">
          <button className="px-2.5 py-1.5 hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition">
            <Minus className="w-3 h-3" />
          </button>
          <button className="px-2.5 py-1.5 hover:bg-[#2a2a2a] text-[#cccccc] hover:text-white transition">
            <Square className="w-2.5 h-2.5" />
          </button>
          <button className="px-2.5 py-1.5 hover:bg-[#e81123] text-[#cccccc] hover:text-white transition">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
