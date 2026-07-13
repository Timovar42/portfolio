import { READY_CAKES, SITE_CONFIG } from "@/lib/data/catalog";
import type { ReadyCake, SiteSettings } from "@/lib/types";

const DEFAULT_DESCRIPTION =
  "Торты, пирожные и десерты на заказ из натуральных продуктов — для любого повода. Каждый торт собирается вручную: вы выбираете начинку, крем и декор.";

export function getSiteSettings(): SiteSettings {
  return {
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    description: DEFAULT_DESCRIPTION,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.location.address,
    lat: SITE_CONFIG.location.lat,
    lng: SITE_CONFIG.location.lng,
  };
}

export function getReadyCakes(): ReadyCake[] {
  return READY_CAKES;
}

export function getReadyCake(id: number): ReadyCake | undefined {
  return READY_CAKES.find((cake) => cake.id === id);
}
