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
import { Instagram, Mail, Phone } from "lucide-react"; // предполагаю, что иконки берутся отсюда

export default function SocialButtons() {
  const buttons = [
    { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
    { icon: <Mail size={15} className="text-[#919191]" />, link: "mailto:example@mail.com" },
    { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+1234567890" },
  ];

  const text = "сайт собирается. мы строим и продаем скейтпарки. пишите нам в соцсети 10.2025";

  return (
    <>
      {/* --- Desktop: статичный баннер --- */}
      <div className="hidden sm:flex fixed top-0 left-0 w-full h-6 bg-red-400 items-center justify-center z-40">
        <span className="text-sm font-futura font-medium">{text}</span>
      </div>

      {/* --- Mobile: бесконечная бегущая строка --- */}
      <div className="sm:hidden fixed   top-0 left-0 w-full h-6 bg-red-400 overflow-hidden z-40">
        <div className="marquee">
          <div className="track ">
            <span className="text-sm font-futura font-medium" >{text} </span>
            <span className="text-sm font-futura font-medium" >{text} </span>
            <span className="text-sm font-futura font-medium">{text} </span>
            <span className="text-sm font-futura font-medium" >{text} </span>
          </div>
        </div>
      </div>

      {/* --- Хедер --- */}
      <div className="fixed top-6 left-0 w-full h-10 bg-black flex items-center justify-between shadow-md z-50 px-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 opacity-50 drop-shadow-lg" />
        </div>

        <div className="flex items-center gap-2">
          {buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-xl shadow-lg flex items-center justify-center w-9 h-9 rounded transition-all hover:bg-white/30"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </>
  );
}

//   // const location = useLocation();

//   // // Определяем текст в зависимости от URL
//   // let pageSuffix = "";
//   // if (location.pathname.includes("ramps")) {
//   //   pageSuffix = "рампи";
//   // } else if (location.pathname.includes("sets")) {
//   //   pageSuffix = "/sets";
//   // }
//   // else if (location.pathname.includes("skateparks")) {
//   //   pageSuffix = "скейтпарки";
//   // }
//   // else if (location.pathname.includes("diys")) {
//   //   pageSuffix = "/diy";
//   // }

//   const buttons = [
//     { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
//     { icon: <Mail size={15} className="text-[#919191]" />, link: "mailto:example@mail.com" },
//     { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+1234567890" },
//   ];

//   return (
//     <>
//       {/* Верхняя зелёная кнопка */}
 
//       {/* Хедер */}
//   <div className="fixed top-4 left-0 w-full h-10 bg-black flex items-center justify-between  shadow-md z-50">
//         <div className="flex items-center space-x-2">
//           <img src="/logo.png" alt="Logo" className="sm:h-10 sm:w-auto opacity-50 drop-shadow-lg" />
//            {/* <span   style={{
//     fontSize: "clamp(50px, 10vw, 0px)",
   
//   }} className="text-[#919191] font-futura font-bold tracking-[-4px] ">parkramps</span> */}
//            {/* {pageSuffix && (
//     <span style={{
//     fontSize: "clamp(30px, 10vw, 30px)",}} className="absolute tracking-[-2px] bottom-0 top-3 left-[60px]  transform -translate-x-1/2 text-[#919191] font-futura text-xs sm:text-sm">
//       {pageSuffix}
//     </span> */}
//   {/* )} */}
//         </div>
// {/* <div className="flex space-x-4"> <div className="fixed">
//       <button
//         onClick={() => (window.location.href = "/projectpage")}
//         className="fixed top-0 left-0 w-full h-[17px] bg-green-700 flex items-center text-lg font-futura font-light justify-center z-40"
//       >
//         присоеденяйся к развитию экстрима в Украине
//       </button>
// </div>
//          */} <div className="flex "> <span
//   className="hidden sm:flex fixed top-0 left-0 w-full h-[17px] bg-green-700 
//   items-center text-lg font-futura font-medium justify-center z-40"
// >
//   сайт собирается. мы строим и продаем скейтпарки. пишите нам в соцсети 10.2025
// </span>

// {/* Бегущая строка — только для мобильных */}
// <div className="sm:hidden fixed top-0 left-0 w-full h-[17px] bg-green-700 overflow-hidden z-40">
//   <div className="animate-marquee whitespace-nowrap text-lg font-futura font-medium text-center">
//     сайт собирается. мы строим и продаем скейтпарки. пишите нам в соцсети 10.2025
//   </div>
// </div>
             

//           {buttons.map((button, index) => (
//             <motion.a
//               key={index}
//               href={button.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className=" backdrop-blur-xl shadow-lg flex items-center justify-center w-[35.5px] h-[35.5px] transition-all hover:bg-white/30"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               {button.icon}
//             </motion.a>
//           ))}

//           {/* <HeaderButton
//             label={buttonLabel}
//             onClick={onButtonClick}
//             animationProps={buttonAnimationProps}
//           /> */}
//         </div>
//       </div>    
//     </>
//   );
// }
