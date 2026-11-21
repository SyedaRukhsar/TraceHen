// TraceHen assets — single map for every image/PDF bundled from the locked HTML.
// Screens import from here; never inline a base64 string and never hard-code an
// asset path in a screen. Metro resolves these via require() at build time.

export const images = {
  heroFarm: require('../../assets/images/hero-farm.jpg'),
  onboardingVet: require('../../assets/images/onboarding-vet.jpg'),
  onboardingPacks: require('../../assets/images/onboarding-packs.jpg'),
  map: require('../../assets/images/map.png'),
  adminHero: require('../../assets/images/admin-hero.jpg'),
  plantWorkers: require('../../assets/images/plant-workers.jpg'),
  shopCages: require('../../assets/images/shop-cages.jpg'),
  martShelves: require('../../assets/images/mart-shelves.jpg'),
  signboardFarm: require('../../assets/images/signboard-farm.jpg'),
  docCnic1: require('../../assets/images/doc-cnic-1.jpg'),
  docCnic2: require('../../assets/images/doc-cnic-2.jpg'),
  docSignboard: require('../../assets/images/doc-signboard.jpg'),
} as const;

export type ImageKey = keyof typeof images;

// PDF documents bundled from the HTML seed data (assets/documents/).
// The key is the file name (without .pdf). The store maps a document's
// (name, owner) to the right bundled PDF; see src/services/documents.ts.
export const documents = {
  farmLicenseApp1: require('../../assets/documents/farm-license-app1.pdf'),
  clinicLicenseShared: require('../../assets/documents/clinic-license-shared.pdf'),
  shopLicenseApp3: require('../../assets/documents/shop-license-app3.pdf'),
  businessLicenseApp4: require('../../assets/documents/business-license-app4.pdf'),
  plantRegistrationCertificateShared: require('../../assets/documents/plant-registration-certificate-shared.pdf'),
  businessLicenseApp5: require('../../assets/documents/business-license-app5.pdf'),
  businessRegistrationShared: require('../../assets/documents/business-registration-shared.pdf'),
  businessLicenseShared: require('../../assets/documents/business-license-shared.pdf'),
  // The Plant's own license PDF (content-verified: "Plant license").
  // The bundled file is named business-license-shared.pdf; plantLicense is
  // the alias the Plant module uses for it.
  plantLicense: require('../../assets/documents/business-license-shared.pdf'),
  plantRegistrationCertificateShared2: require('../../assets/documents/plant-registration-certificate-shared-2.pdf'),
} as const;

export type DocumentKey = keyof typeof documents;
