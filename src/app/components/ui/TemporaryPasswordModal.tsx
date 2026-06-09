import { useState } from 'react';
import { Modal } from './Modal';
import { Copy, Check } from 'lucide-react';

interface TemporaryPasswordModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  email: string;
  temporaryPassword: string;
}

export function TemporaryPasswordModal({ open, onClose, name, email, temporaryPassword }: TemporaryPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="User Created Successfully" width={480}>
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-muted">
          <div className="font-bold text-[13px] text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Temporary Password</label>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
            <code className="flex-1 font-mono text-[13px] text-foreground break-all">{temporaryPassword}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 border border-border bg-card hover:bg-muted text-foreground"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-secondary border border-primary/20">
          <p className="text-xs text-primary">Share this temporary password with the user. They will be prompted to change it on first login.</p>
        </div>

        <button onClick={onClose} className="btn-primary w-full py-2.5">Close</button>
      </div>
    </Modal>
  );
}
