import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import productCatalogRamps from "../data/productCatalogRamps";
import "swiper/css";
import "swiper/css/pagination"; 



export default function RampsProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const imageData = location.state?.imageData;

  const [searchParams] = useSearchParams();
  const slideIndexParam = Number(searchParams.get('view')) || 0;



  // Добавьте эти дополнительные состояния в начало компонента:
const [imageReady, setImageReady] = useState(false);
const [swiperFullyReady, setSwiperFullyReady] = useState(false);


  // Разделение состояний для Swiper и миниатюр
  const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
  const [activeProductIndex, setActiveProductIndex] = useState(
    productCatalogRamps.findIndex(p => p.id === Number(id)) || 0
  );


  const [activeDetail, setActiveDetail] = useState(null);
  // Состояние для выбранных миниатюр каждого продукта
  const [selectedImageIndices, setSelectedImageIndices] = useState(
    productCatalogRamps.map(() => 0)
  );

  // Ссылки
  const containerRef = useRef(null);
  const transitionImageRef = useRef(null);
  const swiperContainerRef = useRef(null);
  const infoRef = useRef(null);
  const swiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null); 
const imageDataRef = useRef(location.state?.imageData || null);

  // Состояния для контроля анимаций
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
     const [activeIndex, setActiveIndex] = useState(0);
const [animationComplete, setAnimationComplete] = useState(!imageDataRef.current);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const [isSlideChanging, setIsSlideChanging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Последний активный продукт для предотвращения двойных обновлений
  const lastActiveProductRef = useRef(activeProductIndex);
  // Блокиратор для предотвращения циклических обновлений URL
  const isUrlUpdatingRef = useRef(false);
  


  const product = productCatalogRamps[activeProductIndex];
  if (!product) return <p>Product not found</p>;


  // Константы для анимации
  const ANIMATION_DURATION = 0.6;
  const ANIMATION_EASE = "power2.out";

  // Обновление URL без перезагрузки компонента
  const updateUrlAndParams = (productId, viewIndex = 0) => {
    // Предотвращаем циклические обновления
    if (isUrlUpdatingRef.current) return;
    
    isUrlUpdatingRef.current = true;
    
    // Используем replaceState вместо navigate для более мягкого обновления URL
    const newUrl = `/product/ramps/${productId}?view=${viewIndex}`;
    window.history.replaceState(null, '', newUrl);
    
    // Сбрасываем блокировку через небольшую задержку
    setTimeout(() => {
      isUrlUpdatingRef.current = false;
    }, 50);
  };



  // Функция предзагрузки изображения:
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};



  // Синхронизация Swiper с состоянием при изменении URL или загрузке
  useEffect(() => {
    // Обновляем слайдер только когда Swiper полностью загружен
    if (swiperRef.current && swiperLoaded && !isAnimating) {
      // Перемещаем к нужному слайду без анимации при первичной загрузке
      swiperRef.current.slideTo(activeProductIndex, 0);
      
      // Также синхронизируем свайпер миниатюр
      if (thumbsSwiperRef.current) {
        thumbsSwiperRef.current.slideTo(activeProductIndex, 0);
      }
      
      // Устанавливаем активный индекс изображения
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
      // Обновляем только индекс изображения, без перерисовки всего компонента
      setActiveImageIndex(slideIndexParam);
      
      // Синхронизируем выбранные миниатюры с параметром из URL
      const newIndices = [...selectedImageIndices];
      newIndices[activeProductIndex] = slideIndexParam;
      setSelectedImageIndices(newIndices);
    }
  }, [slideIndexParam, swiperLoaded]);

  // Синхронизация свайпера миниатюр с основным свайпером
  useEffect(() => {
    if (thumbsSwiperRef.current && swiperLoaded && !isAnimating) {
      // Явно синхронизируем позицию миниатюр с активным слайдом
      thumbsSwiperRef.current.slideTo(activeProductIndex, ANIMATION_DURATION * 1000);
      
      // Активируем выделение миниатюры
      const thumbSlides = thumbsSwiperRef.current.slides;
      if (thumbSlides) {
        thumbSlides.forEach((slide, i) => {
          if (i === activeProductIndex) {
            slide.classList.add('swiper-slide-thumb-active');
          } else {
            slide.classList.remove('swiper-slide-thumb-active');
          }
        });
      }
    }
  }, [activeProductIndex, swiperLoaded]);


// Улучшенная функция переходной анимации:
const startTransitionAnimation = () => {
  if (!transitionImageRef.current || !swiperContainerRef.current || !imageDataRef.current || isAnimating) {
    setAnimationComplete(true);
    return;
  }

  // Дополнительная проверка готовности
  if (!imageReady || !swiperFullyReady) {
    console.log('Ожидание готовности компонентов...');
    setTimeout(() => startTransitionAnimation(), 100);
    return;
  }

  setIsAnimating(true);

  const { top, left, width, height } = imageDataRef.current.rect;
  const transitionImage = transitionImageRef.current;
  const swiperContainer = swiperContainerRef.current;

  // Находим целевое изображение
  const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');

  if (!firstSlideImage || !firstSlideImage.complete) {
    console.warn("Целевое изображение не готово");
    setTimeout(() => {
      setIsAnimating(false);
      startTransitionAnimation();
    }, 100);
    return;
  }

  const finalRect = firstSlideImage.getBoundingClientRect();
  
  if (finalRect.width === 0 || finalRect.height === 0) {
    console.warn("Целевое изображение имеет нулевые размеры");
    setTimeout(() => {
      setIsAnimating(false);
      startTransitionAnimation();
    }, 100);
    return;
  }

  // Скрываем Swiper
  gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

  // Проверяем текущие стили переходного изображения
  const currentStyles = window.getComputedStyle(transitionImage);
  console.log('Стили переходного изображения:', {
    visibility: currentStyles.visibility,
    display: currentStyles.display,
    width: currentStyles.width,
    height: currentStyles.height
  });

  // Устанавливаем начальное состояние с форсированием стилей
  gsap.set(transitionImage, {
    position: "fixed",
    top,
    left,
    width,
    height,
    zIndex: 1000,
    opacity: 1,
    visibility: 'visible',
    display: 'block',
    objectFit: "contain",
    borderRadius: imageDataRef.current.borderRadius || '0px',
    pointerEvents: 'none'
  });

  // Форсируем применение стилей
  transitionImage.offsetHeight; // Принудительный reflow

  // Анимация с улучшенной обработкой
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
      gsap.set(transitionImage, { 
        visibility: 'hidden', 
        opacity: 0,
        display: 'none' // Полностью скрываем
      });
      setAnimationComplete(true);

      gsap.to(infoRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_DURATION,
        ease: ANIMATION_EASE,
        onComplete: () => {
          setIsAnimating(false);
        }
      });
    }
  });

  // Основная анимация перехода
  tl.to(transitionImage, {
    top: finalRect.top,
    left: finalRect.left,
    width: finalRect.width,
    height: finalRect.height,
    borderRadius: '12px',
    duration: ANIMATION_DURATION,
    ease: ANIMATION_EASE,
    onStart: () => {
      console.log('Анимация перехода началась');
    },
    onUpdate: function() {
      // Контроль выполнения анимации
      const progress = this.progress();
      if (progress > 0.1) {
        // Анимация точно началась
      }
    }
  });
};

// Улучшенный useEffect для установки переходного изображения:
useEffect(() => {
  if (transitionImageRef.current && imageDataRef.current && !animationComplete) {
    const transitionImage = transitionImageRef.current;
    
    // Сначала сбрасываем состояние готовности
    setImageReady(false);
    
    const setupTransitionImage = () => {
      // Устанавливаем стили немедленно
      gsap.set(transitionImage, {
        position: "fixed",
        top: imageDataRef.current.rect.top,
        left: imageDataRef.current.rect.left,
        width: imageDataRef.current.rect.width,
        height: imageDataRef.current.rect.height,
        zIndex: 1000,
        opacity: 1,
        visibility: 'visible',
        display: 'block',
        objectFit: "contain",
        borderRadius: imageDataRef.current.borderRadius || '0px',
        pointerEvents: 'none'
      });

      // Форсируем reflow
      transitionImage.offsetHeight;
      
      setImageReady(true);
      console.log('Переходное изображение готово');
    };

    // Если изображение уже загружено
    if (transitionImage.complete && transitionImage.naturalWidth > 0) {
      setupTransitionImage();
    } else {
      // Ждем загрузки изображения
      transitionImage.onload = setupTransitionImage;
      transitionImage.onerror = () => {
        console.error('Ошибка загрузки переходного изображения');
        setImageReady(true); // Продолжаем даже при ошибке
      };
    }
  }
}, [imageData, animationComplete]);


// Улучшенная функция инициализации Swiper:
const handleSwiperInit = async (swiper) => {
  console.log('Swiper инициализирован');
  setSwiperLoaded(true);

  if (!imageData) {
    gsap.set(infoRef.current, { opacity: 1, y: 0 });
    setSwiperFullyReady(true);
    return;
  }

  // Предзагружаем изображение продукта
  try {
    await preloadImage(product.image);
    console.log('Изображение предзагружено');
  } catch (error) {
    console.error('Ошибка предзагрузки:', error);
  }

  // Ждем полного рендеринга Swiper с несколькими проверками
  const waitForSwiperReady = () => {
    return new Promise((resolve) => {
      const checkReady = () => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const slideImg = activeSlide?.querySelector('img');
        
        if (slideImg && slideImg.complete && slideImg.naturalWidth > 0) {
          resolve();
        } else {
          setTimeout(checkReady, 50);
        }
      };
      checkReady();
    });
  };  // Ждем готовности с таймаутом
  try {
    await Promise.race([
      waitForSwiperReady(),
      new Promise(resolve => setTimeout(resolve, 500)) // Максимум 500мс ожидания
    ]);
  } catch (error) {
    console.warn('Таймаут ожидания готовности Swiper');
  }

  setSwiperFullyReady(true);
  
  // Запускаем анимацию только когда все готово
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (imageReady) {
        startTransitionAnimation();
      }
    }, 100);
  });
};

// Дополнительный useEffect для контроля видимости переходного изображения
useEffect(() => {
  if (transitionImageRef.current && imageDataRef.current

  ) {
    const transitionImage = transitionImageRef.current;
    
    // Принудительно устанавливаем видимость при монтировании
    gsap.set(transitionImage, {
      position: "fixed",
      top: imageDataRef.current.rect.top,
      left: imageDataRef.current.rect.left,
      width: imageDataRef.current.rect.width,
      height: imageDataRef.current.rect.height,
      zIndex: 1000,
      opacity: 1,
      visibility: 'visible',
      display: 'block',
      objectFit: "contain",
      borderRadius: imageDataRef.current.borderRadius || '0px'
    });

    console.log('Переходное изображение установлено:', {
      src: transitionImage.src,
      rect: imageData.rect,
      visible: window.getComputedStyle(transitionImage).visibility,
      display: window.getComputedStyle(transitionImage).display
    });
  }
}, [imageData]);

  // Переработанная функция анимации описания
  const animateDescription = () => {
    if (!infoRef.current || isAnimating) return;
    
    setIsAnimating(true);
    
    // Сначала скрываем
    gsap.set(infoRef.current, { opacity: 0, y: 20 });
    
    // Затем анимируем появление
    gsap.to(infoRef.current, {
      opacity: 1, 
      y: 0, 
      duration: ANIMATION_DURATION,
      ease: ANIMATION_EASE,
      onComplete: () => {
        // Только после завершения анимации сбрасываем флаги
        setIsSlideChanging(false);
        setIsAnimating(false);
      }
    });
  };



  // Оптимизированный обработчик смены слайда
const handleSlideChange = (swiper) => {
  const newIndex = swiper.activeIndex;

  if (newIndex === activeProductIndex) return;

  // Сразу синхронизируем индекс, URL и миниатюры
  setActiveProductIndex(newIndex);
  lastActiveProductRef.current = newIndex;

  if (thumbsSwiperRef.current) {
    thumbsSwiperRef.current.slideTo(newIndex);
  }

  updateUrlAndParams(productCatalogRamps[newIndex].id, selectedImageIndices[newIndex]);

  // Затем, отдельно, запускаем анимацию описания
  if (!isAnimating && infoRef.current) {
    setIsSlideChanging(true);
    setIsAnimating(true);

    gsap.to(infoRef.current, {
      opacity: 0,
      y: 20,
      duration: ANIMATION_DURATION / 2,
      ease: ANIMATION_EASE,
      onComplete: () => {
        // отложенная анимация появления
        requestAnimationFrame(() => {
          setTimeout(() => {
            animateDescription();
          }, 50);
        });
      }
    });
  }
};

  const handleExit = () => {
    navigate("/catalogue");
  };



  // Оптимизированный обработчик выбора миниатюры
  const handleImageSelect = (index) => {
    if (isAnimating || !swiperRef.current) return;

    const newSelectedImageIndices = [...selectedImageIndices];
    newSelectedImageIndices[activeProductIndex] = index;
    setSelectedImageIndices(newSelectedImageIndices);
    setActiveImageIndex(index);

    // Обновляем URL с новым индексом изображения
    updateUrlAndParams(product.id, index);
  };

  // Обработчик клика по миниатюре товара
const handleThumbnailClick = (index) => {
  if (isAnimating || index === activeProductIndex) return;

  if (swiperRef.current) {
    swiperRef.current.slideTo(index);
  }

  // 🧠 Не вызывай setActiveProductIndex напрямую — он вызывается внутри handleSlideChange
};

useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveDetail(hash);
    }
  }, [location]);



 useEffect(() => {
    if (activeDetail && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [activeDetail]);

  const handleDetailClick = (detail) => {
    setActiveDetail(detail.link.replace("#", ""));
    navigate(detail.link); // обновит URL
  };



  return (
    <>
      <SocialButtons
        buttonLabel="shop"
        onButtonClick={handleExit}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />
      
      <div ref={containerRef} className="flex flex-col items-center w-full mt-[60px] mx-auto px-4">
        <button onClick={() => navigate(-1)} className="self-start mb-6 text-gray-200 hover:text-gray-800">
          ← Back
        </button>

        {/* Основной контент */}
        <div className={`w-full flex flex-col lg:flex-row gap-8 relative`}>
          {/* Переходное изображение - только при анимированном переходе */}
     
{!animationComplete && imageDataRef.current && (
  <img
    ref={transitionImageRef}
    src={product.image}
    alt={product.name}
    className="object-contain pointer-events-none"
    style={{ 
      position: 'fixed', 
      visibility: imageReady ? 'visible' : 'hidden',
      display: 'block',
      zIndex: 1000,
      opacity: imageReady ? 1 : 0
    }}
    onError={(e) => {
      console.error('Ошибка загрузки переходного изображения:', e);
      setImageReady(true); // Продолжаем анимацию даже при ошибке
    }}
  />
)}
          
          {/* Swiper галерея */}
          <div 
            ref={swiperContainerRef} 
            className="w-full lg:w-3/4 mb-8"
            style={{ 
              visibility: !imageData || animationComplete ? 'visible' : 'hidden',
              opacity: !imageData || animationComplete ? 1 : 0
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
              speed={ANIMATION_DURATION * 1000}
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
              {productCatalogRamps.map((product, index) => (
                <SwiperSlide key={product.id} style={{ height: '100%' }}>
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
                  /></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Свайпер миниатюр товаров */}
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
  onSlideChange={(swiper) => console.log('thumbs swiper index', swiper.activeIndex)}

  

 


              
            >
              {productCatalogRamps.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <img
                    src={product.image}
                    onClick={() => handleThumbnailClick(index)}
                  className={`cursor-pointer transition-all duration-300 rounded-lg border-2
  ${index === activeProductIndex 
    ? 'opacity-100 scale-105 border-black' 
    : 'grayscale border-transparent opacity-60 hover:opacity-100'}`}

                    alt={product.name}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Информация о продукте */}
          <div 
            ref={infoRef}
            className={`w-full lg:w-1/4 flex flex-col justify-center mt-4 lg:mt-0`}
            style={{ 
              opacity: (isSlideChanging || !animationComplete) ? 0 : 1,
              transform: (isSlideChanging || !animationComplete) ? 'translateY(20px)' : 'translateY(0)',
              transition: `opacity ${ANIMATION_DURATION}s ${ANIMATION_EASE}, transform ${ANIMATION_DURATION}s ${ANIMATION_EASE}`,
              visibility: (isSlideChanging || !animationComplete) ? 'hidden' : 'visible',
              position: 'relative'
            }}
          >
            {/* Product information */}
            <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">{product.name}</h1>
            <p className="font-futura text-[#717171] font-medium">{product.description}</p>
            <p className="font-futura text-[#717171] font-medium mt-2">Дизайн: {product.designer}, {product.year}</p>
            
            {/* Image thumbnails for the current product */}
            <div className="mt-8 flex flex-wrap justify-start gap-4">
              {[product.image, ...product.altImages].map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`border rounded-lg p-1 transition hover:scale-105 ${
                    selectedImageIndices[activeProductIndex] === index ? "border-black" : "border-transparent"
                  }`}
                  disabled={isAnimating} // Отключаем кнопки во время анимации
                >
                  <img
                    src={img}
                    alt={`${product.name} Mini ${index + 1}`}
                    className="w-16 h-16 object-contain rounded"
                    draggable="false" // Предотвращаем случайные перетаскивания
                  />
                </button>
              ))}
            </div>

            {/* Product details */}
            {product.details.map((detail, index) => (
              <a
                key={index}
                href={detail.link}
                 onClick={() => handleDetailClick(detail)}
                className="flex justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition"
              >
                <span className="font-futura text-[#717171] font-medium">{detail.title}</span>
                <span className="font-futura text-[#717171] text-lg">→</span>
              </a>
            ))}
          </div>
        </div>

         {activeDetail && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={() => setActiveDetail(null)} className="text-2xl">×</button>
          </div>

          <div className="flex-1">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-full"
            >
              {product.sampleImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`sample-${index}`} className="w-full h-full object-contain" />
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

