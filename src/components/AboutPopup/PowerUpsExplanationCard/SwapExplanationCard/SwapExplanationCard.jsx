import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT, SYMBOL_X_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";

const SwapExplanationCard = () => {
  return (
    <InfoCard title="Swap Power-Up" isNested={true} disableMarginBottom={true}>
      <p>
        The <strong>Swap</strong> power-up allows you to{" "}
        <strong>exchange the positions </strong> of any{" "}
        <strong>two existing symbols</strong> on the board. This power-up is
        only active when <strong>two occupied squares</strong> are selected; it
        cannot be used if you choose an <strong>empty square</strong>. Utilize
        this power-up to instantly disrupt your opponent's almost-complete
        winning lines, or to immediately form your own winning combination!
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.selectSwapBoard} />

      <p style={{ marginTop: "20px" }}>
        <strong>
          Player 2{" "}
          <b>
            (<b data-symbol="x">{SYMBOL_X_TEXT}</b>){" "}
          </b>
        </strong>{" "}
        has strategically activated the <strong>Swap</strong> power-up. They
        selected their own <strong data-symbol="x">{SYMBOL_X_TEXT}</strong> in
        the bottom-right corner even though it's frozen and an{" "}
        <strong>
          opponent's <b>{SYMBOL_O_TEXT}</b>
        </strong>{" "}
        in the same row. These two symbols are about to{" "}
        <strong>swap places</strong>, allowing <strong>Player 2</strong> to
        break the opponent’s setup and possibly set up a winning line of their
        own. The <strong>Swap</strong> power-up can even exchange symbols that
        are frozen, making it a powerful tool to turn the tide of the game.
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.afterSwapBoard} />

      <p style={{ marginTop: "20px" }}>
        The{" "}
        <strong>
          <b>{SYMBOL_O_TEXT}</b>
        </strong>{" "}
        and <strong data-symbol="x">{SYMBOL_X_TEXT}</strong> have successfully
        swapped places. This strategic move allowed{" "}
        <strong>
          Player 2{" "}
          <b>
            (<b data-symbol="x">{SYMBOL_X_TEXT}</b>){" "}
          </b>
        </strong>{" "}
        to immediately complete a <strong>vertical winning</strong> line through
        the second column, securing their victory. By leveraging the Swap
        power-up even with a{" "}
        <strong>
          frozen symbol <b data-symbol="x">{SYMBOL_X_TEXT}</b>
        </strong>{" "}
        was able to turn a defensive position into a winning one.
      </p>
    </InfoCard>
  );
};

export default SwapExplanationCard;
