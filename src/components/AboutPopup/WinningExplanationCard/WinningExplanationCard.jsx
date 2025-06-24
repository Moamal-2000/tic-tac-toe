import ExampleBoard from "@/components/Shared/ExampleBoard/ExampleBoard";
import InfoCard from "@/components/Shared/InfoCard/InfoCard";
import { SYMBOL_O_TEXT } from "@/data/constants";
import { BOARD_EXAMPLES } from "@/data/staticData";

const WinningExplanationCard = () => {
  return (
    <InfoCard title="Winning Example">
      <p>
        Here's a clear illustration of how{" "}
        <strong>
          Player 1 <b>({SYMBOL_O_TEXT})</b>
        </strong>{" "}
        can achieve victory with a diagonal connection on a standard 4x4 board:
      </p>

      <ExampleBoard boardData={BOARD_EXAMPLES.winningBoard} />

      <p style={{ marginTop: "20px" }}>
        In this scenario, <strong>Player 1</strong> successfully connects Four{" "}
        <strong>
          <b>{SYMBOL_O_TEXT}</b> symbols
        </strong>{" "}
        along a diagonal path, securing the win.
      </p>
    </InfoCard>
  );
};

export default WinningExplanationCard;
