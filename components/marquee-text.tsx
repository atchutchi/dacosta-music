export default function MarqueeText() {
  const marqueeItems = [
    "Caiiro",
    "Da Capo", 
    "Enoo Napa",
    "Artist Management",
    "Talent Management",
    "Creative Agency",
    "Electronic Music",
    "Creative Branding",
    "Global Branding"
  ];

  return (
    <div className="bg-white text-black py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Primeira sequência */}
        <div className="flex items-center">
          {marqueeItems.map((item, index) => (
            <div key={`first-${index}`} className="flex items-center">
              <span className="mx-4 text-sm font-medium uppercase tracking-wider">{item}</span>
              <span className="mx-4">•</span>
            </div>
          ))}
        </div>
        {/* Segunda sequência (duplicada para efeito infinito) */}
        <div className="flex items-center">
          {marqueeItems.map((item, index) => (
            <div key={`second-${index}`} className="flex items-center">
              <span className="mx-4 text-sm font-medium uppercase tracking-wider">{item}</span>
              <span className="mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
