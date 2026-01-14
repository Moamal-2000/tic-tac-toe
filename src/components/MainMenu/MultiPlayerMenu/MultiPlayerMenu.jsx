"use client";

import BackButton from "@/components/Shared/BackButton/BackButton";
import { BUTTON_SOUND, soundFiles } from "@/data/sounds";
import usePreloadSounds from "@/hooks/usePreloadSounds";
import { socket } from "@/socket/socket";
import { useGlobalStore } from "@/stores/global.store/global.store";
import { useMultiplayerStore } from "@/stores/multiplayer.store/multiplayer.store";
import { useTranslations } from "next-intl";
import MPBoardSelection from "./MPBoardSelection/MPBoardSelection";
import MPHeader from "./MPHeader/MPHeader";
import s from "./MultiPlayerMenu.module.scss";

const MultiPlayerMenu = () => {
  const t = useTranslations("main_menu");

  const { updateGameMode, updateGlobalState } = useGlobalStore();
  const selectedBoardSize = useMultiplayerStore((s) => s.selectedBoardSize);

  const playSound = usePreloadSounds({ click: soundFiles.click });

  function handleSubmit(event) {
    event?.preventDefault();
    socket.emit("matchmaking", selectedBoardSize);
    updateGlobalState({ waitingOpponent: true });
    playSound(BUTTON_SOUND);
  }

  function handleBackButton() {
    playSound(BUTTON_SOUND);
    updateGameMode(null);
  }

  return (
    <div className={s.mpContent}>
      <BackButton onClick={handleBackButton} />
      <MPHeader />

      <form className={s.mpForm} onSubmit={handleSubmit}>
        <MPBoardSelection />
        <button type="submit">{t("multiplayer.setup.find_match")}</button>
      </form>
    </div>
  );
};

export default MultiPlayerMenu;
