import Header from "@/components/Header/Header";
import PWAInit from "@/components/PWA/PWAInit";
import UpdateNotification from "@/components/Shared/UpdateNotification/UpdateNotification";
import { METADATA } from "@/data/metadata";
import "../styles/globals.scss";

export const metadata = METADATA;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <UpdateNotification />
        <PWAInit />
      </body>
    </html>
  );
}
