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

  // Новые состояния для улучшенной анимации
  const [transitionImageLoaded, setTransitionImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  // Ссылки
  const containerRef = useRef(null);
  const transitionImageRef = useRef(null);
  const swiperContainerRef = useRef(null);
  const infoRef = useRef(null);
  const swiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null); 

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

  const product = productCatalogRamps[activeProductIndex];
  if (!product) return <p>Product not found</p>;

  // Константы для анимации
  const ANIMATION_DURATION = 0.6;
  const ANIMATION_EASE = "power2.out";

  // Функция предзагрузки изображения
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(src)) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  // Эффект для предзагрузки переходного изображения
  useEffect(() => {
    if (imageData && product?.image) {
      console.log('Начинаем предзагрузку переходного изображения:', product.image);
      
      preloadImage(product.image)
        .then(() => {
          console.log('Переходное изображение предзагружено');
          setTransitionImageLoaded(true);
        })
        .catch((error) => {
          console.error('Ошибка предзагрузки переходного изображения:', error);
          // Если предзагрузка не удалась, все равно показываем анимацию
          setTransitionImageLoaded(true);
        });
    } else if (!imageData) {
      // Если нет данных для анимации, сразу помечаем как загруженное
      setTransitionImageLoaded(true);
    }
  }, [imageData, product?.image]);

  // Дополнительный эффект для предзагрузки всех изображений продукта
  useEffect(() => {
    if (product && swiperLoaded) {
      const imagesToPreload = [
        product.image,
        ...product.altImages,
        ...productCatalogRamps.slice(0, 3).map(p => p.image) // Предзагружаем первые 3 продукта
      ];

      Promise.allSettled(imagesToPreload.map(preloadImage))
        .then(results => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          console.log(`Предзагружено ${successful} из ${imagesToPreload.length} изображений`);
        });
    }
  }, [product, swiperLoaded]);

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

  // Улучшенная функция установки переходного изображения
  const setupTransitionImage = () => {
    if (!transitionImageRef.current || !imageData) return Promise.resolve();

    const { top, left, width, height } = imageData.rect;
    const transitionImage = transitionImageRef.current;

    // Устанавливаем изображение и ждем его полной готовности
    return new Promise((resolve) => {
      const applyStyles = () => {
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
          borderRadius: imageData.borderRadius || '0px'
        });

        console.log('Стили переходного изображения применены:', {
          src: transitionImage.src,
          rect: { top, left, width, height },
          computed: {
            visibility: window.getComputedStyle(transitionImage).visibility,
            display: window.getComputedStyle(transitionImage).display,
            opacity: window.getComputedStyle(transitionImage).opacity
          }
        });

        resolve();
      };

      // Если изображение уже загружено
      if (transitionImage.complete && transitionImage.naturalWidth > 0) {
        applyStyles();
      } else {
        // Ждем загрузки изображения
        const handleLoad = () => {
          transitionImage.removeEventListener('load', handleLoad);
          transitionImage.removeEventListener('error', handleError);
          applyStyles();
        };

        const handleError = () => {
          transitionImage.removeEventListener('load', handleLoad);
          transitionImage.removeEventListener('error', handleError);
          console.error('Ошибка загрузки переходного изображения');
          applyStyles(); // Применяем стили даже при ошибке
        };

        transitionImage.addEventListener('load', handleLoad);
        transitionImage.addEventListener('error', handleError);
        
        // Fallback на случай, если события не сработают
        setTimeout(() => {
          transitionImage.removeEventListener('load', handleLoad);
          transitionImage.removeEventListener('error', handleError);
          applyStyles();
        }, 1000);
      }
    });
  };

  // Улучшенная функция ожидания готовности Swiper
  const waitForSwiperRender = () => {
    return new Promise((resolve, reject) => {
      const swiperContainer = swiperContainerRef.current;
      let attempts = 0;
      const maxAttempts = 50; // 2.5 секунды максимум

      const checkSlide = () => {
        attempts++;
        
        if (attempts > maxAttempts) {
          reject(new Error('Превышено время ожидания готовности Swiper'));
          return;
        }

        const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');
        
        if (firstSlideImage) {
          const checkImageReady = () => {
            const rect = firstSlideImage.getBoundingClientRect();
            
            if (rect.width > 0 && rect.height > 0) {
              resolve(firstSlideImage);
              return;
            }
            
            // Если изображение не готово, ждем еще
            setTimeout(checkSlide, 50);
          };

          if (firstSlideImage.complete && firstSlideImage.naturalWidth > 0) {
            checkImageReady();
          } else {
            firstSlideImage.onload = checkImageReady;
            firstSlideImage.onerror = () => {
              console.warn('Ошибка загрузки изображения в слайде');
              setTimeout(checkSlide, 50);
            };
          }
        } else {
          setTimeout(checkSlide, 50);
        }
      };
      
      checkSlide();
    });
  };

  // Исправленная функция запуска анимации
  const startTransitionAnimation = async () => {
    if (!transitionImageRef.current || !swiperContainerRef.current || !imageData || isAnimating) {
      setAnimationComplete(true);
      return;
    }

    console.log('Запуск переходной анимации...');
    setIsAnimating(true);

    try {
      // Сначала настраиваем переходное изображение
      await setupTransitionImage();

      const swiperContainer = swiperContainerRef.current;
      const transitionImage = transitionImageRef.current;

      // Ждем готовности целевого изображения в Swiper
      const firstSlideImage = await waitForSwiperRender();
      const finalRect = firstSlideImage.getBoundingClientRect();

      console.log('Целевое изображение готово, размеры:', finalRect);

      // Скрываем Swiper на время анимации
      gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

      // Запускаем анимацию
      gsap.to(transitionImage, {
        top: finalRect.top,
        left: finalRect.left,
        width: finalRect.width,
        height: finalRect.height,
        borderRadius: '12px',
        duration: ANIMATION_DURATION,
        ease: ANIMATION_EASE,
        onComplete: () => {
          // Показываем Swiper и скрываем переходное изображение
          gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
          gsap.set(transitionImage, { 
            visibility: 'hidden',  
            opacity: 0,
            display: 'none'
          });
          setAnimationComplete(true);

          // Анимируем появление информации
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

    } catch (error) {
      console.error('Ошибка анимации перехода:', error);
      // Fallback: пропускаем анимацию
      const swiperContainer = swiperContainerRef.current;
      gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
      gsap.set(transitionImageRef.current, { visibility: 'hidden', opacity: 0, display: 'none' });
      gsap.set(infoRef.current, { opacity: 1, y: 0 });
      setAnimationComplete(true);
      setIsAnimating(false);
    }
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

  // Обновленный обработчик инициализации Swiper
  const handleSwiperInit = (swiper) => {
    console.log('Swiper инициализирован');
    setSwiperLoaded(true);

    // Если нет анимации, просто показываем галерею
    if (!imageData) {
      gsap.set(infoRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Ждем загрузки переходного изображения перед анимацией
    const startAnimationWhenReady = () => {
      if (transitionImageLoaded) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            startTransitionAnimation();
          }, 50);
        });
      } else {
        // Проверяем каждые 50мс до загрузки
        setTimeout(startAnimationWhenReady, 50);
      }
    };

    startAnimationWhenReady();
  };

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
          {!animationComplete && imageData && (
            <img
              ref={transitionImageRef}
              src={product.image}
              alt={product.name}
              className="object-contain pointer-events-none"
              style={{ 
                position: 'fixed', 
                visibility: transitionImageLoaded ? 'visible' : 'hidden',
                display: 'block',
                zIndex: 1000,
                opacity: transitionImageLoaded ? 1 : 0
              }}
              onLoad={() => {
                console.log('Переходное изображение загружено в DOM');
                setTransitionImageLoaded(true);
              }}
              onError={(e) => {
                console.error('Ошибка загрузки переходного изображения в DOM:', e);
                setTransitionImageLoaded(true); // Показываем анимацию даже при ошибке
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

// export default function RampsProductDetail() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { id, category } = useParams();
//   const imageData = location.state?.imageData;

//   const [searchParams] = useSearchParams();
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

//   // Разделение состояний для Swiper и миниатюр
//   const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
//   const [activeProductIndex, setActiveProductIndex] = useState(
//     productCatalogRamps.findIndex(p => p.id === Number(id)) || 0
//   );
  
//   // Состояние для выбранных миниатюр каждого продукта
//   const [selectedImageIndices, setSelectedImageIndices] = useState(
//     productCatalogRamps.map(() => 0)
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
//   const categoryIndex = productCatalogRamps.findIndex(cat => cat.category === category);
  
//   // Если категория не найдена, показываем ошибку
//   if (categoryIndex === -1) {
//     return <div className="text-center mt-10 p-4">Категория не найдена</div>;
//   }

//   const product = productCatalogRamps[activeProductIndex];
//   if (!product) return <p>Product not found</p>;


//   // Получаем связанные продукты
//   const relatedProducts = product.relatedProducts
//     .map(relatedId => productCatalogRamps.find(p => p.id === relatedId))
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
//     const newUrl = `/product/ramps/${productId}?view=${viewIndex}`;
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
//       console.warn("Не удалось найти изображение в активном слайде");
//       setAnimationComplete(true);
//       setIsAnimating(false);
//       return;
//     }

//     // Получаем финальную позицию и размеры первого изображения
//     const finalRect = firstSlideImage.getBoundingClientRect();
// // Если размеры равны нулю, Swiper мог не успеть правильно отрендерить слайд
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
//            visibility: 'visible', // Явно устанавливаем видимость
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || '0px'
//     });
//    // и установим явные стили для лучшей совместимости
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
//        onStart: () => {
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
//               updateUrlAndParams(productCatalogRamps[newIndex].id, selectedImageIndices[newIndex]);
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
//     const relatedIndex = productCatalogRamps.findIndex(p => p.id === relatedProductId);
    
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
            
//             {productCatalogRamps.map((product, index) => (
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