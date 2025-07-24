import "./globals.css";
import { ColorThemeProvider } from "../components/ColorThemeContext";
import { PlayerProvider } from "@/context/PlayerContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
