// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
// import gsap from "gsap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SocialButtons from "../SocialButtons/SocialButtons";
// import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
// import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
// import productCatalogSetsSetss from "../data/productCatalogSetsSetss";
// import "swiper/css";
// import "swiper/css/pagination"; 
// import { ChevronDown, ChevronUp } from "lucide-react";


// const Accordion = ({ items, defaultOpenIndex = null }) => {
//   const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="w-full">
//       {items.map((item, index) => {
//         const isOpen = openIndex === index;

//         return (
//           <div key={index} className="w-full relative">
//             <button
//               className="relative w-full flex justify-between items-center py-3 text-left text-gray-900 hover:text-blue-600 transition-colors group"
//               onClick={() => toggleAccordion(index)}
//             >
//               <span className="font-futura text-[#717171] font-medium">{item.title}</span>
//               {isOpen ? (
//                 <ChevronUp className="w-5 h-5" />
//               ) : (
//                 <ChevronDown className="w-5 h-5" />
//               )}

//               {/* Линия всегда есть, но у открытого блока она уезжает вниз */}
//               <span
//                 className={`absolute left-0 w-full h-[1px] bg-gray-200 transition-transform duration-300`}
//                 style={{
//                   bottom: isOpen ? "-8px" : "0px",
//                   transform: isOpen ? "translateY(100%)" : "translateY(0)",
//                   opacity: isOpen ? 0 : 1
//                 }}
//               />
//             </button>

//             {/* Контент */}
//             <div
//               className={`transition-all duration-300 overflow-hidden ${
//                 isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="p-2 text-sm text-[#717171] font-futura relative">
//                 {item.content}

//                 {/* Когда открыт — линия появляется под текстом */}
//                 {isOpen && (
//                   <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-200" />
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };




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
//   const lastInteractionRef = useRef(Date.now());
// const hoverIntervalRef = useRef(null);
// const hoveredIndexRef = useRef(null);        // текущий индекс, над которым hover
// const pendingHoverRef = useRef(null);        // если hover пришёл во время анимации — отложим
// const mousePosRef = useRef({ x: 0, y: 0 });  // последние координаты мыши


//   const imageData = location.state?.imageData;
//   const slideIndexParam = Number(searchParams.get('view')) || 0;

  

//   // Определяем, нужен ли loading screen
//   const shouldShowLoading = useMemo(() => {
//     // Показываем loading screen если:
//     // 1. Нет imageData (значит переход не с каталога с анимацией)
//     // 2. Или если это прямой переход/перезагрузка
//     return !imageData;
//   }, [imageData]);
// const [thumbsShown, setThumbsShown] = useState(false);
//   // Основные состояния
//   const [activeProductIndex, setActiveProductIndex] = useState(() => 
//     Math.max(0, productCatalogSetsSetss.findIndex(p => p.id === Number(id)))
//   );
//   const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
//     productCatalogSetsSetss.map(() => 0)
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
//     urlUpdateBlocked: useRef(false),
//       thumbs: useRef(null),
//   };



//   // Мемоизированные значения
//   const currentProduct = useMemo(() => 
//     productCatalogSetsSetss[activeProductIndex], [activeProductIndex]
//   );

//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   // 2. Состояния для галереи
// const [isGalleryOpen, setIsGalleryOpen] = useState(false);
// const [galleryStartIndex, setGalleryStartIndex] = useState(0);


//   const currentImagesFullscreen = useMemo(() => 
//   currentProduct ? currentProduct.sample : [], 
//   [currentProduct]
// );
// // 1. Собираем общий альбом
// const allImages = useMemo(() => {
//   return productCatalogSetsSetss.flatMap((p) => p.sample || []);
// }, []); 


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

//   useEffect(() => {
//   if (animationState.complete && !thumbsShown) {
//     setThumbsShown(true);
//   }
// }, [animationState.complete, thumbsShown]);
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


//   useEffect(() => {
//   const onMove = (e) => {
//     mousePosRef.current = { x: e.clientX, y: e.clientY };
//   };
//   const onTouch = (e) => {
//     if (e.touches && e.touches[0]) mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
//   };

//   window.addEventListener('mousemove', onMove);
//   window.addEventListener('touchstart', onTouch, { passive: true });

//   return () => {
//     window.removeEventListener('mousemove', onMove);
//     window.removeEventListener('touchstart', onTouch);
//   };
// }, []);


// const startHoverInterval = useCallback((index, product) => {
//   clearInterval(hoverIntervalRef.current);

//   const totalImages = 1 + (product?.altImages?.length || 0);
//   if (totalImages <= 1) return; // нечего листать

//   hoverIntervalRef.current = setInterval(() => {
//     setSelectedImageIndices(prev => {
//       const next = [...prev];
//       const cur = next[index] ?? 0;
//       next[index] = (cur + 1) % totalImages;
//       return next;
//     });
//   }, 550);
// }, []);

// const isPointerOverSwiper = useCallback(() => {
//   if (!refs.swiperContainer.current) return false;
//   const { x, y } = mousePosRef.current;
//   const el = document.elementFromPoint(x, y);
//   return !!el && refs.swiperContainer.current.contains(el);
// }, []);

// //   const animateInfo = useCallback((direction = 'in') => {
// //   const targets = [refs.info.current, refs.thumbs.current].filter(Boolean);

// //   if (!targets.length) return Promise.resolve();

// //   const isIn = direction === 'in';
// //   const targetOpacity = isIn ? 1 : 0;
// //   const targetY = isIn ? 0 : 20;
// //   const duration = isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION;

// //   return new Promise(resolve => {
// //     gsap.to(targets, {
// //       opacity: targetOpacity,
// //       y: targetY,
// //       duration,
// //       ease: ANIMATION_CONFIG.EASE,
// //       onComplete: resolve,
// //     });
// //   });
// // }, []);

// const openGallery = () => {
//   // считаем сколько фото было ДО текущего продукта
//   const productStartIndex = productCatalogSetsSetss
//     .slice(0, activeProductIndex)
//     .reduce((acc, p) => acc + (p.sample?.length || 0), 0);

//   // если у продукта есть фото → открываем с его первой картинки
//   if (currentProduct.sample?.length) {
//     setGalleryStartIndex(productStartIndex);
//   } else {
//     // если фото нет → открываем с самого начала
//     setGalleryStartIndex(0);
//   }

//   setIsGalleryOpen(true);
// };

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
//         // await animateInfo('in');
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



  

// const handleSlideChange = useCallback(async (swiper) => {
//   const newIndex = swiper.activeIndex;
//   if (newIndex === activeProductIndex || animationState.inProgress) return;

//   const oldIndex = activeProductIndex; // сохраняем старый индекс

//   updateAnimationState({ slideChanging: true, inProgress: true });

//   // Сначала скрываем информацию
//   await animateInfo('out');

//   // Меняем индекс продукта
//   setActiveProductIndex(newIndex);

//   // Сбрасываем изображение нового продукта сразу на 0 (основное изображение)
//   setSelectedImageIndices(prev => {
//     const newIndices = [...prev];
//     newIndices[newIndex] = 0;
//     return newIndices;
//   });

//   // Обновляем URL и миниатюры
//   updateUrl(productCatalogSetsSetss[newIndex].id, 0);
//   if (swiperInstances.thumbs) {
//     swiperInstances.thumbs.slideTo(newIndex);
//   }

//   // Ждём завершения перелистывания Swiper

//     await animateInfo('in');
//     updateAnimationState({ slideChanging: false, inProgress: false });
//   setTimeout(async () => {
//     // После окончания анимации сбрасываем индекс старого продукта
//     setSelectedImageIndices(prev => {
//       const newIndices = [...prev];
//       newIndices[oldIndex] = 0;
//       return newIndices;
//     });

//     // Перезапускаем hover-анимацию, если курсор остался на слайде
//     const pending = pendingHoverRef.current;
//     if ((pending && pending.index === newIndex) || hoveredIndexRef.current === newIndex || isPointerOverSwiper()) {
//       const product = productCatalogSetsSetss[newIndex];
//       startHoverInterval(newIndex, product);
//       pendingHoverRef.current = null;
//     }
//   }, SWIPER_CONFIG.SPEED);
// }, [activeProductIndex, animationState.inProgress, swiperInstances.thumbs, updateUrl, animateInfo, updateAnimationState, isPointerOverSwiper, startHoverInterval]);

// useEffect(() => {
//   return () => {
//     clearInterval(hoverIntervalRef.current);
//   };
// }, []);


//   // const handleImageSelect = useCallback((index) => {
//   //   if (animationState.inProgress) return;

//   //   const newIndices = [...selectedImageIndices];
//   //   newIndices[activeProductIndex] = index;
//   //   setSelectedImageIndices(newIndices);
//   //   updateUrl(currentProduct.id, index);
//   // }, [animationState.inProgress, selectedImageIndices, activeProductIndex, 
//   //     currentProduct?.id, updateUrl]);

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


//   const handleMouseEnter = (index, product) => {
//      if (!animationState.complete || animationState.inProgress) return; // <-- блокируем пока анимация не завершена
//  setHoveredIndex(index); // запоминаем индекс
//   clearInterval(hoverIntervalRef.current);

//   hoverIntervalRef.current = setInterval(() => {
//     setSelectedImageIndices((prevIndices) => {
//       const newIndices = [...prevIndices];
//       const totalImages = 1 + (product.altImages?.length || 0);
//       const current = newIndices[index];
//       newIndices[index] = (current + 1) % totalImages;
//       return newIndices;
//     });
//   }, 550); // скорость смены кадров (0.5 сек)
// };

// const handleMouseLeave = (index) => {
//     setHoveredIndex(null); // курсор ушёл
//   clearInterval(hoverIntervalRef.current);

//   // setSelectedImageIndices((prevIndices) => {
//   //   const newIndices = [...prevIndices];
//   //   newIndices[index] = 0; // возвращаем на главное изображение
//   //   return newIndices;
//   // });
// };



//   useEffect(() => {
//     const swiper = swiperInstances.main;
//     if (!swiper || animationState.inProgress) return;
  
//     const newIndex = swiper.activeIndex;
//     if (newIndex !== activeProductIndex) {
//       setActiveProductIndex(newIndex);
//       updateUrl(productCatalogSetsSetss[newIndex].id, selectedImageIndices[newIndex]);
  
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
   
    

//     {/* Мобильный заголовок */}
//     <div className="block lg:hidden w-full mt-4">
//       {/* <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//           {currentProduct.description}
//       </h1> */}
//       <p className="font-futura text-[#717171] font-medium">
//       {currentProduct.name}
//       </p>
//     </div>
// {/* 
//       <div className="w-full flex items-start  mb-4"> */}
//       {/* Левая часть — Back */}
//       {/* <button
//         onClick={() => navigate(-1)}
//         className="text-gray-200 hover:text-pink-800 transition-colors"
//       >
//         ← Back
//       </button> */}


//     {/* </div> */}
//     {/* Основной контент */}
//     <div className="w-full  lg:h-[50%]  flex flex-col lg:flex-row lg:content-center  relative">
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
      



// {/* Swiper галерея + Миниатюры (мобильная версия) */}
// <div
//   ref={refs.swiperContainer}
//   className="w-full lg:w-[75%] lg:h-[100%] mt-0 lg:mt-20 lg:content-center"
//   style={{
//     visibility: !imageData || animationState.complete ? "visible" : "hidden",
//     opacity: !imageData || animationState.complete ? 1 : 0,
//   }}
// >
//   <div className="w-full flex flex-row items-start justify-between gap-2">
//     {/* Основная галерея */}
//     <div className="w-[100%]">
//       <Swiper
//         className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
//         modules={[Pagination, Mousewheel, Thumbs]}
//         pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
//         mousewheel={true}
//         direction="horizontal"
//         centeredSlides={true}
//         thumbs={{ swiper: swiperInstances.thumbs }}
//         spaceBetween={20}
//         initialSlide={activeProductIndex}
//         speed={SWIPER_CONFIG.SPEED}
//         threshold={SWIPER_CONFIG.THRESHOLD}
//         resistance={true}
//         resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
//         onInit={handleSwiperInit}
//         onSlideChange={handleSlideChange}
//         preventClicks={false}
//         preventClicksPropagation={false}
//         touchStartPreventDefault={false}
//       >
//         {productCatalogSetsSetss.map((product, index) => (
//           <SwiperSlide key={product.id} style={{ height: "100%" }}>
//             <div className="w-full h-full flex items-center justify-center">
//         <img
//   src={
//     selectedImageIndices[index] === 0
//       ? product.image
//       : product.altImages[selectedImageIndices[index] - 1]
//   }
//   alt={product.name}
//   className="max-h-full w-auto object-contain"
//   draggable="false"

//  onMouseEnter={() => handleMouseEnter(index, product)}
//   onMouseLeave={() => handleMouseLeave(index)}

// />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <div className="custom-swiper-pagination mt-4 sm:mt-4 flex justify-center text-[#ff00fb]" />
//     </div>

//   </div>
// </div>


//       Описание и миниатюры текущего продукта
//       <div
//         ref={refs.info}
//         className="w-full lg:w-[%] lg:h-[55%] flex flex-col justify mt-8 lg:mt-20"
//         style={{
//           opacity:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? 0
//               : 1,
//           transform:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? "translateY(20px)"
//               : "translateY(0)",
//          pointerEvents: animationState.slideChanging ? "none" : "auto",
//            visibility:
//             animationState.slideChanging || (!animationState.complete && imageData)
//               ? "hidden"
//               : "visible",
//         }}
//       >
//         <div className="hidden lg:block">
//           <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
//             {currentProduct.name}</h1>
// <Accordion
//   items={[
//     { title: "Описание", content: currentProduct.description },
//     { title: "Дополнительная информация", content: currentProduct.description2 },
//   ]} defaultOpenIndex={1} 
// />

         
//         </div>


//         {currentProduct.details?.map((detail, index) => {
//           const isCatalog = detail.title.toLowerCase().includes("каталог");
//           return (
//             <button
//               key={index}
//               onClick={() => {
//                 if (isCatalog){
//                   //  setIsGalleryOpen(true);
//                 openGallery();}
//                 else window.location.href = detail.link;
//               }}
//               className="w-full text-left flex cursor-pointer justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
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

//   <div ref={refs.thumbs} className="block w-[100%]  "  style={{
//      opacity: thumbsShown ? 1 : 0,
//       visibility: thumbsShown ? "visible" : "hidden",
//     }} >
    
//       <Swiper
//         modules={[Thumbs]}
//         direction="horizontal"
//         onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
     
//           breakpoints={{
//     320: { slidesPerView: 8 },
//     480: { slidesPerView: 8 },
//     640: { slidesPerView: 8 },
//     768: { slidesPerView: 8 },
//     1024: { slidesPerView: 8 },
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
//         {productCatalogSetsSetss.map((product, index) => (
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
//       i  images={allImages}
//   startIndex={galleryStartIndex}
//   isOpen={isGalleryOpen}
//   onClose={() => setIsGalleryOpen(false)}
//     />

//       {/* Дата по центру внизу */}
//   <div className="flex justify-center items-center   bg-black">
//     <span className="text-[#919190] font-futura font-light text-sm sm:text-[17px]">
//       2015-2025
//     </span>
//   </div>
//   </div>
// </>

//   );
// }



import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import productCatalogSets from "../data/productCatalogSets";
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

export default function SetsProductDetail() {
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
    Math.max(0, productCatalogSets.findIndex(p => p.id === Number(id)))
  );
  const [selectedImageIndices, setSelectedImageIndices] = useState(() => 
    productCatalogSets.map(() => 0)
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
    productCatalogSets[activeProductIndex], [activeProductIndex]
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
    updateUrl(productCatalogSets[newIndex].id, selectedImageIndices[newIndex]);

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
      updateUrl(productCatalogSets[newIndex].id, selectedImageIndices[newIndex]);
  
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
        {productCatalogSets.map((product, index) => (
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
        {productCatalogSets.map((product, index) => (
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
              {productCatalogSets.map((product, index) => (
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
        {productCatalogSets.map((product, index) => (
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