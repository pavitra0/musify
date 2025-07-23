import './globals.css';
import { ColorThemeProvider } from '../components/ColorThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ColorThemeProvider>{children}</ColorThemeProvider>
      </body>
    </html>
  );
}
