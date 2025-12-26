import React from "react";
import { motion } from "framer-motion";

function AnimatedButton({ children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        px-3 py-2 text-sm 
        sm:px-4 sm:py-2 sm:text-base
        md:px-6 md:py-3 md:text-lg 
        lg:px-8 lg:py-4 lg:text-xl 
        rounded-xl font-semibold   
        hover:brightness-110 
        transition-all duration-200
      "
    >
      {children}
    </motion.button>
  );
}

export default AnimatedButton;
