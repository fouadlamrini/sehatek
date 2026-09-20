import { useEffect } from "react";
import { X } from "lucide-react";

const ImageLightbox = ({ src, alt, onClose }) => {
  useEffect(() => {
    if (!src) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [src, onClose]);

  if (!src) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt ?? "Produit"}
          className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white transition hover:bg-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ImageLightbox;
