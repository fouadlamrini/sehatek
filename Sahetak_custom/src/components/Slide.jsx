import { useEffect, useRef, useState } from "react";
import slide from "../data/silde";

const CARD_WIDTH = 264;
const SPEED = 42;
const TILTS = [-4, 2.5, -1.5, 4, -3, 1, -5, 3, -2, 4.5];

function Slide() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const dragRef = useRef({ active: false, pointerX: 0 });
  
  // Zdna had ref bach n7afdo 3la position dyal mouse blama nakhdo state l9dim
  const mousePosRef = useRef(null); 

  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showDragCursor, setShowDragCursor] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateDevice = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);

    return () => {
      mediaQuery.removeEventListener("change", updateDevice);
    };
  }, []);

  // Fix jdid dyal scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current || !mousePosRef.current || !isDesktop) return;

      // kanchoufo chno howa l'element li ja ta7t l'mouse fhad l7da mli kanscrolli
      const elUnderMouse = document.elementFromPoint(
        mousePosRef.current.x,
        mousePosRef.current.y
      );

      // ila kant l'mouse foq slider, nkhliw cursor iban, ila khrjat, nkhbiwh
      if (sliderRef.current.contains(elUnderMouse)) {
        setShowDragCursor(true);
      } else {
        setShowDragCursor(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDesktop]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let oneSetWidth = 0;
    let previousTimestamp = 0;
    let exactScrollLeft = slider.scrollLeft;

    const measureSetWidth = () => {
      const firstItem = slider.children[0];
      const firstItemInNextSet = slider.children[slide.length];

      if (firstItem && firstItemInNextSet) {
        oneSetWidth = firstItemInNextSet.offsetLeft - firstItem.offsetLeft;
      }
    };

    const normalizeScrollPosition = () => {
      if (oneSetWidth > 0) {
        exactScrollLeft = ((exactScrollLeft % oneSetWidth) + oneSetWidth) % oneSetWidth;
        slider.scrollLeft = exactScrollLeft;
      }
    };

    const moveSlider = (timestamp) => {
      if (previousTimestamp && oneSetWidth > 0 && !dragRef.current.active) {
        const elapsed = Math.min((timestamp - previousTimestamp) / 1000, 0.05);
        exactScrollLeft += SPEED * elapsed; 
        slider.scrollLeft = exactScrollLeft; 
        normalizeScrollPosition();
      } else if (dragRef.current.active) {
        exactScrollLeft = slider.scrollLeft;
      }

      previousTimestamp = timestamp;
      animationRef.current = requestAnimationFrame(moveSlider);
    };

    setTimeout(measureSetWidth, 100);
    
    const resizeObserver = new ResizeObserver(measureSetWidth);
    resizeObserver.observe(slider);
    animationRef.current = requestAnimationFrame(moveSlider);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [slide.length]);

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const slider = sliderRef.current;
    if (!slider) return;

    e.preventDefault();
    slider.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, pointerX: e.clientX };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    // Knsjlo aakhir blasa kant fiha l'mouse bach nst3mloha f scroll
    mousePosRef.current = { x: e.clientX, y: e.clientY };

    if (!showDragCursor && e.pointerType === "mouse") {
      setShowDragCursor(true);
    }

    if (dragRef.current.active) {
      const slider = sliderRef.current;
      if (slider) {
        const movement = dragRef.current.pointerX - e.clientX;
        dragRef.current.pointerX = e.clientX;
        slider.scrollLeft += movement;
      }
    }

    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    dragRef.current.active = false;
    setIsDragging(false);

    const slider = sliderRef.current;
    if (slider?.hasPointerCapture(e.pointerId)) {
      slider.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section
      id="clients"
      className="relative w-full scroll-mt-24 overflow-hidden bg-cream py-12 sm:py-16"
    >
      <div className="mb-10 flex flex-col items-center px-4 text-center">
        <h2 dir="rtl" className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
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
          onPointerLeave={() => setShowDragCursor(false)}
          className="relative flex w-full items-center gap-8 overflow-hidden py-8 select-none [touch-action:pan-y]"
          style={{ cursor: isDesktop && showDragCursor ? "none" : isDragging ? "grabbing" : "grab" }}
        >
          {[...slide, ...slide].map((item, index) => (
            <figure
              key={index}
              style={{
                width: CARD_WIDTH,
                transform: `rotate(${TILTS[index % TILTS.length]}deg)`,
              }}
              className="shrink-0 rounded-2xl bg-white p-2 pb-4 shadow-[0_8px_24px_rgba(32,65,21,0.12)] ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(32,65,21,0.18)]"
            >
              <img
                src={item.src}
                alt={item.caption}
                draggable="false"
                className="aspect-[4/3] w-full rounded-xl bg-gray-100 object-cover"
              />
              <figcaption className="mt-1.5 truncate px-1 text-center font-script text-lg leading-tight text-forest">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {showDragCursor && isDesktop ? (
          <div
            className="pointer-events-none fixed z-50 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-2xl shadow-forest-deep/40 ring-4 ring-forest-deep/20"
            style={{ left: cursorPos.x, top: cursorPos.y, backgroundColor: "#204115" }}
          >
            <span className="text-[10px] font-extrabold tracking-[0.15em] text-white">
              DRAG
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Slide;