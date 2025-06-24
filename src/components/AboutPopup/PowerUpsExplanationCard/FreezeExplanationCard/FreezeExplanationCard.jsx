import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";
import s from "./FreezeExplanationCard.module.scss";

const FreezeExplanationCard = () => {
  return (
    <InfoCard title="Freeze Power-Up" isNested={true}>
      <p className={s.freezeDescription}>
        The <strong>Freeze</strong> power-up allows you to immobilize one of
        your opponent’s active symbols on the board. Once a symbol is frozen, it
        becomes <strong>inactive</strong>, meaning:
      </p>

      <ul className={s.freezeList}>
        <li>It cannot be overwritten.</li>
        <li>It does not contribute to any winning combinations.</li>
        <li>It effectively acts as a block in your opponent’s strategy.</li>
        <li>
          It can still be exchanged using the <strong>Swap</strong> power-up.
        </li>
      </ul>

      <p>
        This power-up is a <strong>defensive tool</strong> used to disrupt
        potential winning lines. It can only target existing{" "}
        <strong>opponent symbols</strong>, not your own or empty cells. However,
        if a <strong>Bomb</strong> power-up hits a frozen cell, it will{" "}
        <strong>unfreeze</strong> it from the board without remove the symbol.
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.freezeBoard} />

      <p className={s.freezeExampleDescription}>
        In this example,{" "}
        <strong>
          Player 1 <b>({SYMBOL_O_TEXT})</b>
        </strong>{" "}
        has used the Freeze power-up on{" "}
        <strong>
          Player 2's{" "}
          <b>
            (<b data-symbol="x">{SYMBOL_X_TEXT}</b>){" "}
          </b>
        </strong>{" "}
        symbol in the <strong>top-middle</strong> cell. This{" "}
        <strong>
          <b data-symbol="x">{SYMBOL_X_TEXT}</b>
        </strong>{" "}
        is now <strong>frozen</strong>, making it unusable in future moves and
        blocking Player 2 from completing <strong>vertical</strong>,{" "}
        <strong>diagonal</strong>, or <strong>horizontal</strong> lines through
        that square.
      </p>
    </InfoCard>
  );
};

export default FreezeExplanationCard;
