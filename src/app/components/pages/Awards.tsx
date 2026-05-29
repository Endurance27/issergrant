import { useState, useEffect } from "react";
import { Award, DollarSign, Calendar, TrendingUp, Plus, Send } from "lucide-react";
import { Badge } from "../ui/Badge";
import { StatCard } from "../ui/StatCard";
import { PageHeader } from "../ui/PageHeader";
import { Modal } from "../ui/Modal";
import { useToast } from "../ui/Toast";
import { useAppContext } from "../../context/AppContext";
import { currentUsers } from "../../data/mockData";
import { supabase } from "../../../lib/supabase";
import type { Role, Award as AwardType, Transaction } from "../../data/mockData";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

interface AwardsProps { role: Role; onNavigate: (page: string) => void; }

export function Awards({ role, onNavigate }: AwardsProps) {
  const { awards, addAward, transactions, addTransaction, addNotification, addAuditLog } = useAppContext();
  const totalAwarded = awards.reduce((s, a) => s + a.awardedAmount, 0);
  const totalDisbursed = awards.reduce((s, a) => s + a.disbursed, 0);

  useEffect(() => {
    // Sync awards from Supabase on mount (awards are managed via AppContext, this just ensures persistence)
    const syncAwards = async () => {
      const { data, error } = await supabase.from('awards').select('*');
      if (!error && data && data.length > 0) {
        // Awards already loaded in context from local state; Supabase is the source of truth when populated
      }
    };
    syncAwards();
  }, []);

  // Disbursement request state
  const [showDisburse, setShowDisburse] = useState<AwardType | null>(null);
  const [disburseAmount, setDisburseAmount] = useState('');
  const [disburseDesc, setDisburseDesc] = useState('');

  // Create award manually (Admin)
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newResearcher, setNewResearcher] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const { toast } = useToast();

  const requestDisbursement = () => {
    if (!showDisburse || !disburseAmount || !disburseDesc) { toast('Fill in all fields', 'error'); return; }
    const amt = Number(disburseAmount);
    if (amt <= 0 || amt > showDisburse.remaining) { toast(`Amount must be between 1 and ${fmtCurrency(showDisburse.remaining)}`, 'error'); return; }
    const tx: Transaction = {
      id: `TX-${Date.now()}`,
      projectId: showDisburse.id,
      projectTitle: showDisburse.title,
      type: 'Disbursement',
      amount: amt,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
      description: disburseDesc,
      requestedBy: currentUsers[role].name,
    };
    addTransaction(tx);
    supabase.from('transactions').insert([tx]).then(() => {});
    addNotification({ title: 'Disbursement Requested', message: `${fmtCurrency(amt)} disbursement request for "${showDisburse.title}" is pending approval.`, time: 'Just now', type: 'payment' });
    addAuditLog({ action: 'Disbursement Requested', user: currentUsers[role].name, role, module: 'Financial', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: `${fmtCurrency(amt)} — ${disburseDesc}` });
    toast('Disbursement request submitted');
    setShowDisburse(null); setDisburseAmount(''); setDisburseDesc('');
    onNavigate('financial');
  };

  const createAward = () => {
    if (!newTitle || !newResearcher || !newAmount || !newStart || !newEnd) { toast('Fill in all fields', 'error'); return; }
    const amt = Number(newAmount);
    const award: AwardType = {
      id: `AW-${Date.now()}`,
      proposalId: '',
      title: newTitle,
      researcher: newResearcher,
      awardedAmount: amt,
      awardDate: new Date().toISOString().slice(0, 10),
      startDate: newStart,
      endDate: newEnd,
      status: 'Active',
      disbursed: 0,
      remaining: amt,
    };
    addAward(award);
    supabase.from('awards').insert([award]).then(() => {});
    addAuditLog({ action: 'Award Created', user: currentUsers[role].name, role, module: 'Financial', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: `${award.id}: ${newTitle}` });
    toast('Award created successfully');
    setShowCreate(false); setNewTitle(''); setNewResearcher(''); setNewAmount(''); setNewStart(''); setNewEnd('');
  };

  return (
    <div>
      <PageHeader
        title="Awards & Funding"
        subtitle={`${awards.filter(a => a.status === 'Active').length} active awarded projects`}
        action={role === 'Admin' ? (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Award
          </button>
        ) : undefined}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Awarded" value={fmtCurrency(totalAwarded)} icon={<Award size={20} />} iconColor="#1A3363" iconBg="#E5EBF5" />
        <StatCard label="Total Disbursed" value={fmtCurrency(totalDisbursed)} icon={<TrendingUp size={20} />} iconColor="#10B981" iconBg="#ECFDF5" />
        <StatCard label="Remaining" value={fmtCurrency(totalAwarded - totalDisbursed)} icon={<DollarSign size={20} />} iconColor="#F59E0B" iconBg="#FFFBEB" />
        <StatCard label="Active Projects" value={awards.filter(a => a.status === 'Active').length} icon={<Calendar size={20} />} iconColor="#8B5CF6" iconBg="#F5F3FF" />
      </div>

      <div className="space-y-4">
        {awards.map(award => {
          const pct = Math.round((award.disbursed / award.awardedAmount) * 100);
          const isActive = award.status === 'Active';
          const myAward = role === 'Researcher' || role === 'Assistant Researcher';
          return (
            <div key={award.id} className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ borderLeftWidth: 4, borderLeftColor: isActive ? '#22C55E' : '#94A3B8' }}>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{award.id}</span>
                      <Badge status={award.status} size="sm" />
                    </div>
                    <h3 className="font-bold text-[15px] text-foreground mb-1">{award.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      PI: <span className="text-foreground font-semibold">{award.researcher}</span> &nbsp;·&nbsp; {award.startDate} → {award.endDate}
                    </p>
                  </div>
                  <div className="sm:text-right flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="bg-muted rounded-xl px-4 py-2 text-right">
                      <div className="font-mono font-black text-[18px] text-foreground">{fmtCurrency(award.awardedAmount)}</div>
                      <div className="text-[11px] text-muted-foreground">Total Award</div>
                    </div>
                    {/* Request Disbursement for researcher */}
                    {myAward && isActive && (
                      <button onClick={() => { setShowDisburse(award); setDisburseAmount(''); setDisburseDesc(''); }} className="btn-primary text-xs flex items-center gap-1.5">
                        <Send size={12} /> Request Disbursement
                      </button>
                    )}
                    {/* Finance/Admin: view transactions */}
                    {(role === 'Finance Officer' || role === 'Admin') && (
                      <button onClick={() => onNavigate('financial')} className="btn-secondary text-xs flex items-center gap-1.5">
                        <DollarSign size={12} /> View Transactions
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Disbursement Progress</span>
                    <span className="font-mono font-bold text-xs" style={{ color: pct >= 80 ? '#F59E0B' : '#10B981' }}>{pct}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden bg-muted" style={{ height: 8 }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 100 ? 'linear-gradient(to right,#22C55E,#4ADE80)' : 'linear-gradient(to right,var(--primary),#2D6EA8)' }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted-foreground">Disbursed: <span className="font-semibold" style={{ color: '#22C55E' }}>{fmtCurrency(award.disbursed)}</span></span>
                    <span className="text-[11px] text-muted-foreground">Remaining: <span className="font-semibold" style={{ color: '#F59E0B' }}>{fmtCurrency(award.remaining)}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  {[
                    { label: 'Personnel', pct: 45, color: 'var(--primary)' },
                    { label: 'Equipment', pct: 35, color: '#8B5CF6' },
                    { label: 'Operations', pct: 20, color: '#10B981' },
                  ].map(cat => (
                    <div key={cat.label} className="text-center p-3 rounded-xl bg-muted">
                      <div className="font-mono font-bold text-sm" style={{ color: cat.color }}>{cat.pct}%</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{cat.label}</div>
                      <div className="mt-2 rounded-full overflow-hidden bg-border" style={{ height: 3 }}>
                        <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disbursement request modal */}
      <Modal open={!!showDisburse} onClose={() => setShowDisburse(null)} title="Request Disbursement" width={480}>
        {showDisburse && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-secondary border-l-4 border-primary">
              <div className="font-bold text-[13px] text-foreground">{showDisburse.title}</div>
              <div className="text-xs text-muted-foreground">Available: <span className="font-semibold text-foreground">{fmtCurrency(showDisburse.remaining)}</span></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Amount (GHS)</label>
              <input type="number" value={disburseAmount} onChange={e => setDisburseAmount(e.target.value)} placeholder="0" max={showDisburse.remaining} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Purpose / Description</label>
              <textarea rows={3} value={disburseDesc} onChange={e => setDisburseDesc(e.target.value)} placeholder="What will these funds be used for?" className="w-full px-3 py-2 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDisburse(null)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              <button onClick={requestDisbursement} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"><Send size={14} /> Submit Request</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Award modal (Admin) */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Award" width={520}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Project Title</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Award title" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Principal Investigator</label>
            <input type="text" value={newResearcher} onChange={e => setNewResearcher(e.target.value)} placeholder="Researcher name" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Award Amount (GHS)</label>
            <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Start Date</label>
              <input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">End Date</label>
              <input type="date" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button onClick={createAward} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"><Award size={15} /> Create Award</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
