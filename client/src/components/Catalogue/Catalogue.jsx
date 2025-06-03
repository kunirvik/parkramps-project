import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
const products = [{
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
      image: "/images/diy/kicker.png",
    name: "рампы",
    hoverImage:  ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  }, 
  {
    id: 3,
    name: "фигуры и комплекты фигур",
    category: "sets",
    image: "/images/sets/box.png",
    hoverImage: ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "A bold design statement."
  },
  
  {
    id: 4,
     category: "diy",
    name: "сделай сам diy",
   image: "/images/diy/ramp95garagemain.png",
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
    setTooltip({
      show: true,
      x: e.clientX,
      y: e.clientY,
      productId
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  const handleClick = async (product, e) => {

   
    // Hide tooltip immediately on click
    setTooltip({ ...tooltip, show: false });
    
    // Get the clicked image element
    const imgElement = e.currentTarget.querySelector('img');
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
    await preloadImage(product.image);
  } catch (error) {
    console.warn('Не удалось предзагрузить изображение:', error);
  }
    const firstProductInCategory = products
    .filter(p => p.category === product.category)
    .reduce((minProduct, current) => current.id < minProduct.id ? current : minProduct, product);
    setSelectedProduct(product.id);
 setTimeout(() => {
    // Навигация по категории
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
  }, 400);
};

  useEffect(() => {
    // Запускаем анимацию исчезновения перед снятием лоадинга
    const timer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []); 

  return (

    <div className="  bg-black  grid mt-10 grid-cols-2 gap-6 p-4 relative">
 {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
 <SocialButtons
        buttonLabel="gallery"
        onButtonClick={handleExit}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />
      {products.map((product) => (
        <div
          key={product.id}
          ref={(el) => {
            if (el) productsRef.current.set(product.id, el);
          }}
          className={`cursor-pointer h-90  flex justify-center items-center p-4
            relative overflow-hidden
            transition-all duration-400 ease-in-out
            ${selectedProduct !== null
              ? selectedProduct === product.id
                ? "scale-100"
                : "scale-0 pointer-events-none"
              : "scale-100"}`}
          onClick={(e) => handleClick(product, e)}
          onMouseMove={(e) => handleMouseMove(e, product.id)}
          onMouseLeave={handleMouseLeave}
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
          
          <div className="flex flex-col items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-100 h-80 object-contain transition-all duration-300"
            />
          </div>
        </div>
      ))}

      {/* Tooltip that follows cursor */}
      {tooltip.show && (
        <div 
          className="absolute  font-futura font-light z-10 bg-black text-white px-10 py-2  shadow-lg pointer-events-none transition-opacity opacity-90"
          style={{ 
            left: `${tooltip.x + 10}px`, 
            top: `${tooltip.y + 10}px`,
            transform: 'translate(0, -50%)'
          }}
        >
          {products.find(p => p.id === tooltip.productId)?.name}
        </div>
      )}
    </div>
  );
}