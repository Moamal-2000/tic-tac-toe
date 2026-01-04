import s from "./Logo.module.scss";

const Logo = () => {
  return (
    <div className={s.logo}>
      <ul className={s.logoGrid} role="presentation" aria-hidden="true">
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>

      <p className={s.logoText}>
        Tic Tac Toe
        <br />
        <span>(XO) game</span>
      </p>
    </div>
  );
};

export default Logo;
