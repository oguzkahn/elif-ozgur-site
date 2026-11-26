import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import bilgiler from './src/data/site-bilgileri.json' with { type: 'json' };

// "19.11.2026" -> Date (sitemap'teki <lastmod> için)
const [gun, ay, yil] = (bilgiler.sonGuncelleme || '').split('.');
const sonGuncelleme = yil ? new Date(`${yil}-${ay}-${gun}T00:00:00Z`) : new Date();

export default defineConfig({
  site: 'https://www.elifozgur.com',
  // Tüm adresler "/" ile biter; Cloudflare'in /hakkimda -> /hakkimda/ yönlendirmesini önler.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        item.lastmod = sonGuncelleme.toISOString();
        item.changefreq = 'monthly';
        item.priority = item.url === 'https://www.elifozgur.com/' ? 1.0 : 0.8;
        return item;
      },
    }),
  ],
});
