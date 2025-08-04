import "./globals.css";
import { ColorThemeProvider } from "../components/ColorThemeContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap" });



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
        className={`min-h-screen ${josefin.className} bg-black text-white font-sans antialiased overflow-x-hidden`}
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
