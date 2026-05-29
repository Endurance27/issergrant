import { useState } from "react";
import { Search, Plus, FileText, CheckCircle2, XCircle, Eye, RotateCcw, MessageSquare, Clock } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { useToast } from "../ui/Toast";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { proposals as initialProposals, grantCalls } from "../../data/mockData";
import type { Role, Proposal, StatusBadge } from "../../data/mockData";

const fmtCurrency = (n: number) => `GHS ${n.toLocaleString()}`;

interface ReviewEntry {
  action: 'Approved' | 'Rejected' | 'Revised';
  comment: string;
  reviewer: string;
  date: string;
}

type ProposalWithHistory = Proposal & { reviewHistory?: ReviewEntry[] };

interface ProposalsProps { role: Role; }

export function Proposals({ role }: ProposalsProps) {
  const [proposals, setProposals] = useState<ProposalWithHistory[]>(initialProposals);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<ProposalWithHistory | null>(null);
  const [showNew, setShowNew] = useState(false);

  const [reviewAction, setReviewAction] = useState<{ proposal: ProposalWithHistory; type: 'Approved' | 'Rejected' | 'Revised' } | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [commentError, setCommentError] = useState('');

  const myId = role === 'Researcher' ? 2 : role === 'Assistant Researcher' ? 4 : null;
  const visibleProposals = myId ? proposals.filter(p => p.researcherId === myId) : proposals;

  const filtered = visibleProposals.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.researcher.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Revised'];

  const openReview = (proposal: ProposalWithHistory, type: 'Approved' | 'Rejected' | 'Revised') => {
    setReviewAction({ proposal, type });
    setReviewComment('');
    setCommentError('');
  };

  const submitReview = () => {
    if (!reviewComment.trim()) { setCommentError('A comment is required.'); return; }
    if (!reviewAction) return;

    const statusMap: Record<string, StatusBadge> = { Approved: 'Approved', Rejected: 'Rejected', Revised: 'Revised' };
    const entry: ReviewEntry = { action: reviewAction.type, comment: reviewComment.trim(), reviewer: role, date: new Date().toISOString().slice(0, 10) };

    setProposals(prev => prev.map(p =>
      p.id === reviewAction.proposal.id
        ? { ...p, status: statusMap[reviewAction.type], reviewHistory: [...(p.reviewHistory || []), entry] }
        : p
    ));
    if (selected?.id === reviewAction.proposal.id) {
      setSelected(prev => prev ? { ...prev, status: statusMap[reviewAction.type], reviewHistory: [...(prev.reviewHistory || []), entry] } : prev);
    }
    toast(`Proposal ${reviewAction.type.toLowerCase()}`);
    setReviewAction(null);
    setReviewComment('');
  };

  const { toast } = useToast();
  const actionColors = { Approved: '#22C55E', Rejected: '#EF4444', Revised: '#A855F7' };
  const actionLabels = { Approved: 'Approve Proposal', Rejected: 'Reject Proposal', Revised: 'Request Revision' };

  return (
    <div>
      <PageHeader
        title="Proposals"
        subtitle={`${proposals.filter(p => p.status === 'Under Review').length} proposals pending review`}
        action={(role === 'Researcher' || role === 'Assistant Researcher') ? (
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-[13px] hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
            <Plus size={16} /> New Proposal
          </button>
        ) : undefined}
      />

      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: 'Total', count: proposals.length, color: 'var(--primary)' },
          { label: 'Under Review', count: proposals.filter(p => p.status === 'Under Review').length, color: '#F97316' },
          { label: 'Approved', count: proposals.filter(p => p.status === 'Approved').length, color: '#22C55E' },
          { label: 'Rejected', count: proposals.filter(p => p.status === 'Rejected').length, color: '#EF4444' },
          { label: 'Revised', count: proposals.filter(p => p.status === 'Revised').length, color: '#A855F7' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
            <span className="rounded-full inline-block w-2 h-2" style={{ background: item.color }} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="font-mono font-bold text-[13px] text-foreground">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 bg-card border border-border">
          <Search size={15} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search proposals..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg transition-all text-xs border whitespace-nowrap ${statusFilter === s ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                {['ID', 'Title', 'Researcher', 'Grant Call', 'Amount', 'Submitted', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => (
                <tr key={p.id} className="bg-card hover:bg-muted transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-[11px] text-muted-foreground">{p.id}</span></td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="font-semibold text-[13px] text-foreground truncate">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground">{p.department}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs text-foreground">{p.researcher}</span></td>
                  <td className="px-4 py-3 max-w-[160px]"><span className="text-xs text-muted-foreground truncate block">{p.grantCallTitle}</span></td>
                  <td className="px-4 py-3"><span className="font-mono font-semibold text-xs text-foreground whitespace-nowrap">{fmtCurrency(p.requestedAmount)}</span></td>
                  <td className="px-4 py-3"><span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{p.submitted}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Badge status={p.status} size="sm" />
                      {p.reviewHistory && p.reviewHistory.length > 0 && (
                        <span title={`${p.reviewHistory.length} review note(s)`}><MessageSquare size={12} className="text-muted-foreground" /></span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(p)} className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors" title="View details">
                        <Eye size={14} />
                      </button>
                      {role === 'Admin' && (p.status === 'Under Review' || p.status === 'Revised') && (
                        <>
                          <button onClick={() => openReview(p, 'Approved')} className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-green-50" style={{ color: '#22C55E' }} title="Approve">
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => openReview(p, 'Revised')} className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-purple-50" style={{ color: '#A855F7' }} title="Request revision">
                            <RotateCcw size={14} />
                          </button>
                          <button onClick={() => openReview(p, 'Rejected')} className="flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-red-50" style={{ color: '#EF4444' }} title="Reject">
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollTable>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText size={24} className="text-muted-foreground opacity-50" />
            </div>
            <div className="font-bold text-sm text-foreground mb-1">No proposals found</div>
            <div className="text-[13px] text-muted-foreground">
              {search ? `No results for "${search}"` : 'Try changing your filters'}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted">
          <span className="text-xs text-muted-foreground">Showing {filtered.length} of {visibleProposals.length} proposals</span>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Proposal Details" width={640}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">{selected.id}</span>
              <Badge status={selected.status} />
            </div>
            <h2 className="font-extrabold text-[17px] text-foreground leading-snug">{selected.title}</h2>
            <div className="p-4 rounded-lg bg-muted border-l-[3px] border-primary">
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-[0.05em]">Abstract</div>
              <p className="text-[13px] text-foreground leading-relaxed">{selected.abstract}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Principal Investigator', value: selected.researcher },
                { label: 'Department', value: selected.department },
                { label: 'Grant Call', value: selected.grantCallTitle },
                { label: 'Requested Amount', value: fmtCurrency(selected.requestedAmount) },
                { label: 'Submission Date', value: selected.submitted },
                { label: 'Status', value: selected.status },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>

            {selected.reviewHistory && selected.reviewHistory.length > 0 && (
              <div>
                <div className="font-bold text-[13px] text-foreground mb-2.5">Review History</div>
                <div className="space-y-3">
                  {selected.reviewHistory.map((entry, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ width: 28, height: 28, background: (actionColors as any)[entry.action] + '18' }}>
                        {entry.action === 'Approved' && <CheckCircle2 size={13} style={{ color: '#22C55E' }} />}
                        {entry.action === 'Rejected' && <XCircle size={13} style={{ color: '#EF4444' }} />}
                        {entry.action === 'Revised' && <RotateCcw size={13} style={{ color: '#A855F7' }} />}
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs" style={{ color: (actionColors as any)[entry.action] }}>{entry.action}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-muted-foreground">{entry.reviewer}</span>
                            <Clock size={11} className="text-muted-foreground" />
                            <span className="font-mono text-[11px] text-muted-foreground">{entry.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">{entry.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role === 'Admin' && (selected.status === 'Under Review' || selected.status === 'Revised') && (
              <div className="flex gap-3 pt-2">
                <button onClick={() => { openReview(selected, 'Approved'); setSelected(null); }} className="flex-1 py-2.5 rounded-lg text-white font-bold text-[13px] hover:opacity-90 transition-opacity" style={{ background: '#22C55E' }}>Approve</button>
                <button onClick={() => { openReview(selected, 'Revised'); setSelected(null); }} className="flex-1 py-2.5 rounded-lg text-white font-bold text-[13px] hover:opacity-90 transition-opacity" style={{ background: '#A855F7' }}>Request Revision</button>
                <button onClick={() => { openReview(selected, 'Rejected'); setSelected(null); }} className="flex-1 py-2.5 rounded-lg text-white font-bold text-[13px] hover:opacity-90 transition-opacity" style={{ background: '#EF4444' }}>Reject</button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setReviewAction(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="relative rounded-xl shadow-2xl w-full max-w-md bg-card border border-border" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center rounded-full" style={{ width: 40, height: 40, background: actionColors[reviewAction.type] + '18' }}>
                  {reviewAction.type === 'Approved' && <CheckCircle2 size={20} style={{ color: '#22C55E' }} />}
                  {reviewAction.type === 'Rejected' && <XCircle size={20} style={{ color: '#EF4444' }} />}
                  {reviewAction.type === 'Revised' && <RotateCcw size={20} style={{ color: '#A855F7' }} />}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-foreground">{actionLabels[reviewAction.type]}</div>
                  <div className="text-xs text-muted-foreground">{reviewAction.proposal.title}</div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Review Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={e => { setReviewComment(e.target.value); setCommentError(''); }}
                  placeholder={reviewAction.type === 'Revised' ? 'Describe what needs to be revised...' : reviewAction.type === 'Rejected' ? 'Provide reason for rejection...' : 'Add approval notes...'}
                  className="w-full px-3 py-2 rounded-lg outline-none resize-none bg-muted text-[13px] text-foreground"
                  style={{ border: `1px solid ${commentError ? '#EF4444' : 'var(--border)'}` }}
                />
                {commentError && <div className="text-[11px] text-red-500 mt-1">{commentError}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setReviewAction(null)} className="flex-1 py-2.5 rounded-lg border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={submitReview} className="flex-1 py-2.5 rounded-lg text-white font-bold text-[13px] hover:opacity-90 transition-opacity" style={{ background: actionColors[reviewAction.type] }}>
                  {actionLabels[reviewAction.type]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Submit New Proposal" width={600}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Grant Call</label>
            <select className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
              <option value="">Select a grant call...</option>
              {grantCalls.filter(g => g.status === 'Open').map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Research Title</label>
            <input type="text" placeholder="Full title of your research proposal" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Abstract</label>
            <textarea rows={4} placeholder="Brief summary of research objectives and methodology..." className="w-full px-3 py-2 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Requested Amount (GHS)</label>
            <input type="number" placeholder="e.g. 150000" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Supporting Documents</label>
            <div className="flex flex-col items-center justify-center py-6 rounded-lg cursor-pointer border-2 border-dashed border-border bg-muted">
              <FileText size={24} className="text-muted-foreground mb-2" />
              <div className="font-semibold text-[13px] text-foreground">Drop files or click to upload</div>
              <div className="text-[11px] text-muted-foreground mt-1">PDF, DOCX, XLSX · max 25MB</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { toast('Draft saved', 'info'); setShowNew(false); }} className="flex-1 py-2.5 rounded-lg border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors">Save as Draft</button>
            <button onClick={() => { toast('Proposal submitted successfully'); setShowNew(false); }} className="flex-1 py-2.5 rounded-lg text-white font-semibold text-[13px] hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>Submit Proposal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
