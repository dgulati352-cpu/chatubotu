import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Plus, 
  Play, 
  Key, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Terminal, 
  Search, 
  Download,
  Trash2,
  Server,
  Zap
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DatabaseType, DatabaseModel, DatabaseColumn } from '../../types/database';

export const DatabaseStudio: React.FC = () => {
  const { 
    databaseSchema, 
    setDatabaseSchema, 
    changeDatabaseType, 
    executeDatabaseQuery, 
    addNewTable,
    addTerminalLog 
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'tables' | 'grid' | 'sql' | 'schema'>('tables');
  const [selectedModelId, setSelectedModelId] = useState<string>(databaseSchema.models[0]?.id || '');
  const [sqlQuery, setSqlQuery] = useState<string>(`SELECT * FROM ${databaseSchema.models[0]?.tableName || 'users'} LIMIT 20;`);
  const [queryResult, setQueryResult] = useState<{ columns: string[]; rows: any[]; count: number; error?: string } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Add Model Modal State
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableDesc, setNewTableDesc] = useState('');

  // Add Row Modal State
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});

  const activeModel = databaseSchema.models.find(m => m.id === selectedModelId) || databaseSchema.models[0];
  const modelRows = (activeModel && databaseSchema.mockData[activeModel.id]) || [];

  const handleRunSql = () => {
    if (!sqlQuery.trim()) return;
    const res = executeDatabaseQuery(sqlQuery);
    setQueryResult(res);
    addTerminalLog(`[SQL] Executed: "${sqlQuery}" (${res.count} rows returned)`, 'success');
  };

  const handleCreateTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    addNewTable(newTableName.trim(), newTableDesc.trim());
    setNewTableName('');
    setNewTableDesc('');
    setShowAddTableModal(false);
  };

  const handleInsertRowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModel) return;

    const newRow = {
      id: `${activeModel.name.toLowerCase().substr(0, 3)}_${Math.random().toString(36).substr(2, 6)}`,
      ...newRowData,
      createdAt: new Date().toISOString()
    };

    setDatabaseSchema(prev => ({
      ...prev,
      mockData: {
        ...prev.mockData,
        [activeModel.id]: [newRow, ...(prev.mockData[activeModel.id] || [])]
      }
    }));

    setNewRowData({});
    setShowAddRowModal(false);
    addTerminalLog(`[DB] Inserted 1 record into table "${activeModel.tableName}"`, 'success');
  };

  const filteredRows = modelRows.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchFilter.toLowerCase())
    )
  );

  return (
    <div className="h-full flex flex-col bg-[#090b11] p-4 overflow-y-auto space-y-4">
      {/* Top Header: Database Engine & Connection Details */}
      <div className="p-4 rounded-xl bg-[#0f121e] border border-[#1f253d] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-sans">
                Antigravity Database Studio
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                {databaseSchema.type} Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono text-[11px] truncate max-w-xl mt-0.5">
              URI: {databaseSchema.connectionUri}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick DB Switcher Buttons */}
          <div className="flex bg-[#141828] p-1 rounded-lg border border-[#222942]">
            {(['postgresql', 'sqlite', 'mysql', 'mongodb', 'supabase', 'redis'] as DatabaseType[]).map(type => (
              <button
                key={type}
                onClick={() => changeDatabaseType(type)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition ${
                  databaseSchema.type === type
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Table</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1f253d]">
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
            activeTab === 'tables'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Visual Schema ({databaseSchema.models.length} Models)
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
            activeTab === 'grid'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          Interactive Data Grid
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 ${
            activeTab === 'sql'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          SQL Query Runner
        </button>
      </div>

      {/* TAB 1: VISUAL SCHEMA */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {databaseSchema.models.map(model => (
            <div key={model.id} className="rounded-xl bg-[#0f121e] border border-[#1f253d] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-3 bg-[#131726] border-b border-[#1f253d] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white font-mono">{model.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    "{model.tableName}"
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-[11px] text-slate-400">{model.description}</p>
                  <div className="space-y-1 pt-1">
                    {model.columns.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-[#141828]">
                        <div className="flex items-center gap-1.5">
                          {col.isPrimary ? <Key className="w-3 h-3 text-amber-400" /> : <span className="w-3 h-3 block text-slate-600">•</span>}
                          <span className={col.isPrimary ? 'text-amber-300 font-semibold' : 'text-slate-300'}>{col.name}</span>
                          {col.isUnique && <span className="text-[9px] text-purple-400">UQ</span>}
                        </div>
                        <span className="text-[10px] text-cyan-400 font-semibold">{col.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#121624] border-t border-[#1f253d] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{(databaseSchema.mockData[model.id] || []).length} Records</span>
                <button
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setActiveTab('grid');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  View Data →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: INTERACTIVE DATA GRID */}
      {activeTab === 'grid' && activeModel && (
        <div className="rounded-xl bg-[#0f121e] border border-[#1f253d] flex flex-col flex-1 overflow-hidden">
          {/* Table Model Selector Bar */}
          <div className="p-3 bg-[#131726] border-b border-[#1f253d] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Select Table:</span>
              <div className="flex gap-1.5">
                {databaseSchema.models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                      selectedModelId === m.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-[#141828] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter records..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#0a0d16] border border-[#20273e] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                onClick={() => setShowAddRowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Insert Row
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0e17] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1f253d]">
                <tr>
                  {activeModel.columns.map((col, idx) => (
                    <th key={idx} className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {col.isPrimary && <Key className="w-3 h-3 text-amber-400" />}
                        <span>{col.name}</span>
                        <span className="text-[9px] text-slate-600 lowercase font-normal">({col.type})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f253d] font-mono text-[11px]">
                {filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#141828]/60 transition">
                    {activeModel.columns.map((col, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-slate-200 truncate max-w-xs">
                        {col.isPrimary ? (
                          <span className="text-cyan-400 font-bold">{row[col.name]}</span>
                        ) : typeof row[col.name] === 'object' ? (
                          JSON.stringify(row[col.name])
                        ) : (
                          String(row[col.name] ?? '—')
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SQL QUERY RUNNER */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0f121e] border border-[#1f253d] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                <Terminal className="w-4 h-4" />
                Interactive SQL Query Console ({databaseSchema.type.toUpperCase()})
              </div>
              <button
                onClick={handleRunSql}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Run Query
              </button>
            </div>

            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-[#090b11] border border-[#20273e] text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>

          {/* Results Output */}
          {queryResult && (
            <div className="rounded-xl bg-[#0f121e] border border-[#1f253d] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">Query Execution Output:</span>
                <span className="text-emerald-400 font-semibold">{queryResult.count} rows returned</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-[#1f253d]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0b0e17] text-slate-400 text-[10px] uppercase">
                    <tr>
                      {queryResult.columns.map((c, i) => (
                        <th key={i} className="py-2.5 px-3 border-b border-[#1f253d]">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f253d] text-[11px]">
                    {queryResult.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-[#141828]/60">
                        {queryResult.columns.map((c, j) => (
                          <td key={j} className="py-2.5 px-3 text-slate-200 truncate max-w-xs">
                            {typeof r[c] === 'object' ? JSON.stringify(r[c]) : String(r[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE NEW TABLE MODAL */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f121e] border border-[#222942] rounded-2xl p-5 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f253d]">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Create New Table / Model</h3>
              </div>
              <button onClick={() => setShowAddTableModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTableSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Table / Model Name</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. Subscription, Transaction, Notification"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#090b11] border border-[#20273e] text-white focus:outline-none focus:border-emerald-500 font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Description</label>
                <input
                  type="text"
                  value={newTableDesc}
                  onChange={(e) => setNewTableDesc(e.target.value)}
                  placeholder="What data does this model represent?"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#090b11] border border-[#20273e] text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Add Table to Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSERT ROW MODAL */}
      {showAddRowModal && activeModel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f121e] border border-[#222942] rounded-2xl p-5 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f253d]">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Insert Row into {activeModel.name}</h3>
              </div>
              <button onClick={() => setShowAddRowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInsertRowSubmit} className="space-y-3">
              {activeModel.columns.filter(c => !c.isPrimary && c.name !== 'createdAt').map((col, idx) => (
                <div key={idx}>
                  <label className="text-xs text-slate-400 font-medium block mb-1">
                    {col.name} <span className="text-[10px] text-slate-500">({col.type})</span>
                  </label>
                  <input
                    type="text"
                    value={newRowData[col.name] || ''}
                    onChange={(e) => setNewRowData(prev => ({ ...prev, [col.name]: e.target.value }))}
                    placeholder={`Enter ${col.name}...`}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#090b11] border border-[#20273e] text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              ))}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Insert Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
