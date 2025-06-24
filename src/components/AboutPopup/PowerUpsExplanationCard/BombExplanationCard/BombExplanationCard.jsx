import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";

const BombExplanationCard = () => {
  return (
    <InfoCard title="Bomb Power-Up" isNested={true}>
      <p>
        The <strong>Bomb</strong> power-up grants you the ability to target{" "}
        <strong>any single square</strong> on the board. When activated, the
        selected square and all <strong>8 surrounding adjacent squares</strong>{" "}
        (if they exist within the board's boundaries) will be instantly{" "}
        <strong>cleared</strong> of any <strong>symbols</strong>. If a targeted
        square happened to be <strong>frozen</strong>, the <strong>bomb</strong>{" "}
        will effectively <strong>remove the freeze effect</strong> but{" "}
        <strong>not the symbol</strong>.
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.bombBoard} />

      <p style={{ marginTop: "20px" }}>
        <strong>
          Player 1 <b>({SYMBOL_O_TEXT})</b>
        </strong>{" "}
        is about to deploy the <strong>Bomb</strong> power-up, targeting the
        marked <strong data-symbol="x">{SYMBOL_X_TEXT}</strong> in the second
        row, second column. Notice the symbols surrounding it.
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.afterBombBoard} />

      <p style={{ marginTop: "20px" }}>
        The <strong data-symbol="x">{SYMBOL_X_TEXT}</strong> and all its
        adjacent symbols have been successfully cleared, opening up new
        strategic possibilities for both players.
      </p>
    </InfoCard>
  );
};

export default BombExplanationCard;
