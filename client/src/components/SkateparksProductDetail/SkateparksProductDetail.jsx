import { useEffect, useRef, useState, useMemo,  useCallback } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination } from "swiper/modules";
import { Mousewheel, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination"; 
import "swiper/css/mousewheel"; 
  // import ProductDetailPage from '../ProductDetailPage/ProductDetailPage';


const productCatalogSkateparks = [ {id: 1,
     name: "skatepark",
   image: "/images/skateparks/park.png",
    altImages: ["/images/skateparks/parkfront.png","/images/skateparks/parktop.png", ],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "Studio 65",
    year: 2023,
    description: "Комплексные решения для скейтпарков.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" },
      { title: "Установка", link: "#installation" }
    ],
    relatedProducts: [1, 2, 3, 4, 5, 6, 7] // IDs of related products
  },
  {
    id: 2,
  name: "skatepark2",
   image: "/images/skateparks/park2right.png",
    altImages: ["/images/skateparks/park2back.png", "/images/skateparks/park2front.png", "/images/skateparks/park2right2.png", "/images/skateparks/park2top.png" ],
    sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "РампСтрой",
    year: 2024,
    description: "Профессиональные рампы различных размеров.",
    details: [
      { title: "Материалы", link: "#materials" },
      { title: "Размеры", link: "#dimensions" },
      { title: "Установка", link: "#installation" },
      { title: "Гарантия", link: "#warranty" }
    ],
    relatedProducts: [1,  3, 4, 5, 6, 7] // IDs of related products
  },
  {
    id: 3,
  name: "skatepark3",
    image: "/images/skateparks/park3right.png",
    altImages: ["/images/skateparks/park3right.png", "/images/skateparks/park3front.png"],
   sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
    designer: "СкейтДизайн",
    year: 2024,
    description: "Отдельные элементы и готовые комплекты для скейтпарков.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      { title: "Варианты комплектации", link: "#sets" },
      { title: "Технические характеристики", link: "#tech-specs" },
      { title: "Доставка", link: "#delivery" }
    ],
    relatedProducts: [1, 2, 4, 5, 6, 7] // IDs of related products
  },
  {
    id: 4,
     name: "skatepark4",
  image: "/images/skateparks/park4.png",
   sampleImages: ["/images/sample1.jpg", "/images/sample2.jpg", "/images/sample3.jpg" ],
  altImages: ["/images/skateparks/park4front.png", "/images/skateparks/box7.png"],
    designer: "DIY Workshop",
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
    details: [
      { title: "Инструкции", link: "#instructions" },
      { title: "Материалы", link: "#materials" },
      { title: "Инструменты", link: "#tools" },
      { title: "Советы", link: "#tips" }
    ],
    relatedProducts: [1, 2, 3, 5, 6, 7] // IDs of related products
  },
]

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

export default function SkateparksProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, category } = useParams();
  const [searchParams] = useSearchParams();
  
  const imageData = location.state?.imageData;
  const slideIndexParam = Number(searchParams.get('view')) || 0;

  // Основные состояния
  const [activeProductIndex, setActiveProductIndex] = useState(() => 
    Math.max(0, productCatalogSkateparks.findIndex(p => p.id === Number(id)))
  );
  const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
    productCatalogSkateparks.map(() => 0)
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
    productCatalogSkateparks[activeProductIndex], [activeProductIndex]
  );

  // const relatedProducts = useMemo(() => 
  //   currentProduct?.relatedProducts
  //     ?.map(id => productCatalogSkateparks.find(p => p.id === id))
  //     .filter(Boolean) || [], 
  //   [currentProduct]
  // );

  const currentImages = useMemo(() => 
    currentProduct ? [currentProduct.image, ...currentProduct.altImages] : [], 
    [currentProduct]
  );

  // // Проверка валидности категории
  // const categoryExists = useMemo(() => 
  //   productCatalogSkateparks.some(cat => cat.category === category), [category]
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
    updateUrl(productCatalogSkateparks[newIndex].id, selectedImageIndices[newIndex]);

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
    const relatedIndex = productCatalogSkateparks.findIndex(p => p.id === relatedProductId);
    
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
              {productCatalogSkateparks.map((product, index) => (
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
              {productCatalogSkateparks.map((product, index) => (
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

// export default function SkateparksProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const imageData = location.state?.imageData;

//   const [searchParams] = useSearchParams();
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Разделение состояний для Swiper и миниатюр
//   const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
//   const [activeProductIndex, setActiveProductIndex] = useState(
//     productCatalogSkateparksSkateparks
//     .findIndex(p => p.id === Number(id)) || 0
//   );
  
//   // Состояние для выбранных миниатюр каждого продукта
//   const [selectedImageIndices, setSelectedImageIndices] = useState(
//     productCatalogSkateparksSkateparks
//     .map(() => 0)
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
//   const categoryIndex = productCatalogSkateparksSkateparks.findIndex(cat => cat.category === category);
  
//   // Если категория не найдена, показываем ошибку
//   if (categoryIndex === -1) {
//     return <div className="text-center mt-10 p-4">Категория не найдена</div>;
//   }

//   const product = productCatalogSkateparksSkateparks[activeProductIndex];
//   if (!product) return <p>Product not found</p>;

//   // Получаем связанные продукты
//   const relatedProducts = product.relatedProducts
//     .map(relatedId => productCatalogSkateparksSkateparks

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

  

//   const startTransitionAnimation = () => {
//   if (!transitionImageRef.current || !swiperContainerRef.current || !imageData || isAnimating) {
//     setAnimationComplete(true);
//     return;
//   }

//   setIsAnimating(true);

//   const { top, left, width, height } = imageData.rect;
//   const transitionImage = transitionImageRef.current;
//   const swiperContainer = swiperContainerRef.current;

//   // Ждем полной загрузки и рендеринга Swiper
//   const waitForSwiperRender = () => {
//     return new Promise((resolve) => {
//       const checkSlide = () => {
//         const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');
        
//         if (firstSlideImage) {
//           // Ждем загрузки изображения
//           if (firstSlideImage.complete) {
//             const rect = firstSlideImage.getBoundingClientRect();
//             if (rect.width > 0 && rect.height > 0) {
//               resolve(firstSlideImage);
//               return;
//             }
//           } else {
//             // Если изображение еще не загружено, ждем события load
//             firstSlideImage.onload = () => {
//               const rect = firstSlideImage.getBoundingClientRect();
//               if (rect.width > 0 && rect.height > 0) {
//                 resolve(firstSlideImage);
//               } else {
//                 setTimeout(checkSlide, 50);
//               }
//             };
//             return;
//           }
//         }
        
//         // Повторяем проверку через 50мс
//         setTimeout(checkSlide, 50);
//       };
      
//       checkSlide();
//     });
//   };

//   // Запускаем анимацию только после полной готовности
//   waitForSwiperRender().then((firstSlideImage) => {
//     const finalRect = firstSlideImage.getBoundingClientRect();
    
//     console.log('Начинаем анимацию перехода:', {
//       from: { top, left, width, height },
//       to: { top: finalRect.top, left: finalRect.left, width: finalRect.width, height: finalRect.height }
//     });
    
//     // Скрываем Swiper на время анимации
//     gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });
    
//     // Устанавливаем начальное состояние переходного изображения
//     gsap.set(transitionImage, {
//       position: "fixed",
//       // position: "absolute",
//       top,
//       left,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: 'visible',
//       display: 'block',
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });

//     // Анимируem переходное изображение
//     gsap.to(transitionImage, {
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: '12px',
//       duration: ANIMATION_DURATION,
//       ease: ANIMATION_EASE,
//       onComplete: () => {
//         // Показываем Swiper и скрываем переходное изображение
//         gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
//         gsap.set(transitionImage, { 
//           visibility: 'hidden',  
//           opacity: 0,
//           // display: 'none' // Полностью убираем из layout
//         });
//         setAnimationComplete(true);

//         // Анимируем появление информации
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
//   }).catch((error) => {
//     console.error('Ошибка при ожидании готовности Swiper:', error);
//     // Fallback: пропускаем анимацию
//     gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
//     gsap.set(transitionImage, { visibility: 'hidden', opacity: 0, display: 'none' });
//     gsap.set(infoRef.current, { opacity: 1, y: 0 });
//     setAnimationComplete(true);
//     setIsAnimating(false);
//   });
// };

// // // Улучшенный обработчик инициализации Swiper
// // const handleSwiperInit = (swiper) => {
// //   console.log('Swiper инициализирован');
  
// //   // Устанавливаем флаг загрузки
// //   setSwiperLoaded(true);

// //   // Если нет анимации (прямой переход/перезагрузка), просто показываем галерею
// //   if (!imageData) {
// //     gsap.set(infoRef.current, { opacity: 1, y: 0 });
// //     return;
// //   }

// //   // Для анимированного перехода ждем следующий кадр и затем дополнительную задержку
// //   requestAnimationFrame(() => {
// //     // Дополнительная задержка для полного рендеринга слайдов
// //     setTimeout(() => {
// //       startTransitionAnimation();
// //     }, 100); // Увеличиваем задержку до 100мс
// //   });
// // };

// // Дополнительный useEffect для контроля видимости переходного изображения
// useEffect(() => {
//   if (transitionImageRef.current && imageData) {
//     const transitionImage = transitionImageRef.current;
    
//     // Принудительно устанавливаем видимость при монтировании
//     gsap.set(transitionImage, {
//       position: "absolute",
//       top: imageData.rect.top,
//       left: imageData.rect.left,
//       width: imageData.rect.width,
//       height: imageData.rect.height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: 'visible',
//       display: 'block',
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });

//     console.log('Переходное изображение установлено:', {
//       src: transitionImage.src,
//       rect: imageData.rect,
//       visible: window.getComputedStyle(transitionImage).visibility,
//       display: window.getComputedStyle(transitionImage).display
//     });
//   }
// }, [imageData]);
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

//   updateUrlAndParams(productCatalogSkateparksSkateparks
//     [newIndex].id, selectedImageIndices[newIndex]);

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
//     const relatedIndex = productCatalogSkateparksSkateparks
//     g.findIndex(p => p.id === relatedProductId);
    
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
//         {!animationComplete && imageData && (
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
//           >  {/* Переходное изображение - только при анимированном переходе */}
          
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
//               {productCatalogSkateparksSkateparks

    
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
//               {productCatalogSkateparksSkateparks

    
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