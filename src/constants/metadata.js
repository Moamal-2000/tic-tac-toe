import { BASE_URL } from "./env";

const TITLE = "Advanced Tic Tac Toe";

const DESCRIPTION =
  "A fun and strategic Tic Tac Toe game with board sizes up to 5x5 and exciting power-ups like Freeze, Bomb, and Swap. Learn how to play, challenge a friend, and enjoy a new level of competition!";

const KEYWORDS = [
  "advanced tic tac toe",
  "tic tac toe with power ups",
  "play tic tac toe online",
  "5x5 tic tac toe",
  "4x4 tic tac toe",
  "custom board tic tac toe",
  "tic tac toe strategy game",
  "multiplayer tic tac toe",
  "online tic tac toe game",
  "interactive tic tac toe",
  "freeze bomb swap tic tac toe",
  "modern tic tac toe game",
  "fun tic tac toe variations",
  "how to play tic tac toe with powers",
  "play tic tac toe with friends",
];

const AUTHOR = "Moamal Alaa Kareem";

const PWA_METADATA = {
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: TITLE },
  icons: {
    icon: [
      {
        url: "/assets/images/PWA/icons/maskable-icon.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        url: "/assets/images/PWA/icons/maskable-icon.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
    apple: [
      {
        url: "/assets/images/PWA/icons/maskable-icon.webp",
        sizes: "180x180",
        type: "image/webp",
      },
    ],
  },
};

export const GLOBAL_METADATA = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: AUTHOR }],
  publisher: AUTHOR,
  creator: AUTHOR,
  other: { google: "notranslate" },
};

export function getOpenGraphMetadata(pagePath = "") {
  const url = pagePath ? `${BASE_URL}/${pagePath}` : BASE_URL;

  return {
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      type: "website",
      locale: "en_US",
      siteName: TITLE,
      authors: [AUTHOR],
      images: [
        {
          url: `${BASE_URL}/assets/images/og-image.webp`,
          type: "image/webp",
          alt: "Tic Tac Toe Logo",
          width: 1200,
          height: 500,
        },
      ],
    },
  };
}

export const METADATA = { ...GLOBAL_METADATA, ...PWA_METADATA };
