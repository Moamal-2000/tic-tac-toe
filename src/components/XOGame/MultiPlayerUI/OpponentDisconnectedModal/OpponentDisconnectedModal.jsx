"use client";

import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useRouter } from "next/navigation";
import s from "./OpponentDisconnectedModal.module.scss";

const OpponentDisconnectedModal = () => {
  const router = useRouter();
  const { isOpponentDisconnected, resetMultiplayerState } = useMultiplayerStore(
    (state) => state
  );
  const { updateGameMode } = useGlobalStore();

  if (!isOpponentDisconnected) return null;

  function handleBackToMenu() {
    resetMultiplayerState();
    updateGameMode(null);
    router.push("/");
  }

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <h2>Opponent Disconnected</h2>
        <p>Your opponent has withdrawn from the game.</p>
        <p>You will be returned to the main menu.</p>
        <button onClick={handleBackToMenu} className={s.button}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OpponentDisconnectedModal;
