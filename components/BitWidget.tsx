"use client";

type BitWidgetProps = { artistId: string };

export default function BitWidget({ artistId }: BitWidgetProps) {
  // Default to "dacosta" if the environment variable is not set
  const appId = process.env.NEXT_PUBLIC_BIT_APP_ID || "dacosta";
  
  return (
    <iframe
      src={`https://widget.bandsintown.com/${artistId}?app_id=${appId}&theme=light&language=pt`}
      loading="lazy"
      width="100%"
      height="600"
      style={{ border: 0, marginBottom: "2rem" }}
      allow="clipboard-write; encrypted-media; picture-in-picture"
    />
  );
} 