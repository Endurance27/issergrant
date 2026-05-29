import { Bell, CheckCircle2, DollarSign, Clock, AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";
import { notifications as initial } from "../../data/mockData";
import { PageHeader } from "../ui/PageHeader";
import type { Notification } from "../../data/mockData";

const typeConfig = {
  approval:  { icon: <CheckCircle2 size={16} />, color: '#22C55E', bg: '#ECFDF5' },
  deadline:  { icon: <Clock size={16} />, color: '#F59E0B', bg: '#FFFBEB' },
  payment:   { icon: <DollarSign size={16} />, color: 'var(--primary)', bg: 'var(--secondary)' },
  rejection: { icon: <AlertTriangle size={16} />, color: '#EF4444', bg: '#FEF2F2' },
  system:    { icon: <Info size={16} />, color: '#8B5CF6', bg: '#F5F3FF' },
};

export function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  const displayed = filter === 'Unread' ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
        action={
          <div className="flex gap-2">
            {(['All', 'Unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[13px] border transition-all ${filter === f ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
                {f} {f === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="btn-ghost">
                Mark all read
              </button>
            )}
          </div>
        }
      />

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bell size={24} className="text-muted-foreground opacity-50" />
          </div>
          <div className="font-bold text-base text-foreground">No notifications</div>
          <div className="text-[13px] text-muted-foreground mt-1">You're all caught up!</div>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(n => {
            const cfg = typeConfig[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150 group hover:shadow-sm"
                style={{ background: n.read ? 'var(--card)' : 'var(--secondary)', border: `1px solid ${n.read ? 'var(--border)' : 'var(--primary)'}`, borderLeftWidth: n.read ? undefined : 3 }}
              >
                <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ width: 36, height: 36, background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`text-sm text-foreground ${n.read ? 'font-semibold' : 'font-bold'}`}>{n.title}</div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className="rounded-full inline-block mt-1.5 bg-primary" style={{ width: 7, height: 7 }} />}
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      <button
                        onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                        className="flex items-center justify-center rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted text-muted-foreground"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
