export default function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-border bg-surface font-display text-accent ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      TG
    </span>
  );
}
