

// import Masonry f
// m "react-masonry-css";
// import css from "../CloudGallery/CloudGallery.module.css";
// import { useState } from "react";

// const CloudGallery = ({ images }) => {
//   const [imageSizes, setImageSizes] = useState({});

//   const breakpointColumnsObj = {
//     default: 3,
//     768: 2,
//     480: 1,
//   };

//   // Функция для проверки ориентации изображения после загрузки
//   const handleImageLoad = (mediaId, event) => {
//     const img = event.target;
//     // После загрузки изображения проверяем его ориентацию
//     const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";

//     setImageSizes((prevSizes) => ({
//       ...prevSizes,
//       [mediaId]: orientation,
//     }));
//   };

//   return (
//     <Masonry
//       breakpointCols={breakpointColumnsObj}
//       className={css.gallery}
//       columnClassName={css.gallerycolumn}
//     >
//       {images.map((media) => (
//         <div
//           key={media.public_id}
//           className={css.galleryitem}
//           style={{
//             // Устанавливаем количество колонок в зависимости от ориентации изображения
//             gridColumn: imageSizes[media.public_id] === "landscape" ? "span 2" : "span 1",
//           }}
//         >
//           {media.resource_type === "image" ? (
//             <img
//               src={media.secure_url}
//               alt={media.public_id}
//               className={css.galleryimage}
//               style={{
//                 width: "100%",
//                 cursor: "pointer",
//                 borderRadius: "8px",
//                 display: "block",
//               }}
//               onLoad={(e) => handleImageLoad(media.public_id, e)} // Обработчик события onLoad
//             />
//           ) : (
//             <video
//               src={media.secure_url}
//               autoPlay
//               loop
//               muted
//               playsInline
//               className={css.galleryimage}
//               style={{
//                 width: "100%",
//                 borderRadius: "8px",
//                 display: "block",
//               }}
//             />
//           )}
//         </div>
//       ))}
//     </Masonry>
//   );
// };

// export default CloudGallery;


// import Masonry from "react-responsive-masonry";
// import css from "../CloudGallery/CloudGallery.module.css";
// import { useState, useEffect } from "react";

// const CloudGallery = ({ images }) => {
//   const [imageSizes, setImageSizes] = useState({});
//   const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, productId: null });

//   const handleImageLoad = (mediaId, event) => {
//     const img = event.target;
//     const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";

//     setImageSizes((prevSizes) => ({
//       ...prevSizes,
//       [mediaId]: orientation,
//     }));
//   };
//   useEffect(() => {
//     console.log(images); // посмотри, есть ли context у объектов
//   }, [images]);

//   useEffect(() => {
//   images.forEach(media => {
//     console.log(media.public_id, media.context); // смотрим есть ли context вообще
//   });
// }, [images]);



//   const handleMouseMove = (e, productId) => {
//     setTooltip({
//       show: true,
//       x: e.pageX,  // учитывает прокрутку
//       y: e.pageY,  // учитывает прокрутку
//       productId
//     });
//   };
  
//   const handleMouseLeave = () => {
//     setTooltip({ ...tooltip, show: false });
//   };


//   return (
 
//       <Masonry gutter="16px" columnsCount={3}>
//         {images.map((media) => (
          
//           <div
//             key={media.public_id}
//             className={css.galleryitem}
//             style={{
//               // Если хочешь сделать большее выделение ландшафтных фото — можно добавить ширину вручную.
//               width: "100%", display: "block" 

//             }
//           } onMouseMove={(e) => {
//             const caption =  media.context?.caption || "Заголовок не указан";
//             const alt =  media.context?.alt || "Описание не указано";
            
//  console.log("Caption:", caption, "Alt:", alt); 
//             handleMouseMove(e, `${caption} — ${alt}`);
//           }}
          

//           onMouseLeave={handleMouseLeave}
//           >
//             {media.resource_type === "image" ? (
//               <img
//               src={media.secure_url}
//               alt={media.context?.alt  || "Описание не указано"}
//               className={css.galleryimage}
//               onLoad={(e) => handleImageLoad(media.public_id, e)}
//             />
            
//             ) : (
//               <video
//                 src={media.secure_url}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className={css.galleryimage}
//                 style={{
//                   width: "100%",
//                   borderRadius: "8px",
//                   display: "block",
//                 }}
//               />
//             )}
           

//           </div>
//         ))} {tooltip.show && (
//           <div
//             style={{
//               position: "fixed",
//               top: Math.min(tooltip.y + 15, window.innerHeight - 50), // ограничение по Y
//               left: Math.min(tooltip.x + 15, window.innerWidth - 200), // ограничение по X
//               backgroundColor: "rgba(0, 0, 0, 0.7)",
//               color: "#fff",
//               padding: "6px 10px",
//               borderRadius: "4px",
//               pointerEvents: "none",
//               whiteSpace: "nowrap",
//               zIndex: 1000
//             }}
//           >
//             {tooltip.productId}
//           </div>
//         )}
        
//       </Masonry>
 
//   );
// };
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// import Masonry from "react-responsive-masonry";
// import css from "../CloudGallery/CloudGallery.module.css";
// // Импортируем необходимые хуки из React
// import { useState, useEffect, useRef, useCallback } from "react";

// const CloudGallery = ({ images }) => {
//   // Состояние для хранения ориентации изображений (портретная/ландшафтная)
//   // Используется useState, так как это не вызывает циклов обновления
//   const [imageSizes, setImageSizes] = useState({});
  
//   // Состояние для основной информации тултипа
//   // Включает только необходимую информацию, которая не меняется часто
//   const [tooltip, setTooltip] = useState({ 
//     show: false,    // Видимость тултипа
//     x: 0,           // Начальная X-координата (используется только для первоначального рендеринга)
//     y: 0,           // Начальная Y-координата (используется только для первоначального рендеринга)
//     productId: null // ID продукта, о котором показывается информация
//   });

//   const [fullscreenIndex, setFullscreenIndex] = useState(null);
// const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

// const openFullscreen = (index) => {
//   if (isMobile) {
//     setFullscreenIndex(index);
//   }
// };

// const closeFullscreen = () => {
//   setFullscreenIndex(null);
// };


// useEffect(() => {
//   if (fullscreenIndex !== null) {
//     document.body.style.overflow = "hidden"; // запрет прокрутки
//   } else {
//     document.body.style.overflow = ""; // восстановление прокрутки
//   }

//   return () => {
//     document.body.style.overflow = "";
//   };
// }, [fullscreenIndex]);

  
//   // Реф для прямого доступа к DOM-элементу тултипа
//   // Используется для манипуляции DOM напрямую, минуя систему рендеринга React
//   const tooltipRef = useRef(null);
  
//   // Реф для отслеживания текущей позиции мыши без вызова перерендера
//   // Ключевой момент: обновление ref не вызывает перерендер компонента
//   const mousePositionRef = useRef({ x: 0, y: 0 });

//   // Функция для определения ориентации изображения после его загрузки
//   const handleImageLoad = (mediaId, event) => {
//     const img = event.target;
//     // Определяем ориентацию на основе соотношения сторон
//     const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
//     // Обновляем состояние, сохраняя ранее установленные размеры для других изображений
//     setImageSizes((prevSizes) => ({
//       ...prevSizes,
//       [mediaId]: orientation,
//     }));
//   };

//   // Обработчик движения мыши - мемоизирован с useCallback
//   // useCallback предотвращает создание новой функции при каждом рендере
//   const handleMouseMove = useCallback((e, productId) => {
//      if (isMobile) return; 
//     // Обновляем реф с текущей позицией мыши
//     // Важно: это не вызывает перерендер компонента
//     mousePositionRef.current = { x: e.pageX, y: e.pageY };
    
//     // Обновляем состояние tooltip только если:
//     // 1. Тултип был скрыт и нужно его показать
//     // 2. Изменился productId (наводим на другой элемент)
//     setTooltip(prev => {
//       if (!prev.show || prev.productId !== productId) {
//         return {
//           show: true,
//           x: e.pageX,  // Начальная позиция для первого рендера
//           y: e.pageY,  // Начальная позиция для первого рендера
//           productId    // ID продукта для отображения информации
//         };
//       }
//       // Если ничего существенного не изменилось, не обновляем состояние
//       return prev;
//     });
//   }, []); // Пустой массив зависимостей, так как функция не зависит от реактивных значений

//   // Обработчик ухода мыши с элемента - также мемоизирован
//   const handleMouseLeave = useCallback(() => {
    
//     // Скрываем тултип, сохраняя остальные свойства без изменений
//     setTooltip(prev => ({ ...prev, show: false }));
//   }, []);

//   // Эффект для плавного перемещения тултипа за курсором
//   useEffect(() => {
//     // Если тултип скрыт, ничего не делаем
//     if (!tooltip.show) return;
    
//     // Идентификатор для функции requestAnimationFrame
//     let animationFrameId;
    
//     // Функция обновления позиции тултипа, которая будет вызываться в цикле анимации
//     const updateTooltipPosition = () => {
//       // Проверяем существование DOM-элемента и видимость тултипа
//       if (!tooltipRef.current || !tooltip.show) return;
      
//       // Получаем текущую позицию мыши из рефа
//       const { x, y } = mousePositionRef.current;
      
//       // Получаем размеры тултипа для правильного позиционирования
//       const { width, height } = tooltipRef.current.getBoundingClientRect();
      
//       // Расчет позиции так, чтобы тултип оставался в пределах экрана
//       const tooltipX = x + width + 5 > window.innerWidth ? x - width - 15 : x + 15;
//       const tooltipY = y + height + 5 > window.innerHeight ? y - height - 15 : y + 15;
      
//       // Напрямую обновляем стили DOM-элемента без использования setState
//       // Это ключевой момент для предотвращения бесконечных циклов обновления
//       tooltipRef.current.style.left = `${tooltipX}px`;
//       tooltipRef.current.style.top = `${tooltipY}px`;
      
//       // Если тултип все еще должен быть видимым, запланируем следующее обновление
//       if (tooltip.show) {
//         animationFrameId = requestAnimationFrame(updateTooltipPosition);
//       }
//     };
    
//     // Запускаем цикл анимации
//     animationFrameId = requestAnimationFrame(updateTooltipPosition);
    
//     // Функция очистки - вызывается при размонтировании компонента
//     // или при изменении зависимостей useEffect
//     return () => {
//       // Отменяем запланированный кадр анимации
//       if (animationFrameId) {
//         cancelAnimationFrame(animationFrameId);
//       }
//     };
//   }, [tooltip.show, tooltip.productId]); // Зависимости эффекта - только показ тултипа и ID продукта
//   // Важно: мы НЕ включаем x и y координаты, избегая повторных запусков эффекта при движении мыши

//   return (<>
    
//     <Masonry gutter="16px" columnsCount={3}>
//       {/* Итерация по массиву изображений */}
//       {images.map((media, index ) => (
//         <div
//           key={media.public_id}
//           className={css.galleryitem}
//           style={{
//             width: "100%", 
//             display: "block"
//           }}
//           onClick={() => openFullscreen(index)}

//           // Обработчики событий мыши для показа/скрытия тултипа
//           onMouseMove={(e) => {
//             // Формируем текст для тултипа из данных медиа-элемента
//             const caption = media.context?.caption || "No caption";
//             const alt = media.context?.alt || "No description";
//             handleMouseMove(e, `${caption} — ${alt}`);
//           }}
//           onMouseLeave={handleMouseLeave}
//         >
//           {/* Условный рендеринг: показываем изображение или видео в зависимости от типа */}
//           {media.resource_type === "image" ? (
//             <img
//               src={media.secure_url}
//               alt={media.context?.alt || "No description"}
//               className={css.galleryimage}
//               // Определяем ориентацию изображения после загрузки
//               onLoad={(e) => handleImageLoad(media.public_id, e)}
//             />
//           ) : (
//             <video
//               src={media.secure_url}
//               autoPlay
//               loop
//               muted
//               playsInline
//               className={css.galleryimage}
//               style={{
//                 width: "100%",
//                 borderRadius: "8px",
//                 display: "block",
//               }}
//             />
//           )}
//         </div>
//       ))}
      
//       {/* Тултип - рендерится только если tooltip.show === true */}
//       {tooltip.show &&  !isMobile && (
//         <div
//           // Привязываем DOM-элемент к рефу для прямого управления
//           ref={tooltipRef}
//           style={{
//             position: "fixed",
//             // Начальная позиция - будет обновляться напрямую через DOM
//             top: tooltip.y + 15,
//             left: tooltip.x + 15,
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             color: "#fff",
//             padding: "6px 10px",
//             borderRadius: "4px",
//             pointerEvents: "none", // Чтобы тултип не перехватывал события мыши
//             whiteSpace: "nowrap",
//             zIndex: 1000,
//             maxWidth: "200px",
//             wordWrap: "break-word",
//           }}
//         >
//           {/* Отображаем информацию о продукте в тултипе */}
//           {tooltip.productId}
//         </div>
//       )} 
//       {fullscreenIndex !== null && (
//   <div
//   style={{
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100vw",
//     height: "100vh",
//     backgroundColor: "rgba(0, 0, 0, 0.95)",
//     zIndex: 9999,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     touchAction: "none", // 🔒 запрет свайпов и зума на мобильных
//     overflow: "hidden",  // 🔒 запрет внутреннего скролла
//   }}
// >

//     <button
//       onClick={closeFullscreen}
//       style={{
//         position: "absolute",
//         top: 20,
//         right: 20,
//         background: "transparent",
//         border: "none",
//         color: "white",
//         fontSize: "28px",
//         cursor: "pointer",
//         zIndex: 10000,
//       }}
//     >
//       ✕
//     </button>

//     {images[fullscreenIndex]?.resource_type === "image" ? (
//     <img
//   src={images[fullscreenIndex].secure_url}
//   alt={images[fullscreenIndex].context?.alt || "No description"}
//   style={{
//     maxWidth: "100vw",
//     maxHeight: "100vh",
//     objectFit: "contain",
//     userSelect: "none",     // 🔒 запрет выделения
//     pointerEvents: "none",  // 🔒 запрет перетаскивания
//   }}
// />

//     ) : (
//       <video
//         src={images[fullscreenIndex].secure_url}
//         autoPlay
//         loop
//         muted
//         playsInline
//         style={{
//           maxWidth: "100%",
//           maxHeight: "100%",
//           borderRadius: "8px",
//           objectFit: "contain"
//         }}
//       />
//     )}
//   </div>
// )}

//     </Masonry>

//  </>
//   );
// };

// export default CloudGallery;
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Masonry from "react-responsive-masonry";
import css from "../CloudGallery/CloudGallery.module.css";
// Импортируем необходимые хуки из React
import { useState, useEffect, useRef, useCallback } from "react";

const CloudGallery = ({ images }) => {
  // Состояние для хранения ориентации изображений (портретная/ландшафтная)
  const [imageSizes, setImageSizes] = useState({});
  
  // Состояние для основной информации тултипа
  const [tooltip, setTooltip] = useState({ 
    show: false,
    x: 0,
    y: 0,
    productId: null
  });

  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  
  // Определяем мобильное устройство
  const [isMobile, setIsMobile] = useState(false);

  // Эффект для определения мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    // Запоминаем текущую позицию скролла
    const scrollY = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
    // Восстанавливаем позицию скролла
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  // Обработчик клика на фоне или изображении для закрытия
  const handleFullscreenClick = (e) => {
    // Закрываем только если клик был по фону или по самому изображению
    if (e.target === e.currentTarget || e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      closeFullscreen();
    }
  };

  useEffect(() => {
    // Этот эффект больше не нужен, так как мы управляем позиционированием в функциях открытия/закрытия
    return () => {
      // Восстанавливаем стили при размонтировании компонента
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.overflow = "";
    };
  }, []); // Убираем зависимость от fullscreenIndex

  const tooltipRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Функция для определения ориентации изображения после его загрузки
  const handleImageLoad = (mediaId, event) => {
    const img = event.target;
    const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
    setImageSizes((prevSizes) => ({
      ...prevSizes,
      [mediaId]: orientation,
    }));
  };

  const handleMouseMove = useCallback((e, productId) => {
    if (isMobile) return; 
    
    mousePositionRef.current = { x: e.pageX, y: e.pageY };
    
    setTooltip(prev => {
      if (!prev.show || prev.productId !== productId) {
        return {
          show: true,
          x: e.pageX,
          y: e.pageY,
          productId
        };
      }
      return prev;
    });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    if (!tooltip.show) return;
    
    let animationFrameId;
    
    const updateTooltipPosition = () => {
      if (!tooltipRef.current || !tooltip.show) return;
      
      const { x, y } = mousePositionRef.current;
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      
      const tooltipX = x + width + 5 > window.innerWidth ? x - width - 15 : x + 15;
      const tooltipY = y + height + 5 > window.innerHeight ? y - height - 15 : y + 15;
      
      tooltipRef.current.style.left = `${tooltipX}px`;
      tooltipRef.current.style.top = `${tooltipY}px`;
      
      if (tooltip.show) {
        animationFrameId = requestAnimationFrame(updateTooltipPosition);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateTooltipPosition);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tooltip.show, tooltip.productId]);

  return (
    <>
      <Masonry gutter="16px" columnsCount={isMobile ? 2 : 3}>
        {images.map((media, index) => (
          <div
            key={media.public_id}
            className={css.galleryitem}
            style={{
              width: "100%", 
              display: "block",
              cursor: "pointer"
            }}
            onClick={() => openFullscreen(index)}
            onMouseMove={(e) => {
              if (!isMobile) {
                const caption = media.context?.caption || "No caption";
                const alt = media.context?.alt || "No description";
                handleMouseMove(e, `${caption} — ${alt}`);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            {media.resource_type === "image" ? (
              <img
                src={media.secure_url}
                alt={media.context?.alt || "No description"}
                className={css.galleryimage}
                onLoad={(e) => handleImageLoad(media.public_id, e)}
                style={{
                  borderRadius: "8px",
                  transition: "transform 0.2s ease"
                }}
              />
            ) : (
              <video
                src={media.secure_url}
                autoPlay
                loop
                muted
                playsInline
                className={css.galleryimage}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  display: "block",
                  transition: "transform 0.2s ease"
                }}
              />
            )}
          </div>
        ))}
      </Masonry>

      {/* Тултип - только для десктопа */}
      {tooltip.show && !isMobile && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: tooltip.y + 15,
            left: tooltip.x + 15,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "10px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 1000,
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          {tooltip.productId}
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div
          onClick={handleFullscreenClick}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "none",
            overflow: "hidden",
            cursor: "pointer",
            margin: 0,
            padding: 0
          }}
        >
          {/* Кнопка закрытия - только для десктопа */}
          {!isMobile && (
            <button
              onClick={closeFullscreen}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                fontSize: "28px",
                cursor: "pointer",
                zIndex: 10000,
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ✕
            </button>
          )}

          {/* Контейнер для медиа */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0
            }}
            onClick={handleFullscreenClick}
          >
            {images[fullscreenIndex]?.resource_type === "image" ? (
              <img
                src={images[fullscreenIndex].secure_url}
                alt={images[fullscreenIndex].context?.alt || "No description"}
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                  display: "block",
                  margin: 0,
                  padding: 0
                }}
                onClick={handleFullscreenClick}
              />
            ) : (
              <video
                src={images[fullscreenIndex].secure_url}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                style={{
                  width: "100vw",
                  height: "100vh",
                  objectFit: "contain",
                  display: "block",
                  margin: 0,
                  padding: 0
                }}
                onClick={handleFullscreenClick}
              />
            )}
          </div>

          {/* Подсказка для мобильных устройств */}
          {isMobile && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "14px",
                textAlign: "center",
                pointerEvents: "none"
              }}
            >
              Нажмите на изображение, чтобы закрыть
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CloudGallery;