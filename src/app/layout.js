import Header from "@/components/Header/Header";
import MainMenu from "@/components/MainMenu/MainMenu";
import UpdateNotification from "@/components/PWA/UpdateNotification/UpdateNotification";
import { METADATA } from "@/data/metadata";
import "../styles/globals.scss";

export const metadata = METADATA;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainMenu />
        <Header />
        {children}
        <UpdateNotification />
      </body>
    </html>
  );
}
