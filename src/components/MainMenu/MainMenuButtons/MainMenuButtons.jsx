import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import { GAME_MODES_BUTTONS } from "@/data/staticData";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { useGlobalStore } from "@/stores/global.store/global.store";
import s from "./MainMenuButtons.module.scss";

const MainMenuButtons = () => {
  const updateGameMode = useGlobalStore((s) => s.updateGameMode);
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleClick(mode) {
    updateGameMode(mode);
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.buttons}>
      {GAME_MODES_BUTTONS.map(({ label, iconName, mode, id }) => (
        <button
          type="button"
          className={s.button}
          key={`${mode}-${id}`}
          onClick={() => handleClick(mode)}
        >
          <svg aria-hidden="true">
            <use href={`/icons-sprite.svg#${iconName}`} />
          </svg>
          {label}
        </button>
      ))}
    </div>
  );
};

export default MainMenuButtons;
