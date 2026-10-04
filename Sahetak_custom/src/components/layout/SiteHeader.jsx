import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

import BrandLogo from "../ui/BrandLogo";
import CartDrawer from "../CartDrawer";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { cn } from "../../utils/cn";

// RTL nav, ordered right-to-left like the design.
// "/" and "/track" already exist. "/about" and "/contact" are reserved for the
// pages still to be added — update the paths here when they land.
const NAV_LINKS = [
  { label: "الرئيسية", to: "/" },
  { label: "الفائمة", to: "/#menu", anchor: "menu" },
  { label: "من نحن", to: "/about" },
  { label: "تابع طلبك", to: "/track" },
  { label: "اتصل بنا", to: "/contact" },
];

const SiteHeader = ({ itemsCount = 0 }) => {
  const { settings, loading } = useSiteSettings();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const profileImage = settings?.profileImage?.url || null;

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    document
      .querySelector(location.hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Already on the home page: skip the navigation and scroll in place so
  // repeated clicks keep working.
  const handleAnchorClick = (event, anchor) => {
    if (location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const renderLink = (link) => {
    const active = location.pathname === link.to;

    return (
      <Link
        key={link.to}
        to={link.to}
        onClick={link.anchor ? (event) => handleAnchorClick(event, link.anchor) : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative rounded-lg px-1 py-2 text-[15px] font-bold transition-colors",
          active ? "text-primary" : "text-white/80 hover:text-white"
        )}
      >
        {link.label}

        {active ? (
          <span className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full bg-primary" />
        ) : null}
      </Link>
    );
  };

  return (
    <>
      <header dir="rtl" className="sticky top-0 z-30 bg-forest-deep shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
          <Link
            to="/"
            aria-label="Sehatek — الصفحة الرئيسية"
            className="flex shrink-0 items-center rounded-full ring-2 ring-white/15 transition hover:ring-primary/60"
          >
            <BrandLogo
              src={profileImage}
              alt="Sehatek"
              variant="mark"
              loading={loading}
              className="h-11 w-11 sm:h-12 sm:w-12"
              pulseClassName="h-11 w-11 sm:h-12 sm:w-12"
            />
          </Link>

          <nav className="hidden items-center gap-5 md:flex" aria-label="Navigation principale">
            {NAV_LINKS.filter((link) => !link.anchor).map(renderLink)}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1 py-2 text-[15px] font-bold text-white/80 transition-colors hover:text-white"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              <span>سلة التسوق</span>

              {itemsCount > 0 ? (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white">
                  {itemsCount}
                </span>
              ) : null}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen ? (
          <nav
            aria-label="Navigation principale"
            className="border-t border-white/10 bg-forest-deep px-4 pb-4 pt-2 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map(renderLink)}
            </ul>

            <li className="mt-1">
              <button
                type="button"
                onClick={() => {
                  setCartOpen(true);
                  setMenuOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-2 text-[15px] font-bold text-white/80 transition-colors hover:text-white"
              >
                <ShoppingCart className="h-[18px] w-[18px]" />
                <span>سلة التسوق</span>

                {itemsCount > 0 ? (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white">
                    {itemsCount}
                  </span>
                ) : null}
              </button>
            </li>
          </nav>
        ) : null}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default SiteHeader;