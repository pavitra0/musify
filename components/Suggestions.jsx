// import React, { useState } from 'react'
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from 'lucide-react';
// import { useRouter } from 'next/navigation';


// function Suggestions({setShowSuggestions,showSuggestions,suggestions,bgColor,accentColor}) {
// const router = useRouter()
// const [sortableSuggestions,setSortableSuggestions] = useState(suggestions)
// console.log(sortableSuggestions,suggestions)

//   return (
//    <AnimatePresence>
//         {showSuggestions && (
//           <motion.div
//             initial={{ y: "100%", opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: "100%", opacity: 0 }}
//             transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
//             className="fixed bottom-0 left-0 w-full max-h-[100vh] overflow-y-auto z-50 backdrop-blur-md bg-white/5 border-t border-white/10 rounded-t-2xl p-5 shadow-[0_-2px_30px_rgba(0,0,0,0.3)]"
//           >
//             <div className="flex items-center justify-between mb-4 ">
//               <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
//                 You Might Also Like
//               </h3>
//               <button
//                 onClick={() => setShowSuggestions(false)}
//                 className="text-gray-300 hover:text-white transition"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4">
//               {suggestions.length === 0 ? (
//                 <p className="text-center text-gray-400 text-sm">
//                   No suggestions found.
//                 </p>
//               ) : (
//                 sortableSuggestions.map((sugg) => (
//                   <div
//                     key={sugg.id}
//                     className="flex items-center gap-4 hover:bg-white/15 transition p-3 rounded-lg shadow-md cursor-pointer"
//                     onClick={() => router.push(`/song/${sugg.id}`)}
//                     style={{ backgroundColor: bgColor }}
//                   >
//                     <img
//                       src={sugg.image?.[1]?.url || sugg.image?.[0]?.url}
//                       alt={sugg.title}
//                       className="w-16 h-16 object-cover rounded-md"
//                     />
//                     <div className="flex-1 overflow-hidden">
//                       <p
//                         className="text-white font-medium truncate"
//                         style={{ color: accentColor }}
//                       >
//                         {sugg.name}
//                       </p>
//                       <p
//                         className="text-gray-300 text-sm truncate"
//                         style={{ color: accentColor }}
//                       >
//                         {sugg?.artists?.primary[0]?.name || "Unknown Artist"}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//   )
// }

// export default Suggestions

"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactSortable } from "react-sortablejs";

function Suggestions({
  setShowSuggestions,
  showSuggestions,
  suggestions,
  bgColor,
  accentColor,
}) {
  const router = useRouter();
  const [sortableSuggestions, setSortableSuggestions] = useState(suggestions);

useEffect(()=>{
  setSortableSuggestions(suggestions)
},[suggestions])

  return (
    <AnimatePresence>
      {showSuggestions && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
          className="fixed bottom-0 left-0 w-full max-h-[100vh] overflow-y-auto z-50 backdrop-blur-md bg-white/5 border-t border-white/10 rounded-t-2xl p-5 shadow-[0_-2px_30px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between mb-4 ">
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
              You Might Also Like
            </h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-300 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {sortableSuggestions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm">
              No suggestions found.
            </p>
          ) : (
            <ReactSortable
              list={sortableSuggestions}
              setList={setSortableSuggestions}
              animation={150}
              ghostClass="opacity-50"
              className="flex flex-col gap-4"
            >
              {sortableSuggestions.map((sugg) => (
                <div
                  key={sugg.id}
                  className="flex items-center gap-2 hover:bg-white/15 transition p-3 rounded-lg shadow-md cursor-pointer"
                  onClick={() => router.push(`/song/${sugg.id}`)}
                  style={{ backgroundColor: bgColor }}
                >
                  <img
                    src={sugg.image?.[1]?.url || sugg.image?.[0]?.url}
                    alt={sugg.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p
                      className="text-white font-medium truncate"
                      style={{ color: accentColor }}
                    >
                      {sugg.name}
                    </p>
                    <p
                      className="text-gray-300 text-sm truncate"
                      style={{ color: accentColor }}
                    >
                      {sugg?.artists?.primary[0]?.name || "Unknown Artist"}
                    </p>
                  </div>
                </div>
              ))}
            </ReactSortable>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Suggestions;
