import React from 'react'
import {motion} from 'framer-motion'

function AnimatedButton({children}) {
  return (
         <motion.button
         whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }} 
          className='p-4'
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
       >

     {children}
          </motion.button>
  )
}

export default AnimatedButton