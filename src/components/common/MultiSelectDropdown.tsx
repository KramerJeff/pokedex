import { useEffect, useId, useRef, useState } from 'react';

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
  /** Optional color dot shown before the label (used for Pokémon types). */
  swatchColor?: string;
  /** Optional native tooltip on the option row (used for generation regions). */
  title?: string;
}

interface MultiSelectDropdownProps<T extends string | number> {
  /** Text shown on the trigger button (e.g. "Type", "Generation"). */
  label: string;
  options: DropdownOption<T>[];
  selectedValues: T[];
  onToggle: (value: T) => void;
  /** When provided, a "Clear" action appears at the bottom of the panel. */
  onClear?: () => void;
}

export function MultiSelectDropdown<T extends string | number>({
  label,
  options,
  selectedValues,
  onToggle,
  onClear,
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close on outside click or Escape while the panel is open.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const count = selectedValues.length;

  return (
    <div ref={containerRef} className="relative w-full lg:w-auto">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 lg:h-[42px] lg:w-auto lg:min-w-[160px]"
      >
        <span className="flex items-center gap-2">
          {label}
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg lg:w-56"
        >
          {options.map((option) => {
            const checked = selectedValues.includes(option.value);
            return (
              <label
                key={String(option.value)}
                title={option.title}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option.value)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                {option.swatchColor && (
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: option.swatchColor }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            );
          })}

          {onClear && count > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="mt-1 w-full border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
