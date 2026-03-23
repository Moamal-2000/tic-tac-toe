import s from "./CloseButton.module.scss";

const CloseButton = ({ onClick, ariaLabel, className = "" }) => {
  return (
    <button
      type="button"
      className={`${s.closeButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg aria-hidden="true">
        <use href="/icons-sprite.svg#x-symbol" />
      </svg>
    </button>
  );
};

export default CloseButton;
