import { Bell, CheckCircle2, DollarSign, Clock, AlertTriangle, Info, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { PageHeader } from "../ui/PageHeader";
import { Modal } from "../ui/Modal";
import type { Notification } from "../../data/mockData";

const typeConfig = {
  approval:  { icon: <CheckCircle2 size={16} />, color: '#22C55E', bg: '#ECFDF5', label: 'Approval' },
  deadline:  { icon: <Clock size={16} />, color: '#F59E0B', bg: '#FFFBEB', label: 'Deadline' },
  payment:   { icon: <DollarSign size={16} />, color: 'var(--primary)', bg: 'var(--secondary)', label: 'Payment' },
  rejection: { icon: <AlertTriangle size={16} />, color: '#EF4444', bg: '#FEF2F2', label: 'Rejection' },
  system:    { icon: <Info size={16} />, color: '#8B5CF6', bg: '#F5F3FF', label: 'System' },
};

type TypeFilter = 'All' | keyof typeof typeConfig;

export function Notifications() {
  const { notifications, markNotifRead, markAllNotifRead, dismissNotif } = useAppContext();
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [selected, setSelected] = useState<Notification | null>(null);

  const displayed = notifications
    .filter(n => filter === 'Unread' ? !n.read : true)
    .filter(n => typeFilter === 'All' ? true : n.type === typeFilter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div data-testid="notifications-page">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
        action={
          <div className="flex gap-2">
            {(['All', 'Unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${filter === f ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
                {f} {f === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
            {unreadCount > 0 && (
              <button onClick={markAllNotifRead} className="btn-ghost text-xs">Mark all read</button>
            )}
          </div>
        }
      />

      {/* Filter by type */}
      <div className="flex gap-2 flex-wrap mb-5" data-testid="notification-type-filters">
        <button
          onClick={() => setTypeFilter('All')}
          className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${typeFilter === 'All' ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}
        >
          All Types
        </button>
        {(Object.keys(typeConfig) as (keyof typeof typeConfig)[]).map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${typeFilter === t ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}
          >
            {typeConfig[t].label}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border" data-testid="notifications-empty">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bell size={24} className="text-muted-foreground opacity-40" />
          </div>
          <div className="font-bold text-sm text-foreground">No notifications</div>
          <div className="text-xs text-muted-foreground mt-1">
            {filter === 'Unread' || typeFilter !== 'All' ? 'Try changing your filters' : "You're all caught up!"}
          </div>
        </div>
      ) : (
        <div className="space-y-2" data-testid="notifications-list">
          {displayed.map(n => {
            const cfg = typeConfig[n.type] || typeConfig.system;
            return (
              <div
                key={n.id}
                data-testid="notification-row"
                onClick={() => { markNotifRead(n.id); setSelected(n); }}
                className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-150 group hover:shadow-md"
                style={{ background: n.read ? 'var(--card)' : 'var(--secondary)', border: `1px solid ${n.read ? 'var(--border)' : 'color-mix(in srgb, var(--primary) 20%, transparent)'}` }}
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 mt-0.5" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`text-sm text-foreground ${n.read ? 'font-semibold' : 'font-bold'}`}>{n.title}</div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className="rounded-full mt-1.5 bg-primary inline-block w-[7px] h-[7px]" />}
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      <button onClick={e => { e.stopPropagation(); dismissNotif(n.id); }}
                        className="flex items-center justify-center rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:bg-muted">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification details modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Notification Details"
        width={480}
      >
        {selected && (() => {
          const cfg = typeConfig[selected.type] || typeConfig.system;
          return (
            <div className="space-y-4" data-testid="notification-details">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div>
                  <div className="font-bold text-[15px] text-foreground">{selected.title}</div>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] inline-block mt-1" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-foreground leading-relaxed p-3 rounded-xl bg-muted">
                {selected.message}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{selected.time}</span>
                <span>{selected.read ? 'Read' : 'Unread'}</span>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
