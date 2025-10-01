import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ items, defaultOpenIndexDesktop = 0, forceCloseTrigger }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 👉 Когда forceCloseTrigger меняется — закрываем аккордеон
  useEffect(() => {
    setOpenIndex(null);
  }, [forceCloseTrigger]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="w-full">
            <button
              className="cursor-pointer relative w-full flex justify-between items-center py-3 text-left text-gray-900 hover:text-gray-300 transition-colors group"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-futura font-medium text-[#717171]">{item.title}</span>
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              <span
                className={`absolute left-0 w-full h-[1px] bg-gray-500 transition-transform duration-300`}
                style={{
                  bottom: isOpen ? "-8px" : "0px",
                  transform: isOpen ? "translateY(100%)" : "translateY(0)",
                  opacity: isOpen ? 0 : 1
                }}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-5 text-[#717171] font-futura relative">
                {item.content}
              </div>
              {isOpen && <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-500" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
