import { Link } from "@/i18n/navigation";
import GitHubButton from "../Shared/Buttons/GitHubButton/GitHubButton";
import s from "./Header.module.scss";
import HeaderButtons from "./HeaderButtons/HeaderButtons";
import Logo from "./Logo/Logo";

const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.wrapper}>
        <Link href="/" className={s.logo}>
          <Logo />
        </Link>
        <GitHubButton />
      </div>

      <HeaderButtons />
    </header>
  );
};

export default Header;
