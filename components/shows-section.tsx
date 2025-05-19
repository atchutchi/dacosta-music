"use client";

import BitWidget from "@/components/BitWidget";

export function ShowsSection() {
  return (
    <div className="container mx-auto my-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Shows</h2>
      <BitWidget artistId="14528621" /> {/* Caiiro */}
      <BitWidget artistId="12850209" /> {/* Enoo Napa */}
      <BitWidget artistId="286561" />  {/* Da Capo */}
    </div>
  );
} 