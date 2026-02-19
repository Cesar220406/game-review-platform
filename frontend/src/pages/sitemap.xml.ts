import type { APIRoute } from 'astro';
import { getVideojuegos, getArticulos, getGeneros } from '../lib/api.js';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://pixelcrit.es';

  const [videojuegos, articulos, generos] = await Promise.all([
    getVideojuegos().catch(() => []),
    getArticulos().catch(() => []),
    getGeneros().catch(() => []),
  ]);

  const now = new Date().toISOString();

  const staticUrls = [
    { loc: `${baseUrl}/`,          lastmod: now, priority: '1.0' },
    { loc: `${baseUrl}/videojuegos`, lastmod: now, priority: '0.9' },
    { loc: `${baseUrl}/blog`,       lastmod: now, priority: '0.9' },
    { loc: `${baseUrl}/generos`,    lastmod: now, priority: '0.8' },
    { loc: `${baseUrl}/contacto`,   lastmod: now, priority: '0.7' },
  ];

  const videojuegoUrls = videojuegos.map((v: any) => ({
    loc: `${baseUrl}/videojuegos/${v.slug}`,
    lastmod: now,
    priority: '0.8',
  }));

  const articuloUrls = articulos.map((a: any) => ({
    loc: `${baseUrl}/blog/${a.slug}`,
    lastmod: a.fechaPublicacion
      ? new Date(a.fechaPublicacion).toISOString()
      : now,
    priority: '0.7',
  }));

  const generoUrls = generos.map((g: any) => ({
    loc: `${baseUrl}/generos/${g.slug}`,
    lastmod: now,
    priority: '0.6',
  }));

  const urls = [...staticUrls, ...videojuegoUrls, ...articuloUrls, ...generoUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
