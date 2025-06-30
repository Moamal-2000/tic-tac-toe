import { BOARD_SIZES } from "@/data/constants";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  return (
    <div className={s.mpContent}>
      <header className={s.header}>
        <h2>Multiplayer Setup</h2>
        <p>Configure your game settings</p>
      </header>

      <form className={s.mpForm}>
        <div className={s.boardSelectionWrapper}>
          <label>Board Size</label>

          <div className={s.boardSelection}>
            {BOARD_SIZES.map((size) => (
              <div className={s.option} key={`boardSize-${size}`}>
                <input
                  type="radio"
                  name="boardSize"
                  id={`boardSize-${size}`}
                  value={size}
                />
                <label htmlFor={`boardSize-${size}`}>
                  {size}x{size}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Join & Wait</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
