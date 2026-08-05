import { BentoCatalog } from "@/components/bento/BentoCatalog";
import { PageLocationMap } from "@/components/PageLocationMap";
import { getReadyCakes } from "@/lib/site/repository";

export default function CatalogPage() {
  const readyCakes = getReadyCakes();

  return (
    <>
      <BentoCatalog cakes={readyCakes} />
      <PageLocationMap />
    </>
  );
}
