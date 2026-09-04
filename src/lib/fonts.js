import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Inter/Inter-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Inter/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Inter/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-inter-family",
  display: "swap",
});

export const vazirmatn = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Vazirmatn/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Vazirmatn/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Vazirmatn/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Vazirmatn/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn-family",
  display: "swap",
});

export const digital7 = localFont({
  src: [
    {
      path: "../../public/assets/fonts/digital-7/digital-7-mono.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-digital7-family",
  display: "swap",
});
