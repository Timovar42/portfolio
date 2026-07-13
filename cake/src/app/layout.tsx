import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConditionalLocationMap } from "@/components/ConditionalLocationMap";
import { MainContent } from "@/components/MainContent";
import { ContactButton } from "@/components/ContactButton";
import { getSiteSettings } from "@/lib/site/repository";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Сладкие Торты — домашняя кондитерская",
  description:
    "Премиальные торты на заказ: свадебные, детские, корпоративные. Капкейки и десерты ручной работы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSiteSettings();

  return (
    <html lang="ru" data-static-export="true" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=decodeURIComponent(location.pathname.replace(/\\\\/g,"/"));var i=p.toLowerCase().lastIndexOf("/out/");var prefix="./";if(i>=0){var r=p.slice(i+5);if(r.endsWith("/index.html"))r=r.slice(0,-11);if(r.endsWith("/"))r=r.slice(0,-1);var d=r?r.split("/").filter(Boolean).length:0;prefix=d===0?"./":"../".repeat(d);}document.documentElement.setAttribute("data-asset-prefix",prefix);if(location.protocol!=="file:")return;function fixHrefs(){document.querySelectorAll("a[href]").forEach(function(a){var h=a.getAttribute("href");if(!h||h.startsWith("http")||h.startsWith("tel:")||h.startsWith("mailto:")||h.startsWith("#"))return;if(h.endsWith("/"))a.setAttribute("href",h+"index.html");else if(h.endsWith(".html")||/\\.[a-z0-9]+$/i.test(h.split("/").pop()||""))return;else if(h.startsWith("./")||h.startsWith("../"))a.setAttribute("href",h+"/index.html")})}document.addEventListener("click",function(e){var a=e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");if(!h||h.startsWith("http")||h.startsWith("tel:")||h.startsWith("mailto:")||h.startsWith("#"))return;e.preventDefault();e.stopImmediatePropagation();location.href=h},true);fixHrefs();document.addEventListener("DOMContentLoaded",fixHrefs)})();`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-clip bg-cream text-chocolate antialiased">
        <Header settings={settings} />
        <MainContent>{children}</MainContent>
        <ConditionalLocationMap settings={settings} />
        <Footer settings={settings} />
        <ContactButton phone={settings.phone} />
      </body>
    </html>
  );
}
