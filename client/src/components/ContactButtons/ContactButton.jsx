import { motion } from "framer-motion";
import { Instagram, Mail, Phone } from "lucide-react"; // предполагаю, что иконки берутся отсю
export default function ContactButton({ }) {
const buttons = [
    { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
    { icon: <Mail size={15} className="text-[#919191]" />, link: "mailto:example@mail.com" },
    { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+1234567890" },
  ];
    return (<><div className="flex space-x-4">
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
          ))}</div></>
        )}

    