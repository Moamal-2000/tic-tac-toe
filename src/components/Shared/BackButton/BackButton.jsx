import SvgIcon from "../SvgIcon";
import s from "./BackButton.module.scss";

const BackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className={s.backButton}
      onClick={onClick}
      aria-label="Back to previous menu"
    >
      <SvgIcon name="arrowLeft" />
    </button>
  );
};

export default BackButton;
