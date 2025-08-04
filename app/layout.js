// import "./globals.css";
// import { ColorThemeProvider } from "../components/ColorThemeContext";
// import { PlayerProvider } from "@/context/PlayerContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="manifest" href="/manifest.json" />
//         <meta name="theme-color" content="#0f0f0f" />
//       </head>
//       <body className="w-full ">
//         <PlayerProvider>
//           <ColorThemeProvider>{children}</ColorThemeProvider>
//         </PlayerProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { ColorThemeProvider } from "../components/ColorThemeContext";
import { PlayerProvider } from "@/context/PlayerContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="manifest" href="/manifest.json" />
        <title>Musify</title>
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden"
      >
        <PlayerProvider>
          <ColorThemeProvider>
            <div className="w-full max-w-[1920px] mx-auto">{children}</div>
          </ColorThemeProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
