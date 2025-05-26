// src/components/ProductGallery/ProductDetailAnimation.js
import { gsap } from 'gsap';

export class ProductDetailAnimation {
  constructor(duration = 0.6, ease = "power2.out") {
    this.ANIMATION_DURATION = duration;
    this.ANIMATION_EASE = ease;
    this.isAnimating = false;
  }
  
  // Функция для запуска анимации перехода
  startTransitionAnimation({
    transitionImageRef,
    swiperContainerRef,
    imageData,
    infoRef,
    onAnimationComplete
  }) {
    // Проверка наличия необходимых элементов и данных
    if (!transitionImageRef?.current || !swiperContainerRef || !imageData || this.isAnimating) {
      onAnimationComplete();
      return;
    }

    this.isAnimating = true;

    const { top, left, width, height } = imageData.rect;
    
    // Проверка корректности размеров
    if (!width || !height || width <= 0 || height <= 0) {
      console.warn("Целевое изображение имеет нулевые размеры");
      onAnimationComplete();
      this.isAnimating = false;
      return;
    }
    
    const transitionImage = transitionImageRef.current;
    const swiperContainer = swiperContainerRef;

    // Дополнительная проверка на существование контейнера
    if (!swiperContainer) {
      console.warn("GSAP target not found");
      onAnimationComplete();
      this.isAnimating = false;
      return;
    }

    // Находим элемент первого слайда с ожиданием его появления
    const checkForSlideImage = () => {
      const firstSlideImage = swiperContainer.querySelector('.swiper-slide-active img');
      
      if (!firstSlideImage) {
        // Если изображение еще не появилось, пробуем через небольшую задержку
        setTimeout(checkForSlideImage, 50);
        return;
      }
      
      // Проверяем, что изображение полностью загружено
      if (firstSlideImage.complete) {
        continueAnimation(firstSlideImage);
      } else {
        // Если изображение загружается, ждем его загрузки
        firstSlideImage.onload = () => continueAnimation(firstSlideImage);
        
        // На случай, если загрузка не удастся, устанавливаем таймаут
        setTimeout(() => {
          if (this.isAnimating) {
            console.warn("Timeout for image loading reached");
            onAnimationComplete();
            this.isAnimating = false;
          }
        }, 3000);
      }
    };
    
    const continueAnimation = (firstSlideImage) => {
      try {
        // Получаем финальную позицию и размеры первого изображения
        const finalRect = firstSlideImage.getBoundingClientRect();
        
        if (finalRect.width <= 0 || finalRect.height <= 0) {
          console.warn("Финальное изображение имеет нулевые размеры");
          onAnimationComplete();
          this.isAnimating = false;
          return;
        }

        // Скрываем Swiper на время анимации
        gsap.set(swiperContainer, { visibility: 'hidden', opacity: 0 });

        // Устанавливаем начальное состояние переходного изображения
        gsap.set(transitionImage, {
          position: "fixed",
          top,
          left,
          width,
          height,
          zIndex: 1000,
          opacity: 1,
          objectFit: "contain",
          borderRadius: imageData.borderRadius || '0px'
        });

        // Анимируем переходное изображение
        const tl = gsap.timeline({
          onComplete: () => {
            // Показываем Swiper и скрываем переходное изображение
            gsap.set(swiperContainer, { visibility: 'visible', opacity: 1 });
            gsap.set(transitionImage, { visibility: 'hidden' });
            
            // Проверка существования infoRef перед анимацией
            if (infoRef?.current) {
              gsap.to(infoRef.current, {
                opacity: 1,
                y: 0,
                duration: this.ANIMATION_DURATION,
                ease: this.ANIMATION_EASE,
                onComplete: () => {
                  this.isAnimating = false;
                  onAnimationComplete();
                }
              });
            } else {
              this.isAnimating = false;
              onAnimationComplete();
            }
          }
        });

        tl.to(transitionImage, {
          top: finalRect.top,
          left: finalRect.left,
          width: finalRect.width,
          height: finalRect.height,
          borderRadius: '12px',
          duration: this.ANIMATION_DURATION,
          ease: this.ANIMATION_EASE
        });
      } catch (error) {
        console.error("Error during animation:", error);
        this.isAnimating = false;
        onAnimationComplete();
      }
    };
    
    // Запускаем проверку наличия изображения слайда
    checkForSlideImage();
  }

  fadeOutDescription(infoRef, onComplete) {
    if (!infoRef?.current || this.isAnimating) {
      onComplete && onComplete();
      return;
    }
    
    this.isAnimating = true;
    
    try {
      gsap.to(infoRef.current, {
        opacity: 0, 
        y: 20, 
        duration: this.ANIMATION_DURATION / 2,
        ease: this.ANIMATION_EASE,
        onComplete: () => {
          onComplete && onComplete();
        }
      });
    } catch (error) {
      console.error("Error during fadeOutDescription:", error);
      this.isAnimating = false;
      onComplete && onComplete();
    }
  }

  fadeInDescription(infoRef, onComplete) {
    if (!infoRef?.current) {
      this.isAnimating = false;
      onComplete && onComplete();
      return;
    }
    
    try {
      // Сначала скрываем
      gsap.set(infoRef.current, { opacity: 0, y: 20 });
      
      // Затем анимируем появление
      gsap.to(infoRef.current, {
        opacity: 1, 
        y: 0, 
        duration: this.ANIMATION_DURATION,
        ease: this.ANIMATION_EASE,
        onComplete: () => {
          this.isAnimating = false;
          onComplete && onComplete();
        }
      });
    } catch (error) {
      console.error("Error during fadeInDescription:", error);
      this.isAnimating = false;
      onComplete && onComplete();
    }
  }
}

export default ProductDetailAnimation;