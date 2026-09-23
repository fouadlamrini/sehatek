import { useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

import CartDrawer from "../CartDrawer";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import Sahetak from "../../assets/sahetak.png";

const SiteHeader = ({ itemsCount = 0 }) => {
  const { settings, loading } = useSiteSettings();
  const [cartOpen, setCartOpen] = useState(false);
  const profileImage = settings?.profileImage?.url || Sahetak;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            {loading ? (
              <span className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <img
                src={profileImage}
                alt="Sehatek"
                className="h-9 w-9 rounded-full object-cover"
              />
            )}
            <span className="text-lg font-extrabold tracking-tight text-forest">
              Sehatek
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-primary-soft"
            >
              <PackageSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Suivre ma commande</span>
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Panier : ${itemsCount} article(s)`}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              🛒 <span>{itemsCount}</span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default SiteHeader;