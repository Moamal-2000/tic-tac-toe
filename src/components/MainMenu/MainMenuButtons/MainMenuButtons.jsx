import SvgIcon from "@/components/Shared/SvgIcon";
import { GAME_MODES_BUTTONS } from "@/data/staticData";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./MainMenuButtons.module.scss";

const MainMenuButtons = () => {
  const updateGameMode = useGlobalStore((s) => s.updateGameMode);

  return (
    <div className={s.buttons}>
      {GAME_MODES_BUTTONS.map(({ label, iconName, id }) => (
        <button
          type="button"
          className={s.button}
          key={`${label}-${id}`}
          onClick={() => updateGameMode(label)}
        >
          <SvgIcon name={iconName} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default MainMenuButtons;
