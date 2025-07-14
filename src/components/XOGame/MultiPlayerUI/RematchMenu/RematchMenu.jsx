import s from "./RematchMenu.module.scss";

const RematchMenu = () => {
  return (
    <div className={s.overlay}>
      <div className={s.rematchMenu}>
        <p>Ask for a rematch?</p>

        <div className={s.buttons}>
          <button className={s.yes}>Yes</button>
          <button className={s.no}>No</button>
        </div>
      </div>
    </div>
  );
};

export default RematchMenu;
