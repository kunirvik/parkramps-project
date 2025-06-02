 import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination"; 

const productCatalogDiys = [ {id: 1,
    name: "box1",
    image: "/images/diy/kicker.png",
    altImages: ["/images/sets/box1.png", ],
    designer: "Studio 65",
    year: 2023,
    description: "Комплексные решения для скейтпарков.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" },
      { title: "Установка", link: "#installation" }
    ],
    relatedProducts: [2, 3, 4, 5] // IDs of related products
  },
  {
    id: 2,
    name: "jerseybarrier",
   image: "/images/sets/jerseybarrier.png",
    altImages: ["/images/sets/jerseybarriertop.png", "/images/sets/jerseybarrierfront.png"],
    designer: "РампСтрой",
    year: 2024,
    description: "Профессиональные рампы различных размеров.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Размеры", link: "#dimensions" },
      { title: "Установка", link: "#installation" },
      { title: "Гарантия", link: "#warranty" }
    ],
    relatedProducts: [1, 3, 4, 5] // IDs of related products
  },
  {
    id: 3,
    name: "box3 kicker",
    image: "/images/sets/kicker.png",
    altImages: ["/images/sets/kicker1.png", "/images/sets/kicker2.png"],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      { title: "Варианты комплектации", link: "#sets" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" }
    ],
    relatedProducts: [1, 2, 4, 5] // IDs of related products
  },  
  {
    id: 4,
    name: "manny",
     image: "/images/sets/manny.png",
    altImages: ["/images/sets/manny2.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 5] // IDs of related products
  }, 
  {
    id: 5,
    name: "quater r215h80w125d40",
     image: "/images/sets/quaterr215h80w125d40.png",
    altImages: ["/images/sets/quaterr215h80w125d40left.png", "/images/sets/quaterr215h80w125d40top.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },
{
    id: 6,
    name: "quater r215h80w125d40",
     image: "/images/sets/quaterr250h125w187d125.png",
    altImages: ["/images/sets/quaterr250h125w187d125right.png", "/images/sets/quaterr250h125w187d125top.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },

  {
    id: 7,
    name: "quater r215h80w125d40",
     image: "/images/sets/quaterr250h160w375d125.png",
    altImages: ["/images/sets/quaterr250h160w375d125left.png", "/images/sets/quaterr250h160w375d125top.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },
   {
    id: 8,
    name: "quater r215h80w125d40",
     image: "/images/sets/set.png",
    altImages: ["/images/sets/set2.png", "/images/sets/set3.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },
]  ;



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

export default function DiyProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, category } = useParams();
  const [searchParams] = useSearchParams();
  
  const imageData = location.state?.imageData;
  const slideIndexParam = Number(searchParams.get('view')) || 0;

  // Основные состояния
  const [activeProductIndex, setActiveProductIndex] = useState(() => 
    Math.max(0, productCatalogDiys.findIndex(p => p.id === Number(id)))
  );
  const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
    productCatalogDiys.map(() => 0)
  );
  const [swiperInstances, setSwiperInstances] = useState({
    main: null,
    thumbs: null
  });

  // Состояния анимации
  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false
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
    productCatalogDiys[activeProductIndex], [activeProductIndex]
  );

  // const relatedProducts = useMemo(() => 
  //   currentProduct?.relatedProducts
  //     ?.map(id => productCatalogDiys.find(p => p.id === id))
  //     .filter(Boolean) || [], 
  //   [currentProduct]
  // );

  const currentImages = useMemo(() => 
    currentProduct ? [currentProduct.image, ...currentProduct.altImages] : [], 
    [currentProduct]
  );

  // // Проверка валидности категории
  // const categoryExists = useMemo(() => 
  //   productCatalogDiys.some(cat => cat.category === category), [category]
  // );

  // Утилиты
  const updateUrl = useCallback((productId, viewIndex = 0) => {
    if (refs.urlUpdateBlocked.current) return;
    
    refs.urlUpdateBlocked.current = true;
    const newUrl = `/product/sets/${productId}?view=${viewIndex}`;
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
      gsap.set(refs.info.current, { opacity: 1, y: 0 });
      return;
    }

    requestAnimationFrame(startTransitionAnimation);
  }, [imageData, startTransitionAnimation]);

  const handleSlideChange = useCallback(async (swiper) => {
    const newIndex = swiper.activeIndex;
    
    if (newIndex === activeProductIndex || animationState.inProgress) return;

    updateAnimationState({ slideChanging: true, inProgress: true });

    // Анимируем скрытие информации
    await animateInfo('out');

    // Обновляем состояние
    setActiveProductIndex(newIndex);
    updateUrl(productCatalogDiys[newIndex].id, selectedImageIndices[newIndex]);

    // Синхронизируем thumbs swiper
    if (swiperInstances.thumbs) {
      swiperInstances.thumbs.slideTo(newIndex);
    }

    // Анимируем появление новой информации
    setTimeout(async () => {
      await animateInfo('in');
      updateAnimationState({ slideChanging: false, inProgress: false });
    }, 50);
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

  const handleRelatedProductClick = useCallback(async (relatedProductId) => {
    const relatedIndex = productCatalogDiys.findIndex(p => p.id === relatedProductId);
    
    if (relatedIndex === -1 || relatedIndex === activeProductIndex || 
        animationState.inProgress) return;

    updateAnimationState({ slideChanging: true, inProgress: true });

    // Скрываем текущую информацию
    await animateInfo('out');

    // Обновляем состояние
    setActiveProductIndex(relatedIndex);

    // Синхронизируем swiper'ы без анимации
    if (swiperInstances.main) {
      swiperInstances.main.slideTo(relatedIndex, 0);
    }
    if (swiperInstances.thumbs) {
      swiperInstances.thumbs.slideTo(relatedIndex, 0);
    }

    // Обновляем URL
    setTimeout(() => {
      updateUrl(relatedProductId, selectedImageIndices[relatedIndex] || 0);
    }, 50);

    // Показываем новую информацию
    setTimeout(async () => {
      await animateInfo('in');
      updateAnimationState({ slideChanging: false, inProgress: false });
    }, 100);
  }, [activeProductIndex, animationState.inProgress, swiperInstances, 
      selectedImageIndices, updateUrl, animateInfo, updateAnimationState]);

  // Effects
  useEffect(() => {
    if (!swiperInstances.main || animationState.inProgress) return;

    const newIndices = [...selectedImageIndices];
    newIndices[activeProductIndex] = slideIndexParam;
    setSelectedImageIndices(newIndices);
  }, [slideIndexParam, swiperInstances.main, animationState.inProgress]);

  // Стили и блокировка скролла
  useEffect(() => {
    const styles = `
      html, body { 
        overflow: hidden !important; 
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

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Дополнительно блокируем скролл на body/html
    const originalBodyStyle = document.body.style.overflow;
    const originalHtmlStyle = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.head.removeChild(styleElement);
      document.body.style.overflow = originalBodyStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
    };
  }, []);

  // // Ранний возврат для невалидной категории
  // if (!categoryExists) {
  //   return <div className="text-center mt-10 p-4">Категория не найдена</div>;
  // }

  if (!currentProduct) {
    return <div className="text-center mt-10 p-4">Продукт не найден</div>;
  }

  return (
    <>
      <SocialButtons
        buttonLabel="shop"
        onButtonClick={() => navigate("/catalogue")}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />
      
      <div ref={refs.container} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
        <button 
          onClick={() => navigate(-1)} 
          className="self-start mb-6 text-gray-200 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>

        <div className="w-full flex flex-col lg:flex-row gap-8 relative">
          {/* Переходное изображение */}
          {!animationState.complete && imageData && (
            <div className="transition-image-container">
              <img
                ref={refs.transitionImage}
                src={currentProduct.image}
                alt={currentProduct.name}
                className="object-contain"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  visibility: 'visible',
                  pointerEvents: 'none'
                }}
              />
            </div>
          )}
          
          {/* Swiper галерея */}
          <div 
            ref={refs.swiperContainer} 
            className="w-full lg:w-3/4 mb-8"
            style={{ 
              visibility: !imageData || animationState.complete ? 'visible' : 'hidden',
              opacity: !imageData || animationState.complete ? 1 : 0
            }}
          >
            {/* Основной слайдер */}
            <Swiper
              className="custom-swiper mb-4"
              style={{ height: '500px' }} 
              modules={[Pagination, Mousewheel, Thumbs]}
              pagination={{ clickable: true }}
              mousewheel={true}
              direction="horizontal"
              centeredSlides={true}
              thumbs={{ swiper: swiperInstances.thumbs }}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.2 },
                1024: { slidesPerView: 1.5 }
              }}
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
              {productCatalogDiys.map((product, index) => (
                <SwiperSlide key={product.id} style={{ height: '100%' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={selectedImageIndices[index] === 0 
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

            {/* Свайпер миниатюр товаров */}
            <Swiper
              className="w-full mt-6"
              modules={[Thumbs]}
              direction="horizontal"
              onSwiper={(swiper) => setSwiperInstances(prev => ({ ...prev, thumbs: swiper }))}
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
              {productCatalogDiys.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <img
                    src={product.image}
                    onClick={() => handleThumbnailClick(index)}
                    className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                      index === activeProductIndex 
                        ? 'opacity-100 scale-105 border-black' 
                        : 'grayscale border-transparent opacity-60 hover:opacity-100'
                    }`}
                    alt={product.name}
                    draggable="false"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Информация о продукте */}
          <div 
            ref={refs.info}
            className="w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0"
            style={{ 
              opacity: animationState.slideChanging || !animationState.complete ? 0 : 1,
              transform: animationState.slideChanging || !animationState.complete 
                ? 'translateY(20px)' : 'translateY(0)',
              visibility: animationState.slideChanging || !animationState.complete 
                ? 'hidden' : 'visible'
            }}
          >
            <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
              {currentProduct.name}
            </h1>
            <p className="font-futura text-[#717171] font-medium">
              {currentProduct.description}
            </p>
            <p className="font-futura text-[#717171] font-medium mt-2">
              Дизайн: {currentProduct.designer}, {currentProduct.year}
            </p>
            
            {/* Миниатюры изображений текущего продукта */}
            <div className="mt-8 flex flex-wrap justify-start gap-4">
              {currentImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`border rounded-lg p-1 transition hover:scale-105 ${
                    selectedImageIndices[activeProductIndex] === index 
                      ? "border-black" : "border-transparent"
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

            {/* Детали продукта */}
            {currentProduct.details?.map((detail, index) => (
              <a
                key={index}
                href={detail.link}
                className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
              >
                <span className="font-futura text-[#717171] font-medium">
                  {detail.title}
                </span>
                <span className="font-futura text-[#717171] text-lg">→</span>
              </a>
            ))}

            {/* Связанные продукты */}
            {/* {relatedProducts.length > 0 && (
              <div className="mt-6">
                <h3 className="font-futura text-[#717171] font-bold mb-3">
                  Связанные продукты
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedProducts.map(relatedProduct => (
                    <button
                      key={relatedProduct.id}
                      onClick={() => handleRelatedProductClick(relatedProduct.id)}
                      className="px-3 py-1 border border-gray-300 rounded hover:border-black transition-colors text-sm"
                      disabled={animationState.inProgress}
                    >
                      {relatedProduct.name}
                    </button>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}