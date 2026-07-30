import { personJsonLd } from "@/lib/site";

export function PersonStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
