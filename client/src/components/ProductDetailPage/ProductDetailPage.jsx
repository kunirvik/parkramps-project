import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProductSwiper from '../ProductSwiper/ProductSwiper';
import ProductInfo from '../ProductInfo/ProductInfo';
import RelatedProducts from '../RelatedProducts/RelatedProducts';
import TransitionImage from '../TransitionImage/TransitionImage';
import SocialButtons from '../SocialButtons/SocialButtons'; // Предположим, что этот компонент уже существует
import LoadingScreen from '../LoadingScreen/LodingScreen'; // Предположим, что этот компонент уже существует
import { ProductDetailAnimation } from '../ProductDetailAnimation/ProductDetailAnimation';
import { useUrlNavigation } from '../useUrlNavigation/useUrlNavigation';

const ProductDetailPage = ({ productCatalog }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, category } = useParams();
  const imageData = location.state?.imageData;

  const [searchParams] = useSearchParams();
  const slideIndexParam = Number(searchParams.get('view')) || 0;

  // Разделение состояний для Swiper и миниатюр
  const [activeImageIndex, setActiveImageIndex] = useState(slideIndexParam);
  const [activeProductIndex, setActiveProductIndex] = useState(
    productCatalog.findIndex(p => p.id === Number(id)) || 0
  );
  
  // Состояние для выбранных миниатюр каждого продукта
  const [selectedImageIndices, setSelectedImageIndices] = useState(
    productCatalog.map(() => 0)
  );

  // Ссылки
  const containerRef = useRef(null);
  const transitionImageRef = useRef(null);
  const infoRef = useRef(null);
  const swiperRef = useRef(null);
  
  // Состояния для контроля анимаций и загрузки
  const [animationComplete, setAnimationComplete] = useState(!imageData);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const [isSlideChanging, setIsSlideChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Последний активный продукт для предотвращения двойных обновлений
  const lastActiveProductRef = useRef(activeProductIndex);
  
  // Получаем вспомогательный класс для анимаций
  const animation = new ProductDetailAnimation();
  const { updateUrlAndParams } = useUrlNavigation();

  // Находим продукт
  const product = productCatalog[activeProductIndex];
  if (!product) {
    return <LoadingScreen message="Поиск продукта..." />;
  }

  // Получаем связанные продукты
  const relatedProducts = product.relatedProducts
    .map(relatedId => productCatalog.find(p => p.id === relatedId))
    .filter(Boolean);

  // Предзагрузка изображений
  useEffect(() => {
    // Проверяем только наличие продукта для предотвращения ошибок
    if (!product) return;

    setImagesLoaded(false);
    
    // Собираем все изображения для предзагрузки
    const allImages = [
      product.image, 
      ...product.altImages,
      ...relatedProducts.map(p => p.image)
    ].filter(Boolean);
    
    // Счетчик загруженных изображений
    let loadedCount = 0;
    
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= allImages.length) {
        setImagesLoaded(true);
      }
    };
    
    // Предзагружаем все изображения
    allImages.forEach(imgSrc => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded; // В случае ошибки тоже учитываем
      img.src = imgSrc;
    });
    
    // Если нет изображений или не удается их загрузить, устанавливаем таймаут
    const timeoutId = setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [product?.id]);

  // Состояние загрузки
  useEffect(() => {
    if (swiperLoaded && imagesLoaded) {
      // Задержка перед скрытием экрана загрузки для плавности
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [swiperLoaded, imagesLoaded]);

  // Обработчик инициализации Swiper
  const handleSwiperInit = (swiper) => {
    setSwiperLoaded(true);

    // Если нет анимации (прямой переход/перезагрузка), просто показываем галерею
    if (!imageData) {
      return;
    }

    // Начинаем анимацию только после полной загрузки Swiper и изображений
    if (imagesLoaded) {
      requestAnimationFrame(() => {
        animation.startTransitionAnimation({
          transitionImageRef,
          swiperContainerRef: swiperRef.current?.el,
          imageData,
          infoRef,
          onAnimationComplete: () => setAnimationComplete(true)
        });
      });
    }
  };

  // Отслеживаем изменение URL-параметров
  useEffect(() => {
    if (swiperRef.current && swiperLoaded && !animation.isAnimating) {
      // Обновляем только индекс изображения, без перерисовки всего компонента
      setActiveImageIndex(slideIndexParam);
      
      // Синхронизируем выбранные миниатюры с параметром из URL
      const newIndices = [...selectedImageIndices];
      newIndices[activeProductIndex] = slideIndexParam;
      setSelectedImageIndices(newIndices);
    }
  }, [slideIndexParam, swiperLoaded]);

  // Запуск анимации после загрузки
  useEffect(() => {
    if (imageData && imagesLoaded && swiperLoaded && !animationComplete && swiperRef.current?.el) {
      animation.startTransitionAnimation({
        transitionImageRef,
        swiperContainerRef: swiperRef.current.el,
        imageData,
        infoRef,
        onAnimationComplete: () => setAnimationComplete(true)
      });
    }
  }, [imagesLoaded, swiperLoaded, animationComplete]);

  // Оптимизированный обработчик смены слайда
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    
    // Предотвращаем дублирование обработки одного и того же слайда
    if (newIndex !== activeProductIndex && !animation.isAnimating && lastActiveProductRef.current !== newIndex) {
      lastActiveProductRef.current = newIndex;
      
      // Устанавливаем флаги
      setIsSlideChanging(true);
      
      // Сначала скрываем текущую информацию
      animation.fadeOutDescription(infoRef, () => {
        // Обновляем состояние после скрытия информации
        setActiveProductIndex(newIndex);
        
        // Обновляем URL после смены продукта (отложенно)
        setTimeout(() => {
          updateUrlAndParams(productCatalog[newIndex].id, selectedImageIndices[newIndex], category);
        }, 50);
        
        // Задержка перед показом нового описания
        requestAnimationFrame(() => {
          setTimeout(() => {
            animation.fadeInDescription(infoRef, () => {
              setIsSlideChanging(false);
            });
          }, 50);
        });
      });
    }
  };

  const handleExit = () => {
    navigate("/catalogue");
  };

  // Оптимизированный обработчик клика по связанным продуктам
  const handleRelatedProductClick = (relatedProductId) => {
    const relatedIndex = productCatalog.findIndex(p => p.id === relatedProductId);
    
    if (relatedIndex !== -1 && relatedIndex !== activeProductIndex && !animation.isAnimating) {
      // Запоминаем новый индекс для предотвращения двойной обработки
      lastActiveProductRef.current = relatedIndex;
      
      // Устанавливаем флаги
      setIsSlideChanging(true);
      
      // Скрываем текущую информацию
      animation.fadeOutDescription(infoRef, () => {
        // Обновляем состояние
        setActiveProductIndex(relatedIndex);
        
        // Обновляем URL после смены продукта (отложенно)
        setTimeout(() => {
          updateUrlAndParams(relatedProductId, selectedImageIndices[relatedIndex] || 0, category);
        }, 50);
        
        // Отключаем переходы Swiper на время программного переключения
        if (swiperRef.current) {
          // Переключаем слайд без анимации
          swiperRef.current.slideTo(relatedIndex);
          
          // Анимируем описание
          setTimeout(() => {
            animation.fadeInDescription(infoRef, () => {
              setIsSlideChanging(false);
            });
          }, 50);
        }
      });
    }
  };

  // Оптимизированный обработчик выбора миниатюры
  const handleImageSelect = (index) => {
    if (animation.isAnimating || !swiperRef.current) return;

    const newSelectedImageIndices = [...selectedImageIndices];
    newSelectedImageIndices[activeProductIndex] = index;
    setSelectedImageIndices(newSelectedImageIndices);
    setActiveImageIndex(index);

    swiperRef.current.slideTo(activeProductIndex);
    
    // Обновляем URL для отражения нового индекса изображения
    updateUrlAndParams(product.id, index, category);
  };

  // Отображаем экран загрузки, пока не готовы все необходимые данные
  if (isLoading) {
    return <LoadingScreen message="Загрузка галереи..." />;
  }

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
        <div className="w-full flex flex-col lg:flex-row gap-8 relative">
          {/* Переходное изображение - только при анимированном переходе */}
          <TransitionImage 
            imageUrl={product.image}
            imageData={imageData}
            animationComplete={animationComplete}
            transitionImageRef={transitionImageRef}
          />
          
          {/* Swiper галерея */}
          <ProductSwiper
            products={productCatalog}
            activeProductIndex={activeProductIndex}
            selectedImageIndices={selectedImageIndices}
            animationComplete={animationComplete}
            imageData={imageData}
            handleSwiperInit={handleSwiperInit}
            handleSlideChange={handleSlideChange}
            onSwiperLoad={(swiper) => {
              swiperRef.current = swiper;
              setSwiperLoaded(true);
            }}
            ANIMATION_DURATION={animation.ANIMATION_DURATION}
          />
          
          {/* Информация о продукте */}
          <ProductInfo
            product={product}
            isSlideChanging={isSlideChanging}
            animationComplete={animationComplete}
            selectedImageIndices={selectedImageIndices}
            activeProductIndex={activeProductIndex}
            handleImageSelect={handleImageSelect}
            isAnimating={animation.isAnimating}
            ANIMATION_DURATION={animation.ANIMATION_DURATION}
            infoRef={infoRef}
          />
        </div>

        {/* Related products section */}
        <RelatedProducts
          products={relatedProducts}
          onProductClick={handleRelatedProductClick}
          isAnimating={animation.isAnimating}
        />
      </div>
    </>
  );
};

export default ProductDetailPage;