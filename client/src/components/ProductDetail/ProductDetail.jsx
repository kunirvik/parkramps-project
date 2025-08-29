
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import productCatalog from "../data/productCatalog";
import "swiper/css";
import "swiper/css/pagination"; 

// Константы
const ANIMATION_CONFIG = {
  DURATION: 0.6,
  EASE: "power2.out",
  HALF_DURATION: 0.3
};

const SWIPER_CONFIG = {
  SPEED: ANIMATION_CONFIG.DURATION * 1000,
  THRESHOLD: 20,
  RESISTANCE_RATIO: 0.85
};

const LOADING_SCREEN_DURATION = 1500; // 1.5 секунды

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, category } = useParams();
  const [searchParams] = useSearchParams();
  const hoverIntervalRef = useRef(null);
  const imageData = location.state?.imageData;
  const slideIndexParam = Number(searchParams.get('view')) || 0;

  // Определяем, нужен ли loading screen
  const shouldShowLoading = useMemo(() => {
    // Показываем loading screen если:
    // 1. Нет imageData (значит переход не с каталога с анимацией)
    // 2. Или если это прямой переход/перезагрузка
    return !imageData;
  }, [imageData]);

  // Основные состояния
  const [activeProductIndex, setActiveProductIndex] = useState(() => 
    Math.max(0, productCatalog.findIndex(p => p.id === Number(id)))
  );
  const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
    productCatalog.map(() => 0)
  );
  const [swiperInstances, setSwiperInstances] = useState({
    main: null,
    thumbs: null
  });

  // Состояния анимации и загрузки
  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false
  });

  const [loadingState, setLoadingState] = useState({
    isLoading: shouldShowLoading,
    isCompleted: false
  });

  // Refs
  const refs = {
    container: useRef(null),
    transitionImage: useRef(null),
    swiperContainer: useRef(null),
    info: useRef(null),
    urlUpdateBlocked: useRef(false)
  };

  // Мемоизированные значения
  const currentProduct = useMemo(() => 
    productCatalog[activeProductIndex], [activeProductIndex]
  );

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const currentImages = useMemo(() => 
    currentProduct ? [currentProduct.image, ...currentProduct.altImages] : [], 
    [currentProduct]
  );

  const currentImagesFullscreen = useMemo(() => 
  currentProduct ? currentProduct.sample : [], 
  [currentProduct]
);

  // Обработка завершения loading screen
  const handleLoadingComplete = useCallback(() => {
    setLoadingState(prev => ({ ...prev, isCompleted: true }));
    
    // Небольшая задержка перед началом показа контента
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
      
      // Анимируем появление контента
      if (refs.container.current && refs.info.current) {
        gsap.fromTo(refs.container.current, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE 
          }
        );
        
        gsap.fromTo(refs.info.current,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE,
            delay: 0.2
          }
        );
      }
    }, 200);
  }, []);

  // Эффект для автоматического завершения loading screen
  useEffect(() => {
    if (!shouldShowLoading) return;

    const timer = setTimeout(() => {
      handleLoadingComplete();
    }, LOADING_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, [shouldShowLoading, handleLoadingComplete]);

  // Утилиты
  const updateUrl = useCallback((productId, viewIndex = 0) => {
    if (refs.urlUpdateBlocked.current) return;
    
    refs.urlUpdateBlocked.current = true;
    const newUrl = `/product/set/${productId}?view=${viewIndex}`;
    window.history.replaceState(null, '', newUrl);
    
    setTimeout(() => {
      refs.urlUpdateBlocked.current = false;
    }, 50);
  }, []);

  const updateAnimationState = useCallback((updates) => {
    setAnimationState(prev => ({ ...prev, ...updates }));
  }, []);

  // Анимации
  const animateInfo = useCallback((direction = 'in') => {
    if (!refs.info.current) return Promise.resolve();
    
    const isIn = direction === 'in';
    const targetOpacity = isIn ? 1 : 0;
    const targetY = isIn ? 0 : 20;
    const duration = isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION;

    return new Promise(resolve => {
      gsap.to(refs.info.current, {
        opacity: targetOpacity,
        y: targetY,
        duration,
        ease: ANIMATION_CONFIG.EASE,
        onComplete: resolve
      });
    });
  }, []);

  const startTransitionAnimation = useCallback(() => {
    if (!refs.transitionImage.current || !refs.swiperContainer.current || 
        !imageData || animationState.inProgress) {
      updateAnimationState({ complete: true });
      return;
    }

    updateAnimationState({ inProgress: true });

    const { top, left, width, height } = imageData.rect;
    const transitionEl = refs.transitionImage.current;
    const swiperEl = refs.swiperContainer.current;
    const firstSlideImage = swiperEl.querySelector('.swiper-slide-active img');

    if (!firstSlideImage) {
      console.warn("Активное изображение слайда не найдено");
      updateAnimationState({ complete: true, inProgress: false });
      return;
    }

    const finalRect = firstSlideImage.getBoundingClientRect();
    
    if (finalRect.width === 0 || finalRect.height === 0) {
      setTimeout(() => {
        updateAnimationState({ inProgress: false });
        startTransitionAnimation();
      }, 100);
      return;
    }

    // Скрываем swiper
    gsap.set(swiperEl, { visibility: 'hidden', opacity: 0 });

    // Устанавливаем начальное состояние в контейнере
    gsap.set(transitionEl, {
      position: "absolute",
      top: top - window.scrollY,
      left: left - window.scrollX,
      width, height,
      zIndex: 1000,
      opacity: 1,
      visibility: 'visible',
      objectFit: "contain",
      borderRadius: imageData.borderRadius || '0px',
      pointerEvents: 'none'
    });

    // Анимируем переход
    gsap.to(transitionEl, {
      top: finalRect.top - window.scrollY,
      left: finalRect.left - window.scrollX,
      width: finalRect.width,
      height: finalRect.height,
      borderRadius: '12px',
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      onComplete: async () => {
        // Показываем swiper и скрываем переходное изображение
        gsap.set(swiperEl, { visibility: 'visible', opacity: 1 });
        gsap.set(transitionEl, { visibility: 'hidden', opacity: 0 });
        
        updateAnimationState({ complete: true });
        
        // Анимируем появление информации
        await animateInfo('in');
        updateAnimationState({ inProgress: false });
      }
    });
  }, [imageData, animationState.inProgress, updateAnimationState, animateInfo]);

  // Обработчики событий
  const handleSwiperInit = useCallback((swiper) => {
    setSwiperInstances(prev => ({ ...prev, main: swiper }));
    
    if (!imageData) {
      // Если нет анимации перехода, но есть loading screen
      if (shouldShowLoading && !loadingState.isCompleted) {
        gsap.set(refs.info.current, { opacity: 0, y: 0 });
      } else {
        gsap.set(refs.info.current, { opacity: 1, y: 0 });
      }
      return;
    }

    requestAnimationFrame(startTransitionAnimation);
  }, [imageData, startTransitionAnimation, shouldShowLoading, loadingState.isCompleted]);

  const handleSlideChange = useCallback(async (swiper) => {
    const newIndex = swiper.activeIndex;
    
    if (newIndex === activeProductIndex || animationState.inProgress) return;

    updateAnimationState({ slideChanging: true, inProgress: true });

    // Анимируем скрытие информации
    await animateInfo('out');

    // Обновляем состояние
    setActiveProductIndex(newIndex);
    updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);

    // Синхронизируем thumbs swiper
    if (swiperInstances.thumbs) {
      swiperInstances.thumbs.slideTo(newIndex);
    }

    // Анимируем появление новой информации
    await animateInfo('in');
    updateAnimationState({ slideChanging: false, inProgress: false });
  }, [activeProductIndex, animationState.inProgress, selectedImageIndices, 
      swiperInstances.thumbs, updateUrl, animateInfo, updateAnimationState]);

  const handleImageSelect = useCallback((index) => {
    if (animationState.inProgress) return;

    const newIndices = [...selectedImageIndices];
    newIndices[activeProductIndex] = index;
    setSelectedImageIndices(newIndices);
    updateUrl(currentProduct.id, index);
  }, [animationState.inProgress, selectedImageIndices, activeProductIndex, 
      currentProduct?.id, updateUrl]);

  const handleThumbnailClick = useCallback((index) => {
    if (animationState.inProgress || index === activeProductIndex || !swiperInstances.main) 
      return;
    
    swiperInstances.main.slideTo(index);
  }, [animationState.inProgress, activeProductIndex, swiperInstances.main]);

  useEffect(() => {
    if (!swiperInstances.main || animationState.inProgress) return;

    const newIndices = [...selectedImageIndices];
    newIndices[activeProductIndex] = slideIndexParam;
    setSelectedImageIndices(newIndices);
  }, [slideIndexParam, swiperInstances.main, animationState.inProgress]);

  // Стили и блокировка скролла
  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
 
    const applyStyles = (isDesktop) => {
      const styles = `
        html, body { 
        overflow: ${isDesktop ? "hidden" : "auto"} !important; 
          height: 100% !important;
          width: 100% !important;
        }
        .swiper-wrapper { 
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-slide { 
          transition: transform ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      opacity ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-slide-active { z-index: 2; }
        .swiper-no-transition .swiper-wrapper { transition: none !important; }
        .swiper-slide-thumb-active {
          opacity: 1 !important;
          transform: scale(1.05) !important;
          border: 2px solid black !important;
          border-radius: 0.5rem !important;
        }
        .transition-image-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          pointer-events: none !important;
          z-index: 9999 !important;
        }
      `;

      styleElement.innerHTML = styles;
    };

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      applyStyles(isDesktop);
    };

    // Установить начальное состояние
    handleResize();

    // Подписка на ресайз
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const swiper = swiperInstances.main;
    if (!swiper || animationState.inProgress) return;
  
    const newIndex = swiper.activeIndex;
    if (newIndex !== activeProductIndex) {
      setActiveProductIndex(newIndex);
      updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);
  
      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }
    }
  }, [swiperInstances.main?.activeIndex]);

  if (!currentProduct) {
    return <div className="text-center mt-10 p-4">Продукт не найден</div>;
  }

  // Показываем LoadingScreen если нужно
  if (loadingState.isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
   <><div className="flex flex-col min-h-screen">
  <SocialButtons
    buttonLabel="shop"
    onButtonClick={() => navigate("/catalogue")}
    buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
  />
 
  <div
    ref={refs.container}
    className="w-full flex-grow  mt-[70px] mx-auto px-4"
    style={{
      opacity: shouldShowLoading && !loadingState.isCompleted ? 0 : 1,
    }}
  >
    <div className="w-full flex items-start mb-4">
      {/* Левая часть — Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-200 hover:text-pink-800 transition-colors"
      >
        ← Back
      </button>

      {/* Правая часть — описание-табличка
      <div className="fixed hidden lg:block max-w-[690px] text-[24px] font-futura text-[#717171] font-medium border-b border-gray-200 right-5 px-4 py-2 ml-auto">
        <p className="font-futura tracking-tighter leading-none">
          фигуры которые вы сможете собрать своими руками, материал полностью размечен и подготовлен, так что вы сможете собрать фигуру без проблем по заранее подготовленному чертежу и обкатать её уже в считаные часы
        </p>
      </div> */}
    </div>
<div className=" block md:hidden w-[100%] mt-7 ">
      <Swiper
        modules={[Thumbs]}
        direction="horizontal"
        onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
     
          breakpoints={{
    320: { slidesPerView: 3 },
    480: { slidesPerView: 4 },
    640: { slidesPerView: 5 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 7 },
    1280: { slidesPerView: 8 },
  }}
    slidesPerView="auto"
        spaceBetween={10}
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        initialSlide={activeProductIndex}
        speed={SWIPER_CONFIG.SPEED}
        preventClicks={false}
        preventClicksPropagation={false}
        observer={true}
        observeParents={true}
        resistance={false}
        resistanceRatio={0}
      >
        {productCatalog.map((product, index) => (
          <SwiperSlide key={product.id}>
            <img
              src={product.image}
              onClick={() => handleThumbnailClick(index)}
              className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                index === activeProductIndex
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
    {/* Мобильный заголовок */}
    <div className="block lg:hidden w-full mt-4">
      {/* <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
          {currentProduct.description}
      </h1> */}
      <p className="font-futura text-[#717171] font-medium">
      {currentProduct.name}
      </p>
    </div>

    
    {/* Основной контент */}
    <div className="w-full  lg:h-[50%]  flex flex-col lg:flex-row lg:content-center  relative">
      {/* Переходное изображение */}
      {!animationState.complete && imageData && (
        <div className="transition-image-container">
          <img
            ref={refs.transitionImage}
            src={currentProduct.image}
            alt={currentProduct.name}
            className="object-contain"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              visibility: "visible",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
{/* Swiper галерея + Миниатюры (мобильная версия) */}
<div
  ref={refs.swiperContainer}
  className="w-full lg:w-[75%] lg:h-[50%] mt-0 lg:mt-20 lg:content-center"
  style={{
    visibility: !imageData || animationState.complete ? "visible" : "hidden",
    opacity: !imageData || animationState.complete ? 1 : 0,
  }}
>
  <div className="w-full flex flex-row items-start justify-between gap-2">
    {/* Основная галерея */}
    <div className="w-[calc(100%-80px)]">
      <Swiper
        className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
        modules={[Pagination, Mousewheel, Thumbs]}
        pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
        mousewheel={true}
        direction="horizontal"
        centeredSlides={true}
        thumbs={{ swiper: swiperInstances.thumbs }}
        spaceBetween={20}
        initialSlide={activeProductIndex}
        speed={SWIPER_CONFIG.SPEED}
        threshold={SWIPER_CONFIG.THRESHOLD}
        resistance={true}
        resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
        onInit={handleSwiperInit}
        onSlideChange={handleSlideChange}
        preventClicks={false}
        preventClicksPropagation={false}
        touchStartPreventDefault={false}
      >
        {productCatalog.map((product, index) => (
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
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-swiper-pagination mt-4 sm:mt-4 flex justify-center text-[#ff00fb]" />
    </div>

    {/* Миниатюры — справа от галереи */}
    <div className="block  md:hidden w-20 space-y-2">
      {currentImages.map((img, index) => (
        <button
          key={index}
          onClick={() => handleImageSelect(index)}
          className={`border rounded-lg p-1 transition hover:scale-105 ${
            selectedImageIndices[activeProductIndex] === index
              ? "border-black"
              : "border-transparent"
          }`}
          disabled={animationState.inProgress}
        >
          <img
            src={img}
            alt={`${currentProduct.name} Mini ${index + 1}`}
            className="w-16 h-16 object-contain rounded"
            draggable="false"
          />
        </button>
      ))}
    </div>
  </div>
</div>


        
          {/* Вертикальные миниатюры на мобилках
          <div className="block md:hidden absolute right-0 top-0 h-full w-20 z-10">
            <Swiper
              modules={[Thumbs]}
              direction="vertical"
              onSwiper={(swiper) =>
                setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
              }
              className="block md:hidden w-20 h-104 mt-4"
              slidesPerView={5}
              spaceBetween={10}
              watchSlidesProgress={true}
              slideToClickedSlide={true}
              initialSlide={activeProductIndex}
              speed={SWIPER_CONFIG.SPEED}
              preventClicks={false}
              preventClicksPropagation={false}
              observer={true}
              observeParents={true}
              resistance={false}
              resistanceRatio={0}
            >
              {productCatalog.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <img
                    src={product.image}
                    onClick={() => handleThumbnailClick(index)}
                    className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                      index === activeProductIndex
                        ? "opacity-100 scale-105 border-black"
                        : "grayscale border-transparent opacity-60 hover:opacity-100"
                    }`}
                    alt={product.name}
                    draggable="false"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div> */}
    

      {/* Описание и миниатюры текущего продукта */}
      <div
        ref={refs.info}
        className="w-full lg:w-[25%] lg:h-[25%] flex flex-col justify mt-8 lg:mt-20"
        style={{
          opacity:
            animationState.slideChanging || (!animationState.complete && imageData)
              ? 0
              : 1,
          transform:
            animationState.slideChanging || (!animationState.complete && imageData)
              ? "translateY(20px)"
              : "translateY(0)",
          visibility:
            animationState.slideChanging || (!animationState.complete && imageData)
              ? "hidden"
              : "visible",
        }}
      >
        <div className="hidden lg:block">
          <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
            {currentProduct.name}
          </h1>
          <p className="font-futura text-[#717171] font-medium">
            {currentProduct.description}
          </p>
        </div>

        {/* Миниатюры текущего товара */}
        <div className="hidden md:block flex flex-wrap justify-start gap-4">
          {currentImages.map((img, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`border rounded-lg p-1 transition hover:scale-105 ${
                selectedImageIndices[activeProductIndex] === index
                  ? "border-black"
                  : "border-transparent"
              }`}
              disabled={animationState.inProgress}
            >
              <img
                src={img}
                alt={`${currentProduct.name} Mini ${index + 1}`}
                className="w-16 h-16 object-contain rounded"
                draggable="false"
              />
            </button>
          ))}
        </div>

        {currentProduct.details?.map((detail, index) => {
          const isCatalog = detail.title.toLowerCase().includes("каталог");
          return (
            <button
              key={index}
              onClick={() => {
                if (isCatalog) setIsGalleryOpen(true);
                else window.location.href = detail.link;
              }}
              className="w-full text-left flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className="font-futura text-[#717171] font-medium">
                {detail.title}
              </span>
              <span className="font-futura text-[#717171] text-lg">→</span>
            </button>
          );
        })}
      </div>
     </div></div>

    {/* ✅ Новая нижняя полоса миниатюр — после всего контента */}
    <div className="hidden md:block w-[100%]  ">
      <Swiper
        modules={[Thumbs]}
        direction="horizontal"
        onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
     
          breakpoints={{
    320: { slidesPerView: 3 },
    480: { slidesPerView: 4 },
    640: { slidesPerView: 5 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 7 },
    1280: { slidesPerView: 8 },
  }}
    slidesPerView="auto"
        spaceBetween={10}
        watchSlidesProgress={true}
        slideToClickedSlide={true}
        initialSlide={activeProductIndex}
        speed={SWIPER_CONFIG.SPEED}
        preventClicks={false}
        preventClicksPropagation={false}
        observer={true}
        observeParents={true}
        resistance={false}
        resistanceRatio={0}
      >
        {productCatalog.map((product, index) => (
          <SwiperSlide key={product.id}>
            <img
              src={product.image}
              onClick={() => handleThumbnailClick(index)}
              className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                index === activeProductIndex
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

    {/* Fullscreen gallery */}
    <FullscreenGallery
      images={currentImagesFullscreen}
      isOpen={isGalleryOpen}
      onClose={() => setIsGalleryOpen(false)}
    />
  </div>
</>

  );
}


// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SocialButtons from "../SocialButtons/SocialButtons";
// import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
// import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
// import productCatalog from "../data/productCatalog";
// import "swiper/css";
// import "swiper/css/pagination"; 

// // Константы
// const ANIMATION_CONFIG = {
//   DURATION: 0.6,
//   EASE: "power2.out",
//   HALF_DURATION: 0.3
// };

// const SWIPER_CONFIG = {
//   SPEED: ANIMATION_CONFIG.DURATION * 1000,
//   THRESHOLD: 20,
//   RESISTANCE_RATIO: 0.85
// };

// const LOADING_SCREEN_DURATION = 1500; // 1.5 секунды

// export default function DiyProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const [searchParams] = useSearchParams();
  
//   const imageData = location.state?.imageData;
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Определяем, нужен ли loading screen
//   const shouldShowLoading = useMemo(() => {
//     // Показываем loading screen если:
//     // 1. Нет imageData (значит переход не с каталога с анимацией)
//     // 2. Или если это прямой переход/перезагрузка
//     return !imageData;
//   }, [imageData]);

//   // Основные состояния
//   const [activeProductIndex, setActiveProductIndex] = useState(() => 
//     Math.max(0, productCatalog.findIndex(p => p.id === Number(id)))
//   );
//   const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
//     productCatalog.map(() => 0)
//   );
//   const [swiperInstances, setSwiperInstances] = useState({
//     main: null,
//     thumbs: null
//   });

//   // Состояния анимации и загрузки
//   const [animationState, setAnimationState] = useState({
//     complete: !imageData,
//     inProgress: false,
//     slideChanging: false
//   });

//   const [loadingState, setLoadingState] = useState({
//     isLoading: shouldShowLoading,
//     isCompleted: false
//   });

//   // Refs
//   const refs = {
//     container: useRef(null),
//     transitionImage: useRef(null),
//     swiperContainer: useRef(null),
//     info: useRef(null),
//     urlUpdateBlocked: useRef(false)
//   };

//   // Мемоизированные значения
//   const currentProduct = useMemo(() => 
//     productCatalog[activeProductIndex], [activeProductIndex]
//   );

//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);

//   const currentImages = useMemo(() => 
//     currentProduct ? [currentProduct.image, ...currentProduct.altImages] : [], 
//     [currentProduct]
//   );

//   // Обработка завершения loading screen
//   const handleLoadingComplete = useCallback(() => {
//     setLoadingState(prev => ({ ...prev, isCompleted: true }));
    
//     // Небольшая задержка перед началом показа контента
//     setTimeout(() => {
//       setLoadingState(prev => ({ ...prev, isLoading: false }));
      
//       // Анимируем появление контента
//       if (refs.container.current && refs.info.current) {
//         gsap.fromTo(refs.container.current, 
//           { opacity: 0, y: 30 },
//           { 
//             opacity: 1, 
//             y: 0, 
//             duration: ANIMATION_CONFIG.DURATION,
//             ease: ANIMATION_CONFIG.EASE 
//           }
//         );
        
//         gsap.fromTo(refs.info.current,
//           { opacity: 0, y: 20 },
//           { 
//             opacity: 1, 
//             y: 0, 
//             duration: ANIMATION_CONFIG.DURATION,
//             ease: ANIMATION_CONFIG.EASE,
//             delay: 0.2
//           }
//         );
//       }
//     }, 200);
//   }, []);

//   // Эффект для автоматического завершения loading screen
//   useEffect(() => {
//     if (!shouldShowLoading) return;

//     const timer = setTimeout(() => {
//       handleLoadingComplete();
//     }, LOADING_SCREEN_DURATION);

//     return () => clearTimeout(timer);
//   }, [shouldShowLoading, handleLoadingComplete]);

//   // Утилиты
//   const updateUrl = useCallback((productId, viewIndex = 0) => {
//     if (refs.urlUpdateBlocked.current) return;
    
//     refs.urlUpdateBlocked.current = true;
//     const newUrl = `/product/diy/${productId}?view=${viewIndex}`;
//     window.history.replaceState(null, '', newUrl);
    
//     setTimeout(() => {
//       refs.urlUpdateBlocked.current = false;
//     }, 50);
//   }, []);

//   const updateAnimationState = useCallback((updates) => {
//     setAnimationState(prev => ({ ...prev, ...updates }));
//   }, []);

//   // Анимации
//   const animateInfo = useCallback((direction = 'in') => {
//     if (!refs.info.current) return Promise.resolve();
    
//     const isIn = direction === 'in';
//     const targetOpacity = isIn ? 1 : 0;
//     const targetY = isIn ? 0 : 20;
//     const duration = isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION;

//     return new Promise(resolve => {
//       gsap.to(refs.info.current, {
//         opacity: targetOpacity,
//         y: targetY,
//         duration,
//         ease: ANIMATION_CONFIG.EASE,
//         onComplete: resolve
//       });
//     });
//   }, []);

//   const startTransitionAnimation = useCallback(() => {
//     if (!refs.transitionImage.current || !refs.swiperContainer.current || 
//         !imageData || animationState.inProgress) {
//       updateAnimationState({ complete: true });
//       return;
//     }

//     updateAnimationState({ inProgress: true });

//     const { top, left, width, height } = imageData.rect;
//     const transitionEl = refs.transitionImage.current;
//     const swiperEl = refs.swiperContainer.current;
//     const firstSlideImage = swiperEl.querySelector('.swiper-slide-active img');

//     if (!firstSlideImage) {
//       console.warn("Активное изображение слайда не найдено");
//       updateAnimationState({ complete: true, inProgress: false });
//       return;
//     }

//     const finalRect = firstSlideImage.getBoundingClientRect();
    
//     if (finalRect.width === 0 || finalRect.height === 0) {
//       setTimeout(() => {
//         updateAnimationState({ inProgress: false });
//         startTransitionAnimation();
//       }, 100);
//       return;
//     }

//     // Скрываем swiper
//     gsap.set(swiperEl, { visibility: 'hidden', opacity: 0 });

//     // Устанавливаем начальное состояние в контейнере
//     gsap.set(transitionEl, {
//       position: "absolute",
//       top: top - window.scrollY,
//       left: left - window.scrollX,
//       width, height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: 'visible',
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px',
//       pointerEvents: 'none'
//     });

//     // Анимируем переход
//     gsap.to(transitionEl, {
//       top: finalRect.top - window.scrollY,
//       left: finalRect.left - window.scrollX,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: ANIMATION_CONFIG.DURATION,
//       ease: ANIMATION_CONFIG.EASE,
//       onComplete: async () => {
//         // Показываем swiper и скрываем переходное изображение
//         gsap.set(swiperEl, { visibility: 'visible', opacity: 1 });
//         gsap.set(transitionEl, { visibility: 'hidden', opacity: 0 });
        
//         updateAnimationState({ complete: true });
        
//         // Анимируем появление информации
//         await animateInfo('in');
//         updateAnimationState({ inProgress: false });
//       }
//     });
//   }, [imageData, animationState.inProgress, updateAnimationState, animateInfo]);

//   // Обработчики событий
//   const handleSwiperInit = useCallback((swiper) => {
//     setSwiperInstances(prev => ({ ...prev, main: swiper }));
    
//     if (!imageData) {
//       // Если нет анимации перехода, но есть loading screen
//       if (shouldShowLoading && !loadingState.isCompleted) {
//         gsap.set(refs.info.current, { opacity: 0, y: 0 });
//       } else {
//         gsap.set(refs.info.current, { opacity: 1, y: 0 });
//       }
//       return;
//     }

//     requestAnimationFrame(startTransitionAnimation);
//   }, [imageData, startTransitionAnimation, shouldShowLoading, loadingState.isCompleted]);

//   const handleSlideChange = useCallback(async (swiper) => {
//     const newIndex = swiper.activeIndex;
    
//     if (newIndex === activeProductIndex || animationState.inProgress) return;

//     updateAnimationState({ slideChanging: true, inProgress: true });

//     // Анимируем скрытие информации
//     await animateInfo('out');

//     // Обновляем состояние
//     setActiveProductIndex(newIndex);
//     updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);

//     // Синхронизируем thumbs swiper
//     if (swiperInstances.thumbs) {
//       swiperInstances.thumbs.slideTo(newIndex);
//     }

//     // Анимируем появление новой информации
//     await animateInfo('in');
//     updateAnimationState({ slideChanging: false, inProgress: false });
//   }, [activeProductIndex, animationState.inProgress, selectedImageIndices, 
//       swiperInstances.thumbs, updateUrl, animateInfo, updateAnimationState]);

//   const handleImageSelect = useCallback((index) => {
//     if (animationState.inProgress) return;

//     const newIndices = [...selectedImageIndices];
//     newIndices[activeProductIndex] = index;
//     setSelectedImageIndices(newIndices);
//     updateUrl(currentProduct.id, index);
//   }, [animationState.inProgress, selectedImageIndices, activeProductIndex, 
//       currentProduct?.id, updateUrl]);

//   const handleThumbnailClick = useCallback((index) => {
//     if (animationState.inProgress || index === activeProductIndex || !swiperInstances.main) 
//       return;
    
//     swiperInstances.main.slideTo(index);
//   }, [animationState.inProgress, activeProductIndex, swiperInstances.main]);

//   useEffect(() => {
//     if (!swiperInstances.main || animationState.inProgress) return;

//     const newIndices = [...selectedImageIndices];
//     newIndices[activeProductIndex] = slideIndexParam;
//     setSelectedImageIndices(newIndices);
//   }, [slideIndexParam, swiperInstances.main, animationState.inProgress]);

//   // Стили и блокировка скролла
//   useEffect(() => {
//     const styleElement = document.createElement("style");
//     document.head.appendChild(styleElement);
 
//     const applyStyles = (isDesktop) => {
//       const styles = `
//         html, body { 
//         overflow: ${isDesktop ? "hidden" : "auto"} !important; 
//           height: 100% !important;
//           width: 100% !important;
//         }
//         .swiper-wrapper { 
//           transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
//         }
//         .swiper-slide { 
//           transition: transform ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
//                       opacity ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
//         }
//         .swiper-slide-active { z-index: 2; }
//         .swiper-no-transition .swiper-wrapper { transition: none !important; }
//         .swiper-slide-thumb-active {
//           opacity: 1 !important;
//           transform: scale(1.05) !important;
//           border: 2px solid black !important;
//           border-radius: 0.5rem !important;
//         }
//         .transition-image-container {
//           position: fixed !important;
//           top: 0 !important;
//           left: 0 !important;
//           width: 100vw !important;
//           height: 100vh !important;
//           overflow: hidden !important;
//           pointer-events: none !important;
//           z-index: 9999 !important;
//         }
//       `;

//       styleElement.innerHTML = styles;
//     };

//     const handleResize = () => {
//       const isDesktop = window.innerWidth >= 1024;
//       applyStyles(isDesktop);
//     };

//     // Установить начальное состояние
//     handleResize();

//     // Подписка на ресайз
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   useEffect(() => {
//     const swiper = swiperInstances.main;
//     if (!swiper || animationState.inProgress) return;
  
//     const newIndex = swiper.activeIndex;
//     if (newIndex !== activeProductIndex) {
//       setActiveProductIndex(newIndex);
//       updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);
  
//       if (swiperInstances.thumbs) {
//         swiperInstances.thumbs.slideTo(newIndex);
//       }
//     }
//   }, [swiperInstances.main?.activeIndex]);

//   if (!currentProduct) {
//     return <div className="text-center mt-10 p-4">Продукт не найден</div>;
//   }

//   // Показываем LoadingScreen если нужно
//   if (loadingState.isLoading) {
//     return <LoadingScreen onComplete={handleLoadingComplete} />;
//   }

//   return (
//    <><div className="flex flex-col min-h-screen">
//   <SocialButtons
//     buttonLabel="shop"
//     onButtonClick={() => navigate("/catalogue")}
//     buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//   />
 
//   <div
//     ref={refs.container}
//     className="w-full flex-grow  mt-[70px] mx-auto px-4"
//     style={{
//       opacity: shouldShowLoading && !loadingState.isCompleted ? 0 : 1,
//     }}
//   >
//     <div className="w-full flex items-start mb-4">
//       {/* Левая часть — Back */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-gray-200 hover:text-pink-800 transition-colors"
//       >
//         ← Back
//       </button>

//       {/* Правая часть — описание-табличка
//       <div className="fixed hidden lg:block max-w-[690px] text-[24px] font-futura text-[#717171] font-medium border-b border-gray-200 right-5 px-4 py-2 ml-auto">
//         <p className="font-futura tracking-tighter leading-none">
//           фигуры которые вы сможете собрать своими руками, материал полностью размечен и подготовлен, так что вы сможете собрать фигуру без проблем по заранее подготовленному чертежу и обкатать её уже в считаные часы
//         </p>
//       </div> */}
//     </div>

//     {/* Мобильный заголовок */}
//     <div className="block lg:hidden w-full mb-6">
//       <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//         {currentProduct.name}
//       </h1>
//       <p className="font-futura text-[#717171] font-medium">
//         {currentProduct.description}
//       </p>
//     </div>

//     {/* Основной контент */}
//     <div className="w-full  lg:h-[50%]  flex flex-col lg:flex-row lg:content-center gap-8  relative">
//       {/* Переходное изображение */}
//       {!animationState.complete && imageData && (
//         <div className="transition-image-container">
//           <img
//             ref={refs.transitionImage}
//             src={currentProduct.image}
//             alt={currentProduct.name}
//             className="object-contain"
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               visibility: "visible",
//               pointerEvents: "none",
//             }}
//           />
//         </div>
//       )}

//       {/* Swiper галерея */}
//       <div
//         ref={refs.swiperContainer}
//         className="w-full lg:w-[75%] lg:h-[50%] mt-20 lg:content-center"
//         style={{
//           visibility: !imageData || animationState.complete ? "visible" : "hidden",
//           opacity: !imageData || animationState.complete ? 1 : 0,
//         }}
//       >
//         <div className="w-full content-center">
//           <div className="md:w-full w-[75%]">
//             <Swiper
//               className="custom-swiper"
//               style={{ height: "350px" }}
//               modules={[Pagination, Mousewheel, Thumbs]}
//               pagination={{ clickable: true,
//                  el: ".custom-swiper-pagination",
//                }}
//               mousewheel={true}
//               direction="horizontal"
//               centeredSlides={true}
//               thumbs={{ swiper: swiperInstances.thumbs }}
          
//               spaceBetween={20}
//               initialSlide={activeProductIndex}
//               speed={SWIPER_CONFIG.SPEED}
//               threshold={SWIPER_CONFIG.THRESHOLD}
//               resistance={true}
//               resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
//               onInit={handleSwiperInit}
//               onSlideChange={handleSlideChange}
//               preventClicks={false}
//               preventClicksPropagation={false}
//               touchStartPreventDefault={false}
//             >
//               {productCatalog.map((product, index) => (
//                 <SwiperSlide key={product.id} style={{ height: "100%" }}>
//                   <div className="w-full h-full flex items-center justify-center">
//                     <img
//                       src={
//                         selectedImageIndices[index] === 0
//                           ? product.image
//                           : product.altImages[selectedImageIndices[index] - 1]
//                       }
//                       alt={product.name}
//                       className="max-h-full w-auto object-contain"
//                       draggable="false"
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//              <div className="custom-swiper-pagination mt-4 flex justify-center text-[#ff00fb] mgap-2" />
//           </div>

//           {/* Вертикальные миниатюры на мобилках */}
//           <div className="block md:hidden absolute right-0 top-0 h-full w-20 z-10">
//             <Swiper
//               modules={[Thumbs]}
//               direction="vertical"
//               onSwiper={(swiper) =>
//                 setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
//               }
//               className="block md:hidden w-20 h-104 mt-4"
//               slidesPerView={5}
//               spaceBetween={10}
//               watchSlidesProgress={true}
//               slideToClickedSlide={true}
//               initialSlide={activeProductIndex}
//               speed={SWIPER_CONFIG.SPEED}
//               preventClicks={false}
//               preventClicksPropagation={false}
//               observer={true}
//               observeParents={true}
//               resistance={false}
//               resistanceRatio={0}
//             >
//               {productCatalog.map((product, index) => (
//                 <SwiperSlide key={product.id}>
//                   <img
//                     src={product.image}
//                     onClick={() => handleThumbnailClick(index)}
//                     className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
//                       index === activeProductIndex
//                         ? "opacity-100 scale-105 border-black"
//                         : "grayscale border-transparent opacity-60 hover:opacity-100"
//                     }`}
//                     alt={product.name}
//                     draggable="false"
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
//         </div>
//       </div>

//       {/* Описание и миниатюры текущего продукта */}
//       <div
//         ref={refs.info}
//         className="w-full lg:w-[25%] lg:h-[25%] flex flex-col justify mt-8 lg:mt-20"
//         style={{
//           opacity:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? 0
//               : 1,
//           transform:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? "translateY(20px)"
//               : "translateY(0)",
//           visibility:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? "hidden"
//               : "visible",
//         }}
//       >
//         <div className="hidden lg:block">
//           <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//             {currentProduct.name}
//           </h1>
//           <p className="font-futura text-[#717171] font-medium">
//             {currentProduct.description}
//           </p>
//         </div>

//         {/* Миниатюры текущего товара */}
//         <div className=" flex flex-wrap justify-start gap-4">
//           {currentImages.map((img, index) => (
//             <button
//               key={index}
//               onClick={() => handleImageSelect(index)}
//               className={`border rounded-lg p-1 transition hover:scale-105 ${
//                 selectedImageIndices[activeProductIndex] === index
//                   ? "border-black"
//                   : "border-transparent"
//               }`}
//               disabled={animationState.inProgress}
//             >
//               <img
//                 src={img}
//                 alt={`${currentProduct.name} Mini ${index + 1}`}
//                 className="w-16 h-16 object-contain rounded"
//                 draggable="false"
//               />
//             </button>
//           ))}
//         </div>

//         {currentProduct.details?.map((detail, index) => {
//           const isCatalog = detail.title.toLowerCase().includes("каталог");
//           return (
//             <button
//               key={index}
//               onClick={() => {
//                 if (isCatalog) setIsGalleryOpen(true);
//                 else window.location.href = detail.link;
//               }}
//               className="w-full text-left flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
//             >
//               <span className="font-futura text-[#717171] font-medium">
//                 {detail.title}
//               </span>
//               <span className="font-futura text-[#717171] text-lg">→</span>
//             </button>
//           );
//         })}
//       </div>
//      </div></div>

//     {/* ✅ Новая нижняя полоса миниатюр — после всего контента */}
//     <div className="hidden  md:block    w-[100%]  ">
//       <Swiper
//         modules={[Thumbs]}
//         direction="horizontal"
//         onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
     
//           breakpoints={{
//     320: { slidesPerView: 3 },
//     480: { slidesPerView: 4 },
//     640: { slidesPerView: 5 },
//     768: { slidesPerView: 6 },
//     1024: { slidesPerView: 7 },
//     1280: { slidesPerView: 8 },
//   }}
//     slidesPerView="auto"
//         spaceBetween={10}
//         watchSlidesProgress={true}
//         slideToClickedSlide={true}
//         initialSlide={activeProductIndex}
//         speed={SWIPER_CONFIG.SPEED}
//         preventClicks={false}
//         preventClicksPropagation={false}
//         observer={true}
//         observeParents={true}
//         resistance={false}
//         resistanceRatio={0}
//       >
//         {productCatalog.map((product, index) => (
//           <SwiperSlide key={product.id}>
//             <img
//               src={product.image}
//               onClick={() => handleThumbnailClick(index)}
//               className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
//                 index === activeProductIndex
//                   ? "opacity-100 scale-105 border-black"
//                   : "grayscale border-transparent opacity-60 hover:opacity-100"
//               }`}
//               alt={product.name}
//               draggable="false"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//    </div>

//     {/* Fullscreen gallery */}
//     <FullscreenGallery
//       images={currentImages}
//       isOpen={isGalleryOpen}
//       onClose={() => setIsGalleryOpen(false)}
//     />
//   </div>
// </>

//   );
// }


// import { useEffect, useRef, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SocialButtons from "../SocialButtons/SocialButtons";
// import { Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination"; 

// const products = [
//   {
//     id: 1,
//     name: "Cactus® Green",
//     image: "/images/box1.png",
//     altImages: ["/images/box3.png"],
//     designer: "Studio 65",
//     year: 1970,
//     description: "A bold design statement.",
//     details: [
//       { title: "History", link: "#history" },
//       { title: "Exhibitions", link: "#exhibitions" },
//       { title: "Materials", link: "#materials" },
//       { title: "Technical Specs", link: "#tech-specs" }
//     ]
//   },
//   {
//     id: 2,
//     name: "Lips Sofa",
//     image: "/images/box4.png",
//     altImages: ["/images/box1.png", "/images/box4.png"],
//     designer: "Studio 65",
//     year: 1970,
//     description: "An iconic pop-art sofa.",
//     details: [
//       { title: "History", link: "#history" },
//       { title: "Exhibitions", link: "#exhibitions" },
//       { title: "Materials", link: "#materials" },
//       { title: "Technical Specs", link: "#tech-specs" }
//     ]
//   }
// ];



// export default function ProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const imageData = location.state?.imageData;
  
  
//   const transitionImageRef = useRef(null);
//   const swiperContainerRef = useRef(null);
//   const [animationComplete, setAnimationComplete] = useState(!imageData);
//   const [swiperLoaded, setSwiperLoaded] = useState(false);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   // const [isLoading, setIsLoading] = useState(true);
  
//  const containerRef = useRef(null);



// const [activeProduct, setActiveProduct] = useState(null);

// useEffect(() => {
//   const found = products.find((p) => p.id === Number(id));
//   if (found) {
//     setActiveProduct(found);
//   }
// }, [id]);


// const handleExit = () => {
//   console.log("handleExit вызван!");
//   setIsFadingOut(true);
//   setTimeout(() => {
//     navigate("/photopage");
//   }, 500);
// };


// useEffect(() => {
//   // Запускаем анимацию исчезновения перед снятием лоадинга
//   const timer = setTimeout(() => setIsFadingOut(true), 1500);
//   const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
  
//   return () => {
//     clearTimeout(timer);
//     clearTimeout(removeLoadingScreen);
//   };
// }, []); 


// const handleThumbnailClick = (productId) => {
//   if (productId !== activeProduct?.id) {
//     navigate(`/product/${productId}`);
//   }
// };


//   const product = products.find((p) => p.id === Number(id));
//   if (!product) return <p>Not found</p>;
  
//   const images = [product.image, ...product.altImages];
  
//   // Обработчик события, когда Swiper полностью инициализирован
//   const handleSwiperInit = (swiper) => {
//     setSwiperLoaded(true);
    
//     // Если нет анимации (прямой переход/перезагрузка), просто показываем галерею
//     if (!imageData) {
//       return;
//     }
    
//     // Начинаем анимацию только после полной загрузки Swiper
//     requestAnimationFrame(() => {
//       startTransitionAnimation();
//     });
//   };
  
//   // Функция для запуска анимации перехода
//   const startTransitionAnimation = () => {
//     if (!transitionImageRef.current || !swiperContainerRef.current || !imageData) {
//       setAnimationComplete(true);
//       return;
//     }
    
//     const { top, left, width, height } = imageData.rect;
//     const transitionImage = transitionImageRef.current;
//     const swiperContainer = swiperContainerRef.current;
    
//     // Находим элемент первого слайда
//     const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');
    
//     if (!firstSlideImage) {
//       setAnimationComplete(true);
//       return;
//     }
    
//     // Получаем финальную позицию и размеры первого изображения
//     const finalRect = firstSlideImage.getBoundingClientRect();
    
//     // Скрываем Swiper на время анимации
//     gsap.set(swiperContainer, { visibility: 'hidden' });
    
//     // Устанавливаем начальное состояние переходного изображения
//     gsap.set(transitionImage, {
//       position: "fixed",
//       top,
//       left,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });
    
//     // Анимируем переходное изображение
//     gsap.to(transitionImage, {
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: 0.6,
//       ease: "power2.inOut",
//       onComplete: () => {
//         // Показываем Swiper и скрываем переходное изображение
//         gsap.set(swiperContainer, { visibility: 'visible' });
//         gsap.set(transitionImage, { visibility: 'hidden' });
//         setAnimationComplete(true);
//       }
//     });
//   };
  
//   return (

//     <div ref={containerRef} className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
//       {/* {isLoading && <LoadingScreen isFadingOut={isFadingOut} />} */}
//        <SocialButtons
//               buttonLabel="gallery"
//               onButtonClick={handleExit}
//               buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//             />
//       <button onClick={() => navigate(-1)} className="self-start mb-6 text-gray-600 hover:text-gray-800">
//         ← Back
//       </button>
      
//       {/* Основной контент */}
//       <div className="w-full flex flex-col lg:flex-row items-start gap-10 mt-8">
//         {/* Переходное изображение - только при анимированном переходе */}
//         {!animationComplete && imageData && (
//           <img
//             ref={transitionImageRef}
//             src={product.image}
//             alt={product.name}
//             className="object-contain"
//             style={{ position: 'fixed', visibility: 'visible' }}
//           />
//         )}
        
//         {/* Swiper галерея */}
//         <div 
//           ref={swiperContainerRef} 
//           className="w-full "
//           style={{ visibility: !imageData || animationComplete ? 'visible' : 'hidden' }}
//         >
//           <Swiper
//             modules={[Pagination]}
//             pagination={{ clickable: true }}
//             slidesPerView={1.5}
//             centeredSlides={true}
//             spaceBetween={20}
//             className="w-full"
//             initialSlide={0}
//             onInit={handleSwiperInit}
//             onSwiper={(swiper) => {
//               // Дополнительная проверка, что слайдер инициализирован
//               if (swiper.initialized) {
//                 setSwiperLoaded(true);
//               }
//             }}
//           >
//             {images.map((img, index) => (
//               <SwiperSlide key={index} className="flex justify-center">
//                 <div className="w-full aspect-[4/3] flex justify-center">
//                   <img
//                     src={img}
//                     alt={`${product.name} - View ${index + 1}`}
//                     className="w-full h-full object-contain rounded-xl"
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
        
//           {/* Информация о продукте */}
//           <div className="text-center mt-10">
//         <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">{product.name}</h1>
//         <p className="text-sm text-gray-500 mb-1">
//           {product.designer} &nbsp;·&nbsp; {product.year}
//         </p>
//         <div className="max-w-3xl mx-auto text-gray-700 text-base leading-relaxed mt-6">
//           <p className="max-h-48 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//             {product.description}
//           </p>
//         </div>
//         <div className="mt-8 flex flex-wrap justify-center gap-4">
//   {products.map((item) => (
//     <button
//       key={item.id}
//       onClick={() => handleThumbnailClick(item.id)}
//       className={`border rounded-lg p-1 transition hover:scale-105 ${
//         activeProduct?.id === item.id ? "border-black" : "border-transparent"
//       }`}
//     >
//       <img
//         src={item.image}
//         alt={item.name}
//         className="w-20 h-20 object-contain rounded"
//       />
//     </button>
//   ))}
// </div>

//         {/* Блок ссылок */}
//         <div className="mt-10 border-t border-gray-300 pt-4 max-w-md mx-auto">
//           {product.details.map((detail, index) => (
//             <a
//               key={index}
//               href={detail.link}
//               className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
//             >
//               <span className="font-medium">{detail.title}</span>
//               <span className="text-lg">→</span>
//             </a>
//           ))}
//         </div>
//       </div>
//       </div>
      
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from "react";
// import { useLocation, useParams, useNavigate,  useSearchParams } from "react-router-dom";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SocialButtons from "../SocialButtons/SocialButtons";
// import { Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination"; 

// const products = [
//   {
//     id: 1,
//     name: "BOX",
//     image: "/images/sets/box1.png",
//     altImages: ["/images/sets/box1.png", "/images/sets/box4.png"],
//     designer: "Studio 65",
//     year: 1970,
//     description: "A bold design statement.",
//      imagesRight:["/images/sets/box6.png", "/images/sets/box8.png"],
//     details: [
//       { title: "History", link: "#history" },
//       { title: "Exhibitions", link: "#exhibitions" },
//       { title: "Materials", link: "#materials" },
//       { title: "Technical Specs", link: "#tech-specs" }
//     ],
 
//   },

//   {
//     id: 2,
//     name: "Skateparks",
  
//     image: ["/images/ramps/r180h60w200d40main.png"],
//     altImages: ["/images/sets/box1.png", "/images/sets/box3.png"],
//     imagesRight:["/images/ramps/r180h60w200d40main.png", "/images/ramps/r180h60w200d40main.png"],
//      designer: "Studio 65",
//     year: 1970,
//     description: "An iconic pop-art sofa.",
//     details: [
//       { title: "History", link: "#history" },
//       { title: "Exhibitions", link: "#exhibitions" },
//       { title: "Materials", link: "#materials" },
//       { title: "Technical Specs", link: "#tech-specs" }
//     ],
//  }, 
// ];


// // Импортируются необходимые хуки и библиотеки для роутинга, анимаций и Swiper-слайдера


// export default function ProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const imageData = location.state?.imageData;

//   const [searchParams, setSearchParams] = useSearchParams();
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   const containerRef = useRef(null);
//   const transitionImageRef = useRef(null);
//   const swiperContainerRef = useRef(null);
//   const infoRef = useRef(null);
//   const swiperRef = useRef(null);

//   const [animationComplete, setAnimationComplete] = useState(!imageData);
//   const [swiperLoaded, setSwiperLoaded] = useState(false);

//   const product = products.find((p) => p.id === Number(id));
//   if (!product) return <p>Not found</p>;

//   // Новое состояние: выбранный продукт (будем менять его по клику)
//   const [activeProduct, setActiveProduct] = useState(product);

//   const updateViewParam = (index) => {
//     setSearchParams((prev) => {
//       const params = new URLSearchParams(prev);
//       params.set('view', index);
//       return params;
//     }, { replace: true });
//   };

//   // При смене id товара из URL сбрасываем состояние
//   useEffect(() => {
//     const found = products.find((p) => p.id === Number(id));
//     if (found) {
//       setActiveProduct(found);
//       setActiveImageIndex(0);
//       setSelectedImageIndex(0);
//     }
//   }, [id]);

//   const images = [product.image, ...product.altImages];

//   useEffect(() => {
//     if (swiperRef.current && swiperLoaded) {
//       swiperRef.current.slideTo(slideIndexParam);
//       setActiveImageIndex(slideIndexParam);
//     }
//   }, [slideIndexParam, swiperLoaded]);

//   const handleSwiperInit = (swiper) => {
//     setSwiperLoaded(true);

//     if (!imageData) {
//       gsap.set(infoRef.current, { opacity: 1, y: 0 });
//       return;
//     }

//     requestAnimationFrame(() => {
//       startTransitionAnimation();
//     });
//   };

//   const startTransitionAnimation = () => {
//     if (!transitionImageRef.current || !swiperContainerRef.current || !imageData) {
//       setAnimationComplete(true);
//       return;
//     }

//     const { top, left, width, height } = imageData.rect;
//     const transitionImage = transitionImageRef.current;
//     const swiperContainer = swiperContainerRef.current;

//     const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');

//     if (!firstSlideImage) {
//       setAnimationComplete(true);
//       return;
//     }

//     const finalRect = firstSlideImage.getBoundingClientRect();

//     gsap.set(swiperContainer, { visibility: 'hidden' });

//     gsap.set(transitionImage, {
//       position: "fixed",
//       top,
//       left,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });

//     gsap.to(transitionImage, {
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: 0.6,
//       ease: "power2.inOut",
//       onComplete: () => {
//         gsap.set(swiperContainer, { visibility: 'visible' });
//         gsap.set(transitionImage, { visibility: 'hidden' });
//         setAnimationComplete(true);

//         gsap.to(infoRef.current, {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//           ease: "power2.out",
//         });
//       }
//     });
//   };

//   const animateDescription = () => {
//     gsap.fromTo(
//       infoRef.current,
//       { opacity: 0, y: 20 },
//       { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
//     );
//   };

//   useEffect(() => {
//     animateDescription();
//   }, []);

//   const handleSlideChange = (index) => {
//     setActiveImageIndex(index);
//     updateViewParam(index);
//     animateDescription();
//   };

//   const handleExit = () => {
//     setTimeout(() => {
//       navigate("/photopage");
//     }, 500);
//   };
// const handleRightThumbnailClick = (index) => {
//   setSelectedImageIndex(index);
//   setActiveImageIndex(index);
//   updateViewParam(index);
//   animateDescription();
  
// };
//   // Обработчик клика по миниатюре внизу
//   const handleThumbnailClick = (index) => {
//  setSelectedImageIndex(index);  // Меняем только выбранный ракурс (из imagesRight)
//   animateDescription();

//    updateViewParam(index);
//     // Меняем описание и правые миниатюры по выбранному индексу
//     setActiveProduct({
//       ...product,
//       name: products[index]?.name || product.name,
//       description: products[index]?.description || product.description,
//       imagesRight: products[index]?.imagesRight || product.imagesRight
//     });

//     animateDescription();
//   };

//   return (
//     <>
//       <SocialButtons
//         buttonLabel="shop"
//         onButtonClick={handleExit}
//         buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//       />

//       <div ref={containerRef} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">

//         <button onClick={() => navigate(-1)} className="self-start mb-6 text-gray-200 hover:text-gray-800">
//           ← Back
//         </button>

//         <div className={`w-full flex gap-8 ${animationComplete ? 'flex-col lg:flex-row' : 'flex-col'}`}>

//           {!animationComplete && imageData && (
//             <img
//               ref={transitionImageRef}
//               src={product.image}
//               alt={product.name}
//               className="object-contain"
//               style={{ position: 'fixed', visibility: 'visible' }}
//             />
//           )}

//           {/* Слайдер Swiper */}
//           <div
//             ref={swiperContainerRef}
//             className="w-full lg:w-[80%] mb-8"
//             style={{ visibility: !imageData || animationComplete ? 'visible' : 'hidden' }}
//           >
//             <Swiper
//               modules={[Pagination]}
//               pagination={{ clickable: true }}
//               slidesPerView={1.5}
//               centeredSlides={true}
//               spaceBetween={20}
//               className="w-full"
//               initialSlide={0}
//               onInit={handleSwiperInit}
//               onSlideChange={(swiper) => handleSlideChange(swiper.activeIndex)}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//                 if (swiper.initialized) {
//                   setSwiperLoaded(true);
//                 }
//               }}
//             >
//               {images.map((img, index) => (
//                 <SwiperSlide key={index} className="flex justify-center">
//                   <div className="w-full aspect-[4/3] flex justify-center">
//                     <img
//                       src={  index === activeImageIndex
//             ? (activeProduct.imagesRight?.[selectedImageIndex] || images[activeImageIndex])
//             : img}
//                       alt={`${product.name} - View ${index + 1}`}
//                       className="w-full h-full object-contain rounded-xl"
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>

//           {/* Описание продукта + правые миниатюры */}
//           <div
//             ref={infoRef}
//             className={`w-full lg:w-[20%] flex flex-col justify-center transition-opacity duration-500 ${
//               animationComplete ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute'
//             }`}
//           >
//             <div className="mt-8 flex flex-wrap justify-center gap-4">
//               <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//                 {activeProduct.name}
//               </h1>
//               <p className="font-futura text-[#717171] font-medium">
//                 {activeProduct.description}
//               </p>

//               {/* Правые миниатюры */}
//               <div className="mt-8 flex flex-wrap justify-center gap-4">
//                {activeProduct.imagesRight.map((img, index) => (
//   <button
//     key={index}
//     onClick={() => handleRightThumbnailClick(index)}
//     className={`border rounded-lg p-1 transition hover:scale-105 ${
//       activeImageIndex === index ? "border-black" : "border-transparent"
//     }`}
//   >
//     <img
//       src={img}
//       alt={`${activeProduct.name} Right Mini ${index + 1}`}
//       className="w-20 h-20 object-contain rounded"
//     />
//   </button>
// ))}

//               </div>
//             </div>

//             {product.details.map((detail, index) => (
//               <a
//                 key={index}
//                 href={detail.link}
//                 className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
//               >
//                 <span className="font-futura text-[#717171] font-medium">{detail.title}</span>
//                 <span className="font-futura text-[#717171] text-lg">→</span>
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Нижние миниатюры */}
//         <div className="mt-8 flex flex-wrap justify-center gap-4">
//           {images.map((img, index) => (
//             <button
//               key={index}
//               onClick={() => handleThumbnailClick(index)}
//               className={`border rounded-lg p-1 transition hover:scale-105 ${
//                 activeImageIndex === index ? "border-black" : "border-transparent"
//               }`}
//             >
//               <img
//                 src={img}
//                 alt={`${product.name} Thumbnail ${index + 1}`}
//                 className="w-20 h-20 object-contain rounded"
//               />
//             </button>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }


// const productCatalog = [
//   {    category: 'sets',
//     products: 
//     [ {id: 1,
//     name: "Скейтпарки",
//     image: "/images/sets/box1.png",
//     altImages: ["/images/sets/box1.png", "/images/sets/box4.png"],
//     designer: "Studio 65",
//     year: 2023,
//     description: "Комплексные решения для скейтпарков.",
//     details: [
//       { title: "Материалы", link: "#materials" },
//       { title: "Технические характеристики", link: "#tech-specs" },
//       { title: "Доставка", link: "#delivery" },
//       { title: "Установка", link: "#installation" }
//     ],
//     relatedProducts: [2, 3, 4] // IDs of related products
//   },
//   {
//     id: 2,
//     name: "Рампы",
//     image: "/images/ramps/r180h60w200d40main.png",
//     altImages: ["/images/ramps/r180h60w200d40top.png", "/images/ramps/r180h60w200d40front.png"],
//     designer: "РампСтрой",
//     year: 2024,
//     description: "Профессиональные рампы различных размеров.",
//     details: [
//       { title: "Материалы", link: "#materials" },
//       { title: "Размеры", link: "#dimensions" },
//       { title: "Установка", link: "#installation" },
//       { title: "Гарантия", link: "#warranty" }
//     ],
//     relatedProducts: [1, 3, 4] // IDs of related products
//   },
//   {
//     id: 3,
//     name: "Фигуры и комплекты фигур",
//     image: "/images/skateparks/box7.png",
//     altImages: ["/images/skateparks/box7.png", "/images/skateparks/box7.png"],
//     designer: "СкейтДизайн",
//     year: 2024,
//     description: "Отдельные элементы и готовые комплекты для скейтпарков.",
//     details: [
//       { title: "Каталог фигур", link: "#catalog" },
//       { title: "Варианты комплектации", link: "#sets" },
//       { title: "Технические характеристики", link: "#tech-specs" },
//       { title: "Доставка", link: "#delivery" }
//     ],
//     relatedProducts: [1, 2, 4] // IDs of related products
//   },
//   {
//     id: 4,
//     name: "Сделай сам DIY",
//     image: "/images/diy/kicker.png",
//     altImages: ["/images/diy/kicker.png", "/images/diy/kicker.png"],
//     designer: "DIY Workshop",
//     year: 2023,
//     description: "Комплекты для самостоятельного строительства элементов.",
//     details: [
//       { title: "Инструкции", link: "#instructions" },
//       { title: "Материалы", link: "#materials" },
//       { title: "Инструменты", link: "#tools" },
//       { title: "Советы", link: "#tips" }
//     ],
//     relatedProducts: [1, 2, 3] // IDs of related products
//   }]
// }, 
// {
//     category: 'ramps',
//     products: [{id: 1,
//     name: "Скейтпарки",
//     image: "/images/sets/box1.png",
//     altImages: ["/images/sets/box1.png", "/images/sets/box4.png"],
//     designer: "Studio 65",
//     year: 2023,
//     description: "Комплексные решения для скейтпарков.",
//     details: [
//       { title: "Материалы", link: "#materials" },
//       { title: "Технические характеристики", link: "#tech-specs" },
//       { title: "Доставка", link: "#delivery" },
//       { title: "Установка", link: "#installation" }
//     ],
//     relatedProducts: [2, 3, 4] // IDs of related products
//   },
//   {
//     id: 2,
//     name: "Рампы",
//     image: "/images/ramps/r180h60w200d40main.png",
//     altImages: ["/images/ramps/r180h60w200d40top.png", "/images/ramps/r180h60w200d40front.png"],
//     designer: "РампСтрой",
//     year: 2024,
//     description: "Профессиональные рампы различных размеров.",
//     details: [
//       { title: "Материалы", link: "#materials" },
//       { title: "Размеры", link: "#dimensions" },
//       { title: "Установка", link: "#installation" },
//       { title: "Гарантия", link: "#warranty" }
//     ],
//     relatedProducts: [1, 3, 4] // IDs of related products
//   },
//   {
//     id: 3,
//     name: "Фигуры и комплекты фигур",
//     image: "/images/skateparks/box7.png",
//     altImages: ["/images/skateparks/box7.png", "/images/skateparks/box7.png"],
//     designer: "СкейтДизайн",
//     year: 2024,
//     description: "Отдельные элементы и готовые комплекты для скейтпарков.",
//     details: [
//       { title: "Каталог фигур", link: "#catalog" },
//       { title: "Варианты комплектации", link: "#sets" },
//       { title: "Технические характеристики", link: "#tech-specs" },
//       { title: "Доставка", link: "#delivery" }
//     ],
//     relatedProducts: [1, 2, 4] // IDs of related products
//   },
//   {
//     id: 4,
//     name: "Сделай сам DIY",
//     image: "/images/diy/kicker.png",
//     altImages: ["/images/diy/kicker.png", "/images/diy/kicker.png"],
//     designer: "DIY Workshop",
//     year: 2023,
//     description: "Комплекты для самостоятельного строительства элементов.",
//     details: [
//       { title: "Инструкции", link: "#instructions" },
//       { title: "Материалы", link: "#materials" }, 
//       { title: "Инструменты", link: "#tools" },
//       { title: "Советы", link: "#tips" }
//     ],
//     relatedProducts: [1, 2, 3] // IDs of related products
//   }
     
//     ],
//   },
// ];





// export default function ProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const imageData = location.state?.imageData;

//   const [searchParams] = useSearchParams();
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Разделение состояний для Swiper и миниатюр
//   const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
//   const [activeProductIndex, setActiveProductIndex] = useState(
//     productCatalog.findIndex(p => p.id === Number(id)) || 0
//   );
  
//   // Состояние для выбранных миниатюр каждого продукта
//   const [selectedImageIndices, setSelectedImageIndices] = useState(
//     productCatalog.map(() => 0)
//   );

//   // Ссылки
//   const containerRef = useRef(null);
//   const transitionImageRef = useRef(null);
//   const swiperContainerRef = useRef(null);
//   const infoRef = useRef(null);
//   const swiperRef = useRef(null);
  
//   // Состояния для контроля анимаций
//   const [animationComplete, setAnimationComplete] = useState(!imageData);
//   const [swiperLoaded, setSwiperLoaded] = useState(false);
//   const [isSlideChanging, setIsSlideChanging] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
  
//   // Последний активный продукт для предотвращения двойных обновлений
//   const lastActiveProductRef = useRef(activeProductIndex);
//   // Блокиратор для предотвращения циклических обновлений URL
//   const isUrlUpdatingRef = useRef(false);
//     // Найдем категорию и продукт
//   const categoryIndex = productCatalog.findIndex(cat => cat.category === category);
  
//   // Если категория не найдена, показываем ошибку
//   if (categoryIndex === -1) {
//     return <div className="text-center mt-10 p-4">Категория не найдена</div>;
//   }

//   const product = productCatalog[activeProductIndex];
//   if (!product) return <p>Product not found</p>;


//   // Получаем связанные продукты
//   const relatedProducts = product.relatedProducts
//     .map(relatedId => productCatalog.find(p => p.id === relatedId))
//     .filter(Boolean);

//   const images = [product.image, ...product.altImages];

//   // Константы для анимации
//   const ANIMATION_DURATION = 0.6;
//   const ANIMATION_EASE = "power2.out";

//   // Обновление URL без перезагрузки компонента
//   const updateUrlAndParams = (productId, viewIndex = 0) => {
//     // Предотвращаем циклические обновления
//     if (isUrlUpdatingRef.current) return;
    
//     isUrlUpdatingRef.current = true;
    
//     // Используем replaceState вместо navigate для более мягкого обновления URL
//     const newUrl = `/product/sets/${productId}?view=${viewIndex}`;
//     window.history.replaceState(null, '', newUrl);
    
//     // Сбрасываем блокировку через небольшую задержку
//     setTimeout(() => {
//       isUrlUpdatingRef.current = false;
//     }, 50);
//   };

//   useEffect(() => {
//     // Обновляем слайдер только когда Swiper полностью загружен
//     if (swiperRef.current && swiperLoaded && !isAnimating) {
//       // Перемещаем к нужному слайду без анимации при первичной загрузке
//       swiperRef.current.slideTo(activeProductIndex, 0);
      
//       // Устанавливаем активный индекс изображения
//       if (selectedImageIndices[activeProductIndex] !== activeImageIndex) {
//         const newIndices = [...selectedImageIndices];
//         newIndices[activeProductIndex] = activeImageIndex;
//         setSelectedImageIndices(newIndices);
//       }
//     }
//   }, [swiperLoaded]);

//   // Отслеживаем изменение URL-параметров
//   useEffect(() => {
//     if (swiperRef.current && swiperLoaded && !isAnimating) {
//       // Обновляем только индекс изображения, без перерисовки всего компонента
//       setActiveImageIndex(slideIndexParam);
      
//       // Синхронизируем выбранные миниатюры с параметром из URL
//       const newIndices = [...selectedImageIndices];
//       newIndices[activeProductIndex] = slideIndexParam;
//       setSelectedImageIndices(newIndices);
//     }
//   }, [slideIndexParam, swiperLoaded]);

//   // Обработчик инициализации Swiper
//   const handleSwiperInit = (swiper) => {
//     setSwiperLoaded(true);

//     // Если нет анимации (прямой переход/перезагрузка), просто показываем галерею
//     if (!imageData) {
//       gsap.set(infoRef.current, { opacity: 1, y: 0 });
//       return;
//     }

//     // Начинаем анимацию только после полной загрузки Swiper
//     requestAnimationFrame(() => {
//       startTransitionAnimation();
//     });
//   };

//   // Функция для запуска анимации перехода
//   const startTransitionAnimation = () => {
//     if (!transitionImageRef.current || !swiperContainerRef.current || !imageData || isAnimating) {
//       setAnimationComplete(true);
//       return;
//     }

//     setIsAnimating(true);

//     const { top, left, width, height } = imageData.rect;
//     const transitionImage = transitionImageRef.current;
//     const swiperContainer = swiperContainerRef.current;

//     // Находим элемент первого слайда
//     const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');

//     if (!firstSlideImage) {
//       setAnimationComplete(true);
//       setIsAnimating(false);
//       return;
//     }

//     // Получаем финальную позицию и размеры первого изображения
//     const finalRect = firstSlideImage.getBoundingClientRect();

//     // Скрываем Swiper на время анимации
//     gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

//     // Устанавливаем начальное состояние переходного изображения
//     gsap.set(transitionImage, {
//       position: "fixed",
//       top,
//       left,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });

//     // Анимируем переходное изображение
//     const tl = gsap.timeline({
//       onComplete: () => {
//         // Показываем Swiper и скрываем переходное изображение
//         gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
//         gsap.set(transitionImage, { visibility: 'hidden' });
//         setAnimationComplete(true);

//         gsap.to(infoRef.current, {
//           opacity: 1,
//           y: 0,
//           duration: ANIMATION_DURATION,
//           ease: ANIMATION_EASE,
//           onComplete: () => {
//             setIsAnimating(false);
//           }
//         });
//       }
//     });

//     tl.to(transitionImage, {
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: ANIMATION_DURATION,
//       ease: ANIMATION_EASE
//     });
//   };

//   // Переработанная функция анимации описания
//   const animateDescription = () => {
//     if (!infoRef.current || isAnimating) return;
    
//     setIsAnimating(true);
    
//     // Сначала скрываем
//     gsap.set(infoRef.current, { opacity: 0, y: 20 });
    
//     // Затем анимируем появление
//     gsap.to(infoRef.current, {
//       opacity: 1, 
//       y: 0, 
//       duration: ANIMATION_DURATION,
//       ease: ANIMATION_EASE,
//       onComplete: () => {
//         // Только после завершения анимации сбрасываем флаги
//         setIsSlideChanging(false);
//         setIsAnimating(false);
//       }
//     });
//   };

//   // Улучшенные CSS для устранения дерганья при свайпе
//   const swiperStyles = `
//     .swiper-wrapper {
//       transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
//     }
//     .swiper-slide {
//       transition: transform ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
//                   opacity ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
//     }
//     .swiper-slide-active {
//       z-index: 2;
//     }
//     /* Предотвращаем смещение слайдов во время анимации */
//     .swiper-no-transition .swiper-wrapper {
//       transition: none !important;
//     }
//   `;

//   // Добавляем стили для Swiper
//   useEffect(() => {
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = swiperStyles;
//     document.head.appendChild(styleElement);

//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   // Оптимизированный обработчик смены слайда
//   const handleSlideChange = (swiper) => {
//     const newIndex = swiper.activeIndex;
    
//     // Предотвращаем дублирование обработки одного и того же слайда
//     if (newIndex !== activeProductIndex && !isAnimating && lastActiveProductRef.current !== newIndex) {
//       lastActiveProductRef.current = newIndex;
      
//       // Устанавливаем флаги
//       setIsSlideChanging(true);
//       setIsAnimating(true);
      
//       // Сначала скрываем текущую информацию
//       if (infoRef.current) {
//         gsap.to(infoRef.current, {
//           opacity: 0,
//           y: 20,
//           duration: ANIMATION_DURATION / 2,
//           ease: ANIMATION_EASE,
//           onComplete: () => {
//             // Обновляем состояние после скрытия информации
//             setActiveProductIndex(newIndex);
            
//             // Обновляем URL после смены продукта (отложенно)
//             setTimeout(() => {
//               updateUrlAndParams(productCatalog[newIndex].id, selectedImageIndices[newIndex]);
//             }, 50);
            
//             // Задержка перед показом нового описания
//             requestAnimationFrame(() => {
//               setTimeout(() => {
//                 animateDescription();
//               }, 50);
//             });
//           }
//         });
//       }
//     }
//   };

//   const handleExit = () => {
//     navigate("/catalogue");
//   };

//   // Оптимизированный обработчик клика по связанным продуктам
//   const handleRelatedProductClick = (relatedProductId) => {
//     const relatedIndex = productCatalog.findIndex(p => p.id === relatedProductId);
    
//     if (relatedIndex !== -1 && relatedIndex !== activeProductIndex && !isAnimating) {
//       // Запоминаем новый индекс для предотвращения двойной обработки
//       lastActiveProductRef.current = relatedIndex;
      
//       // Устанавливаем флаги
//       setIsSlideChanging(true);
//       setIsAnimating(true);
      
//       // Скрываем текущую информацию
//       if (infoRef.current) {
//         gsap.to(infoRef.current, {
//           opacity: 0,
//           y: 20,
//           duration: ANIMATION_DURATION / 2,
//           ease: ANIMATION_EASE,
//           onComplete: () => {
//             // Обновляем состояние
//             setActiveProductIndex(relatedIndex);
            
//             // Обновляем URL после смены продукта (отложенно)
//             setTimeout(() => {
//               updateUrlAndParams(relatedProductId, selectedImageIndices[relatedIndex] || 0);
//             }, 50);
            
//             // Отключаем переходы Swiper на время программного переключения
//             if (swiperRef.current) {
//               // Добавляем класс для отключения анимации
//               // swiperRef.current.el.classList.add('swiper-no-transition');
//               // Переключаем слайд без анимации
//               swiperRef.current.slideTo(relatedIndex);
              
//               // Восстанавливаем анимации после короткой задержки
//               setTimeout(() => {
//                 swiperRef.current.el.classList.remove('swiper-no-transition');
//                 // Анимируем описание
//                 animateDescription();
//               }, 50);
//             }
//           }
//         });
//       }
//     }
//   };

//   // Оптимизированный обработчик выбора миниатюры
// const handleImageSelect = (index) => {
//   if (isAnimating || !swiperRef.current) return;

//   const newSelectedImageIndices = [...selectedImageIndices];
//   newSelectedImageIndices[activeProductIndex] = index;
//   setSelectedImageIndices(newSelectedImageIndices);
//   setActiveImageIndex(index);

//   swiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
// };


//   return (
//     <>
//       <SocialButtons
//         buttonLabel="shop"
//         onButtonClick={handleExit}
//         buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//       />
      
//       <div ref={containerRef} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
//         <button onClick={() => navigate(-1)} className="self-start mb-6 text-gray-200 hover:text-gray-800">
//           ← Back
//         </button>

//         {/* Основной контент */}
//         <div className={`w-full flex flex-col lg:flex-row gap-8 relative`}>
//           {/* Переходное изображение - только при анимированном переходе */}
//           {!animationComplete && imageData && (
//             <img
//               ref={transitionImageRef}
//               src={product.image}
//               alt={product.name}
//               className="object-contain"
//               style={{ position: 'fixed', visibility: 'visible' }}
//             />
//           )}
          
//           {/* Swiper галерея */}
//           <div 
//             ref={swiperContainerRef} 
//             className="w-full lg:w-3/4 mb-8"
//             style={{ 
//               visibility: !imageData || animationComplete ? 'visible' : 'hidden',
//               opacity: !imageData || animationComplete ? 1 : 0
//             }}
//           >
//             <Swiper
//               modules={[Pagination]}
//               pagination={{ clickable: true }}
//               slidesPerView={1}
//               breakpoints={{
//                 640: { slidesPerView: 1.2 },
//                 1024: { slidesPerView: 1.5 }
//               }}
//               centeredSlides={true}
//               spaceBetween={20}
//               className="w-full"
//               initialSlide={activeProductIndex}
//               speed={ANIMATION_DURATION * 1000}
//               effect="slide"
//               threshold={20} // Увеличиваем порог для уменьшения случайных свайпов
//               resistance={true}
//               resistanceRatio={0.85} // Увеличиваем сопротивление для более естественного ощущения
//               onInit={handleSwiperInit}
//               onSlideChange={handleSlideChange}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//                 if (swiper.initialized) {
//                   setSwiperLoaded(true);
//                 }
//               }}
//               preventClicks={false} // Важно для работы кликов
//               preventClicksPropagation={false} // Важно для работы кликов
//               touchStartPreventDefault={false} // Улучшает отзывчивость
//             >
            
//             {productCatalog.map((product, index) => (
//               <SwiperSlide key={product.id}>
//                 <img
//                   src={
//                     selectedImageIndices[index] === 0 
//                       ? product.image 
//                       : product.altImages[selectedImageIndices[index] - 1]
//                   }
//                   alt={product.name}
//                   className="w-full h-full object-contain rounded-xl"
//                   draggable="false" // Предотвращаем случайные перетаскивания
//                 />
//               </SwiperSlide>
//             ))}
//             </Swiper>
//           </div>
          
//           {/* Информация о продукте */}
//           <div 
//             ref={infoRef}
//             className={`w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0`}
//             style={{ 
//               opacity: (isSlideChanging || !animationComplete) ? 0 : 1,
//               transform: (isSlideChanging || !animationComplete) ? 'translateY(20px)' : 'translateY(0)',
//               transition: `opacity ${ANIMATION_DURATION}s ${ANIMATION_EASE}, transform ${ANIMATION_DURATION}s ${ANIMATION_EASE}`,
//               visibility: (isSlideChanging || !animationComplete) ? 'hidden' : 'visible',
//               position: 'relative'
//             }}
//           >
//             {/* Product information */}
//             <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">{product.name}</h1>
//             <p className="font-futura text-[#717171] font-medium">{product.description}</p>
//             <p className="font-futura text-[#717171] font-medium mt-2">Дизайн: {product.designer}, {product.year}</p>
            
//             {/* Image thumbnails for the current product */}
//             <div className="mt-8 flex flex-wrap justify-start gap-4">
//               {[product.image, ...product.altImages].map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleImageSelect(index)}
//                   className={`border rounded-lg p-1 transition hover:scale-105 ${
//                     selectedImageIndices[activeProductIndex] === index ? "border-black" : "border-transparent"
//                   }`}
//                   disabled={isAnimating} // Отключаем кнопки во время анимации
//                 >
//                   <img
//                     src={img}
//                     alt={`${product.name} Mini ${index + 1}`}
//                     className="w-16 h-16 object-contain rounded"
//                     draggable="false" // Предотвращаем случайные перетаскивания
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Product details */}
//             {product.details.map((detail, index) => (
//               <a
//                 key={index}
//                 href={detail.link}
//                 className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
//               >
//                 <span className="font-futura text-[#717171] font-medium">{detail.title}</span>
//                 <span className="font-futura text-[#717171] text-lg">→</span>
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Related products section */}
//         <div className="w-full mt-16">
//           <h2 className="text-2xl font-futura text-[#717171] font-bold mb-6 text-center">Рекомендуемые товары</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
//             {relatedProducts.map((relatedProduct) => (
//               <div 
//                 key={relatedProduct.id}
//                 onClick={() => handleRelatedProductClick(relatedProduct.id)}
//                 className={`w-full max-w-xs cursor-pointer hover:scale-105 transition-transform duration-300 ${isAnimating ? 'pointer-events-none opacity-70' : ''}`}
//               >
//                 <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
//                   <img 
//                     src={relatedProduct.image} 
//                     alt={relatedProduct.name}
//                     className="w-full h-48 object-contain mb-4"
//                     draggable="false" // Предотвращаем случайные перетаскивания
//                   />
//                   <h3 className="font-futura text-[#717171] font-medium text-center">{relatedProduct.name}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// } 
// 
// 
//  import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SocialButtons from "../SocialButtons/SocialButtons";
// import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination"; 




// // Константы
// const ANIMATION_CONFIG = {
//   DURATION: 0.6,
//   EASE: "power2.out",
//   HALF_DURATION: 0.3
// };

// const SWIPER_CONFIG = {
//   SPEED: ANIMATION_CONFIG.DURATION * 1000,
//   THRESHOLD: 20,
//   RESISTANCE_RATIO: 0.85
// };

// export default function ProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const [searchParams] = useSearchParams();
  
//   const imageData = location.state?.imageData;
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Основные состояния
//   const [activeProductIndex, setActiveProductIndex] = useState(() => 
//     Math.max(0, productCatalog.findIndex(p => p.id === Number(id)))
//   );
//   const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
//     productCatalog.map(() => 0)
//   );
//   const [swiperInstances, setSwiperInstances] = useState({
//     main: null,
//     thumbs: null
//   });

//   // Состояния анимации
//   const [animationState, setAnimationState] = useState({
//     complete: !imageData,
//     inProgress: false,
//     slideChanging: false
//   });

//   // Refs
//   const refs = {
//     container: useRef(null),
//     transitionImage: useRef(null),
//     swiperContainer: useRef(null),
//     info: useRef(null),
//     urlUpdateBlocked: useRef(false)
//   };

//   // Мемоизированные значения
//   const currentProduct = useMemo(() => 
//     productCatalog[activeProductIndex], [activeProductIndex]
//   );

//   // const relatedProducts = useMemo(() => 
//   //   currentProduct?.relatedProducts
//   //     ?.map(id => productCatalog.find(p => p.id === id))
//   //     .filter(Boolean) || [], 
//   //   [currentProduct]
//   // );

//   const currentImages = useMemo(() => 
//     currentProduct ? [currentProduct.image, ...currentProduct.altImages] : [], 
//     [currentProduct]
//   );

//   // // Проверка валидности категории
//   // const categoryExists = useMemo(() => 
//   //   productCatalog.some(cat => cat.category === category), [category]
//   // );

//   // Утилиты
//   const updateUrl = useCallback((productId, viewIndex = 0) => {
//     if (refs.urlUpdateBlocked.current) return;
    
//     refs.urlUpdateBlocked.current = true;
//     const newUrl = `/product/sets/${productId}?view=${viewIndex}`;
//     window.history.replaceState(null, '', newUrl);
    
//     setTimeout(() => {
//       refs.urlUpdateBlocked.current = false;
//     }, 50);
//   }, []);

//   const updateAnimationState = useCallback((updates) => {
//     setAnimationState(prev => ({ ...prev, ...updates }));
//   }, []);

//   // Анимации
//   const animateInfo = useCallback((direction = 'in') => {
//     if (!refs.info.current) return Promise.resolve();
    
//     const isIn = direction === 'in';
//     const targetOpacity = isIn ? 1 : 0;
//     const targetY = isIn ? 0 : 20;
//     const duration = isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION;

//     return new Promise(resolve => {
//       gsap.to(refs.info.current, {
//         opacity: targetOpacity,
//         y: targetY,
//         duration,
//         ease: ANIMATION_CONFIG.EASE,
//         onComplete: resolve
//       });
//     });
//   }, []);

//   const startTransitionAnimation = useCallback(() => {
//     if (!refs.transitionImage.current || !refs.swiperContainer.current || 
//         !imageData || animationState.inProgress) {
//       updateAnimationState({ complete: true });
//       return;
//     }

//     updateAnimationState({ inProgress: true });

//     const { top, left, width, height } = imageData.rect;
//     const transitionEl = refs.transitionImage.current;
//     const swiperEl = refs.swiperContainer.current;
//     const firstSlideImage = swiperEl.querySelector('.swiper-slide-active img');

//     if (!firstSlideImage) {
//       console.warn("Активное изображение слайда не найдено");
//       updateAnimationState({ complete: true, inProgress: false });
//       return;
//     }

//     const finalRect = firstSlideImage.getBoundingClientRect();
    
//     if (finalRect.width === 0 || finalRect.height === 0) {
//       setTimeout(() => {
//         updateAnimationState({ inProgress: false });
//         startTransitionAnimation();
//       }, 100);
//       return;
//     }

//     // Скрываем swiper
//     gsap.set(swiperEl, { visibility: 'hidden', opacity: 0 });

//     // Устанавливаем начальное состояние в контейнере
//     gsap.set(transitionEl, {
//       position: "absolute",
//       top: top - window.scrollY,
//       left: left - window.scrollX,
//       width, height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: 'visible',
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px',
//       pointerEvents: 'none'
//     });

//     // Анимируем переход
//     gsap.to(transitionEl, {
//       top: finalRect.top - window.scrollY,
//       left: finalRect.left - window.scrollX,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: ANIMATION_CONFIG.DURATION,
//       ease: ANIMATION_CONFIG.EASE,
//       onComplete: async () => {
//         // Показываем swiper и скрываем переходное изображение
//         gsap.set(swiperEl, { visibility: 'visible', opacity: 1 });
//         gsap.set(transitionEl, { visibility: 'hidden', opacity: 0 });
        
//         updateAnimationState({ complete: true });
        
//         // Анимируем появление информации
//         await animateInfo('in');
//         updateAnimationState({ inProgress: false });
//       }
//     });
//   }, [imageData, animationState.inProgress, updateAnimationState, animateInfo]);

//   // Обработчики событий
//   const handleSwiperInit = useCallback((swiper) => {
//     setSwiperInstances(prev => ({ ...prev, main: swiper }));
    
//     if (!imageData) {
//       gsap.set(refs.info.current, { opacity: 1, y: 0 });
//       return;
//     }

//     requestAnimationFrame(startTransitionAnimation);
//   }, [imageData, startTransitionAnimation]);

//   const handleSlideChange = useCallback(async (swiper) => {
//     const newIndex = swiper.activeIndex;
    
//     if (newIndex === activeProductIndex || animationState.inProgress) return;

//     updateAnimationState({ slideChanging: true, inProgress: true });

//     // Анимируем скрытие информации
//     await animateInfo('out');

//     // Обновляем состояние
//     setActiveProductIndex(newIndex);
//     updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);

//     // Синхронизируем thumbs swiper
//     if (swiperInstances.thumbs) {
//       swiperInstances.thumbs.slideTo(newIndex);
//     }

//     // Анимируем появление новой информации
//     // setTimeout(async () => {
//       await animateInfo('in');
//       updateAnimationState({ slideChanging: false, inProgress: false });
//     // }, 50);
//   }, [activeProductIndex, animationState.inProgress, selectedImageIndices, 
//       swiperInstances.thumbs, updateUrl, animateInfo, updateAnimationState]);

//   const handleImageSelect = useCallback((index) => {
//     if (animationState.inProgress) return;

//     const newIndices = [...selectedImageIndices];
//     newIndices[activeProductIndex] = index;
//     setSelectedImageIndices(newIndices);
//     updateUrl(currentProduct.id, index);
//   }, [animationState.inProgress, selectedImageIndices, activeProductIndex, 
//       currentProduct?.id, updateUrl]);

//   const handleThumbnailClick = useCallback((index) => {
//     if (animationState.inProgress || index === activeProductIndex || !swiperInstances.main) 
//       return;
    
//     swiperInstances.main.slideTo(index);
//   }, [animationState.inProgress, activeProductIndex, swiperInstances.main]);

//   const handleRelatedProductClick = useCallback(async (relatedProductId) => {
//     const relatedIndex = productCatalog.findIndex(p => p.id === relatedProductId);
    
//     if (relatedIndex === -1 || relatedIndex === activeProductIndex || 
//         animationState.inProgress) return;

//     updateAnimationState({ slideChanging: true, inProgress: true });

//     // Скрываем текущую информацию
//     await animateInfo('out');

//     // Обновляем состояние
//     setActiveProductIndex(relatedIndex);

//     // Синхронизируем swiper'ы без анимации
//     if (swiperInstances.main) {
//       swiperInstances.main.slideTo(relatedIndex, 0);
//     }
//     if (swiperInstances.thumbs) {
//       swiperInstances.thumbs.slideTo(relatedIndex, 0);
//     }

//     // Обновляем URL
//     setTimeout(() => {
//       updateUrl(relatedProductId, selectedImageIndices[relatedIndex] || 0);
//     }, 50);

//     // Показываем новую информацию
//     setTimeout(async () => {
//       await animateInfo('in');
//       updateAnimationState({ slideChanging: false, inProgress: false });
//     }, 100);
//   }, [activeProductIndex, animationState.inProgress, swiperInstances, 
//       selectedImageIndices, updateUrl, animateInfo, updateAnimationState]);

//   // Effects
//   useEffect(() => {
//     if (!swiperInstances.main || animationState.inProgress) return;

//     const newIndices = [...selectedImageIndices];
//     newIndices[activeProductIndex] = slideIndexParam;
//     setSelectedImageIndices(newIndices);
//   }, [slideIndexParam, swiperInstances.main, animationState.inProgress]);

//   // Стили и блокировка скролла
//   useEffect(() => {
//     const styles = `
//       html, body { 
//         overflow: hidden !important; 
//         height: 100% !important;
//         width: 100% !important;
//       }
//       .swiper-wrapper { 
//         transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
//       }
//       .swiper-slide { 
//         transition: transform ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
//                     opacity ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
//       }
//       .swiper-slide-active { z-index: 2; }
//       .swiper-no-transition .swiper-wrapper { transition: none !important; }
//       .swiper-slide-thumb-active {
//         opacity: 1 !important;
//         transform: scale(1.05) !important;
//         border: 2px solid black !important;
//         border-radius: 0.5rem !important;
//       }
//       .transition-image-container {
//         position: fixed !important;
//         top: 0 !important;
//         left: 0 !important;
//         width: 100vw !important;
//         height: 100vh !important;
//         overflow: hidden !important;
//         pointer-events: none !important;
//         z-index: 9999 !important;
//       }
//     `;

//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = styles;
//     document.head.appendChild(styleElement);

//     // Дополнительно блокируем скролл на body/html
//     const originalBodyStyle = document.body.style.overflow;
//     const originalHtmlStyle = document.documentElement.style.overflow;
    
//     document.body.style.overflow = 'hidden';
//     document.documentElement.style.overflow = 'hidden';

//     return () => {
//       document.head.removeChild(styleElement);
//       document.body.style.overflow = originalBodyStyle;
//       document.documentElement.style.overflow = originalHtmlStyle;
//     };
//   }, []);

//   // // Ранний возврат для невалидной категории
//   // if (!categoryExists) {
//   //   return <div className="text-center mt-10 p-4">Категория не найдена</div>;
//   // }

//   if (!currentProduct) {
//     return <div className="text-center mt-10 p-4">Продукт не найден</div>;
//   }
//   useEffect(() => {
//     const swiper = swiperInstances.main;
//     if (!swiper || animationState.inProgress) return;
  
//     const newIndex = swiper.activeIndex;
//     if (newIndex !== activeProductIndex) {
//       setActiveProductIndex(newIndex);
//       updateUrl(productCatalog[newIndex].id, selectedImageIndices[newIndex]);
  
//       if (swiperInstances.thumbs) {
//         swiperInstances.thumbs.slideTo(newIndex);
//       }
//     }
//   }, [swiperInstances.main?.activeIndex]);
  

//   return (
//     <>
//       <SocialButtons
//         buttonLabel="shop"
//         onButtonClick={() => navigate("/catalogue")}
//         buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//       />
      
//       <div ref={refs.container} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="self-start mb-6 text-gray-200 hover:text-gray-800 transition-colors"
//         >
//           ← Back
//         </button>

//         <div className="w-full flex flex-col lg:flex-row gap-8 relative">
//           {/* Переходное изображение */}
//           {!animationState.complete && imageData && (
//             <div className="transition-image-container">
//               <img
//                 ref={refs.transitionImage}
//                 src={currentProduct.image}
//                 alt={currentProduct.name}
//                 className="object-contain"
//                 style={{ 
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   visibility: 'visible',
//                   pointerEvents: 'none'
//                 }}
//               />
//             </div>
//           )}
          
//           {/* Swiper галерея */}
//           <div 
//             ref={refs.swiperContainer} 
//             className="w-full lg:w-3/4 mb-8"
//             style={{ 
//               visibility: !imageData || animationState.complete ? 'visible' : 'hidden',
//               opacity: !imageData || animationState.complete ? 1 : 0
//             }}
//           >
//             {/* Основной слайдер */}
//             <Swiper
//               className="custom-swiper mb-4"
//               style={{ height: '500px' }} 
//               modules={[Pagination, Mousewheel, Thumbs]}
//               pagination={{ clickable: true }}
//               mousewheel={true}
//               direction="horizontal"
//               centeredSlides={true}
//               thumbs={{ swiper: swiperInstances.thumbs }}
//               slidesPerView={1}
//               breakpoints={{
//                 640: { slidesPerView: 1.2 },
//                 1024: { slidesPerView: 1.5 }
//               }}
//               spaceBetween={20}
//               initialSlide={activeProductIndex}
//               speed={SWIPER_CONFIG.SPEED}
//               threshold={SWIPER_CONFIG.THRESHOLD}
//               resistance={true}
//               resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
//               onInit={handleSwiperInit}
//               onSlideChange={handleSlideChange}
//               preventClicks={false}
//               preventClicksPropagation={false}
//               touchStartPreventDefault={false}
//             >
//               {productCatalog.map((product, index) => (
//                 <SwiperSlide key={product.id} style={{ height: '100%' }}>
//                   <div className="w-full h-full flex items-center justify-center">
//                     <img
//                       src={selectedImageIndices[index] === 0 
//                         ? product.image 
//                         : product.altImages[selectedImageIndices[index] - 1]
//                       }
//                       alt={product.name}
//                       className="max-h-full w-auto object-contain"
//                       draggable="false"
//                     />
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Свайпер миниатюр товаров */}
//             <Swiper
//               className="w-full mt-6"
//               modules={[Thumbs]}
//               direction="horizontal"
//               onSwiper={(swiper) => setSwiperInstances(prev => ({ ...prev, thumbs: swiper }))}
//               slidesPerView={5}
//               spaceBetween={10}
//               watchSlidesProgress={true}
//               slideToClickedSlide={true}
//               initialSlide={activeProductIndex}
//               speed={SWIPER_CONFIG.SPEED}
//               preventClicks={false}
//               preventClicksPropagation={false}
//               observer={true}
//               observeParents={true}
//               resistance={false}
//               resistanceRatio={0}
//             >
//               {productCatalog.map((product, index) => (
//                 <SwiperSlide key={product.id}>
//                   <img
//                     src={product.image}
//                     onClick={() => handleThumbnailClick(index)}
//                     className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
//                       index === activeProductIndex 
//                         ? 'opacity-100 scale-105 border-black' 
//                         : 'grayscale border-transparent opacity-60 hover:opacity-100'
//                     }`}
//                     alt={product.name}
//                     draggable="false"
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
          
//           {/* Информация о продукте */}
//           <div 
//             ref={refs.info}
//             className="w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0"
//             style={{ 
//               opacity: animationState.slideChanging || !animationState.complete ? 0 : 1,
//               transform: animationState.slideChanging || !animationState.complete 
//                 ? 'translateY(20px)' : 'translateY(0)',
//               visibility: animationState.slideChanging || !animationState.complete 
//                 ? 'hidden' : 'visible'
//             }}
//           >
//             <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//               {currentProduct.name}
//             </h1>
//             <p className="font-futura text-[#717171] font-medium">
//               {currentProduct.description}
//             </p>
//             <p className="font-futura text-[#717171] font-medium mt-2">
//               Дизайн: {currentProduct.designer}, {currentProduct.year}
//             </p>
            
//             {/* Миниатюры изображений текущего продукта */}
//             <div className="mt-8 flex flex-wrap justify-start gap-4">
//               {currentImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleImageSelect(index)}
//                   className={`border rounded-lg p-1 transition hover:scale-105 ${
//                     selectedImageIndices[activeProductIndex] === index 
//                       ? "border-black" : "border-transparent"
//                   }`}
//                   disabled={animationState.inProgress}
//                 >
//                   <img
//                     src={img}
//                     alt={`${currentProduct.name} Mini ${index + 1}`}
//                     className="w-16 h-16 object-contain rounded"
//                     draggable="false"
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Детали продукта */}
//             {currentProduct.details?.map((detail, index) => (
//               <a
//                 key={index}
//                 href={detail.link}
//                 className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
//               >
//                 <span className="font-futura text-[#717171] font-medium">
//                   {detail.title}
//                 </span>
//                 <span className="font-futura text-[#717171] text-lg">→</span>
//               </a>
//             ))}

//             {/* Связанные продукты */}
//             {/* {relatedProducts.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="font-futura text-[#717171] font-bold mb-3">
//                   Связанные продукты
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {relatedProducts.map(relatedProduct => (
//                     <button
//                       key={relatedProduct.id}
//                       onClick={() => handleRelatedProductClick(relatedProduct.id)}
//                       className="px-3 py-1 border border-gray-300 rounded hover:border-black transition-colors text-sm"
//                       disabled={animationState.inProgress}
//                     >
//                       {relatedProduct.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )} */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default function ProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const imageData = location.state?.imageData;

//   const [searchParams] = useSearchParams();
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Разделение состояний для Swiper и миниатюр
//   const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
//   const [activeProductIndex, setActiveProductIndex] = useState(
//     productCatalog.findIndex(p => p.id === Number(id)) || 0
//   );
  
//   // Состояние для выбранных миниатюр каждого продукта
//   const [selectedImageIndices, setSelectedImageIndices] = useState(
//     productCatalog.map(() => 0)
//   );

//   // Ссылки
//   const containerRef = useRef(null);
//   const transitionImageRef = useRef(null);
//   const swiperContainerRef = useRef(null);
//   const infoRef = useRef(null);
//   const swiperRef = useRef(null);
//   const thumbsSwiperRef = useRef(null); 

//   // Состояния для контроля анимаций
//     const [thumbsSwiper, setThumbsSwiper] = useState(null);
//      const [activeIndex, setActiveIndex] = useState(0);
//   const [animationComplete, setAnimationComplete] = useState(!imageData);
//   const [swiperLoaded, setSwiperLoaded] = useState(false);
//   const [isSlideChanging, setIsSlideChanging] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
  
//   // Последний активный продукт для предотвращения двойных обновлений
//   const lastActiveProductRef = useRef(activeProductIndex);
//   // Блокиратор для предотвращения циклических обновлений URL
//   const isUrlUpdatingRef = useRef(false);
  
//   // Найдем категорию и продукт
//   const categoryIndex = productCatalog.findIndex(cat => cat.category === category);
  
//   // Если категория не найдена, показываем ошибку
//   if (categoryIndex === -1) {
//     return <div className="text-center mt-10 p-4">Категория не найдена</div>;
//   }

//   const product = productCatalog[activeProductIndex];
//   if (!product) return <p>Product not found</p>;

//   // Получаем связанные продукты
//   const relatedProducts = product.relatedProducts
//     .map(relatedId => productCatalog
// .find(p => p.id === relatedId))
//     .filter(Boolean);

//   const images = [product.image, ...product.altImages];

//   // Константы для анимации
//   const ANIMATION_DURATION = 0.6;
//   const ANIMATION_EASE = "power2.out";

//   // Обновление URL без перезагрузки компонента
//   const updateUrlAndParams = (productId, viewIndex = 0) => {
//     // Предотвращаем циклические обновления
//     if (isUrlUpdatingRef.current) return;
    
//     isUrlUpdatingRef.current = true;
    
//     // Используем replaceState вместо navigate для более мягкого обновления URL
//     const newUrl = `/product/sets/${productId}?view=${viewIndex}`;
//     window.history.replaceState(null, '', newUrl);
    
//     // Сбрасываем блокировку через небольшую задержку
//     setTimeout(() => {
//       isUrlUpdatingRef.current = false;
//     }, 50);
//   };

//   // Синхронизация Swiper с состоянием при изменении URL или загрузке
//   useEffect(() => {
//     // Обновляем слайдер только когда Swiper полностью загружен
//     if (swiperRef.current && swiperLoaded && !isAnimating) {
//       // Перемещаем к нужному слайду без анимации при первичной загрузке
//       swiperRef.current.slideTo(activeProductIndex, 0);
      
//       // Также синхронизируем свайпер миниатюр
//       if (thumbsSwiperRef.current) {
//         thumbsSwiperRef.current.slideTo(activeProductIndex, 0);
//       }
      
//       // Устанавливаем активный индекс изображения
//       if (selectedImageIndices[activeProductIndex] !== activeImageIndex) {
//         const newIndices = [...selectedImageIndices];
//         newIndices[activeProductIndex] = activeImageIndex;
//         setSelectedImageIndices(newIndices);
//       }
//     }
//   }, [swiperLoaded]);

//   // Отслеживаем изменение URL-параметров
//   useEffect(() => {
//     if (swiperRef.current && swiperLoaded && !isAnimating) {
//       // Обновляем только индекс изображения, без перерисовки всего компонента
//       setActiveImageIndex(slideIndexParam);
      
//       // Синхронизируем выбранные миниатюры с параметром из URL
//       const newIndices = [...selectedImageIndices];
//       newIndices[activeProductIndex] = slideIndexParam;
//       setSelectedImageIndices(newIndices);
//     }
//   }, [slideIndexParam, swiperLoaded]);

//   // Синхронизация свайпера миниатюр с основным свайпером
//   useEffect(() => {
//     if (thumbsSwiperRef.current && swiperLoaded && !isAnimating) {
//       // Явно синхронизируем позицию миниатюр с активным слайдом
//       thumbsSwiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
      
//       // Активируем выделение миниатюры
//       const thumbSlides = thumbsSwiperRef.current.slides;
//       if (thumbSlides) {
//         thumbSlides.forEach((slide, i) => {
//           if (i === activeProductIndex) {
//             slide.classList.add('swiper-slide-thumb-active');
//           } else {
//             slide.classList.remove('swiper-slide-thumb-active');
//           }
//         });
//       }
//     }
//   }, [activeProductIndex, swiperLoaded]);

  

//   // Функция для запуска анимации перехода
//   const startTransitionAnimation = () => {
//     if (!transitionImageRef.current || !swiperContainerRef.current || !imageData || isAnimating) {
//       setAnimationComplete(true);
//       return;
//     }

//     setIsAnimating(true);

//     const { top, left, width, height } = imageData.rect;
//     const transitionImage = transitionImageRef.current;
//     const swiperContainer = swiperContainerRef.current;

//     // Находим элемент первого слайда
//     const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');

//     if (!firstSlideImage) {
//       console.warn("Не удалось найти изображение в активном слайде");
//       setAnimationComplete(true);
//       setIsAnimating(false);
//       return;
//     }

//     // Получаем финальную позицию и размеры первого изображения
//     const finalRect = firstSlideImage.getBoundingClientRect();
    
//     // Если размеры равны нулю, Swiper мог не успеть правильно отрендерить слайд
//     if (finalRect.width === 0 || finalRect.height === 0) {
//       console.warn("Целевое изображение имеет нулевые размеры");
//       // Даем время для рендеринга и пробуем еще раз
//       setTimeout(() => {
//         setIsAnimating(false);
//         startTransitionAnimation();
//       }, 100);
//       return;
//     }
    
//     // Скрываем Swiper на время анимации
//     gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

//     // Устанавливаем начальное состояние переходного изображения
//     gsap.set(transitionImage, {
//       position: "fixed",
//       top,
//       left,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       overflow:'hidden',
//       visibility: 'visible', // Явно устанавливаем видимость
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });
    
//     // и установим явные стили для лучшей совместимости
//     const imageStyle = window.getComputedStyle(transitionImage);
//     if (imageStyle.display === 'none' || imageStyle.visibility === 'hidden') {
//       console.warn("Переходное изображение невидимо после установки стилей");
//       transitionImage.style.display = 'block';
//       transitionImage.style.visibility = 'visible';
//     }

//     // Анимируем переходное изображение
//     const tl = gsap.timeline({
//       onComplete: () => {
//         // Показываем Swiper и скрываем переходное изображение
//         gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
//         gsap.set(transitionImage, { visibility: 'hidden',  opacity: 0  });
//         setAnimationComplete(true);

//         gsap.to(infoRef.current, {
//           opacity: 1,
//           y: 0,
//           duration: ANIMATION_DURATION,
//           ease: ANIMATION_EASE,
//           onComplete: () => {
//             setIsAnimating(false);
//           }
//         });
//       }
//     });
    
//     let animationStarted = false;
//     tl.to(transitionImage, {
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: ANIMATION_DURATION,
//       ease: ANIMATION_EASE,
//       onStart: () => {
//         animationStarted = true;
//       },
//       onUpdate: function() {
//         // Контроль выполнения анимации
//         if (this.progress() > 0.1 && !animationStarted) {
//           console.warn("Анимация не началась корректно");
//         }
//       }
//     });
//   };
// // Обработчик инициализации Swiper
//   const handleSwiperInit = (swiper) => {
//     setSwiperLoaded(true);

//     // Если нет анимации (прямой переход/перезагрузка), просто показываем галерею
//     if (!imageData) {
//       gsap.set(infoRef.current, { opacity: 1, y: 0 });
//       return;
//     }

//     // Начинаем анимацию только после полной загрузки Swiper
//     requestAnimationFrame(() => {
//       startTransitionAnimation();
//     });
//   };
//   // Переработанная функция анимации описания
//   const animateDescription = () => {
//     if (!infoRef.current || isAnimating) return;
    
//     setIsAnimating(true);
    
//     // Сначала скрываем
//     gsap.set(infoRef.current, { opacity: 0, y: 20 });
    
//     // Затем анимируем появление
//     gsap.to(infoRef.current, {
//       opacity: 1, 
//       y: 0, 
//       duration: ANIMATION_DURATION,
//       ease: ANIMATION_EASE,
//       onComplete: () => {
//         // Только после завершения анимации сбрасываем флаги
//         setIsSlideChanging(false);
//         setIsAnimating(false);
//       }
//     });
//   };

//   // Улучшенные CSS для устранения дерганья при свайпе
//   const swiperStyles = `
//     /* Предотвращаем появление скроллбара */
//   body {
//     overflow-y: hidden !important;
//   }
//     .swiper-wrapper {
//       transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
//     }
//     .swiper-slide {
//       transition: transform ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
//                   opacity ${ANIMATION_DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
//     }
//     .swiper-slide-active {
//       z-index: 2;
//     }
//     /* Предотвращаем смещение слайдов во время анимации */
//     .swiper-no-transition .swiper-wrapper {
//       transition: none !important;
//     }
//     /* Стили для активной миниатюры */
//     .swiper-slide-thumb-active {
//       opacity: 1 !important;
//       transform: scale(1.05) !important;
//       border-color: black !important;
//       border-width: 2px !important;
//       border-style: solid !important;
//       border-radius: 0.5rem !important;
//     }
//   `;

//   // Добавляем стили для Swiper
//   useEffect(() => {
//     const styleElement = document.createElement('style');
//     styleElement.innerHTML = swiperStyles;
//     document.head.appendChild(styleElement);

//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);

//   // Оптимизированный обработчик смены слайда
// const handleSlideChange = (swiper) => {
//   const newIndex = swiper.activeIndex;

//   if (newIndex === activeProductIndex) return;

//   // Сразу синхронизируем индекс, URL и миниатюры
//   setActiveProductIndex(newIndex);
//   lastActiveProductRef.current = newIndex;

//   if (thumbsSwiperRef.current) {
//     thumbsSwiperRef.current.slideTo(newIndex);
//   }

//   updateUrlAndParams(productCatalog[newIndex].id, selectedImageIndices[newIndex]);

//   // Затем, отдельно, запускаем анимацию описания
//   if (!isAnimating && infoRef.current) {
//     setIsSlideChanging(true);
//     setIsAnimating(true);

//     gsap.to(infoRef.current, {
//       opacity: 0,
//       y: 20,
//       duration: ANIMATION_DURATION / 2,
//       ease: ANIMATION_EASE,
//       onComplete: () => {
//         // отложенная анимация появления
//         requestAnimationFrame(() => {
//           setTimeout(() => {
//             animateDescription();
//           }, 50);
//         });
//       }
//     });
//   }
// };

//   const handleExit = () => {
//     navigate("/catalogue");
//   };

//   // Оптимизированный обработчик клика по связанным продуктам
//   const handleRelatedProductClick = (relatedProductId) => {
//     const relatedIndex = productCatalog.findIndex(p => p.id === relatedProductId);
    
//     if (relatedIndex !== -1 && relatedIndex !== activeProductIndex && !isAnimating) {
//       // Запоминаем новый индекс для предотвращения двойной обработки
//       lastActiveProductRef.current = relatedIndex;
      
//       // Устанавливаем флаги
//       setIsSlideChanging(true);
//       setIsAnimating(true);
      
//       // Скрываем текущую информацию
//       if (infoRef.current) {
//         gsap.to(infoRef.current, {
//           opacity: 0,
//           y: 20,
//           duration: ANIMATION_DURATION / 2,
//           ease: ANIMATION_EASE,
//           onComplete: () => {
//             // Обновляем состояние
//             setActiveProductIndex(relatedIndex);
            
//             // Синхронизируем оба свайпера
//             if (swiperRef.current) {
//               swiperRef.current.slideTo(relatedIndex, 0);
//             }
            
//             if (thumbsSwiperRef.current) {
//               thumbsSwiperRef.current.slideTo(relatedIndex, 0);
//             }
            
//             // Обновляем URL после смены продукта (отложенно)
//             setTimeout(() => {
//               updateUrlAndParams(relatedProductId, selectedImageIndices[relatedIndex] || 0);
//             }, 50);
            
//             // Отключаем переходы Swiper на время программного переключения
//             if (swiperRef.current) {
//               // Добавляем класс для отключения анимации
//               swiperRef.current.el.classList.add('swiper-no-transition');
              
//               // Восстанавливаем анимации после короткой задержки
//               setTimeout(() => {
//                 swiperRef.current.el.classList.remove('swiper-no-transition');
//                 // Анимируем описание
//                 animateDescription();
//               }, 50);
//             }
//           }
//         });
//       }
//     }
//   };

//   // Оптимизированный обработчик выбора миниатюры
//   const handleImageSelect = (index) => {
//     if (isAnimating || !swiperRef.current) return;

//     const newSelectedImageIndices = [...selectedImageIndices];
//     newSelectedImageIndices[activeProductIndex] = index;
//     setSelectedImageIndices(newSelectedImageIndices);
//     setActiveImageIndex(index);

//     // Обновляем URL с новым индексом изображения
//     updateUrlAndParams(product.id, index);
//   };

//   // Обработчик клика по миниатюре товара
// const handleThumbnailClick = (index) => {
//   if (isAnimating || index === activeProductIndex) return;

//   if (swiperRef.current) {
//     swiperRef.current.slideTo(index);
//   }

//   // 🧠 Не вызывай setActiveProductIndex напрямую — он вызывается внутри handleSlideChange
// };


//   return (
//     <>
//       <SocialButtons
//         buttonLabel="shop"
//         onButtonClick={handleExit}
//         buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
//       />
      
//       <div ref={containerRef} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
//         <button onClick={() => navigate(-1)} className="self-start mb-6 text-gray-200 hover:text-gray-800">
//           ← Back
//         </button>

//         {/* Основной контент */}
//         <div className={`w-full flex flex-col lg:flex-row gap-8 relative`}>
//           {/* Переходное изображение - только при анимированном переходе */}
//           {!animationComplete && imageData && (
//             <img
//               ref={transitionImageRef}
//               src={product.image}
//               alt={product.name}
//               className="object-contain"
//               style={{ position: 'fixed', visibility: 'visible' }}
//             />
//           )}
          
//           {/* Swiper галерея */}
//           <div 
//             ref={swiperContainerRef} 
//             className="w-full lg:w-3/4 mb-8"
//             style={{ 
//               visibility: !imageData || animationComplete ? 'visible' : 'hidden',
//               opacity: !imageData || animationComplete ? 1 : 0
//             }}
//           >
//             {/* Основной слайдер */}
//             <Swiper
//               className="custom-swiper mb-4"
//                style={{ height: '500px' }} 
//               modules={[Pagination, Mousewheel, Thumbs]}
//               pagination={{ clickable: true }}
//               mousewheel={true}
//               direction="horizontal"
//               centeredSlides={true}
//               thumbs={{ swiper: thumbsSwiper }}
//               slidesPerView={1}
//               breakpoints={{
//                 640: { slidesPerView: 1.2 },
//                 1024: { slidesPerView: 1.5 }
//               }}
//               spaceBetween={20}
//               initialSlide={activeProductIndex}
//               speed={ANIMATION_DURATION * 1000}
//               threshold={20}
//               resistance={true}
//               resistanceRatio={0.85}
//               onInit={handleSwiperInit}
//               onSlideChange={handleSlideChange}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//                 if (swiper.mousewheel && !swiper.mousewheel.enabled) {
//                   swiper.mousewheel.enable();
//                 }
//                 if (swiper.initialized) {
//                   setSwiperLoaded(true);
//                 }
//               }}
//               preventClicks={false}
//               preventClicksPropagation={false}
//               touchStartPreventDefault={false}
//             >
//               {productCatalog
//         .map((product, index) => (
//                 <SwiperSlide key={product.id} style={{ height: '100%' }}>
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img
//                     src={
//                       selectedImageIndices[index] === 0 
//                         ? product.image 
//                         : product.altImages[selectedImageIndices[index] - 1]
//                     }
//                     alt={product.name}
//                     className="max-h-full w-auto object-contain"
//                     draggable="false"
//                   /></div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Свайпер миниатюр товаров */}
//             <Swiper
//               className="w-full mt-6"
//               modules={[Thumbs]}
//               direction="horizontal"
//               onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
//               slidesPerView={5}
//               spaceBetween={10}
//               watchSlidesProgress={true}
//               slideToClickedSlide={true}
//               initialSlide={activeProductIndex}
//               speed={ANIMATION_DURATION * 1000}
//               preventClicks={false}
//               preventClicksPropagation={false}
//              observer={true}
//   observeParents={true}
//   resistance={false}
//   resistanceRatio={0}
//   onSlideChange={(swiper) => console.log('thumbs swiper index', swiper.activeIndex)}

  

 


              
//             >
//               {productCatalog
//         .map((product, index) => (
//                 <SwiperSlide key={product.id}>
//                   <img
//                     src={product.image}
//                     onClick={() => handleThumbnailClick(index)}
//                   className={`cursor-pointer transition-all duration-300 rounded-lg border-2
//   ${index === activeProductIndex 
//     ? 'opacity-100 scale-105 border-black' 
//     : 'grayscale border-transparent opacity-60 hover:opacity-100'}`}

//                     alt={product.name}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </div>
          
//           {/* Информация о продукте */}
//           <div 
//             ref={infoRef}
//             className={`w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0`}
//             style={{ 
//               opacity: (isSlideChanging || !animationComplete) ? 0 : 1,
//               transform: (isSlideChanging || !animationComplete) ? 'translateY(20px)' : 'translateY(0)',
//               transition: `opacity ${ANIMATION_DURATION}s ${ANIMATION_EASE}, transform ${ANIMATION_DURATION}s ${ANIMATION_EASE}`,
//               visibility: (isSlideChanging || !animationComplete) ? 'hidden' : 'visible',
//               position: 'relative'
//             }}
//           >
//             {/* Product information */}
//             <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">{product.name}</h1>
//             <p className="font-futura text-[#717171] font-medium">{product.description}</p>
//             <p className="font-futura text-[#717171] font-medium mt-2">Дизайн: {product.designer}, {product.year}</p>
            
//             {/* Image thumbnails for the current product */}
//             <div className="mt-8 flex flex-wrap justify-start gap-4">
//               {[product.image, ...product.altImages].map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleImageSelect(index)}
//                   className={`border rounded-lg p-1 transition hover:scale-105 ${
//                     selectedImageIndices[activeProductIndex] === index ? "border-black" : "border-transparent"
//                   }`}
//                   disabled={isAnimating} // Отключаем кнопки во время анимации
//                 >
//                   <img
//                     src={img}
//                     alt={`${product.name} Mini ${index + 1}`}
//                     className="w-16 h-16 object-contain rounded"
//                     draggable="false" // Предотвращаем случайные перетаскивания
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Product details */}
//             {product.details.map((detail, index) => (
//               <a
//                 key={index}
//                 href={detail.link}
//                 className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
//               >
//                 <span className="font-futura text-[#717171] font-medium">{detail.title}</span>
//                 <span className="font-futura text-[#717171] text-lg">→</span>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }