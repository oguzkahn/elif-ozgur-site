// Site genelinde kullanılan yapılandırılmış veri (JSON-LD).
// Google ve yapay zekâ arama motorları kişi, işletme ve site bilgilerini
// buradan okur. Bilgiler iletisim.json, site-bilgileri.json ve
// egitimler-sabit.js dosyalarından otomatik alınır; elle güncellemeye gerek yoktur.

import iletisim from "./iletisim.json";
import bilgiler from "./site-bilgileri.json";
import gorseller from "./gorseller.json";
import { akademikEgitimler, meslekiEgitimler } from "./egitimler-sabit.js";

export const SITE = "https://www.elifozgur.com";
export const SITE_ADI = "Klinik Psikolog Elif Özgür Önal";

export const KISI_ID = `${SITE}/#elif-ozgur-onal`;
export const ISLETME_ID = `${SITE}/#isletme`;
export const WEBSITE_ID = `${SITE}/#website`;

export const tamUrl = (yol) => new URL(yol, SITE).href;

const fotograf = tamUrl(gorseller.anaSayfaFotografi);
const sameAs = [bilgiler.instagram, bilgiler.doktorsitesi].filter(Boolean);

// "Arabacıalanı, Eski Kazım Paşa Cd. No:45 D:102, 54050 Serdivan/Sakarya"
// biçimindeki adresi Google'ın beklediği parçalara ayırır.
function adresParcala(adres) {
  const postaKodu = adres.match(/\b\d{5}\b/)?.[0];
  const sokak = postaKodu ? adres.split(postaKodu)[0].replace(/[,\s]+$/, "") : adres;
  return {
    "@type": "PostalAddress",
    streetAddress: sokak,
    addressLocality: "Serdivan",
    addressRegion: "Sakarya",
    ...(postaKodu && { postalCode: postaKodu }),
    addressCountry: "TR",
  };
}

const uzmanlikAlanlari = [
  "Klinik psikoloji",
  "Psikoterapi",
  "Çocuk terapisi",
  "Ergen terapisi",
  "Yetişkin terapisi",
  "Ebeveyn danışmanlığı",
  "Psikolojik değerlendirme",
  "Bilişsel Davranışçı Terapi (BDT)",
  "EMDR",
  "Deneyimsel Oyun Terapisi",
  "Online terapi",
];

export const kisi = {
  "@type": "Person",
  "@id": KISI_ID,
  name: "Elif Özgür Önal",
  givenName: "Elif",
  familyName: "Özgür Önal",
  jobTitle: "Klinik Psikolog",
  description:
    "Sakarya Serdivan'da çocuk, ergen ve yetişkinlerle yüz yüze ve online psikoterapi görüşmeleri yürüten klinik psikolog.",
  url: tamUrl("/hakkimda/"),
  image: fotograf,
  email: iletisim.email,
  telephone: iletisim.telefon,
  worksFor: { "@id": ISLETME_ID },
  workLocation: { "@id": ISLETME_ID },
  alumniOf: akademikEgitimler.map((e) => ({
    "@type": "CollegeOrUniversity",
    name: e.kurum,
  })),
  hasCredential: akademikEgitimler.map((e) => ({
    "@type": "EducationalOccupationalCredential",
    name: e.baslik,
    credentialCategory: "degree",
    recognizedBy: { "@type": "CollegeOrUniversity", name: e.kurum },
  })),
  knowsAbout: [
    ...uzmanlikAlanlari,
    ...meslekiEgitimler.map((e) => e.ad),
  ],
  knowsLanguage: "tr",
  sameAs,
};

export const isletme = {
  "@type": ["MedicalBusiness", "ProfessionalService"],
  "@id": ISLETME_ID,
  name: SITE_ADI,
  description:
    "Sakarya Serdivan'da çocuk, ergen ve yetişkinlere yönelik yüz yüze ve online psikoterapi, ebeveyn danışmanlığı ve psikolojik değerlendirme.",
  url: `${SITE}/`,
  image: fotograf,
  logo: tamUrl("/favicon.svg"),
  telephone: iletisim.telefon,
  email: iletisim.email,
  address: adresParcala(iletisim.adres),
  hasMap: iletisim.haritaLinki,
  areaServed: [
    { "@type": "City", name: "Serdivan" },
    { "@type": "City", name: "Sakarya" },
    { "@type": "Country", name: "Türkiye" },
  ],
  founder: { "@id": KISI_ID },
  employee: { "@id": KISI_ID },
  knowsAbout: uzmanlikAlanlari,
  availableService: [
    "Bireysel Terapi",
    "Çocuk ve Ergen Terapisi",
    "Ebeveyn Danışmanlığı",
    "Psikolojik Değerlendirme",
    "Yüz Yüze Terapi",
    "Online Terapi",
  ].map((name) => ({ "@type": "MedicalTherapy", name })),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Randevu ve bilgi",
    telephone: iletisim.telefon,
    email: iletisim.email,
    availableLanguage: "Turkish",
  },
  sameAs,
};

export const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: SITE_ADI,
  inLanguage: "tr-TR",
  publisher: { "@id": KISI_ID },
  about: { "@id": KISI_ID },
};

export function sayfaYolu(baslik, yol) {
  return [
    { ad: "Ana Sayfa", yol: "/" },
    ...(yol === "/" ? [] : [{ ad: baslik, yol }]),
  ];
}

export function breadcrumb(parcalar) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: parcalar.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.ad,
      item: tamUrl(p.yol),
    })),
  };
}

export function sssSemasi(sorular) {
  return {
    "@type": "FAQPage",
    mainEntity: sorular.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  };
}
