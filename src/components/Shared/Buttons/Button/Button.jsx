import s from "./Button.module.scss";

const Button = ({ children, onClick, disabled, title }) => {
  return (
    <button
      type="button"
      className={s.button}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
