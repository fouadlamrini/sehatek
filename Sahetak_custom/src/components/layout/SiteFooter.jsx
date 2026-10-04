import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const QUICK_LINKS = [
  { label: "الفائمة", to: "/#menu" },
  { label: "تابع طلبك", to: "/track" },
  { label: "من نحن", to: "/about" },
  { label: "اتصل بنا", to: "/contact" },
];

const SiteFooter = () => {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Shares the FAQ's dark green so the page closes on one solid block.
    <footer className="w-full bg-forest-deep text-cream">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div dir="rtl" className="text-center sm:text-right">
            <p className="font-serif text-3xl font-semibold tracking-wide text-white sm:text-4xl">
              Sehatek
            </p>

            <p className="mt-1 text-sm font-medium text-leaf-soft/80">
              صحتك .. أولويتنا
            </p>
          </div>

          <nav dir="rtl" aria-label="روابط سريعة" className="text-center sm:text-right">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
              روابط سريعة
            </p>

            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-semibold text-cream/75 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/45">
            <span dir="rtl">كل الحقوق محفوظة</span>
            {" · © "}
            <span dir="ltr">
              Sehatek {year}
            </span>
          </p>

          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-white/90 transition hover:text-primary"
          >
            العودة للأعلى
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;