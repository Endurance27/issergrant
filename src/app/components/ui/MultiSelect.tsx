import { useState, useRef, useEffect, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  onBlur?: () => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /**
   * When false, renders the selected chips read-only (remove still works, but
   * the search/add UI is hidden) — for contexts where the backend only
   * supports removing existing selections, not adding new ones.
   */
  allowAdd?: boolean;
  name?: string;
  "data-testid"?: string;
}

/**
 * Generic searchable multi-select with chip display, keyboard navigation,
 * and a plain value/onChange contract so it drops straight into Formik via
 * `formik.values.<field>` / `formik.setFieldValue('<field>', ids)`.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  onBlur,
  loading = false,
  disabled = false,
  placeholder = "Search and select…",
  searchPlaceholder,
  emptyMessage = "No results found",
  allowAdd = true,
  name,
  "data-testid": testId = "multi-select",
}: MultiSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = useMemo(
    () =>
      value
        .map((id) => options.find((o) => o.id === id))
        .filter((o): o is MultiSelectOption => !!o),
    [value, options],
  );

  // Already-selected options are excluded here, which is what structurally
  // prevents picking the same researcher twice.
  const availableOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options.filter((o) => {
      if (value.includes(o.id)) return false;
      if (!q) return true;
      return (
        o.label.toLowerCase().includes(q) ||
        (o.sublabel?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [options, value, search]);

  useEffect(() => {
    setHighlighted(0);
  }, [search, open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectOption = (id: string) => {
    if (value.includes(id)) return; // duplicate guard
    onChange([...value, id]);
    setSearch("");
    setHighlighted(0);
    inputRef.current?.focus();
  };

  const removeOption = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, availableOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = availableOptions[highlighted];
      if (opt) selectOption(opt.id);
    } else if (e.key === "Backspace" && search === "" && selectedOptions.length > 0) {
      removeOption(selectedOptions[selectedOptions.length - 1].id);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative" data-testid={testId}>
      <div
        className={`flex flex-wrap items-center gap-1.5 w-full px-2.5 py-2 rounded-xl bg-muted border border-border text-[13px] focus-within:border-primary/50 transition-colors ${disabled ? "opacity-50" : ""}`}
        onClick={() => {
          if (allowAdd && !disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {selectedOptions.map((opt) => (
          <span
            key={opt.id}
            data-testid="multi-select-chip"
            className="inline-flex items-center gap-1 pl-2 pr-1 py-1 rounded-lg bg-secondary text-primary font-medium text-[12px]"
          >
            {opt.label}
            {!disabled && (
              <button
                type="button"
                data-testid="multi-select-remove-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(opt.id);
                }}
                className="flex items-center justify-center rounded-full w-4 h-4 hover:bg-primary/15 transition-colors"
                aria-label={`Remove ${opt.label}`}
              >
                <X size={11} />
              </button>
            )}
          </span>
        ))}

        {allowAdd && (
          <input
            ref={inputRef}
            name={name}
            data-testid="multi-select-input"
            type="text"
            value={search}
            disabled={disabled}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedOptions.length === 0 ?
                placeholder
              : (searchPlaceholder ?? "Add more…")
            }
            className="flex-1 min-w-[120px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground py-0.5"
          />
        )}

        {loading && (
          <Loader2 size={14} className="animate-spin text-muted-foreground flex-shrink-0" />
        )}
        {allowAdd && !loading && (
          <ChevronDown size={14} className="text-muted-foreground flex-shrink-0 ml-auto" />
        )}
      </div>

      {allowAdd && open && !disabled && (
        <div
          data-testid="multi-select-dropdown"
          className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-xl shadow-lg border border-border bg-card py-1"
        >
          {loading ?
            <div className="px-3 py-3 text-[12px] text-muted-foreground flex items-center gap-2">
              <Loader2 size={13} className="animate-spin" /> Loading…
            </div>
          : availableOptions.length === 0 ?
            <div className="px-3 py-3 text-[12px] text-muted-foreground">{emptyMessage}</div>
          : availableOptions.map((opt, i) => (
              <button
                type="button"
                key={opt.id}
                data-testid="multi-select-option"
                onClick={() => selectOption(opt.id)}
                onMouseEnter={() => setHighlighted(i)}
                className={`w-full flex flex-col items-start px-3 py-2 text-left transition-colors ${i === highlighted ? "bg-muted" : "hover:bg-muted"}`}
              >
                <span className="text-[13px] font-medium text-foreground">{opt.label}</span>
                {opt.sublabel && (
                  <span className="text-[11px] text-muted-foreground">{opt.sublabel}</span>
                )}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
}
