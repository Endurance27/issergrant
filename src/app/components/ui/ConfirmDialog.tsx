import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', confirmColor = '#EF4444',
  onConfirm, onCancel, children
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
      <div className="relative rounded-xl shadow-2xl w-full max-w-sm bg-card border border-border" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: confirmColor + '18' }}>
              <AlertTriangle size={20} style={{ color: confirmColor }} />
            </div>
            <div>
              <div className="font-bold text-[15px] text-foreground mb-1">{title}</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed">{message}</div>
            </div>
          </div>
          {children && <div className="mb-4">{children}</div>}
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-secondary flex-1 py-2.5">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg text-white font-bold text-[13px] hover:opacity-90 transition-opacity" style={{ background: confirmColor }}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
