import Header from "@/components/Header/Header";
import MainMenu from "@/components/MainMenu/MainMenu";
import UpdateNotification from "@/components/PWA/UpdateNotification/UpdateNotification";
import { METADATA } from "@/data/metadata";
import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../../styles/globals.scss";

export const metadata = METADATA;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} dir={dir}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body>
          <MainMenu />
          <Header />
          {children}
          <UpdateNotification />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
