import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { PageHeader } from "../ui/PageHeader";
import { useToast } from "../ui/Toast";
import { milestones as mockMilestones } from "../../data/mockData";
import { supabase } from "../../../lib/supabase";
import type { Role, Milestone } from "../../data/mockData";

interface MilestonesProps { role: Role; }

const STATUS_COLOR: Record<string, string> = {
  Approved: '#22C55E', Locked: '#22C55E',
  'Under Review': '#F97316', Submitted: '#3B82F6',
  Draft: '#94A3B8', Rejected: '#EF4444',
};

export function Milestones({ role }: MilestonesProps) {
  const [allMilestones, setAllMilestones] = useState<Milestone[]>(mockMilestones);
  const [selected, setSelected] = useState<Milestone | null>(null);
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilestones = async () => {
      const { data, error } = await supabase.from('milestones').select('*').order('due_date');
      if (!error && data && data.length > 0) {
        setAllMilestones(data as Milestone[]);
      } else if (!error && data && data.length === 0) {
        await supabase.from('milestones').insert(mockMilestones);
        setAllMilestones(mockMilestones);
      }
    };
    fetchMilestones();
  }, []);

  const updateMilestoneStatus = async (id: string, status: string) => {
    setAllMilestones(prev => prev.map(m => m.id === id ? { ...m, status: status as Milestone['status'] } : m));
    await supabase.from('milestones').update({ status }).eq('id', id);
  };

  const filtered = allMilestones.filter(m => filter === 'All' || m.status === filter);
  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Locked'];

  const statusIcon = (s: string) => {
    const color = STATUS_COLOR[s] || '#94A3B8';
    if (s === 'Approved' || s === 'Locked') return <CheckCircle2 size={14} style={{ color }} />;
    if (s === 'Under Review' || s === 'Submitted') return <Clock size={14} style={{ color }} />;
    return <AlertCircle size={14} style={{ color }} />;
  };

  return (
    <div>
      <PageHeader
        title="Milestones & Deliverables"
        subtitle="Track project progress checkpoints"
        action={
          (role === 'Researcher' || role === 'Assistant Researcher') ? (
            <button onClick={() => toast('Report submission coming soon', 'info')} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Submit Report
            </button>
          ) : undefined
        }
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-nowrap sm:flex-wrap">
        {statuses.map(s => {
          const count = s === 'All' ? allMilestones.length : allMilestones.filter(m => m.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs border ${filter === s ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
              {s !== 'All' && filter !== s && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: STATUS_COLOR[s] }} />}
              {s} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-0">
        {filtered.map((m, i) => {
          const color = STATUS_COLOR[m.status] || '#94A3B8';
          const isLast = i === filtered.length - 1;
          return (
            <div key={m.id} className="flex gap-4 cursor-pointer group" onClick={() => setSelected(m)}>
              {/* Timeline column */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1 w-8">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 z-10" style={{ background: color + '15', borderColor: color }}>
                  {statusIcon(m.status)}
                </div>
                {!isLast && <div className="flex-1 mt-1 mb-0 w-[2px] min-h-[28px]" style={{ background: `linear-gradient(to bottom, ${color}60, var(--border))` }} />}
              </div>

              {/* Card */}
              <div className="flex-1 pb-4">
                <div className="rounded-2xl bg-card border border-border border-l-[3px] overflow-hidden transition-all duration-150 group-hover:shadow-md group-hover:-translate-y-0.5"
                  style={{ borderLeftColor: color }}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{m.id}</span>
                          <span className="text-[11px] text-muted-foreground truncate">{m.projectTitle}</span>
                        </div>
                        <h3 className="font-bold text-sm text-foreground mb-1 break-words">{m.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{m.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">PI: <span className="text-foreground font-semibold">{m.researcher}</span></span>
                          <span className="font-mono text-[11px]" style={{ color: new Date(m.dueDate) < new Date() && m.status === 'Draft' ? '#EF4444' : 'var(--muted-foreground)' }}>Due: {m.dueDate}</span>
                          {m.submittedDate && <span className="font-mono text-[11px]" style={{ color: '#22C55E' }}>✓ {m.submittedDate}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge status={m.status} />
                        {role === 'Admin' && m.status === 'Under Review' && (
                          <div className="flex gap-2 flex-wrap justify-end">
                            <button className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity" onClick={e => { e.stopPropagation(); updateMilestoneStatus(m.id, 'Approved'); toast('Milestone approved'); }}>Approve</button>
                            <button className="btn-destructive px-3 py-1 text-xs" onClick={e => { e.stopPropagation(); updateMilestoneStatus(m.id, 'Rejected'); toast('Revision requested', 'warning'); }}>Revise</button>
                          </div>
                        )}
                        {(role === 'Researcher' || role === 'Assistant Researcher') && m.status === 'Draft' && (
                          <button className="btn-primary px-3 py-1 text-xs" onClick={e => { e.stopPropagation(); updateMilestoneStatus(m.id, 'Submitted'); toast('Milestone submitted for review'); }}>Submit</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Milestone Details" width={580}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[11px] text-muted-foreground">{selected.id}</span>
              <Badge status={selected.status} />
            </div>
            <h2 className="font-extrabold text-[17px] text-foreground">{selected.title}</h2>
            <div className="p-4 rounded-xl bg-muted border-l-4" style={{ borderLeftColor: STATUS_COLOR[selected.status] || 'var(--border)' }}>
              <p className="text-[13px] text-foreground leading-relaxed">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Project', value: selected.projectTitle },
                { label: 'Researcher', value: selected.researcher },
                { label: 'Due Date', value: selected.dueDate },
                { label: 'Submitted', value: selected.submittedDate || 'Not yet submitted' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.05em] mb-2">Attachments</div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
                <FileText size={16} className="text-primary" />
                <span className="text-[13px] text-foreground">milestone_report_{selected.id}.pdf</span>
                <button onClick={() => toast(`Downloading milestone_report_${selected.id}.pdf`, 'info')} className="ml-auto text-xs font-semibold text-primary hover:opacity-75 transition-opacity">Download</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
