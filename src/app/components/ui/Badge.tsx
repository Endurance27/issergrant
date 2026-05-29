const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  'Draft':          { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
  'Submitted':      { bg: 'var(--secondary)', text: 'var(--primary)', dot: 'var(--primary)' },
  'Under Review':   { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' },
  'Approved':       { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Rejected':       { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444' },
  'Paid':           { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Pending':        { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  'Active':         { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Suspended':      { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444' },
  'Open':           { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Closed':         { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
  'Locked':         { bg: '#F1F5F9', text: '#475569', dot: '#64748B' },
  'Revised':        { bg: '#FDF4FF', text: '#7E22CE', dot: '#A855F7' },
  'Completed':      { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Admin':          { bg: 'var(--secondary)', text: 'var(--primary)', dot: 'var(--primary)' },
  'Researcher':     { bg: '#EAF0F6', text: '#2D6EA8', dot: '#2D6EA8' },
  'Assistant Researcher': { bg: '#F7F3EC', text: '#8C7040', dot: '#B79A64' },
  'Finance Officer':{ bg: '#EDECEB', text: '#403C3A', dot: '#403C3A' },
};

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'md' }: BadgeProps) {
  const config = statusConfig[status] || { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
  const fontSize = size === 'sm' ? 10 : 11;
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full whitespace-nowrap font-semibold"
      style={{ background: config.bg, color: config.text, fontSize, padding }}
    >
      <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: config.dot }} />
      {status}
    </span>
  );
}
