import { useState } from "react";
import { ChevronDown } from "lucide-react";

import ImageLightbox from "./ui/ImageLightbox";
import Plats from "../assets/plats.jpeg";
import { useSiteSettings } from "../hooks/useSiteSettings";

// Subtle line-art leaves scattered over the photo, as in the reference design.
const LEAF_PATH = "M4 20c0-9 6-16 16-17 1 10-5 17-16 17Z";

const DecoLeaf = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d={LEAF_PATH} />
    <path d="M4 20 16 8" />
  </svg>
);

const Header = () => {
  const [lightbox, setLightbox] = useState(null);
  const { settings, loading } = useSiteSettings();

  // Admin-managed image, falling back to the packaged default only after the
  // fetch settles — never while loading. The profile badge is rendered by
  // SiteHeader, which owns the bar it hangs from.
  const bannerImage = settings?.bannerImage?.url || Plats;

  return (
    // Same dark green as the navbar, so the two read as one block. The photo is
    // full-bleed: no side padding, no corner rounding.
    <header className="relative bg-forest-deep">
      <div className="relative w-full overflow-hidden">
        {/* Photo banner */}

        {loading ? (
          <div className="h-80 w-full animate-pulse bg-forest sm:h-[26rem] lg:h-[30rem]" />
        ) : (
          <button
            type="button"
            onClick={() =>
              setLightbox({ src: bannerImage, alt: "أطباق الأسبوع" })
            }
            className="group relative block h-80 w-full cursor-pointer overflow-hidden bg-forest sm:h-[26rem] lg:h-[30rem]"
          >
              <img
                src={bannerImage}
                alt="أطباق الأسبوع"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              

             
            </button>
          )}

          {/* Line-art decoration */}

          <span className="pointer-events-none absolute inset-0 block text-white/[0.14]">
            <DecoLeaf className="absolute left-[14%] top-[24%] h-6 w-6 -rotate-12" />
            <DecoLeaf className="absolute left-[27%] top-[11%] h-4 w-4 rotate-[24deg]" />
            <DecoLeaf className="absolute right-[16%] top-[28%] h-7 w-7 rotate-[18deg]" />
            <DecoLeaf className="absolute right-[31%] top-[10%] h-4 w-4 -rotate-[30deg]" />
            <DecoLeaf className="absolute left-[9%] bottom-[18%] h-5 w-5 rotate-[40deg]" />
            <DecoLeaf className="absolute right-[9%] bottom-[14%] h-6 w-6 -rotate-[16deg]" />
          </span>

          {/* Headline, overlaid on the photo. pointer-events-none so clicks
              still reach the photo behind it, except the CTA. */}

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.4em] text-primary">
              Sehatek
            </p>

            <h1
              dir="rtl"
              className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl"
            >
              صحتك .. أولويتنا
            </h1>

            <p
              dir="rtl"
              className="mt-3 text-sm font-medium text-cream/90 drop-shadow-sm sm:text-lg"
            >
              وجبات صحية بنكهة البيت
            </p>

            <a
              href="#menu"
              className="pointer-events-auto mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-forest shadow-lg transition hover:bg-primary hover:text-white"
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
