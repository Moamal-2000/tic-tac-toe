import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import GitHubButton from "../Shared/Buttons/GitHubButton/GitHubButton";
import s from "./Header.module.scss";
import HeaderButtons from "./HeaderButtons/HeaderButtons";
import Logo from "./Logo/Logo";

const Header = () => {
  const t = useTranslations("header");
  const logoTitle = t("logo_home");

  return (
    <header className={s.header}>
      <div className={s.wrapper}>
        <Link
          href="/"
          className={s.logo}
          title={logoTitle}
          aria-label={logoTitle}
        >
          <Logo />
        </Link>
        <GitHubButton />
      </div>

      <HeaderButtons />
    </header>
  );
};

export default Header;
