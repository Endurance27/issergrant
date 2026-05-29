import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 560 }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative rounded-xl shadow-2xl w-full overflow-hidden bg-card border border-border" style={{ maxWidth: width }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-muted text-muted-foreground"
            style={{ width: 28, height: 28 }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '80vh' }}>{children}</div>
      </div>
    </div>
  );
}
