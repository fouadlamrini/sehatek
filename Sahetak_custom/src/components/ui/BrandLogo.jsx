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
// fixed padding clips the corners on the large hero badge.
const FALLBACK = {
  mark: LogoMark,
  lockup: LogoLockup,
};

const INSET = "p-[14%]";

// src: admin-managed profile image URL. Leave empty to use the bundled logo.
// `loading` renders a neutral pulse instead of flashing the fallback before the
// settings request settles.
const BrandLogo = ({
  src,
  alt = "Sehatek",
  variant = "lockup",
  loading = false,
  className,
  pulseClassName,
}) => {
  const fallback = FALLBACK[variant] ?? FALLBACK.lockup;

  if (loading) {
    return (
      <span
        className={cn("block shrink-0 animate-pulse rounded-full bg-white/40", pulseClassName ?? className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "block shrink-0 overflow-hidden rounded-full bg-white",
        className
      )}
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