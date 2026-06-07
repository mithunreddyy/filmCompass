import type { OMDbEnrichment } from "@/services/omdb";

interface OMDbEnrichmentPanelProps {
  enrichment: OMDbEnrichment;
}

export function OMDbEnrichmentPanel({ enrichment }: OMDbEnrichmentPanelProps) {
  const items = [
    { label: "IMDb", value: enrichment.imdbRating?.toFixed(1) },
    { label: "Metascore", value: enrichment.metascore?.toString() },
    {
      label: "Rotten Tomatoes",
      value: enrichment.rottenTomatoes ? `${enrichment.rottenTomatoes}%` : null,
    },
    { label: "Box Office", value: enrichment.boxOffice },
  ].filter((item) => item.value);

  if (!items.length && !enrichment.awards) return null;

  return (
    <div className="fc-card !p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        IMDb / OMDb enrichment
      </h3>
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      )}
      {enrichment.awards && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {enrichment.awards}
        </p>
      )}
    </div>
  );
}
