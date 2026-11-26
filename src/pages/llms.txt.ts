// /llms.txt — ChatGPT, Claude, Perplexity, Gemini gibi yapay zekâ sistemlerinin
// siteyi hızlıca anlaması için düz metin özet. Veriler site dosyalarından
// otomatik alınır; içerik güncellendiğinde bu dosya da kendiliğinden güncellenir.
import type { APIRoute } from "astro";
import iletisim from "../data/iletisim.json";
import bilgiler from "../data/site-bilgileri.json";
import sss from "../data/sss.json";
import {
  akademikEgitimler,
  meslekiEgitimler,
} from "../data/egitimler-sabit.js";

const alanDosyalari = import.meta.glob("../data/calisma-alanlari/*.json", {
  eager: true,
  import: "default",
}) as Record<string, { baslik: string; aciklama: string; sira?: number; yayinda?: boolean }>;

const alanlar = Object.values(alanDosyalari)
  .filter((a) => a && a.baslik && a.yayinda !== false)
  .sort((a, b) => Number(a.sira ?? 999) - Number(b.sira ?? 999));

const SITE = "https://www.elifozgur.com";

export const GET: APIRoute = () => {
  const metin = `# Klinik Psikolog Elif Özgür Önal

> Elif Özgür Önal, Sakarya'nın Serdivan ilçesinde çocuk, ergen ve yetişkinlerle yüz yüze psikoterapi görüşmeleri yürüten bir klinik psikologdur. Uygunluk değerlendirmesi sonrasında online terapi görüşmeleri de yapmaktadır.

## Temel bilgiler

- Unvan: Klinik Psikolog
- Konum: ${iletisim.adres}
- Görüşme biçimi: Yüz yüze (Serdivan, Sakarya) ve online
- Çalışılan yaş grupları: Çocuk, ergen, yetişkin
- Telefon: ${iletisim.telefonGorunen}
- WhatsApp: https://wa.me/${iletisim.whatsapp.replace(/\D/g, "")}
- E-posta: ${iletisim.email}
- Google Haritalar: ${iletisim.haritaLinki}
- Instagram: ${bilgiler.instagram}
- DoktorSitesi profili: ${bilgiler.doktorsitesi}

## Çalışma alanları

${alanlar.map((a) => `- ${a.baslik}: ${a.aciklama}`).join("\n")}

## Akademik eğitim

${akademikEgitimler.map((e) => `- ${e.baslik}, ${e.kurum}`).join("\n")}

## Mesleki eğitimler

${meslekiEgitimler.map((e) => `- ${e.ad}${e.veren ? ` (${e.veren})` : ""}`).join("\n")}

## Sık sorulan sorular

${sss.sorular.map((s) => `### ${s.soru}\n\n${s.cevap}`).join("\n\n")}

## Sayfalar

- [Ana Sayfa](${SITE}/): Genel tanıtım, görüşme seçenekleri ve iletişim
- [Hakkımda](${SITE}/hakkimda/): Eğitim geçmişi ve mesleki yaklaşım
- [Eğitimler ve Sertifikalar](${SITE}/egitimler-ve-sertifikalar/): Akademik eğitim, mesleki eğitimler, seminerler
- [Çalışma Alanları](${SITE}/calisma-alanlari/): Bireysel terapi, ebeveyn danışmanlığı, psikolojik değerlendirme
- [İletişim](${SITE}/iletisim/): Adres, telefon, WhatsApp, e-posta ve harita

Son içerik güncellemesi: ${bilgiler.sonGuncelleme}
`;

  return new Response(metin, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
