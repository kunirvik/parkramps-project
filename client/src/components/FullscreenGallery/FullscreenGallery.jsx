// components/FullscreenGallery.jsx
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function FullscreenGallery({ images, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
      >
        ×
      </button>
      <Swiper
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
