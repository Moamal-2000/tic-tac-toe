import SvgIcon from "@/components/Shared/SvgIcon";
import { GAME_MODES_BUTTONS } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { BUTTON_SOUND, soundFiles } from "../../../data/sounds";
import s from "./MainMenuButtons.module.scss";

const MainMenuButtons = () => {
  const updateGameMode = useGlobalStore((s) => s.updateGameMode);
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleClick(label) {
    updateGameMode(label);
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.buttons}>
      {GAME_MODES_BUTTONS.map(({ label, iconName, id }) => (
        <button
          type="button"
          className={s.button}
          key={`${label}-${id}`}
          onClick={() => handleClick(label)}
        >
          <SvgIcon name={iconName} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default MainMenuButtons;
