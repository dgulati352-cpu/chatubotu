import React, { useState } from 'react';
import {
  Search,
  Settings,
  PanelLeft,
  PanelBottom,
  PanelRight,
  Minus,
  Square,
  X
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface HeaderProps {
  onOpenGitHubModal?: () => void;
  onOpenAuthModal?: () => void;
}

interface MenuItem {
  name: string;
  shortcut?: string;
  action?: () => void;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuthModal }) => {
  const {
    workspaceName,
    activeFile,
    isLeftSidebarOpen,
    setIsLeftSidebarOpen,
    isRightAssistantOpen,
    setIsRightAssistantOpen,
    isBottomTerminalOpen,
    setIsBottomTerminalOpen,
    user,
    openLocalFolder,
    openLocalFile,
    exportProjectZip,
    createNewFile
  } = useWorkspace();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuGroups: MenuGroup[] = [
    {
      label: 'File',
      items: [
        { name: 'New File', shortcut: 'Ctrl+N', action: () => createNewFile('src/newFile.ts') },
        { name: 'Open File...', shortcut: 'Ctrl+O', action: openLocalFile },
        { name: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O', action: openLocalFolder },
        { name: 'Save', shortcut: 'Ctrl+S', action: () => {} },
        { name: 'Export Project (ZIP)', shortcut: 'Ctrl+E', action: exportProjectZip },
        { name: 'Close Editor', shortcut: 'Ctrl+W', action: () => {} }
      ]
    },
    {
      label: 'Edit',
      items: [
        { name: 'Undo', shortcut: 'Ctrl+Z' },
        { name: 'Redo', shortcut: 'Ctrl+Y' },
        { name: 'Cut', shortcut: 'Ctrl+X' },
        { name: 'Copy', shortcut: 'Ctrl+C' },
        { name: 'Paste', shortcut: 'Ctrl+V' },
        { name: 'Find in Files', shortcut: 'Ctrl+Shift+F' }
      ]
    },
    {
      label: 'Selection',
      items: [
        { name: 'Select All', shortcut: 'Ctrl+A' },
        { name: 'Expand Selection', shortcut: 'Alt+Shift+Right' },
        { name: 'Add Cursor Above', shortcut: 'Ctrl+Alt+Up' },
        { name: 'Add Cursor Below', shortcut: 'Ctrl+Alt+Down' }
      ]
    },
    {
      label: 'View',
      items: [
        { name: 'Explorer', shortcut: 'Ctrl+Shift+E' },
        { name: 'Search', shortcut: 'Ctrl+Shift+F' },
        { name: 'Source Control', shortcut: 'Ctrl+Shift+G' },
        { name: 'Dual Swarm Panel', shortcut: 'Ctrl+Shift+A' },
        { name: 'Toggle Terminal', shortcut: 'Ctrl+`' }
      ]
    },
    {
      label: 'Go',
      items: [
        { name: 'Go to File...', shortcut: 'Ctrl+P' },
        { name: 'Go to Line...', shortcut: 'Ctrl+G' }
      ]
    },
    {
      label: 'Run',
      items: [
        { name: 'Start Debugging', shortcut: 'F5' },
        { name: 'Build Fullstack App', shortcut: 'Ctrl+Shift+B' }
      ]
    },
    {
      label: 'Terminal',
      items: [
        { name: 'New Terminal', shortcut: 'Ctrl+`' },
        { name: 'Run Build Task', shortcut: 'Ctrl+Shift+T' }
      ]
    },
    {
      label: 'Help',
      items: [
        { name: 'Welcome & Documentation' },
        { name: 'About Antigravity IDE' }
      ]
    }
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
          {menuGroups.map((menu) => (
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
                  <div className="absolute left-0 top-full mt-0.5 w-60 bg-[#1f1f1f] border border-[#3c3c3c] rounded-md shadow-2xl py-1 z-50 animate-fade-in text-[12px]">
                    {menu.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveMenu(null);
                          if (item.action) item.action();
                        }}
                        className="w-full text-left px-3 py-1.5 text-slate-300 hover:bg-[#094771] hover:text-white flex items-center justify-between transition"
                      >
                        <span>{item.name}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.shortcut}
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
        <span
          onClick={openLocalFolder}
          className="truncate hover:text-white cursor-pointer transition flex items-center gap-1"
          title="Click to Open Local Folder from PC"
        >
          <span className="font-semibold text-white">{workspaceName}</span>
          <span>—</span>
          <span>Antigravity IDE</span>
          <span>—</span>
          <span className="text-cyan-300">{activeFile ? activeFile.name : 'models.ts'}</span>
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
            title="Toggle Antigravity Dual AI Assistant & Swarm"
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
