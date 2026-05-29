import { useState } from "react";
import { Search, Shield, Download } from "lucide-react";
import { auditLogs } from "../../data/mockData";
import { Badge } from "../ui/Badge";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";

const moduleColors: Record<string, string> = {
  'Proposals': '#1A3363',
  'Financial': '#10B981',
  'Milestones': '#8B5CF6',
  'Grant Calls': '#F59E0B',
  'User Management': '#EF4444',
  'Auth': '#64748B',
  'Reports': '#06B6D4',
  'Settings': '#F97316',
};

export function AuditLogs() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const modules = ['All', ...Array.from(new Set(auditLogs.map(l => l.module)))];
  const filtered = auditLogs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'All' || l.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle={`Complete system activity trail — ${auditLogs.length} events recorded`}
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border font-semibold text-[13px] text-foreground hover:bg-muted transition-colors">
            <Download size={15} /> Export Logs
          </button>
        }
      />

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {modules.filter(m => m !== 'All').map(m => {
          const count = auditLogs.filter(l => l.module === m).length;
          const color = moduleColors[m] || '#94A3B8';
          return (
            <button key={m} onClick={() => setModuleFilter(m)} className="p-3 rounded-xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md duration-200"
              style={{ background: moduleFilter === m ? color + '20' : 'var(--card)', border: `1px solid ${moduleFilter === m ? color : 'var(--border)'}` }}>
              <div className="font-mono font-extrabold text-lg leading-none" style={{ color }}>{count}</div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-snug">{m}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 bg-card border border-border">
          <Search size={15} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions, users, or details..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground" />
        </div>
        <button onClick={() => setModuleFilter('All')} className={`px-3 py-2 rounded-lg text-[13px] border transition-all ${moduleFilter === 'All' ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
          All Modules
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                {['Timestamp', 'Action', 'User', 'Role', 'Module', 'IP Address', 'Details'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(log => {
                const color = moduleColors[log.module] || '#94A3B8';
                return (
                  <tr key={log.id} className="bg-card hover:bg-muted transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-muted-foreground">{log.timestamp}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 22, height: 22, background: color + '20' }}>
                          <Shield size={11} style={{ color }} />
                        </div>
                        <span className="font-semibold text-xs text-foreground">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-foreground">{log.user}</span>
                    </td>
                    <td className="px-4 py-3"><Badge status={log.role} size="sm" /></td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap" style={{ background: color + '20', color }}>{log.module}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{log.ip}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <span className="text-xs text-muted-foreground truncate block">{log.details}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollTable>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Shield size={24} className="opacity-40" />
            </div>
            <div className="font-semibold text-sm">No matching log entries</div>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted">
          <span className="text-xs text-muted-foreground">Showing {filtered.length} of {auditLogs.length} entries</span>
        </div>
      </div>
    </div>
  );
}
