import { BentoLanding } from "@/components/bento/BentoLanding";
import { getSiteSettings } from "@/lib/site/repository";

export default function HomePage() {
  const settings = getSiteSettings();

  return <BentoLanding settings={settings} />;
}
