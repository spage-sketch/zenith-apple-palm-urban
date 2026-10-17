import { clsx, type ClassValue } from "clsx";
import { ShieldAlert, ShieldCheck, X } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { fmt } from "@/lib/nutrition/calc";
import { SALT_LIMIT } from "@/lib/nutrition/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  variant = "ghost",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "quiet";
}) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-lime text-lime-ink hover:bg-lime/90",
        variant === "ghost" && "bg-surface-2 text-fg shadow-ring hover:bg-surface-2/80",
        variant === "danger" && "bg-salt/15 text-salt hover:bg-salt/25",
        variant === "quiet" && "h-10 bg-transparent text-muted hover:bg-surface-2 hover:text-fg",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-3 sm:items-center sm:p-6">
      <button className="absolute inset-0 cursor-default" aria-label="Zatvori" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-surface p-5 shadow-ring sm:p-6",
          wide ? "max-w-2xl" : "max-w-md",
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium text-fg">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Zatvori"
            className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function SaltBadge({ salt }: { salt: number }) {
  const high = salt >= SALT_LIMIT;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        high ? "bg-salt/15 text-salt" : "bg-lime/12 text-lime",
      )}
    >
      {high ? <ShieldAlert className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
      {high ? "Visoka sol" : "Niska sol"}
      <span className="tabular-nums">{fmt(salt, 2)} g</span>
    </span>
  );
}

export function Meter({
  value,
  max,
  tone,
}: {
  value: number;
  max: number;
  tone: "lime" | "cream" | "olive" | "salt";
}) {
  const ratio = max > 0 ? value / max : 0;
  const over = ratio > 1;
  const width = `${Math.min(100, ratio * 100)}%`;
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-bg">
      <div
        className={cn(
          "h-full rounded-full",
          over || tone === "salt" ? "bg-salt" : tone === "lime" ? "bg-lime" : tone === "cream" ? "bg-cream" : "bg-olive",
        )}
        style={{ width }}
      />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-xl bg-bg px-3 text-sm text-fg shadow-ring outline-none placeholder:text-faint";
