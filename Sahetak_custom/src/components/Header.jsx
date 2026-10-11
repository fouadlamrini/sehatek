import { useState } from "react";
import { ChevronDown, Clock, Leaf, Shield, Truck } from "lucide-react";

import ImageLightbox from "./ui/ImageLightbox";
import Plats from "../assets/plats.jpeg";
import { useSiteSettings } from "../hooks/useSiteSettings";

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

  const bannerImage = settings?.bannerImage?.url || Plats;

  const features = [
    { icon: Leaf, text: "مكونات طازجة" },
    { icon: Truck, text: "توصيل سريع" },
    { icon: Shield, text: "جودة مضمونة" },
    { icon: Clock, text: "توصيل 13:30-15:00" },
  ];

  return (
    <header className="relative bg-forest-deep">
      <div className="relative h-screen w-full overflow-hidden">
        {loading ? (
          <div className="h-screen w-full animate-pulse bg-forest" />
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              setLightbox({ src: bannerImage, alt: "أطباق الأسبوع" })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setLightbox({ src: bannerImage, alt: "أطباق الأسبوع" });
              }
            }}
            className="group relative block h-screen w-full cursor-pointer overflow-hidden bg-forest"
          >
            <img
              src={bannerImage}
              alt="أطباق الأسبوع"
              className="h-full w-full object-cover transform-none transition-none"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-forest-deep/20 to-transparent" />

            <span className="pointer-events-none absolute inset-0 block text-white/[0.14]">
              <DecoLeaf className="absolute left-[14%] top-[24%] h-6 w-6 -rotate-12" />
              <DecoLeaf className="absolute left-[27%] top-[11%] h-4 w-4 rotate-[24deg]" />
              <DecoLeaf className="absolute right-[16%] top-[28%] h-7 w-7 rotate-[18deg]" />
              <DecoLeaf className="absolute right-[31%] top-[10%] h-4 w-4 -rotate-[30deg]" />
              <DecoLeaf className="absolute left-[9%] bottom-[18%] h-5 w-5 rotate-[40deg]" />
              <DecoLeaf className="absolute right-[9%] bottom-[14%] h-6 w-6 -rotate-[16deg]" />
            </span>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.4em] text-primary">
                صحتك
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

              <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-3">
                {features.map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {text}
                  </span>
                ))}
              </div>

              <a
                href="#menu"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-primary/30 transition-colors duration-300 hover:bg-primary-dark active:scale-100"
              >
                اكتشف القائمة
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
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