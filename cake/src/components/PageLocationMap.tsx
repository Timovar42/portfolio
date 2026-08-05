import { LocationMap } from "@/components/LocationMap";
import { getSiteSettings } from "@/lib/site/repository";

export function PageLocationMap() {
  const settings = getSiteSettings();

  return (
    <LocationMap
      settings={{
        address: settings.address,
        lat: settings.lat,
        lng: settings.lng,
      }}
    />
  );
}
