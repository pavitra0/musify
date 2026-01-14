import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { ColorThemeProvider } from "../components/ColorThemeContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { Josefin_Sans } from "next/font/google";
import SideBar from "@/components/SideBar";


const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap" });



export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="UTF-8" />
    <link rel="icon" href="/favicon-32x32.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f0f0f" />
        <link rel="manifest" href="/manifest.json" />
        <title>Musify</title>
      </head>
      <body
        suppressHydrationWarning
        className={`min-h-screen ${josefin.className} bg-black text-white font-sans antialiased overflow-x-hidden`}
      >
        <PlayerProvider>
          <ColorThemeProvider>
            <div className="flex w-full max-w-[1920px] mx-auto"><SideBar />
            
                <main className="ml-60 flex-1 min-h-screen bg-[radial-gradient(circle_at_top_left,#4c1d95_0%,#1f1028_40%,#000_75%)]">

                {children}
              </main></div>
            <Analytics />
          </ColorThemeProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
