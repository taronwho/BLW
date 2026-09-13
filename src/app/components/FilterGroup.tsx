import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Jedna pojmenovaná skupina filtrů, ať je vidět, co k čemu patří. */
export function FilterGroup({
  nadpis,
  popis,
  children,
}: {
  nadpis: string;
  popis?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{nadpis}</span>
      {popis !== undefined && <span className="text-[11px] leading-snug text-muted">{popis}</span>}
      {children}
    </div>
  );
}

/** Upřesnění, které se nabídne, až když je co upřesňovat. */
export function Upresneni({ nadpis, children }: { nadpis: string; children: ReactNode }): ReactNode {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-line pl-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{nadpis}</span>
      {children}
    </div>
  );
}

interface ChipButtonProps {
  label: string;
  pressed: boolean;
  onClick: () => void;
  Icon?: LucideIcon;
  testId: string;
  /** Zvýrazněná nabídka, i když zrovna zapnutá není — typicky zkratka. */
  zvyraznene?: boolean;
  /** Tlačítko, které nic nezapíná (například „zrušit filtry"). */
  tlumene?: boolean;
}

/**
 * Samostatný čip mimo skupinu. Dotyková plocha má 44 px podle docs/SPEC.md
 * kap. 6, vidět je menší štítek — jinak by filtry zabraly celou obrazovku.
 */
export function ChipButton({
  label,
  pressed,
  onClick,
  Icon,
  testId,
  zvyraznene = false,
  tlumene = false,
}: ChipButtonProps): ReactNode {
  const klid = zvyraznene
    ? 'border-accent/40 bg-accent-soft text-accent'
    : tlumene
      ? 'border-line bg-paper text-muted'
      : 'border-line bg-surface text-ink';
  return (
    <button
      type="button"
      {...(tlumene ? {} : { 'aria-pressed': pressed })}
      data-testid={testId}
      onClick={onClick}
      className="flex min-h-touch items-center"
    >
      <span
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
          pressed ? 'border-accent bg-accent text-on-accent shadow-soft' : klid
        }`}
      >
        {Icon !== undefined && <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
        {label}
      </span>
    </button>
  );
}
