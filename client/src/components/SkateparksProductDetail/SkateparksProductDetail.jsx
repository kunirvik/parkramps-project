import { useEffect, useRef, useState } from "react";
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


const productCatalogSkateparks= [ {id: 1,
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

export default function SkateparksProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const imageData = location.state?.imageData;

  const [searchParams] = useSearchParams();
  const slideIndexParam = Number(searchParams.get('view')) || 0;

  // Разделение состояний для Swiper и миниатюр
  const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
  const [activeProductIndex, setActiveProductIndex] = useState(
    productCatalogSkateparks.findIndex(p => p.id === Number(id)) || 0
  );

  const [activeDetail, setActiveDetail] = useState(null);
  // Состояние для выбранных миниатюр каждого продукта
  const [selectedImageIndices, setSelectedImageIndices] = useState(
    productCatalogSkateparks.map(() => 0)
  );

  // Ссылки
  const containerRef = useRef(null);
  const transitionImageRef = useRef(null);
  const swiperContainerRef = useRef(null);
  const infoRef = useRef(null);
  const swiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null); 
  const galleryOverlayRef = useRef(null);

  // Состояния для контроля анимаций
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(!imageData);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const [isSlideChanging, setIsSlideChanging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Последний активный продукт для предотвращения двойных обновлений
  const lastActiveProductRef = useRef(activeProductIndex);
  // Блокиратор для предотвращения циклических обновлений URL
  const isUrlUpdatingRef = useRef(false);

  const product = productCatalogSkateparks[activeProductIndex];
  if (!product) return <p>Product not found</p>;

  // Улучшенные константы для анимации
  const ANIMATION_DURATION = 0.8; // Увеличена длительность для плавности
  const ANIMATION_EASE = "power3.out"; // Более плавная кривая
  const FAST_ANIMATION_DURATION = 0.4; // Для быстрых переходов
  const SMOOTH_EASE = "power2.inOut"; // Для двусторонних анимаций

  // Обновление URL без перезагрузки компонента
  const updateUrlAndParams = (productId, viewIndex = 0) => {
    if (isUrlUpdatingRef.current) return;
    
    isUrlUpdatingRef.current = true;
    const newUrl = `/product/skateparks/${productId}?view=${viewIndex}`;
    window.history.replaceState(null, '', newUrl);
    
    setTimeout(() => {
      isUrlUpdatingRef.current = false;
    }, 50);
  };

  // Синхронизация Swiper с состоянием при изменении URL или загрузке
  useEffect(() => {
    if (swiperRef.current && swiperLoaded && !isAnimating) {
      // Плавная синхронизация с анимацией
      swiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
      
      if (thumbsSwiperRef.current) {
        thumbsSwiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
      }
      
      if (selectedImageIndices[activeProductIndex] !== activeImageIndex) {
        const newIndices = [...selectedImageIndices];
        newIndices[activeProductIndex] = activeImageIndex;
        setSelectedImageIndices(newIndices);
      }
    }
  }, [swiperLoaded]);

  // Отслеживаем изменение URL-параметров
  useEffect(() => {
    if (swiperRef.current && swiperLoaded && !isAnimating) {
      setActiveImageIndex(slideIndexParam);
      
      const newIndices = [...selectedImageIndices];
      newIndices[activeProductIndex] = slideIndexParam;
      setSelectedImageIndices(newIndices);
    }
  }, [slideIndexParam, swiperLoaded]);

  // Улучшенная синхронизация свайпера миниатюр
  useEffect(() => {
    if (thumbsSwiperRef.current && swiperLoaded && !isAnimating) {
      // Более плавная синхронизация с easing
      thumbsSwiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
      
      const thumbSlides = thumbsSwiperRef.current.slides;
      if (thumbSlides) {
        thumbSlides.forEach((slide, i) => {
          const isActive = i === activeProductIndex;
          // Плавная анимация активации миниатюр
          gsap.to(slide, {
            scale: isActive ? 1.05 : 1,
            opacity: isActive ? 1 : 0.6,
            duration: FAST_ANIMATION_DURATION,
            ease: SMOOTH_EASE
          });
          
          if (isActive) {
            slide.classList.add('swiper-slide-thumb-active');
          } else {
            slide.classList.remove('swiper-slide-thumb-active');
          }
        });
      }
    }
  }, [activeProductIndex, swiperLoaded]);

  // Обработчик инициализации Swiper
  const handleSwiperInit = (swiper) => {
    setSwiperLoaded(true);

    if (!imageData) {
      // Плавное появление галереи при прямом переходе
      gsap.fromTo(infoRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: ANIMATION_DURATION, ease: ANIMATION_EASE }
      );
      return;
    }

    requestAnimationFrame(() => {
      startTransitionAnimation();
    });
  };

  // Улучшенная функция анимации перехода
  const startTransitionAnimation = () => {
    if (!transitionImageRef.current || !swiperContainerRef.current || !imageData || isAnimating) {
      setAnimationComplete(true);
      return;
    }

    setIsAnimating(true);

    const { top, left, width, height } = imageData.rect;
    const transitionImage = transitionImageRef.current;
    const swiperContainer = swiperContainerRef.current;

    const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');

    if (!firstSlideImage) {
      console.warn("Не удалось найти изображение в активном слайде");
      setAnimationComplete(true);
      setIsAnimating(false);
      return;
    }

    const finalRect = firstSlideImage.getBoundingClientRect();
    
    if (finalRect.width === 0 || finalRect.height === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        startTransitionAnimation();
      }, 100);
      return;
    }
    
    // Предварительная анимация затемнения фона
    gsap.to('body', {
      backgroundColor: 'rgba(0,0,0,0.05)',
      duration: FAST_ANIMATION_DURATION,
      ease: ANIMATION_EASE
    });

    // Скрываем Swiper с плавным исчезновением
    gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

    // Более плавная установка начального состояния
    gsap.set(transitionImage, {
      position: "fixed",
      top,
      left,
      width,
      height,
      zIndex: 1000,
      opacity: 1,
      visibility: 'visible',
      objectFit: "contain",
      borderRadius: imageData.borderRadius || '0px',
      filter: 'brightness(1.05)', // Легкое свечение для плавности
      transformOrigin: 'center center'
    });

    // Создаем более сложную анимацию перехода
    const tl = gsap.timeline({
      onComplete: () => {
        // Плавное появление Swiper
        gsap.set(swiperContainer, { visibility: 'visible' });
        gsap.to(swiperContainer, {
          opacity: 1,
          duration: FAST_ANIMATION_DURATION,
          ease: ANIMATION_EASE
        });
        
        // Скрываем переходное изображение с fade-out
        gsap.to(transitionImage, {
          opacity: 0,
          scale: 0.95,
          duration: FAST_ANIMATION_DURATION,
          ease: SMOOTH_EASE,
          onComplete: () => {
            gsap.set(transitionImage, { visibility: 'hidden' });
          }
        });

        setAnimationComplete(true);

        // Плавная анимация информации
        gsap.fromTo(infoRef.current, 
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASE,
            delay: 0.2, // Небольшая задержка для последовательности
            onComplete: () => {
              setIsAnimating(false);
              // Возвращаем фон в исходное состояние
              gsap.to('body', {
                backgroundColor: 'transparent',
                duration: FAST_ANIMATION_DURATION,
                ease: ANIMATION_EASE
              });
            }
          }
        );
      }
    });
    
    // Основная анимация трансформации
    tl.to(transitionImage, {
      top: finalRect.top,
      left: finalRect.left,
      width: finalRect.width,
      height: finalRect.height,
      borderRadius: '12px',
      filter: 'brightness(1)', // Убираем свечение
      duration: ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      // Добавляем промежуточные ключевые кадры для более плавной анимации
      keyframes: {
        "25%": { scale: 1.02, filter: 'brightness(1.08)' },
        "75%": { scale: 0.98, filter: 'brightness(1.02)' },
        "100%": { scale: 1, filter: 'brightness(1)' }
      }
    });
  };

  // Улучшенная анимация описания
  const animateDescription = () => {
    if (!infoRef.current || isAnimating) return;
    
    setIsAnimating(true);
    
    // Создаем более сложную анимацию появления
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSlideChanging(false);
        setIsAnimating(false);
      }
    });

    // Сначала анимируем исчезновение
    tl.to(infoRef.current, {
      opacity: 0,
      y: -15,
      scale: 0.98,
      duration: FAST_ANIMATION_DURATION,
      ease: SMOOTH_EASE
    })
    // Затем плавное появление с новым содержимым
    .to(infoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      delay: 0.1
    });
  };

  // Улучшенный обработчик смены слайда
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    if (newIndex === activeProductIndex) return;

    setActiveProductIndex(newIndex);
    lastActiveProductRef.current = newIndex;

    // Плавная синхронизация миниатюр
    if (thumbsSwiperRef.current) {
      thumbsSwiperRef.current.slideTo(newIndex, ANIMATION_DURATION * 1000);
    }

    updateUrlAndParams(productCatalogSkateparks[newIndex].id, selectedImageIndices[newIndex]);

    // Запускаем улучшенную анимацию описания
    if (!isAnimating && infoRef.current) {
      setIsSlideChanging(true);
      animateDescription();
    }
  };

  const handleExit = () => {
    // Добавляем плавный выход
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: FAST_ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      onComplete: () => {
        navigate("/catalogue");
      }
    });
  };

  // Улучшенный обработчик выбора миниатюры
  const handleImageSelect = (index) => {
    if (isAnimating || !swiperRef.current) return;

    // Добавляем микро-анимацию для обратной связи
    const clickedThumb = event.currentTarget;
    gsap.to(clickedThumb, {
      scale: 0.9,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });

    const newSelectedImageIndices = [...selectedImageIndices];
    newSelectedImageIndices[activeProductIndex] = index;
    setSelectedImageIndices(newSelectedImageIndices);
    setActiveImageIndex(index);

    updateUrlAndParams(product.id, index);
  };

  // Обработчик клика по миниатюре товара с анимацией
  const handleThumbnailClick = (index) => {
    if (isAnimating || index === activeProductIndex) return;

    // Анимация клика
    const clickedElement = event.currentTarget;
    gsap.to(clickedElement, {
      scale: 0.95,
      duration: 0.15,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });

    if (swiperRef.current) {
      swiperRef.current.slideTo(index, ANIMATION_DURATION * 1000);
    }
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveDetail(hash);
    }
  }, [location]);

  // Улучшенная анимация модального окна галереи
  useEffect(() => {
    if (activeDetail && containerRef.current) {
      // Создаем backdrop blur эффект
      gsap.set('body', { overflow: 'hidden' });
      
      gsap.fromTo(
        containerRef.current,
        { 
          y: "100%", 
          opacity: 0,
          scale: 0.9
        },
        { 
          y: "0%", 
          opacity: 1,
          scale: 1,
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE
        }
      );

      // Добавляем размытие фона
      if (galleryOverlayRef.current) {
        gsap.fromTo(galleryOverlayRef.current,
          { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' },
          { 
            backdropFilter: 'blur(10px)', 
            backgroundColor: 'rgba(0,0,0,0.3)',
            duration: ANIMATION_DURATION,
            ease: ANIMATION_EASE
          }
        );
      }
    }

    return () => {
      if (!activeDetail) {
        gsap.set('body', { overflow: 'auto' });
      }
    };
  }, [activeDetail]);

  const handleDetailClick = (detail) => {
    setActiveDetail(detail.link.replace("#", ""));
    navigate(detail.link);
  };

  // Улучшенное закрытие модального окна
  const handleCloseGallery = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveDetail(null);
        gsap.set('body', { overflow: 'auto' });
      }
    });

    // Анимация закрытия
    tl.to(containerRef.current, {
      y: "50%",
      opacity: 0,
      scale: 0.95,
      duration: FAST_ANIMATION_DURATION,
      ease: SMOOTH_EASE
    });

    if (galleryOverlayRef.current) {
      tl.to(galleryOverlayRef.current, {
        backdropFilter: 'blur(0px)',
        backgroundColor: 'rgba(0,0,0,0)',
        duration: FAST_ANIMATION_DURATION,
        ease: SMOOTH_EASE
      }, 0);
    }
  };

  return (
    <>
      <SocialButtons
        buttonLabel="shop"
        onButtonClick={handleExit}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />
      
      <div ref={containerRef} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
        <button 
          onClick={() => navigate(-1)} 
          className="self-start mb-6 text-gray-200 hover:text-gray-800 transition-all duration-300 hover:transform hover:-translate-x-1"
        >
          ← Back
        </button>

        {/* Основной контент */}
        <div className={`w-full flex flex-col lg:flex-row gap-8 relative`}>
          {/* Переходное изображение */}
          {!animationComplete && imageData && (
            <img
              ref={transitionImageRef}
              src={product.image}
              alt={product.name}
              className="object-contain transition-all duration-300"
              style={{ position: 'fixed', visibility: 'visible' }}
            />
          )}
          
          {/* Swiper галерея */}
          <div 
            ref={swiperContainerRef} 
            className="w-full lg:w-3/4 mb-8 transition-all duration-500"
            style={{ 
              visibility: !imageData || animationComplete ? 'visible' : 'hidden',
              opacity: !imageData || animationComplete ? 1 : 0,
              transform: !imageData || animationComplete ? 'translateY(0)' : 'translateY(20px)'
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
              thumbs={{ swiper: thumbsSwiper }}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.2 },
                1024: { slidesPerView: 1.5 }
              }}
              spaceBetween={20}
              initialSlide={activeProductIndex}
              speed={ANIMATION_DURATION * 1000} // Используем улучшенную длительность
              threshold={20}
              resistance={true}
              resistanceRatio={0.85}
              onInit={handleSwiperInit}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                if (swiper.mousewheel && !swiper.mousewheel.enabled) {
                  swiper.mousewheel.enable();
                }
                if (swiper.initialized) {
                  setSwiperLoaded(true);
                }
              }}
              preventClicks={false}
              preventClicksPropagation={false}
              touchStartPreventDefault={false}
            >
              {productCatalogSkateparks.map((product, index) => (
                <SwiperSlide key={product.id} style={{ height: '100%' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={
                        selectedImageIndices[index] === 0 
                          ? product.image 
                          : product.altImages[selectedImageIndices[index] - 1]
                      }
                      alt={product.name}
                      className="max-h-full w-auto object-contain transition-all duration-300 hover:scale-105"
                      draggable="false"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Улучшенный свайпер миниатюр товаров */}
            <Swiper
              className="w-full mt-6"
              modules={[Thumbs]}
              direction="horizontal"
              onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
              slidesPerView={5}
              spaceBetween={10}
              watchSlidesProgress={true}
              slideToClickedSlide={true}
              initialSlide={activeProductIndex}
              speed={ANIMATION_DURATION * 1000}
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
                    className={`cursor-pointer transition-all duration-500 rounded-lg border-2 hover:shadow-lg
                      ${index === activeProductIndex 
                        ? 'opacity-100 scale-105 border-black shadow-md' 
                        : 'grayscale border-transparent opacity-60 hover:opacity-100 hover:scale-102'}`}
                    alt={product.name}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Информация о продукте с улучшенными переходами */}
          <div 
            ref={infoRef}
            className="w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0"
            style={{ 
              opacity: (isSlideChanging || !animationComplete) ? 0 : 1,
              transform: (isSlideChanging || !animationComplete) ? 'translateY(30px) scale(0.98)' : 'translateY(0) scale(1)',
              transition: `all ${ANIMATION_DURATION}s ${ANIMATION_EASE}`,
              visibility: (isSlideChanging || !animationComplete) ? 'hidden' : 'visible',
            }}
          >
            <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3 transition-all duration-300 hover:text-black">
              {product.name}
            </h1>
            <p className="font-futura text-[#717171] font-medium">{product.description}</p>
            <p className="font-futura text-[#717171] font-medium mt-2">Дизайн: {product.designer}, {product.year}</p>
            
            {/* Улучшенные миниатюры изображений */}
            <div className="mt-8 flex flex-wrap justify-start gap-4">
              {[product.image, ...product.altImages].map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => handleImageSelect(index, e)}
                  className={`border rounded-lg p-1 transition-all duration-300 hover:scale-110 hover:shadow-md ${
                    selectedImageIndices[activeProductIndex] === index 
                      ? "border-black shadow-lg scale-105" 
                      : "border-transparent hover:border-gray-300"
                  }`}
                  disabled={isAnimating}
                >
                  <img
                    src={img}
                    alt={`${product.name} Mini ${index + 1}`}
                    className="w-16 h-16 object-contain rounded transition-all duration-300"
                    draggable="false"
                  />
                </button>
              ))}
            </div>

            {/* Детали продукта с улучшенными hover-эффектами */}
            {product.details.map((detail, index) => (
              <a
                key={index}
                href={detail.link}
                onClick={() => handleDetailClick(detail)}
                className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-all duration-300 hover:bg-gray-50 hover:px-2 rounded"
              >
                <span className="font-futura text-[#717171] font-medium transition-all duration-300">
                  {detail.title}
                </span>
                <span className="font-futura text-[#717171] text-lg transition-all duration-300 hover:transform hover:translate-x-1">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Улучшенное модальное окно галереи */}
        {activeDetail && (
          <div 
            ref={galleryOverlayRef}
            className="fixed inset-0 bg-white z-50 flex flex-col"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div className="flex justify-end p-4">
              <button 
                onClick={handleCloseGallery} 
                className="text-2xl hover:text-red-500 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                ×
              </button>
            </div>

            <div className="flex-1">
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-full"
                speed={ANIMATION_DURATION * 1000}
                effect="fade"
                fadeEffect={{ crossFade: true }}
              >
                {product.sampleImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={img} 
                      alt={`sample-${index}`} 
                      className="w-full h-full object-contain transition-all duration-500 hover:scale-105" 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </>
  );
}