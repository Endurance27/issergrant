import { Badge } from "../../components/ui/Badge";
import { SectionCard, ViewAllBtn } from "../../admin/components/SectionCard";
import { useCoPrincipalInvestigatorProjects } from "../../../hooks/useCoPrincipalInvestigatorProjects";
import { toDisplayStatus } from "../../utils/proposalStatus";
import { fmtCurrency } from "../../utils/formatters";

interface CoPiProjectsListProps {
  onNavigate: (p: string) => void;
}

export function CoPiProjectsList({ onNavigate }: CoPiProjectsListProps) {
  const { proposals, loading } = useCoPrincipalInvestigatorProjects({ limit: 4 });

  return (
    <SectionCard title="Co-PI Projects" action={<ViewAllBtn onClick={() => onNavigate('co-pi-projects')} />}>
      {loading && proposals.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          You haven't been added as a Co-PI on any proposal yet.
        </p>
      ) : (
        <div className="space-y-2">
          {proposals.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-foreground truncate">{p.title}</div>
                <div className="text-[11px] text-muted-foreground">{p.user.name} · {fmtCurrency(p.requestedAmount)}</div>
              </div>
              <Badge status={toDisplayStatus(p.status)} size="sm" />
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
