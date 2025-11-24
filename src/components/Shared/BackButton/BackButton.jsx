import s from "./BackButton.module.scss";

const BackButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className={s.backButton}
      onClick={onClick}
      aria-label="Back to previous menu"
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#arrowLeft" />
      </svg>
    </button>
  );
};

export default BackButton;
