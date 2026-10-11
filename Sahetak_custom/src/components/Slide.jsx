
import { useEffect, useRef, useState } from "react";
import slide from "../data/silde";

const CARD_WIDTH = 264;
const SPEED = 42;
const TILTS = [-4, 2.5, -1.5, 4, -3, 1, -5, 3, -2, 4.5];

function Slide() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const setWidthRef = useRef(0);

  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  const mousePosRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showDragCursor, setShowDragCursor] = useState(false);

  // Détection des appareils avec une souris
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const updateDevice = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);

    return () => {
      mediaQuery.removeEventListener("change", updateDevice);
    };
  }, []);

  // Mise à jour du curseur personnalisé pendant le scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        !sliderRef.current ||
        !mousePosRef.current ||
        !isDesktop
      ) {
        return;
      }

      const element = document.elementFromPoint(
        mousePosRef.current.x,
        mousePosRef.current.y
      );

      setShowDragCursor(
        Boolean(element && sliderRef.current.contains(element))
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDesktop]);

  // Infinite slider
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || slide.length === 0) return;

    let previousTimestamp = 0;

    const measureSetWidth = () => {
      const firstItem = slider.children[0];
      const firstItemInNextSet = slider.children[slide.length];

      if (!firstItem || !firstItemInNextSet) return;

      const oneSetWidth =
        firstItemInNextSet.offsetLeft - firstItem.offsetLeft;

      if (oneSetWidth <= 0) return;

      setWidthRef.current = oneSetWidth;

      // Démarrer au milieu pour permettre le déplacement dans les deux sens
      if (slider.scrollLeft < oneSetWidth) {
        slider.scrollLeft += oneSetWidth;
      }
    };

    const normalizeScroll = () => {
      const oneSetWidth = setWidthRef.current;

      if (!oneSetWidth) return;

      // Garder scrollLeft dans la zone centrale des répétitions
      while (slider.scrollLeft < oneSetWidth) {
        slider.scrollLeft += oneSetWidth;
        dragRef.current.scrollLeft += oneSetWidth;
      }

      while (slider.scrollLeft >= oneSetWidth * 3) {
        slider.scrollLeft -= oneSetWidth;
        dragRef.current.scrollLeft -= oneSetWidth;
      }
    };

    const moveSlider = (timestamp) => {
      if (previousTimestamp && !dragRef.current.active) {
        const elapsed = Math.min(
          (timestamp - previousTimestamp) / 1000,
          0.05
        );

        slider.scrollLeft += SPEED * elapsed;
        normalizeScroll();
      }

      previousTimestamp = timestamp;
      animationRef.current = requestAnimationFrame(moveSlider);
    };

    const initialMeasure = () => {
      measureSetWidth();
    };

    const timeoutId = window.setTimeout(initialMeasure, 100);

    const resizeObserver = new ResizeObserver(() => {
      measureSetWidth();
    });

    resizeObserver.observe(slider);

    animationRef.current = requestAnimationFrame(moveSlider);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  // Commencer le drag
  const handlePointerDown = (e) => {
    const slider = sliderRef.current;

    if (!slider) return;

    // Ne pas démarrer le drag avec le bouton droit de la souris
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: slider.scrollLeft,
    };

    setIsDragging(true);

    if (e.pointerType === "mouse") {
      slider.setPointerCapture(e.pointerId);
    }
  };

  // Déplacer les images et conserver la boucle infinie
  const handlePointerMove = (e) => {
    mousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (e.pointerType === "mouse") {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });

      if (!showDragCursor) {
        setShowDragCursor(true);
      }
    }

    const slider = sliderRef.current;

    if (!slider || !dragRef.current.active) return;

    const walk = (e.clientX - dragRef.current.startX) * 1.5;

    slider.scrollLeft = dragRef.current.scrollLeft - walk;

    const oneSetWidth = setWidthRef.current;

    if (oneSetWidth > 0) {
      // Revenir dans la zone centrale sans atteindre scrollLeft = 0
      while (slider.scrollLeft < oneSetWidth) {
        slider.scrollLeft += oneSetWidth;
        dragRef.current.scrollLeft += oneSetWidth;
      }

      while (slider.scrollLeft >= oneSetWidth * 3) {
        slider.scrollLeft -= oneSetWidth;
        dragRef.current.scrollLeft -= oneSetWidth;
      }
    }
  };

  // Terminer le drag
  const handlePointerUp = (e) => {
    dragRef.current.active = false;
    setIsDragging(false);

    const slider = sliderRef.current;

    if (
      slider &&
      e.pointerType === "mouse" &&
      slider.hasPointerCapture(e.pointerId)
    ) {
      slider.releasePointerCapture(e.pointerId);
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setShowDragCursor(false);
    }
  };

  return (
    <section
      id="clients"
      className="relative w-full scroll-mt-24 overflow-hidden bg-cream py-12 sm:py-16"
    >
      <div className="mb-10 flex flex-col items-center px-4 text-center">
        <h2
          dir="rtl"
          className="font-serif text-3xl font-semibold text-forest sm:text-4xl"
        >
          طلبات زبنائنا
        </h2>

        <p dir="rtl" className="mt-2 text-sm text-gray-500">
          لحظات من زبنائنا
        </p>
      </div>

      <div className="relative w-full" dir="ltr">
        <div
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerEnter={() => setShowDragCursor(true)}
          onPointerLeave={handlePointerLeave}
          className={`relative flex w-full items-center gap-8 overflow-x-auto py-8 select-none scrollbar-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            cursor:
              isDesktop && showDragCursor
                ? "none"
                : isDragging
                  ? "grabbing"
                  : "grab",
            touchAction: "pan-y",
          }}
        >
          {[...slide, ...slide, ...slide, ...slide].map(
            (item, index) => (
              <figure
                key={`${index}-${item.caption}`}
                style={{
                  width: CARD_WIDTH,
                  transform: `rotate(${
                    TILTS[index % TILTS.length]
                  }deg)`,
                }}
                className="shrink-0 rounded-2xl bg-white p-2 pb-4 shadow-[0_8px_24px_rgba(32,65,21,0.12)] ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(32,65,21,0.18)]"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  draggable="false"
                  className="pointer-events-none aspect-[4/3] w-full rounded-xl bg-gray-100 object-cover"
                />

                <figcaption className="mt-1.5 truncate px-1 text-center font-script text-lg leading-tight text-forest">
                  {item.caption}
                </figcaption>
              </figure>
            )
          )}
        </div>

        {showDragCursor && isDesktop && (
          <div
            className="pointer-events-none fixed z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-2xl shadow-forest-deep/40 ring-4 ring-forest-deep/20"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              backgroundColor: "#204115",
            }}
          >
            <span className="text-[10px] font-extrabold tracking-[0.15em] text-white">
              DRAG
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Slide;
