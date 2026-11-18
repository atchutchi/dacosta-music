import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://www.dacosta-music.com'

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/images/whiteICON.png</image:loc>
      <image:title>Da Costa Music Logo</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/artists</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/artists/caiiro</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/images/artists/Caiiro-VIII.webp</image:loc>
      <image:title>Caiiro - Electronic Music Artist</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/artists/dacapo</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/images/artists/da-capo-X.webp</image:loc>
      <image:title>Da Capo - Electronic Music Artist</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/artists/enoonapa</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${baseUrl}/images/artists/Enoo-Napa0374.webp</image:loc>
      <image:title>Enoo Napa - Electronic Music Artist</image:title>
    </image:image>
  </url>

  <url>
    <loc>${baseUrl}/b3b</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/events</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${baseUrl}/shop</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${baseUrl}/services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url><loc>${baseUrl}/artists/djeff</loc><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/artists/breyth</loc><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/shop/product/akhet-ade-2026-limited-edition-oversized-t-shirt</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/shop/product/caiiro-london-2025-limited-edition-oversized-t-shirt</loc><changefreq>weekly</changefreq></url>
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
    }
  })
}