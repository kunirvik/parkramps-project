
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/mousewheel";

export default function FullscreenGallery({ images, isOpen, onClose, startIndex = 0 }) {
  const containerRef = useRef(null);
  const swiperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && swiperRef.current && !isMobile) {
      swiperRef.current.slideToLoop(startIndex, 0);
    }
  }, [isOpen, startIndex, isMobile]);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      gsap.fromTo(
        containerRef.current,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1, duration: 0.45, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      if (containerRef.current) {
        gsap.set(containerRef.current, { autoAlpha: 0, y: "100%" });
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 overflow-y-auto"
      style={{ opacity: 0, transform: "translateY(100%)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
      >
        ×
      </button>

      {/* 📱 Мобильная версия — masonry 1 столбик */}
      {isMobile ? (
        <div className="flex flex-col items-center py-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="w-full px-2">
              {!loaded[i] && (
                <div className="w-full flex justify-center items-center py-16 bg-gray-800 animate-pulse rounded-md">
                  <div className="w-12 h-12 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={img}
                alt={`Slide ${i}`}
                className={`w-full object-contain transition-opacity duration-500 rounded-md ${
                  loaded[i] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
              />
            </div>
          ))}
        </div>
      ) : (
        /* 💻 Десктоп — обычный Swiper */
        <Swiper
        modules={[Mousewheel]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        mousewheel={!isMobile}
        direction={isMobile ? "vertical" : "horizontal"}
        className="w-full h-full"
        spaceBetween={10}
        slidesPerView={1.2}
        centeredSlides
        grabCursor
        loop
        loopedSlides={images.length}
        lazy={{
          loadPrevNext: true,
          loadOnTransitionStart: true,
        }}
        preloadImages={false}
        watchSlidesProgress
        breakpoints={{
    0: {           // 👈 для мобильных
      
      spaceBetween: -10,    // фотки почти без отступов
    },
    768: {         // 👈 для планшетов/десктопа
    
      spaceBetween: -10,
    },}}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}   style={{ height: "90vh" }} className="flex  justify-center items-center relative">
            {/* Skeleton Loader */}
            {!loaded[i] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={img}
              alt={`Slide ${i}`}
              className={`swiper-lazy   max-h-[85vh] object-contain  max-w-full transition-opacity duration-500 ${
                loaded[i] ? "opacity-100" : "opacity-0"
              }`}
              draggable="false"
              onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      )}
    </div>
  );
}
