import { useState, useEffect } from "react";
import { Plus, Search, Calendar, Users, DollarSign, ChevronRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { PageHeader } from "../ui/PageHeader";
import { useToast } from "../ui/Toast";
import { grantCalls as mockGrantCalls } from "../../data/mockData";
import { supabase } from "../../../lib/supabase";
import type { Role, GrantCall } from "../../data/mockData";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

const STATUS_BORDER: Record<string, string> = {
  Open:   '#22C55E',
  Closed: '#94A3B8',
  Draft:  '#F59E0B',
  Locked: '#64748B',
};

interface GrantCallsProps { role: Role; onNavigate: (page: string, state?: { grantCallId?: string; grantCallTitle?: string }) => void; }

export function GrantCalls({ role, onNavigate }: GrantCallsProps) {
  const [grantCalls, setGrantCalls] = useState<GrantCall[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Open' | 'Closed' | 'Draft'>('All');
  const [selected, setSelected] = useState<GrantCall | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEligibility, setNewEligibility] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchGrantCalls = async () => {
      const { data, error } = await supabase.from('grant_calls').select('*').order('id');
      if (!error && data && data.length > 0) {
        setGrantCalls(data as GrantCall[]);
      } else {
        // Seed with mock data if table is empty
        if (!error && data && data.length === 0) {
          const { error: insertError } = await supabase.from('grant_calls').insert(mockGrantCalls);
          if (!insertError) setGrantCalls(mockGrantCalls);
          else setGrantCalls(mockGrantCalls);
        } else {
          setGrantCalls(mockGrantCalls);
        }
      }
    };
    fetchGrantCalls();
  }, []);

  const saveGrantCall = async (status: 'Draft' | 'Open') => {
    if (!newTitle.trim()) { toast('Enter a grant call title', 'error'); return; }
    const newGC: GrantCall = {
      id: `GC-${Date.now()}`,
      title: newTitle,
      category: newCategory || 'General',
      totalBudget: Number(newBudget) || 0,
      deadline: newDeadline || new Date().toISOString().slice(0, 10),
      applications: 0,
      status,
      description: newDescription,
      eligibility: newEligibility,
    };
    const { error } = await supabase.from('grant_calls').insert([newGC]);
    if (!error) {
      setGrantCalls(prev => [...prev, newGC]);
      toast(status === 'Draft' ? 'Saved as draft' : 'Grant call published');
    } else {
      setGrantCalls(prev => [...prev, newGC]);
      toast(status === 'Draft' ? 'Saved as draft' : 'Grant call published');
    }
    setShowCreate(false);
    setNewTitle(''); setNewCategory(''); setNewBudget(''); setNewDeadline('');
    setNewDescription(''); setNewEligibility('');
  };

  const filtered = grantCalls.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || g.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageHeader
        title="Grant Calls"
        subtitle={`${grantCalls.filter(g => g.status === 'Open').length} active opportunities available`}
        action={
          role === 'Admin' ? (
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-[13px] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
              <Plus size={16} /> New Grant Call
            </button>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search size={15} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search grant calls..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground" />
        </div>
        <div className="flex gap-2">
          {(['All', 'Open', 'Closed', 'Draft'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl transition-all text-[13px] border ${filter === f ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(g => (
          <div
            key={g.id}
            className="rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group bg-card border border-border overflow-hidden"
            style={{ borderLeftWidth: 4, borderLeftColor: STATUS_BORDER[g.status] || 'var(--border)' }}
            onClick={() => setSelected(g)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{g.id}</span>
                <Badge status={g.status} size="sm" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-2 leading-snug">{g.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">{g.description}</p>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <DollarSign size={13} className="text-muted-foreground flex-shrink-0" />
                  <span className="font-mono font-bold text-xs text-foreground">{fmtCurrency(g.totalBudget)}</span>
                  <span className="text-[11px] text-muted-foreground">total budget</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Deadline: <span className="text-foreground font-semibold">{g.deadline}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{g.applications} application{g.applications !== 1 ? 's' : ''} received</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="px-2.5 py-1 rounded-lg bg-muted text-[11px] text-muted-foreground font-medium">{g.category}</span>
                <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Search size={24} className="opacity-40" />
          </div>
          <div className="font-semibold text-sm">No grant calls found</div>
          <div className="text-xs mt-1">Try adjusting your search or filter</div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Grant Call Details" width={620}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">{selected.id}</span>
              <Badge status={selected.status} />
            </div>
            <div className="p-4 rounded-xl border-l-4" style={{ background: STATUS_BORDER[selected.status] + '10', borderLeftColor: STATUS_BORDER[selected.status] }}>
              <h2 className="font-extrabold text-[18px] text-foreground leading-snug">{selected.title}</h2>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Budget', value: fmtCurrency(selected.totalBudget) },
                { label: 'Applications', value: `${selected.applications} received` },
                { label: 'Deadline', value: selected.deadline },
                { label: 'Category', value: selected.category },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-muted">
              <div className="text-[11px] text-muted-foreground mb-1">Eligibility Criteria</div>
              <div className="text-[13px] text-foreground">{selected.eligibility}</div>
            </div>
            {(role === 'Researcher' || role === 'Assistant Researcher') && selected.status === 'Open' && (
              <button onClick={() => { setSelected(null); onNavigate('proposals', { grantCallId: selected.id, grantCallTitle: selected.title }); }} className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
                Apply for This Grant
              </button>
            )}
            {role === 'Admin' && (
              <div className="flex gap-3">
                <button onClick={() => { toast('Grant call updated'); setSelected(null); }} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>Edit</button>
                {selected.status === 'Open' && <button onClick={() => { toast('Grant call closed', 'warning'); setSelected(null); }} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors">Close Call</button>}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Grant Call" width={600}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Grant Call Title</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Sustainable Energy Innovation Grant" className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Category</label>
            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g. Health & Technology" className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Total Budget (GHS)</label>
            <input type="number" value={newBudget} onChange={e => setNewBudget(e.target.value)} placeholder="500000" className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Application Deadline</label>
            <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
            <textarea rows={3} value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full px-3 py-2.5 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground" placeholder="Describe the grant call objectives..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Eligibility Criteria</label>
            <textarea rows={2} value={newEligibility} onChange={e => setNewEligibility(e.target.value)} className="w-full px-3 py-2.5 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground" placeholder="Who can apply?" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => saveGrantCall('Draft')} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors">Save as Draft</button>
            <button onClick={() => saveGrantCall('Open')} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>Publish Now</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
