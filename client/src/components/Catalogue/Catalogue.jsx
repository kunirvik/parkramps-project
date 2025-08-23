import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { gsap } from "gsap";

const products = [
  {
    id: 1,
     category: "skateparks",
    name: "скейтпарки",
    image:"/images/skateparks/park.png",
    hoverImage:  ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  },
 
  {
    id: 2,
      category: "ramps",  
      image: "/images/sets/kicker2.webp",
    name: " фигуры которые вы сможете собрать своими руками, материал полностью размечен и подготовлен, так что вы сможете собрать фигуру без проблем по заранее подготовленному чертежу и обкатать её уже в считаные часы",
    hoverImage:  ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  }, 
  {
    id: 3,
    name: "фигуры и комплекты фигур",
    category: "sets",
    image: "/images/sets/box.webp",
    hoverImage: ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "A bold design statement."
  },
  
  {
    id: 4,
     category: "diy",
    name: "сделай сам diy",
   image: "/images/ramps/ramp95garagemain.png",
    hoverImage:  ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  }
];

export default function Catalogue() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, productId: null });
  const [animatedLines, setAnimatedLines] = useState(false);
  const productsRef = useRef(new Map());
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tooltipRef = useRef(null);

  const [mobileTooltipProductId, setMobileTooltipProductId] = useState(null);
const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;


  const handleExit = () => {
    console.log("handleExit вызван!");
    setIsFadingOut(true);
    setTimeout(() => {
      navigate("/photopage");
    }, 500);
  };

// В Catalogue.jsx, перед навигацией
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;

  });
};

  // Start animation when component mounts
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setAnimatedLines(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Track mouse position for tooltip
const handleMouseMove = (e, productId) => {
  const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
  const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
  const padding = 10;
  

  let x = e.clientX + padding;
  let y = e.clientY;

  // Проверка выхода за правый край
  if (x + tooltipWidth > window.innerWidth) {
    x = e.clientX - tooltipWidth - padding;
  }

  // Проверка выхода за нижний край
  if (y + tooltipHeight > window.innerHeight) {
    y = window.innerHeight - tooltipHeight - padding;
  }

  setTooltip({
    show: true,
    x,
    y,
    productId
  });
};


  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

const handleClick = async (product, e) => {
  if (isMobile) {
    if (mobileTooltipProductId !== product.id) {
      setMobileTooltipProductId(product.id);
      return;
    } else {
      setMobileTooltipProductId(null);
    }
  }

  setTooltip({ ...tooltip, show: false });

  const imgElement = e.currentTarget.querySelector("img");
  const imgRect = imgElement.getBoundingClientRect();

  const imageData = {
    id: product.id,
    src: product.image,
    rect: {
      top: imgRect.top,
      left: imgRect.left,
      width: imgRect.width,
      height: imgRect.height,
    },
  };

  try {
    // дождёмся загрузки
    await preloadImage(product.image);

    // добавим паузу в 500ms
    await new Promise((res) => setTimeout(res, 500));

    // теперь только делаем navigate
    switch (product.category) {
      case "sets":
        navigate(`/product/sets/1?view=0`, { state: { imageData } });
        break;
      case "ramps":
        navigate(`/product/diy/1?view=0`, { state: { imageData } });
        break;
      case "skateparks":
        navigate(`/product/skateparks/1?view=0`, { state: { imageData } });
        break;
      case "diy":
        navigate(`/product/ramps/1?view=0`, { state: { imageData } });
        break;
      default:
        console.warn("Неизвестная категория:", product.category);
    }
  } catch (err) {
    console.warn("Ошибка предзагрузки", err);
    navigate(`/product/${product.category}/1?view=0`, { state: { imageData } });
  }
};



useEffect(() => {
  if (tooltip.show && tooltipRef.current) {
    gsap.fromTo(
      tooltipRef.current,
      {
        opacity: 0,
        scaleX: 0.7,
        scaleY: 0.5,
        transformOrigin: "top left",
      },
      {
        opacity: 0.95,
        scaleX: 1,
        scaleY: 1,
        duration: 0.6, // медленнее
        ease: "power3.out",
      }
    );
  }
}, [tooltip.show]);


useEffect(() => {
  if (mobileTooltipProductId) {
    const timer = setTimeout(() => {
      setMobileTooltipProductId(null);
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [mobileTooltipProductId]);


  useEffect(() => {
    // Запускаем анимацию исчезновения перед снятием лоадинга
    const timer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []); 

  return (<>

   <div className="bg-black overflow-hidden relative min-h-screen flex flex-col">
 
  
  <SocialButtons
    buttonLabel="gallery"
    onButtonClick={handleExit}
    buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
  />
   {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
  {/* Контейнер для карточек с flex-grow */}
  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 p-14 sm:p-2 mt-0 sm:mt-10">
    {products.map((product) => (
      <div
        key={product.id}
        ref={(el) => {
          if (el) productsRef.current.set(product.id, el);
        }}
        className={`cursor-pointer flex justify-center items-center p-2 sm:p-4
          relative overflow-hidden
          transition-all duration-400 ease-in-out
          h-40 sm:h-60 md:h-80 lg:h-90
          ${selectedProduct !== null
            ? selectedProduct === product.id
              ? "scale-100"
              : "scale-0 pointer-events-none"
            : "scale-100"}`}
        onClick={(e) => handleClick(product, e)}
       
      >
        {/* Animated border lines */}
        <div className={`absolute inset-0 pointer-events-none`}>
          {/* Top line */}
          <div
            className={`absolute top-0 left-0 h-px bg-gray-300 transition-all duration-1000 ease-out
              ${animatedLines ? 'w-full' : 'w-0'}`}
          ></div>
          
          {/* Right line - delayed animation */}
          <div
            className={`absolute top-0 right-0 w-px bg-gray-300 transition-all duration-1000 ease-out delay-300
              ${animatedLines ? 'h-full' : 'h-0'}`}
          ></div>
          
          {/* Bottom line - delayed animation */}
          <div
            className={`absolute bottom-0 right-0 h-px bg-gray-300 transition-all duration-1000 ease-out delay-500
              ${animatedLines ? 'w-full' : 'w-0'}`}
            style={{ transform: 'translateX(-100%)' }}
          ></div>
          
          {/* Left line - delayed animation */}
          <div
            className={`absolute bottom-0 left-0 w-px bg-gray-300 transition-all duration-1000 ease-out delay-700
              ${animatedLines ? 'h-full' : 'h-0'}`}
            style={{ transform: 'translateY(-100%)' }}
          ></div>
        </div>
        
  <div className="flex flex-col items-center w-full h-full relative">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-contain transition-all duration-300"
    onMouseMove={!isMobile ? (e) => handleMouseMove(e, product.id) : undefined}
    onMouseLeave={!isMobile ? handleMouseLeave : undefined}
  />

  {/* Подсказка внутри карточки — только для мобилок */}
  {isMobile && mobileTooltipProductId === product.id && (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 
                  bg-white/90 text-black text-base sm:text-lg 
                  px-4 py-2 rounded-xl shadow-xl animate-fadeIn 
                  font-light leading-snug w-[90%] max-w-xs text-center z-20">
      {product.name}
    </div>
  )}
</div>

      </div>
    ))}
  </div>
  
{tooltip.show && (
  <div
    ref={tooltipRef}
    style={{
      left: `${tooltip.x}px`,
      top: `${tooltip.y}px`,
    }}
    className="absolute transform -translate-y-1/2 font-futura font-light z-10 bg-white w-[400px] h-[200px] text-black px-6 sm:px-10 py-2 shadow-lg pointer-events-none text-sm sm:text-base"
  >
    {products.find(p => p.id === tooltip.productId)?.name}
  </div>
)}

  
  {/* Дата по центру внизу */}
  <div className="flex justify-center items-center py-4 sm:py-6 bg-black">
    <span className="text-[#919190] font-futura font-light text-sm sm:text-[17px]">
      2015-2025
    </span>
  </div>
</div></>)}