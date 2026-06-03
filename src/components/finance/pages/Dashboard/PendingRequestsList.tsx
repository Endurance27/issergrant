import { SectionCard, ViewAllBtn } from "../../../admin/components/SectionCard";
import { transactions } from "../../../../app/data/mockData";
import { fmtCurrency } from "../../../../shared/utils/formatters";

interface PendingRequestsListProps {
  onNavigate: (p: string) => void;
}

export function PendingRequestsList({ onNavigate }: PendingRequestsListProps) {
  const pending = transactions.filter(t => t.status === 'Pending');
  return (
    <SectionCard title="Pending Disbursement Requests" action={<ViewAllBtn onClick={() => onNavigate('financial')} />}>
      <div className="space-y-2">
        {pending.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-foreground">{t.description}</div>
              <div className="text-[11px] text-muted-foreground">{t.projectTitle} · Requested by {t.requestedBy}</div>
            </div>
            <span className="font-mono font-semibold text-[13px] text-foreground whitespace-nowrap">{fmtCurrency(t.amount)}</span>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('financial')} className="px-3 py-1 rounded-lg bg-green-500 text-white text-[11px] font-semibold transition-opacity hover:opacity-90">Approve</button>
              <button onClick={() => onNavigate('financial')} className="btn-secondary px-3 py-1 text-[11px]">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
