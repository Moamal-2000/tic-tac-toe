import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import s from "./BoardSizeOption.module.scss";

const BoardSizeOption = ({ size, selectedBoardSize, setSelectedBoardSize }) => {
  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleChange(event) {
    setSelectedBoardSize(+event.target.value);
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
