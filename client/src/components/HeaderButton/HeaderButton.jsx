import { motion } from "framer-motion";

export default function HeaderButton({ label, onClick, animationProps }) {
  return (
    <motion.button
      className="cursor-pointer p-1.5 backdrop-blur-xl shadow-lg flex items-center justify-center transition-all hover:bg-white/30"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, opacity: 0.8 }}
      {...animationProps} // Передаем кастомные анимации
      onClick={onClick}
    >
      <div className="title-bar text-[#919191] font-medium">{label}</div>
    </motion.button>
  );
}
