import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ items, defaultOpenIndex = null }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="w-full relative">
            <button
              className="relative w-full flex justify-between items-center py-3 text-left text-gray-900 hover:text-blue-600 transition-colors group"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-futura text-[#717171] font-medium">{item.title}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}

              {/* Линия всегда есть, но у открытого блока она уезжает вниз */}
              <span
                className={`absolute left-0 w-full h-[1px] bg-gray-200 transition-transform duration-300`}
                style={{
                  bottom: isOpen ? "-8px" : "0px",
                  transform: isOpen ? "translateY(100%)" : "translateY(0)",
                  opacity: isOpen ? 0 : 1
                }}
              />
            </button>

            {/* Контент */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-0 text-[#717171] font-futura relative">
                {item.content}

                {/* Когда открыт — линия появляется под текстом */}
                {isOpen && (
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-200" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Accordion;