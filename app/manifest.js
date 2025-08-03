// app/manifest.ts

export default function manifest() {
  return {
    name: "Musify",
    short_name: "Musify",
    start_url: "/",
    display: "standalone",
    theme_color: "#1DB954",
    background_color: "#ffffff",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
