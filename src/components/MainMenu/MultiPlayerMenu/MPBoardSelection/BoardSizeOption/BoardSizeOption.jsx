import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/app/usePreloadSounds";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./BoardSizeOption.module.scss";

const BoardSizeOption = ({ size }) => {
  const { selectedBoardSize, updateMultiplayerState } = useMultiplayerStore();
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleChange(event) {
    updateMultiplayerState({ selectedBoardSize: +event.target.value });
    playSound(BUTTON_SOUND);
  }

  return (
    <div className={s.option}>
      <input
        type="radio"
        name="boardSize"
        id={`boardSize-${size}`}
        value={size}
        checked={size === selectedBoardSize}
        onChange={(event) => handleChange(event)}
      />
      <label htmlFor={`boardSize-${size}`}>
        {size}x{size}
      </label>
    </div>
  );
};

export default BoardSizeOption;
