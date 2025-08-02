import "./globals.css";
import { ColorThemeProvider } from "../components/ColorThemeContext";
import { PlayerProvider } from "@/context/PlayerContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1DB954" />
      </head>
      <body className="w-full ">
        <PlayerProvider>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
