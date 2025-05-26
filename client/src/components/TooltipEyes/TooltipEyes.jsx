import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function TooltipEyes({ x, y }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const maxMove = 50; // ограничение движения зрачков
    const xMove = ((clientX - centerX) / centerX) * maxMove;
    const yMove = ((clientY - centerY) / centerY) * maxMove;

    setPos({ x: xMove, y: yMove });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="absolute"
      style={{ top: y, left: x }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {/* SVG Глаз с анимированными зрачками */}
      <svg width="80" height="40" viewBox="0 0 200 100">
        {/* Левый глаз */}
        <circle cx="50" cy="50" r="40" fill="#fff" stroke="#000" strokeWidth="4" />
        <circle
          cx={50 + pos.x}
          cy={50 + pos.y}
          r="10"
          fill="#000"
        />

        {/* Правый глаз */}
        <circle cx="150" cy="50" r="40" fill="#fff" stroke="#000" strokeWidth="4" />
        <circle
          cx={150 + pos.x}
          cy={50 + pos.y}
          r="10"
          fill="#000"
        />
      </svg>
    </motion.div>
  );
}
