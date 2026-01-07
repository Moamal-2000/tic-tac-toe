import { BOARD_SIZES } from "@/data/constants";
import { useTranslations } from "next-intl";
import BoardSizeOption from "./BoardSizeOption/BoardSizeOption";
import s from "./MPBoardSelection.module.scss";

const MPBoardSelection = () => {
  const t = useTranslations("main_menu");

  return (
    <div className={s.boardSelectionWrapper}>
      <label htmlFor="boardSize">{t("multiplayer.board_size")}</label>

      <div className={s.boardSelection} id="boardSize">
        {BOARD_SIZES.map((size) => (
          <BoardSizeOption size={size} key={`boardSize-${size}`} />
        ))}
      </div>
    </div>
  );
};

export default MPBoardSelection;
