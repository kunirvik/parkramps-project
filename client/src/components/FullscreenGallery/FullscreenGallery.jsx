// import { useEffect, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Mousewheel } from "swiper/modules";
// import gsap from "gsap";
// import "swiper/css";
// import "swiper/css/mousewheel";

// export default function FullscreenGallery({ images, isOpen, onClose, startIndex = 0 }) {
//   const containerRef = useRef(null);
//   const swiperRef = useRef(null);


//   useEffect(() => {
//   if (isOpen && swiperRef.current) {
//     swiperRef.current.slideToLoop(startIndex, 0); // 👈 вместо slideTo
//   }
// }, [isOpen, startIndex]);
 

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//     };

//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", handleKeyDown);

//       // GSAP анимация появления снизу
//       gsap.fromTo(
//         containerRef.current,
//         { y: "100%", autoAlpha: 0 },
//         { y: "0%", autoAlpha: 1, duration: 0.5, ease: "power3.out" }
//       );

//       // Открываем галерею с нужного индекса
//       if (swiperRef.current) {
//         swiperRef.current.slideTo(startIndex, 0);
//       }
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "auto";

//       if (containerRef.current) {
//         gsap.set(containerRef.current, { autoAlpha: 0, y: "100%" });
//       }
//     };
//   }, [isOpen, onClose, startIndex]);

//   if (!isOpen) return null;

//   return (
//     <div
//       ref={containerRef}
//       className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 flex flex-col"
//       style={{ opacity: 0, transform: "translateY(100%)" }}
//     >
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
//       >
//         ×
//       </button>
//       <Swiper
//         modules={[Mousewheel]}
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         mousewheel={true}
//         direction="horizontal"
//         className="w-full h-full"
//         spaceBetween={10}
//         slidesPerView={1.2}
//         centeredSlides={true}
//         grabCursor={true}
//         style={{ padding: "60px 20px 20px" }}
//         initialSlide={startIndex}  // 👈 ключ для правильного старта
//          loop={true}              // 👈 добавляем это
//   loopedSlides={images.length} // 👈 чтобы все корректно зацикливались
//    breakpoints={{
//     0: {           // 👈 для мобильных
      
//       spaceBetween: 0,    // фотки почти без отступов
//     },
//     768: {         // 👈 для планшетов/десктопа
//       slidesPerView: 1.2,
//       spaceBetween: 10,
//     },}}
//       >
//         {images.map((img, i) => (
//           <SwiperSlide key={i} className="flex justify-center items-center">
//             <img
//               src={img}
//               alt={`Slide ${i}`}
//               className="object-contain max-h-[90vh] max-w-full"
//               draggable="false"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
// import { useEffect, useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Mousewheel } from "swiper/modules";
// import gsap from "gsap";
// import "swiper/css";
// import "swiper/css/mousewheel";

// export default function FullscreenGallery({ images, isOpen, onClose, startIndex = 0 }) {
//   const containerRef = useRef(null);
//   const swiperRef = useRef(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768); // 👈 breakpoint
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     if (isOpen && swiperRef.current) {
//       swiperRef.current.slideToLoop(startIndex, 0);
//     }
//   }, [isOpen, startIndex]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//     };

//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", handleKeyDown);

//       gsap.fromTo(
//         containerRef.current,
//         { y: "100%", autoAlpha: 0 },
//         { y: "0%", autoAlpha: 1, duration: 0.5, ease: "power3.out" }
//       );

//       if (swiperRef.current) {
//         swiperRef.current.slideTo(startIndex, 0);
//       }
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "auto";

//       if (containerRef.current) {
//         gsap.set(containerRef.current, { autoAlpha: 0, y: "100%" });
//       }
//     };
//   }, [isOpen, onClose, startIndex]);

//   if (!isOpen) return null;

//   return (
//     <div
//       ref={containerRef}
//       className="fixed top-0 left-0 w-full h-full z-[9999] bg-black bg-opacity-95 flex flex-col"
//       style={{ opacity: 0, transform: "translateY(100%)" }}
//     >
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 z-50 text-white text-3xl font-bold"
//       >
//         ×
//       </button>
//       <Swiper
//         modules={[Mousewheel]}
//         onSwiper={(swiper) => (swiperRef.current = swiper)}
//         mousewheel={!isMobile}     // 👈 колесо мыши только на десктопе
//         direction={isMobile ? "vertical" : "horizontal"} // 👈 мобильные листают вверх/вниз
//         className="w-full h-full"
//         spaceBetween={10}
//         slidesPerView={1.2}
//         centeredSlides={true}
//         grabCursor={true}
//         style={{ padding: "60px 20px 20px" }}
//         initialSlide={startIndex}
//         loop={true}
//         loopedSlides={images.length}
//     lazy={{
//     loadPrevNext: true,        // грузить соседние
//     loadOnTransitionStart: true,
//   }}

// preloadImages={false}

// watchSlidesProgress={true} 
//       >
//         {images.map((img, i) => (
//           <SwiperSlide key={i} className="flex justify-center items-center">
//             <img
//               src={img}
//               alt={`Slide ${i}`}
//               className=" swiper-lazy object-contain max-h-[90vh] max-w-full"
//               draggable="false"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
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
  const [loaded, setLoaded] = useState({}); // 👈 хранит какие изображения загружены

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen && swiperRef.current) {
      swiperRef.current.slideToLoop(startIndex, 0);
    }
  }, [isOpen, startIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

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
        gsap.set(containerRef.current, { autoAlpha: 0, y: "100%" });
      }
    };
  }, [isOpen, onClose, startIndex]);

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
      
      spaceBetween: 0,    // фотки почти без отступов
    },
    768: {         // 👈 для планшетов/десктопа
      slidesPerView: 1.2,
      spaceBetween: 10,
    },}}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="flex justify-center items-center relative">
            {/* Skeleton Loader */}
            {!loaded[i] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-gray-400 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={img}
              alt={`Slide ${i}`}
              className={`swiper-lazy object-contain max-h-[90vh] max-w-full transition-opacity duration-500 ${
                loaded[i] ? "opacity-100" : "opacity-0"
              }`}
              draggable="false"
              onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
