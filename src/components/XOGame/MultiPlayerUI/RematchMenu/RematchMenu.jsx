"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./RematchMenu.module.scss";

const RematchMenu = () => {
  const { updateMultiplayerState } = useMultiplayerStore((s) => s);

  function closeRematchMenu() {
    updateMultiplayerState({ isRematchMenuActive: false });
  }

  return (
    <div className={s.overlay} onClick={closeRematchMenu}>
      <div className={s.rematchMenu}>
        <p>Ask for a rematch?</p>

        <div className={s.buttons}>
          <button className={s.yes}>Yes</button>
          <button className={s.no} onClick={closeRematchMenu}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default RematchMenu;
