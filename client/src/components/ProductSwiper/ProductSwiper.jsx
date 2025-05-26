import  { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

 const ProductSwiper = ({
  products,
  activeProductIndex,
  selectedImageIndices,
  animationComplete,
  imageData,
  handleSwiperInit,
  handleSlideChange,
  onSwiperLoad,
  ANIMATION_DURATION
}) => {
  const swiperContainerRef = useRef(null);
  const swiperRef = useRef(null);

  // Стили для Swiper
  const swiperStyles = `
    .swiper-wrapper {
      transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }

    .swiper-slide-active {
      z-index: 2;
    }
    /* Предотвращаем смещение слайдов во время анимации */
    .swiper-no-transition .swiper-wrapper {
      transition: none !important;
    }
  `;

  // Добавляем стили для Swiper
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = swiperStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div 
      ref={swiperContainerRef} 
      className="w-full lg:w-3/4 mb-8"
      style={{ 
        visibility: !imageData || animationComplete ? 'visible' : 'hidden',
        opacity: !imageData || animationComplete ? 1 : 0
      }}
    >
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          1024: { slidesPerView: 1.5 }
        }}
        centeredSlides={true}
        spaceBetween={20}
        className="w-full"
        initialSlide={activeProductIndex}
        speed={ANIMATION_DURATION * 1000}
        effect="slide"
        threshold={20} // Увеличиваем порог для уменьшения случайных свайпов
        resistance={true}
        resistanceRatio={0.85} // Увеличиваем сопротивление для более естественного ощущения
        onInit={handleSwiperInit}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (swiper.initialized) {
            onSwiperLoad(swiper);
          }
        }}
        preventClicks={false} // Важно для работы кликов
        preventClicksPropagation={false} // Важно для работы кликов
        touchStartPreventDefault={false} // Улучшает отзывчивость
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <img
              src={
                selectedImageIndices[index] === 0 
                  ? product.image 
                  : product.altImages[selectedImageIndices[index] - 1]
              }
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
              draggable="false" // Предотвращаем случайные перетаскивания
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default ProductSwiper