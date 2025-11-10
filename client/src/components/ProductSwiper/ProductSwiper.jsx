import { Swiper, SwiperSlide } from "swiper-react";
import { Pagination, Mousewheel, Thumbs } from "swiper";

const SWIPER_CONFIG = {
  SPEED: 600,
  THRESHOLD: 20,
  RESISTANCE_RATIO: 0.85
};

export function ProductSwiper({
  products,
  activeIndex,
  selectedImageIndices,
  thumbsSwiper,
  onInit,
  onSlideChange,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  swiperRef
}) {
  return (
    <div ref={swiperRef} className="w-full lg:w-[75%] lg:h-[100%] mt-0 lg:mt-20 lg:content-center">
      <div className="w-full flex flex-row items-start justify-between gap-2">
        <div className="w-[100%]">
          <Swiper
            className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
            modules={[Pagination, Mousewheel, Thumbs]}
            pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
            mousewheel={true}
            direction="horizontal"
            centeredSlides={true}
            thumbs={{ swiper: thumbsSwiper }}
            spaceBetween={20}
            initialSlide={activeIndex}
            speed={SWIPER_CONFIG.SPEED}
            threshold={SWIPER_CONFIG.THRESHOLD}
            resistance={true}
            resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
            onInit={onInit}
            onSlideChange={onSlideChange}
            preventClicks={false}
            preventClicksPropagation={false}
            touchStartPreventDefault={false}
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id} style={{ height: "100%" }}>
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={
                      selectedImageIndices[index] === 0
                        ? product.image
                        : product.altImages[selectedImageIndices[index] - 1]
                    }
                    alt={product.name}
                    className="max-h-full w-auto object-contain"
                    draggable="false"
                    onMouseEnter={() => onMouseEnter(index, product)}
                    onMouseLeave={() => onMouseLeave(index)}
                    onTouchStart={() => onTouchStart(index, product)}
                    onTouchEnd={() => onTouchEnd(index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-swiper-pagination mt-4 sm:mt-4 flex justify-center text-[#ff00fb]" />
        </div>
      </div>
    </div>
  );
}