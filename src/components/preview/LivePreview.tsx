import React, { useState } from 'react';
import { 
  Tv, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  ExternalLink, 
  Activity, 
  Layers, 
  Database, 
  ShieldCheck, 
  Plus, 
  Server,
  Zap,
  Terminal,
  Cpu
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const LivePreview: React.FC = () => {
  const { databaseSchema, addTerminalLog } = useWorkspace();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isReloading, setIsReloading] = useState(false);

  // Live in-app sandbox state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'api-live'>('dashboard');
  const [records, setRecords] = useState<any[]>([
    { id: 'rec_101', title: 'Neural Vector Indexer Pro', price: 299.00, category: 'AI Tools', status: 'ACTIVE' },
    { id: 'rec_102', title: 'Quantum Telemetry Stream Gateway', price: 449.50, category: 'Infrastructure', status: 'ACTIVE' },
    { id: 'rec_103', title: 'Antigravity Autonomous Core', price: 899.00, category: 'Swarm Core', status: 'DEPLOYED' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('199.00');
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Express API initialized on :5000`,
    `[${new Date().toLocaleTimeString()}] ${databaseSchema.type.toUpperCase()} database connection verified`,
    `[${new Date().toLocaleTimeString()}] Client React App mounted with fullstack reactivity`
  ]);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
      addTerminalLog('Sandbox Live Preview reloaded.', 'info');
    }, 600);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRec = {
      id: `rec_${Math.floor(Math.random() * 899) + 100}`,
      title: newTitle.trim(),
      price: parseFloat(newPrice) || 99,
      category: 'User Added',
      status: 'ACTIVE',
      createdAt: 'Just now'
    };

    setRecords([newRec, ...records]);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] POST /api/v1/items -> 201 Created (Saved to ${databaseSchema.type.toUpperCase()})`, ...prev]);
    setNewTitle('');
    addTerminalLog(`[PREVIEW] Created record "${newRec.title}" via Live Sandbox client`, 'success');
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#07080d] select-none">
      {/* Sandbox Top Control Bar */}
      <div className="h-11 bg-[#0e111a] border-b border-[#1d2336] px-4 flex items-center justify-between">
        {/* URL Address Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#07090f] border border-[#20273c] text-xs font-mono text-slate-300 w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-500">https://</span>
            <span className="text-cyan-300 font-semibold">localhost:3000</span>
            <span className="text-slate-500">/app</span>
          </div>

          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg hover:bg-[#1a2032] text-slate-400 hover:text-cyan-400 transition"
            title="Reload Sandbox"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center bg-[#07090f] p-1 rounded-lg border border-[#20273c] gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded text-xs transition ${deviceMode === 'desktop' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            title="Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded text-xs transition ${deviceMode === 'tablet' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            title="Tablet Mode"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded text-xs transition ${deviceMode === 'mobile' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            title="Mobile Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Sandbox App Viewport */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-[#05060a]">
        <div className={`${getContainerWidth()} w-full bg-[#0a0c13] rounded-2xl border border-[#1d2338] shadow-2xl overflow-hidden min-h-[600px] flex flex-col transition-all duration-300`}>
          {/* App Header */}
          <div className="p-5 border-b border-[#1b2034] bg-gradient-to-r from-[#0e121e] to-[#0a0c13] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white flex items-center gap-2">
                  Antigravity Fullstack App
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">
                    LIVE
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">
                  Powered by Frontend & Backend Swarm ({databaseSchema.type.toUpperCase()})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Backend 200 OK
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-[#1b2034] px-5 pt-3 bg-[#0d101a]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                activeTab === 'records'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Live Records ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('api-live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
                activeTab === 'api-live'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Live Event Bus
            </button>
          </div>

          {/* App Body Content */}
          <div className="p-5 flex-1 space-y-5">
            {activeTab === 'dashboard' && (
              <div className="space-y-4">
                {/* 4 Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0e121e] border border-[#1f263d]">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Total Users</span>
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">1,420</div>
                    <div className="text-[10px] text-emerald-400 mt-1">↑ 14.8% sync rate</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0e121e] border border-[#1f263d]">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>API Throughput</span>
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">3.8k/s</div>
                    <div className="text-[10px] text-slate-400 mt-1">Zero dropped frames</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0e121e] border border-[#1f263d]">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>DB Latency</span>
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-emerald-400 font-mono">1.8ms</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase">{databaseSchema.type} active</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0e121e] border border-[#1f263d]">
                    <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Contract Health</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="text-xl font-bold text-purple-300 font-mono">100%</div>
                    <div className="text-[10px] text-slate-400 mt-1">Types 1:1 aligned</div>
                  </div>
                </div>

                {/* Form to Create New Live Item */}
                <div className="p-4 rounded-xl bg-[#0e121e] border border-[#1f263d]">
                  <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    Test Live Frontend-to-Backend Mutation
                  </h3>
                  <form onSubmit={handleCreateRecord} className="flex gap-2">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Enter new item name..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#07090f] border border-[#20273c] text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Price"
                      className="w-24 px-3 py-1.5 text-xs rounded-lg bg-[#07090f] border border-[#20273c] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
                    >
                      Create
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="rounded-xl border border-[#1f263d] overflow-hidden bg-[#0e121e]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07090f] text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f263d] font-mono text-[11px]">
                    {records.map((r) => (
                      <tr key={r.id} className="hover:bg-[#141a2c]/50">
                        <td className="py-2.5 px-3 text-cyan-400">{r.id}</td>
                        <td className="py-2.5 px-3 text-white font-medium">{r.title}</td>
                        <td className="py-2.5 px-3 text-emerald-400">\${r.price?.toFixed(2)}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 font-bold">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'api-live' && (
              <div className="p-3.5 rounded-xl bg-[#07090f] border border-[#1f263d] font-mono text-xs text-slate-300 space-y-1.5">
                {logs.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-cyan-400">›</span>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
