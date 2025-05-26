import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// import { PiEyesFill } from "react-icons/pi";
import TooltipEyes from "../TooltipEyes/TooltipEyes"; // путь подстрой под себя

const words = ["Welcome", "Explore", "Discover", "Parkramps"];

export default function MenuPark() {
  const [index, setIndex] = useState(0);
  const [tooltip, setTooltip] = useState({ visible: false, x:0 , y: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setTooltip({ visible: true, x: e.clientX , y: e.clientY  });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <div className="relative w-full  bg-white-200  h-screen flex items-center justify-center overflow-visible ">
      {/* Фоновое видео */}
      {/* <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover grayscale"
      >
        <source src="/tlprshrt.mp4" type="video/mp4" />
      </video> */}
      
      {/* Анимированный текст */}
      <div className="relative z-10 flex flex-col items-center overflow-visible">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className={`text-[150px]  font-futura bg-clip-text tracking-[-10px] mb-6 cursor-pointer ${index === words.length - 1 ? " font-bold text-transparent bg-black/50" : "font-medium  text-transparent  bg-white/50"}`}
          onMouseMove={handleMouseMove}
          style={{ padding: "0 20px" }} 
          onMouseLeave={handleMouseLeave}
        >
          {words[index]}
        </motion.h1>
        {/* <span className="text-[250px] font-bold text-transparent bg-clip-text bg-white/30 ">skatepark</span>
         */}

             {/* Подсказка */}
             {/* {tooltip.visible && (
          <motion.div
            ref={tooltipRef}
            className="absolute bg-black font-futura font-medium text-white text-sm px-3 py-1 rounded-lg shadow-lg "
            style={{ top: tooltip.y, left: tooltip.x }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
          <PiEyesFill />
          </motion.div>
        )} */}

{tooltip.visible && (
  <TooltipEyes x={tooltip.x} y={tooltip.y} />
)}



        {/* Кнопка перехода */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-6 py-3 bg-black/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-blue-200 cursor-pointer"
          onClick={() => window.location.href = "/catalogue"}
        >
          shop
        </motion.button>
      </div>
    </div>
  );
}
