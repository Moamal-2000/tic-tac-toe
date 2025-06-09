import s from "./PowerUps.module.scss";

const PowerUps = () => {
  return (
    <div className={s.powerUps}>
      <div className={`${s.powerUp} ${true ? s.disabled : ""}`}>
        <span className={s.icon}>❄️</span>
        <span className={s.powerName}>Freeze</span>
        <span className={s.coolDown}>6</span>
      </div>

      <div className={`${s.powerUp} ${false ? s.disabled : ""}`}>
        <span className={s.icon}>💣</span>
        <span className={s.powerName}>Bomb</span>
        <span className={s.coolDown}>6</span>
      </div>

      <div className={`${s.powerUp} ${false ? s.disabled : ""}`}>
        <span className={s.icon}>🔄</span>
        <span className={s.powerName}>Swap</span>
        <span className={s.coolDown}>6</span>
      </div>
    </div>
  );
};

export default PowerUps;
