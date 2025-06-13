import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/mousewheel";

export default function FullscreenGallery({ images, isOpen, onClose }) {
  const containerRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      // GSAP анимация появления снизу
      gsap.fromTo(
        containerRef.current,
        { y: "100%", autoAlpha: 0 },
        { y: "0%", autoAlpha: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";

      if (containerRef.current) {
        // При закрытии сразу скрываем, чтобы избежать "зависания"
        gsap.set(containerRef.current, { autoAlpha: 0, y: "100%" });
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 flex flex-col"
      style={{ opacity: 0, transform: "translateY(100%)" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
      >
        ×
      </button>
      <Swiper
        modules={[Mousewheel]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
          mousewheel={true}
              direction="horizontal"
        className="w-full h-full"
        spaceBetween={10}
        slidesPerView={1.2}
        centeredSlides={true}
        grabCursor={true}
        style={{ padding: "60px 20px 20px" }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="flex justify-center items-center">
            <img
              src={img}
              alt={`Slide ${i}`}
              className="object-contain max-h-[90vh] max-w-full"
              draggable="false"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

