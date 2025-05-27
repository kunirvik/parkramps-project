// import { motion } from "framer-motion";
// import { Instagram, Mail, Phone } from "lucide-react";

// export default function SocialButtons() {
//   const buttons = [
//     { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com" },
//     { icon: <Mail size={15} className="text-[#919191]" />, link: "mailto:example@mail.com" },
//     { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+1234567890" }
   
//   ];

//   return (
//     <div className="fixed top-0 left-0 w-full h-10 bg-black flex items-center justify-between px-4 shadow-md z-50">
//       <div className="flex items-center">
//         <img src="/logo.png" alt="Logo" className="h-10 w-auto  opacity-50 drop-shadow-lg" />
//       </div>
//       <div className="flex space-x-4">
//         {buttons.map((button, index) => (
//           <motion.a
//             key={index}
//             href={button.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-1.5 backdrop-blur-xl  shadow-lg flex items-center justify-center w-[35.5px] h-[35.5px] transition-all hover:bg-white/30"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             {button.icon}
//           </motion.a>
//         ))}
//       </div>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react";
import HeaderButton from "../HeaderButton/HeaderButton"; // Подключаем новую кнопку
import Attention from "../Attention/Attention";
export default function SocialButtons({ buttonLabel, onButtonClick, buttonAnimationProps }) {
  const buttons = [
    { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
    { icon: <Mail size={15} className="text-[#919191]" />, link: "mailto:example@mail.com" },
    { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+1234567890" },
  ];

  return (
    <>
      {/* Черная полоска */}
      <div className="fixed top-0 left-0 w-full h-10 bg-black flex items-center justify-between px-4 shadow-md z-50">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto opacity-50 drop-shadow-lg" />
        </div>
        <div className="flex space-x-4">
          {buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 backdrop-blur-xl shadow-lg flex items-center justify-center w-[35.5px] h-[35.5px] transition-all hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {button.icon}
            </motion.a>
          ))}

          {/* Используем новую кнопку */}
          <HeaderButton label={buttonLabel} onClick={onButtonClick} animationProps={buttonAnimationProps} />
        </div>
      </div>

      {/* Зеленая полоса сразу под черной */}
      <button
        onClick={() => window.location.href = "/projectpage"}
        className="fixed top-10 left-0 w-full h-[17px] bg-green-700 flex items-center justify-center z-40"
      >
        присоеденяйся к развитию экстрима в Украине
      </button>
    </>
  );
}
