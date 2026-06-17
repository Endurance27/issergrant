import { useState } from "react";
import {
  TrendingUp,
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Eye,
} from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { directorReportCards, type DirectorReportCard } from "./reportCards";

const ICONS: Record<string, React.ReactNode> = {
  "RPT-DIR-001": <TrendingUp size={20} />,
  "RPT-DIR-002": <FileText size={20} />,
  "RPT-DIR-003": <PieChartIcon size={20} />,
  "RPT-DIR-004": <BarChart3 size={20} />,
};

export function DirectorReportCards() {
  const [previewing, setPreviewing] = useState<DirectorReportCard | null>(null);
  const { toast } = useToast();

  return (
    <div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-testid="director-report-cards"
      >
        {directorReportCards.map((card) => (
          <div
            key={card.id}
            data-testid="director-report-card"
            className="rounded-2xl bg-card border border-border p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 mb-3"
              style={{ background: "var(--secondary)", color: "var(--primary)" }}
            >
              {ICONS[card.id]}
            </div>
            <h3 className="font-bold text-[14px] text-foreground leading-snug mb-1.5">
              {card.title}
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4 flex-1">
              {card.description}
            </p>
            <div className="text-[10px] text-muted-foreground mb-3">
              Last generated {card.lastGenerated} · {card.format}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewing(card)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-[12px] font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Eye size={13} /> Preview
              </button>
              <button
                onClick={() => toast(`Downloading ${card.title}...`, "info")}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-[12px] font-semibold hover:opacity-90 transition-opacity"
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!previewing}
        onClose={() => setPreviewing(null)}
        title={previewing?.title ?? ""}
        width={520}
      >
        {previewing && (
          <div className="space-y-4">
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {previewing.description}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {previewing.metrics.map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-muted text-center">
                  <div className="font-bold text-sm text-foreground">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Last generated {previewing.lastGenerated} · {previewing.format} format
            </div>
            <button
              onClick={() => {
                toast(`Downloading ${previewing.title}...`, "info");
                setPreviewing(null);
              }}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              <Download size={14} /> Download Full Report
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
