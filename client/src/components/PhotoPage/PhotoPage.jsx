


import { useEffect, useState } from "react";
import CloudGallery from "../CloudGallery/CloudGallery";
import { useNavigate } from "react-router-dom";
import { useTransition, animated } from "@react-spring/web";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons"; // Подключаем SocialButtons

const PhotoPage = () => {
  const [images, setImages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const navigate = useNavigate();


const API = import.meta.env.VITE_API_URL;
// const API = "https://parkramps-project.onrender.com";

console.log(import.meta.env);
console.log("API URL:", API);




  const exitTransition = useTransition(!isExiting, {
    from: { transform: "translateY(0%)", opacity: 1 },
    leave: { transform: "translateY(-100vh)", opacity: 0 },
    config: { tension: 200, friction: 25, duration: 1000 },
    onRest: () => {
      if (isExiting) {
        window.scrollTo(0, 0);
        navigate("/catalogue");
      }
    },
  });

  const handleExit = () => {
    setIsExiting(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const galleryTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(galleryTimer);
    };
  }, []);

  useEffect(() => {
    const tagsQuery = selectedTags.length > 0 ? `?tags=${selectedTags.join(",")}` : "";
fetch(`${API}api/gallery${tagsQuery}`)
  .then(async (res) => {
    const text = await res.text();
    console.log('Raw response:', text);  // Выведет что пришло реально
    try {
      const data = JSON.parse(text);
      setImages(data);
      setIsFadingOut(true);
      setTimeout(() => setIsLoading(false), 800);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
      throw e;
    }
  })
  .catch((err) => console.error("Ошибка загрузки изображений:", err));
}, [selectedTags]);

  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

      {/* Передаем handleExit в SocialButtons */}
     {/* Передаем название кнопки, обработчик клика и анимацию */}
     <SocialButtons
        buttonLabel="shop"
        onButtonClick={handleExit}
        buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
      />

<div className="min-h-screen  mt-10 font-futura ">

        {exitTransition(
          (styles, item) =>
            item && (
              <animated.div style={styles} className="w-full bg-black h-full">
                <CloudGallery images={images} />
              </animated.div>
            )
        )}
      </div>

      <div className="z-9 text-[#919190] font-futura font-light text-[17px]  w-full flex items-center justify-center bg-black">
        <span>2015-2025</span>
      </div>
    </>
  );
};

export default PhotoPage;
