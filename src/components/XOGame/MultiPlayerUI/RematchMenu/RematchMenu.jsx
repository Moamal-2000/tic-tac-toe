"use client";

import { socket } from "@/socket/socket";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useEffect, useState } from "react";
import RematchDeclineNotification from "./RematchDeclineNotification/RematchDeclineNotification";
import s from "./RematchMenu.module.scss";

const RematchMenu = () => {
  const { updateMultiplayerState, playerTurn } = useMultiplayerStore();
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [showDeclineNotification, setShowDeclineNotification] = useState(false);

  useEffect(() => {
    socket.on("rematch-request-rejected", () => {
      setWaitingOpponent(false);
      setShowDeclineNotification(true);
    });

    socket.on("rematch-accepted", () => {
      setWaitingOpponent(false);
      updateMultiplayerState({ isRematchMenuActive: false });
    });

    return () => {
      socket.off("rematch-request-rejected");
      socket.off("rematch-accepted");
    };
  }, [updateMultiplayerState]);

  function closeRematchMenu(event) {
    const isOverlayClick = event.target.contains(event.currentTarget);

    if (!isOverlayClick) return;

    if (!waitingOpponent) {
      updateMultiplayerState({ isRematchMenuActive: false });
    }
  }

  function handleRematch() {
    setWaitingOpponent(true);
    socket.emit("requestRematch", { playerWhoRequested: playerTurn });
  }

  if (showDeclineNotification) {
    return (
      <RematchDeclineNotification
        isVisible={showDeclineNotification}
        onHide={() => setShowDeclineNotification(false)}
      />
    );
  }

  return (
    <div className={s.overlay} onClick={closeRematchMenu}>
      <div className={s.rematchMenu}>
        {!waitingOpponent && (
          <>
            <h2>Ask for a rematch?</h2>

            <div className={s.buttons}>
              <button onClick={handleRematch}>Yes</button>
              <button onClick={closeRematchMenu}>No</button>
            </div>
          </>
        )}

        {waitingOpponent && (
          <>
            <h2>Waiting for opponent...</h2>
            <p>
              Please wait while the opponent responds to your rematch request.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RematchMenu;
