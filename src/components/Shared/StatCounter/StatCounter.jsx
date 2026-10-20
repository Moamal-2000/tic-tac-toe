import s from "./StatCounter.module.scss";

/**
 * @component
 * @param {Object} props
 * @param {string | number} props.value
 * @param {'green' | 'yellow' | 'red'} [props.color]
 * @param {'player1' | 'player2'} [props.target]
 */

const StatCounter = ({ value, color, target }) => {
  const validColor = COUNTER_COLORS[color] ? color : DEFAULT_COLOR;
  const [startColor, endColor] = COUNTER_COLORS[validColor];

  const valueText = String(value);
  const valueLength = valueText.length;
  const gradientId = validColor;

  return (
    <svg
      className={s.counter}
      viewBox={`0 0 ${valueLength * 60} 100`}
      data-score-target={target}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>

      <text
        x={valueLength * 30}
        y="40"
        textAnchor="middle"
        dominantBaseline="central"
        fill={`url(#${gradientId})`}
        opacity=".4"
      >
        {"0".repeat(valueLength)}
      </text>

      <text
        x={valueLength * 30}
        y="40"
        textAnchor="middle"
        dominantBaseline="central"
        fill={`url(#${gradientId})`}
      >
        {valueText}
      </text>
    </svg>
  );
};
export default StatCounter;

const COUNTER_COLORS = {
  green: ["#45e5db", "#44a08d"],
  yellow: ["#ffd93d", "#ff9f1c"],
  red: ["#ff6b6b", "#ee5a6f"],
};
const DEFAULT_COLOR = "green";
