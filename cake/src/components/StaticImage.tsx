import { resolveCakeImage } from "@/lib/data/cake-images";

type StaticImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/** Картинки тортов вшиты в сборку как data URL — одинаково на SSR и после гидратации. */
export function StaticImage({
  src,
  alt,
  fill,
  priority,
  className = "",
}: StaticImageProps) {
  const resolved = resolveCakeImage(src);

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}
