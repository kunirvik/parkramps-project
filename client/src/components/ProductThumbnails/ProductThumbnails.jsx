import { Swiper, SwiperSlide } from "swiper-react";
import { Thumbs } from "swiper";

export function ProductThumbnails({
  products,
  activeIndex,
  onSwiper,
  onThumbnailClick,
  className = "hidden sm:block w-[100%] pt-10 pb-10 sm:pt-10",
  style
}) {
  return (
    <div className={className} style={style}>
      <Swiper
        modules={[Thumbs]}
        direction="horizontal"
        onSwiper={onSwiper}
        breakpoints={{
          320: { slidesPerView: 4, spaceBetween: 8 },
          480: { slidesPerView: 8 },
          640: { slidesPerView: 8 },
          768: { slidesPerView: 8 },
          1024: { slidesPerView: 8 },
          1280: { slidesPerView: 8 },
        }}
        slidesPerView="auto"
        spaceBetween={10}
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        initialSlide={activeIndex}
        speed={600}
        preventClicks={false}
        preventClicksPropagation={false}
        observer={true}
        observeParents={true}
        resistance={false}
        resistanceRatio={0}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <img
              src={product.image}
              onClick={() => onThumbnailClick(index)}
              className={`cursor-pointer transition-all duration-300 rounded-lg border-2 px-3 ${
                index === activeIndex
                  ? "opacity-100 scale-105 border-black"
                  : "grayscale border-transparent opacity-60 hover:opacity-100"
              }`}
              alt={product.name}
              draggable="false"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}