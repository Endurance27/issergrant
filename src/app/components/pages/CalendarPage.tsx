import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from "lucide-react";
import { grantCalls, milestones } from "../../data/mockData";
import { PageHeader } from "../ui/PageHeader";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface CalendarEvent {
  date: string;
  label: string;
  type: 'deadline' | 'milestone' | 'award' | 'meeting' | 'review';
  color: string;
}

// Board meetings and proposal review schedules — organization-wide calendar items
const meetingsAndReviews: CalendarEvent[] = [
  { date: '2025-06-20', label: 'Research Directorate Board Meeting', type: 'meeting', color: '#0EA5E9' },
  { date: '2025-07-04', label: 'Quarterly Funding Review Meeting', type: 'meeting', color: '#0EA5E9' },
  { date: '2025-06-25', label: 'Proposal Review Panel — Biomedical', type: 'review', color: '#A855F7' },
  { date: '2025-07-18', label: 'Proposal Review Panel — Climate Science', type: 'review', color: '#A855F7' },
  { date: '2025-08-08', label: 'Mid-Year Budget Review', type: 'review', color: '#A855F7' },
];

const events: CalendarEvent[] = [
  ...grantCalls.map(g => ({ date: g.deadline, label: g.title, type: 'deadline' as const, color: '#EF4444' })),
  ...milestones.map(m => ({ date: m.dueDate, label: m.title, type: 'milestone' as const, color: 'var(--chart-1)' })),
  ...meetingsAndReviews,
];

export function CalendarPage() {
  const today = new Date(2025, 4, 29);
  const [current, setCurrent] = useState({ year: 2025, month: 6 });

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const daysInPrev = new Date(current.year, current.month, 0).getDate();

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const getEventsForDate = (day: number) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const cells: { day: number; type: 'prev' | 'current' | 'next' }[] = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: daysInPrev - firstDay + 1 + i, type: 'prev' });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, type: 'current' });
  const remaining = totalCells - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: 'next' });

  return (
    <div>
      <PageHeader
        title="Calendar & Deadlines"
        subtitle="Track grant deadlines, milestones, and key dates"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-5 bg-card border border-border">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prev} className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-extrabold text-base text-foreground">{MONTHS[current.month]} {current.year}</h2>
            <button onClick={next} className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.05em]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              const cellEvents = cell.type === 'current' ? getEventsForDate(cell.day) : [];
              const isToday = cell.type === 'current' && current.year === today.getFullYear() && current.month === today.getMonth() && cell.day === today.getDate();
              return (
                <div key={i}
                  className={`rounded-lg p-1.5 min-h-[56px] cursor-pointer border transition-colors ${isToday ? 'bg-secondary border-primary/30' : 'border-transparent hover:bg-muted'}`}
                  style={{ opacity: cell.type !== 'current' ? 0.35 : 1 }}
                >
                  <div className={`text-center mb-1 text-[13px] ${isToday ? 'font-extrabold text-primary' : 'font-medium text-foreground'}`}>{cell.day}</div>
                  <div className="space-y-0.5">
                    {cellEvents.slice(0, 2).map((ev, j) => (
                      <div key={j} className="rounded px-1 py-0.5 truncate text-[9px] font-semibold leading-snug" style={{ background: ev.color + '20', color: ev.color }}>
                        {ev.label.split(' ').slice(0, 2).join(' ')}
                      </div>
                    ))}
                    {cellEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground pl-0.5">+{cellEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="rounded-sm inline-block w-2.5 h-2.5 bg-red-500" />
              <span className="text-[11px] text-muted-foreground">Grant Deadlines</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-sm inline-block w-2.5 h-2.5 bg-chart-1" />
              <span className="text-[11px] text-muted-foreground">Milestones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-sm inline-block w-2.5 h-2.5" style={{ background: '#0EA5E9' }} />
              <span className="text-[11px] text-muted-foreground">Meetings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-sm inline-block w-2.5 h-2.5" style={{ background: '#A855F7' }} />
              <span className="text-[11px] text-muted-foreground">Review Schedules</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card border border-border">
          <h3 className="font-bold text-sm text-foreground mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => {
              const daysUntil = Math.ceil((new Date(ev.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysUntil <= 14;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted" style={{ borderLeft: `3px solid ${ev.color}` }}>
                  <div className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5" style={{ background: ev.color + '20', color: ev.color }}>
                    {ev.type === 'deadline' ? <AlertCircle size={13} /> : <Calendar size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-foreground truncate">{ev.label}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="font-mono text-[10px] text-muted-foreground">{ev.date}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold whitespace-nowrap" style={{ background: isUrgent ? '#FEF2F2' : 'var(--card)', color: isUrgent ? '#EF4444' : 'var(--muted-foreground)' }}>
                    {daysUntil}d
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
