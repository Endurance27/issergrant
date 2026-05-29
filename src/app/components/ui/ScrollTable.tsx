import { useRef, useEffect, useState } from "react";

interface ScrollTableProps {
  children: React.ReactNode;
}

export function ScrollTable({ children }: ScrollTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setOverflows(el.scrollWidth > el.clientWidth + 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };

    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className="overflow-x-auto">
        {children}
      </div>
      {overflows && !atEnd && (
        <div className="absolute inset-y-0 right-0 w-10 pointer-events-none rounded-r-xl"
          style={{ background: 'linear-gradient(to right, transparent, var(--card))' }} />
      )}
      {overflows && (
        <div className="flex items-center justify-end px-4 py-1.5 border-t border-border bg-muted/50">
          <span className="text-[10px] text-muted-foreground">← scroll to see more →</span>
        </div>
      )}
    </div>
  );
}
