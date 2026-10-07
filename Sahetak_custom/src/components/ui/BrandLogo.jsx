import LogoMark from "../../assets/logo-mark.png";
import LogoLockup from "../../assets/logo-lockup.png";

import { cn } from "../../utils/cn";

// The bundled brand is one tall vertical lockup (sahetak.png: mark, wordmark,
// tagline, icon row). Cropped renditions of the same artwork are bundled too so
// each circle can frame it the way it needs:
//   - "mark"   -> logo-mark.png, the circular mark alone (navbar badge)
//   - "lockup" -> logo-lockup.png, mark + wordmark (hero profile photo)
// Both are letterboxed rather than cropped: the admin-managed profile image is
// a brand lockup too, and cropping it inside a circle cuts the wordmark.
// Padding is a percentage of the badge so the artwork always lands inside the
// circle's inscribed square (~71% of its diameter) whatever the badge size —
// fixed padding clips the corners on the large badge. The navbar badge has a
// bowed bottom edge, which narrows towards the baseline, so the artwork needs
// the wider margin to clear it.
const FALLBACK = {
  mark: LogoMark,
  lockup: LogoLockup,
};

const INSET = "p-[20%]";

// src: admin-managed profile image URL. Leave empty to use the bundled logo.
// `rounded` overrides the default circular clip (the hero uses a rectangle with
// rounded bottom corners so the badge can hang from the top of the page).
// `loading` renders a neutral pulse instead of flashing the fallback before the
// settings request settles.
const BrandLogo = ({
  src,
  alt = "Sehatek",
  variant = "lockup",
  rounded = "rounded-full",
  loading = false,
  className,
  pulseClassName,
}) => {
  const fallback = FALLBACK[variant] ?? FALLBACK.lockup;

  if (loading) {
    return (
      <span
        className={cn("block shrink-0 animate-pulse bg-white/40", rounded, pulseClassName ?? className)}
      />
    );
  }

  return (
    <span
      className={cn("block shrink-0 overflow-hidden bg-white", rounded, className)}
    >
      <img
        src={src || fallback}
        alt={alt}
        style={{ objectFit: "contain" }}
        className={cn("h-full w-full", INSET)}
      />
    </span>
  );
};

export default BrandLogo;