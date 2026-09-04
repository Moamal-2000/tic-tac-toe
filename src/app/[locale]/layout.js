import Header from "@/components/Header/Header";
import MainMenu from "@/components/MainMenu/MainMenu";
import UpdateNotification from "@/components/PWA/UpdateNotification/UpdateNotification";
import ConnectionLabelAlert from "@/components/Shared/ConnectionLabelAlert/ConnectionLabelAlert";
import { METADATA } from "@/constants/metadata";
import { routing } from "@/i18n/routing";
import { digital7, inter, vazirmatn } from "@/lib/fonts";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../../styles/global.scss";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html
        lang={locale}
        dir={dir}
        className={`${inter.variable} ${vazirmatn.variable} ${digital7.variable}`}
      >
        <body>
          <div className="main-content">
            <MainMenu />
            <Header />
            {children}
          </div>

          <UpdateNotification />
          <ConnectionLabelAlert />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
