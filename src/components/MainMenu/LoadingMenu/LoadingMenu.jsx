import BackButton from "@/components/Shared/BackButton/BackButton";
import SvgIcon from "@/components/Shared/SvgIcon";
import s from "./LoadingMenu.module.scss";

const LoadingMenu = () => {
  return (
    <div className={s.loadingMenu}>
      <BackButton onClick={() => updateGameMode(null)} />

      <div className={s.content}>
        <div className={s.loader}>
          <SvgIcon name="spinner" />
        </div>

        <h2>Finding Match...</h2>
        <p>Please wait while we connect you with another player</p>
      </div>
    </div>
  );
};

export default LoadingMenu;
