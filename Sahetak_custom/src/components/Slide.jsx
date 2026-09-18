
import { useEffect, useRef, useState } from "react";
import slide from "../data/silde";

function Slide() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  const GAP = 16;
  const IMAGE_WIDTH = 220;
  const SPEED = 0.7;

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

        const oneSetWidth = slide.length * (IMAGE_WIDTH + GAP);

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
    <section className="w-full py-12">

      {/* Titre avec cadre */}
      <div className="mb-8 flex justify-center px-4">
        <h2
          className="
            rounded-xl
            border-2 border-[#649714]
            bg-white
            px-6 py-3
            text-center
            text-2xl font-bold
            text-[#204115]
            shadow-md
            sm:px-8 sm:py-4
            sm:text-3xl
          "
        >
          Les commandes de nos clients
        </h2>
      </div>

      {/* Slider */}
      <div className="relative w-full">
        <div
          ref={sliderRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="
            flex w-full
            gap-4
            overflow-hidden
            bg-[#204115]
            px-4 py-8
            select-none
          "
        >
          {[...slide, ...slide].map((image, index) => (
            <div
              key={index}
              className="
                w-[220px]
                min-w-[220px]
                shrink-0
                overflow-hidden
                rounded-xl
                border-4
                border-[#649714]
                bg-white
                shadow-lg
                transition
                duration-300
                hover:border-[#E58730]
              "
            >
              <img
                src={image}
                alt={`Commande client ${(index % slide.length) + 1}`}
                draggable="false"
                className="
                  h-[280px]
                  w-full
                  object-cover
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slide;
