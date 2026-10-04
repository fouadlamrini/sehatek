import { useState } from "react";
import { ChevronDown } from "lucide-react";

import BrandLogo from "./ui/BrandLogo";
import ImageLightbox from "./ui/ImageLightbox";
import Plats from "../assets/plats.jpeg";
import { useSiteSettings } from "../hooks/useSiteSettings";

const Header = () => {
  const [lightbox, setLightbox] = useState(null);
  const { settings, loading } = useSiteSettings();

  // Admin-managed images fall back to the packaged defaults, only after the
  // fetch settles — never while loading.
  const bannerImage = settings?.bannerImage?.url || Plats;
  const profileImage = settings?.profileImage?.url || null;

  return (
    // Hero sits on the same dark green as the navbar, so the two read as one
    // block: photo on top, brand block underneath.
    <header className="w-full bg-forest">
      {/* Photo banner — always the full screen width */}

      {loading ? (
        <div className="h-52 w-full animate-pulse bg-forest-deep sm:h-72 md:h-[26rem]" />
      ) : (
        <button
          type="button"
          onClick={() => setLightbox({ src: bannerImage, alt: "أطباق الأسبوع" })}
          className="group relative block h-52 w-full cursor-pointer overflow-hidden bg-forest-deep sm:h-72 md:h-[26rem]"
        >
          <img
            src={bannerImage}
            alt="أطباق الأسبوع"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              شوف الصورة
            </span>
          </span>
        </button>
      )}

      {/* Brand block — the profile photo overlaps the banner */}

      <div className="mx-auto max-w-4xl px-4">
        <div className="relative -mt-20 px-6 pb-14 pt-24 text-center sm:-mt-24 sm:px-10 sm:pb-20 sm:pt-28">
          <BrandLogo
            src={profileImage}
            alt="Sehatek"
            variant="lockup"
            loading={loading}
            className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 border-4 border-forest shadow-2xl sm:h-48 sm:w-48"
            pulseClassName="h-40 w-40 sm:h-48 sm:w-48"
          />

          <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-primary">
            Sehatek
          </p>

          <h1
            dir="rtl"
            className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            صحتك .. أولويتنا
          </h1>

          <p dir="rtl" className="mt-3 text-sm font-medium text-cream/70 sm:text-base">
            وجبات صحية بنكهة البيت
          </p>

          <a
            href="#menu"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-primary-dark"
          >
            اكتشف القائمة
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </div>

      <ImageLightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </header>
  );
};

export default Header;