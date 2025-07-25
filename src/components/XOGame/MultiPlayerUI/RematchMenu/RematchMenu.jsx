"use client";

import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import s from "./RematchMenu.module.scss";

const RematchMenu = () => {
  const { updateMultiplayerState, playerTurn } = useMultiplayerStore((s) => s);

  function closeRematchMenu(event) {
    const isOverlayClick = event.target.contains(event.currentTarget);

    if (!isOverlayClick) return;

    updateMultiplayerState({ isRematchMenuActive: false });
  }

  function handleRematch() {
    updateMultiplayerState({ isRematchMenuActive: false });
    // socket.emit("requestRematch", { playerWhoRequested: playerTurn });
  }

  return (
    <div className={s.overlay} onClick={closeRematchMenu}>
      <div className={s.rematchMenu}>
        <h2>Ask for a rematch?</h2>

        <div className={s.buttons}>
          <button className={s.yes} onClick={handleRematch}>
            Yes
          </button>
          <button className={s.no} onClick={closeRematchMenu}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default RematchMenu;
