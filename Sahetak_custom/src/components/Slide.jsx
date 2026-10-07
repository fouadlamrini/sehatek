import { useEffect, useRef, useState } from "react";

import slide from "../data/silde";

// Marquee geometry — CARD_WIDTH and GAP must match the classes on the track
// below, since the loop length is derived from them.
const CARD_WIDTH = 264;
const GAP = 32;
const SPEED = 0.7;

// Fixed per-slot tilt: the list is rendered twice to loop, so the angle is
// keyed on the slot index to keep the scattered look stable across re-renders.
const TILTS = [-4, 2.5, -1.5, 4, -3, 1, -5, 3, -2, 4.5];

function Slide() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Détecter PC / mobile
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

  // Animation automatique
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const moveSlider = () => {
      if (isPlaying) {
        slider.scrollLeft += SPEED;

        const oneSetWidth = slide.length * (CARD_WIDTH + GAP);

        if (slider.scrollLeft >= oneSetWidth) {
          slider.scrollLeft -= oneSetWidth;
        }
      }

      animationRef.current = requestAnimationFrame(moveSlider);
    };

    animationRef.current = requestAnimationFrame(moveSlider);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // PC : pause au hover
  const handleMouseEnter = () => {
    if (isDesktop) {
      setIsPlaying(false);
    }
  };

  // PC : reprendre quand on quitte
  const handleMouseLeave = () => {
    if (isDesktop) {
      setIsPlaying(true);
    }
  };

  // Mobile : click pour pause/reprendre
  const handleClick = () => {
    if (!isDesktop) {
      setIsPlaying((prev) => !prev);
    }
  };

  return (
    <section id="clients" className="w-full scroll-mt-24 overflow-hidden bg-cream py-12 sm:py-16">
      <div className="mb-10 flex justify-center px-4">
        <h2 dir="rtl" className="text-center font-serif text-3xl font-medium text-forest sm:text-4xl">
          طلبات زبنائنا
        </h2>
      </div>

      <div className="relative w-full">
        <div
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="flex w-full items-center gap-8 overflow-hidden py-8 select-none"
        >
          {[...slide, ...slide].map((item, index) => (
            <figure
              key={index}
              style={{
                width: CARD_WIDTH,
                transform: `rotate(${TILTS[index % TILTS.length]}deg)`,
              }}
              className="shrink-0 bg-white p-2 pb-4 shadow-[0_12px_32px_rgba(32,65,21,0.14)] transition-transform duration-300 hover:scale-105"
            >
              <img
                src={item.src}
                alt={item.caption}
                draggable="false"
                className="aspect-[4/3] w-full bg-gray-100 object-cover"
              />

              <figcaption className="mt-1.5 truncate px-1 text-center font-script text-xl leading-tight text-forest">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slide;