import styles from "./NewGameButton.module.css";

const NewGameButton = ({ startNewGame }) => {
  const handleClick = (e) => {
    e.target.blur();
    startNewGame();
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      New Game
    </button>
  );
};

export default NewGameButton;
