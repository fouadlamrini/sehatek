import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

import BrandLogo from "../ui/BrandLogo";
import CartDrawer from "../CartDrawer";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { cn } from "../../utils/cn";

// "/" and "/track" already exist. "/about" is reserved for the page still to be
// added — update the path here when it lands.
const NAV_LINKS = [
  { label: "الرئيسية", to: "/" },
  { label: "من نحن", to: "/about" },
  { label: "تابع طلبك", to: "/track" },
];

// Anchors to sections of the home page rather than to routes.
const SECTION_LINKS = [
  { label: "طلبات زبنائنا", anchor: "clients" },
];

// Badge hanging from the very top of the page. `rounded-b-[999px]` is clamped
// by the browser to half the width, which gives the fully bowed bottom edge of
// the reference without hardcoding an elliptical radius per breakpoint.
const LOGO_SIZES = "h-20 w-24 sm:h-24 sm:w-28";
const LOGO_ROUNDED = "rounded-b-[999px]";

const SiteHeader = ({ itemsCount = 0 }) => {
  const { settings, loading } = useSiteSettings();
  const location = useLocation();

  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileImage = settings?.profileImage?.url || null;

  // The badge belongs to the hero composition (flush with the top of the page,
  // dropping over the photo). Once the bar sticks, that composition is gone, so
  // the badge slides away instead of hanging over the content underneath.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Only meaningful on the home page; elsewhere the route change does the work.
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

  const renderSectionLink = (link) => (
    <a
      key={link.anchor}
      href={`/#${link.anchor}`}
      onClick={(event) => handleAnchorClick(event, link.anchor)}
      className="rounded-lg px-1 py-2 text-[15px] font-bold text-white/80 transition-colors hover:text-white"
    >
      {link.label}
    </a>
  );

  const cartButton = (className) => (
    <button
      type="button"
      onClick={() => {
        setCartOpen(true);
        setMenuOpen(false);
      }}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-lg px-1 py-2 text-[15px] font-bold text-white/80 transition-colors hover:text-white",
        className
      )}
    >
      <ShoppingCart className="h-[18px] w-[18px]" />
      <span>سلة التسوق</span>

      {itemsCount > 0 ? (
        <span className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white">
          {itemsCount}
        </span>
      ) : null}
    </button>
  );

  return (
    <>
      {/* The badge hangs from the very top of the page and drops over the hero
          photo, so it lives here rather than in the hero. z-10 keeps it above
          the bar background; the bar's own z-30 keeps it above the page. */}
      <header dir="rtl" className="sticky top-0 z-30 bg-forest-deep">
        <BrandLogo
          src={profileImage}
          alt="Sehatek"
          variant="lockup"
          rounded={LOGO_ROUNDED}
          loading={loading}
          className={cn(
            `absolute left-1/2 top-0 z-10 -translate-x-1/2 shadow-xl transition-all duration-300 ${LOGO_SIZES}`,
            scrolled && "pointer-events-none -translate-y-full opacity-0"
          )}
          pulseClassName={LOGO_SIZES}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mobile */}
          <div className="flex items-center justify-end py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop: section link on the right, main nav on the left, and a
              reserved centre slot so the hanging badge never overlaps a link. */}
          <div className="hidden grid-cols-[1fr_8rem_1fr] items-center py-3 md:grid">
            <nav
              aria-label="Sections"
              className="col-start-1 flex items-center justify-end gap-6"
            >
              {SECTION_LINKS.map(renderSectionLink)}
            </nav>

            <nav
              aria-label="Navigation principale"
              className="col-start-3 flex items-center gap-6"
            >
              {NAV_LINKS.map(renderLink)}
              {cartButton()}
            </nav>
          </div>
        </div>

        {menuOpen ? (
          <nav
            aria-label="Navigation principale"
            className="border-t border-white/10 px-4 pb-4 pt-2 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map(renderLink)}
            </ul>

            <div className="mt-1 flex flex-col">
              {SECTION_LINKS.map(renderSectionLink)}
              {cartButton("w-full")}
            </div>
          </nav>
        ) : null}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default SiteHeader;