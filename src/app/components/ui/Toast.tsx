import { useState, useCallback, createContext, useContext } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={15} />,
  error:   <XCircle size={15} />,
  warning: <AlertTriangle size={15} />,
  info:    <Info size={15} />,
};

const styles: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: '#F0FDF4', border: '#86EFAC', icon: '#16A34A', text: '#15803D' },
  error:   { bg: '#FEF2F2', border: '#FCA5A5', icon: '#DC2626', text: '#B91C1C' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', icon: '#D97706', text: '#B45309' },
  info:    { bg: 'var(--secondary)', border: 'var(--primary)', icon: 'var(--primary)', text: 'var(--primary)' },
};

let _nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++_nextId;
    setToasts(prev => [...prev.slice(-2), { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none w-[340px]">
        {toasts.map(t => {
          const s = styles[t.type];
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-3 fade-in duration-200 pointer-events-auto"
              style={{ background: s.bg, borderColor: s.border }}
            >
              <span style={{ color: s.icon, flexShrink: 0, marginTop: 1 }}>{icons[t.type]}</span>
              <span className="flex-1 text-sm font-medium leading-snug" style={{ color: s.text }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="flex-shrink-0 hover:opacity-60 transition-opacity" style={{ color: s.icon }}>
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
