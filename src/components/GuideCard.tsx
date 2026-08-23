import Link from "next/link";

export type GuideCardData = {
  userId: string;
  name: string | null;
  city: string;
  countryName?: string;
  languages: string[];
};

export default function GuideCard({
  guide,
  className = "",
}: {
  guide: GuideCardData;
  className?: string;
}) {
  return (
    <Link href={`/guides/${guide.userId}`} prefetch={false} className={className}>
      <div className="card-shine flex h-full flex-col gap-2 rounded-xl p-4">
        <p className="text-[14.5px] font-semibold text-text">{guide.name ?? "Guide"}</p>
        <p className="text-[12px] text-muted">
          {guide.city}
          {guide.countryName ? `, ${guide.countryName}` : ""}
        </p>
        {guide.languages.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {guide.languages.map((l) => (
              <span
                key={l}
                className="rounded-full border border-border px-2 py-0.5 text-[10.5px] font-semibold text-muted uppercase"
              >
                {l}
              </span>
            ))}
          </div>
        )}
        <span className="mt-auto pt-2 text-[12px] font-semibold text-accent">
          Message &rarr;
        </span>
      </div>
    </Link>
  );
}
