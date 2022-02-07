import styles from "./Message.module.css";

const Message = ({ message, won, isGamePaused, answer }) => {
  if (won) {
    return (
      <div className={`${styles.container} ${styles.green}`}>
        <div>
          You won! 🥳
          <br />
          Click the "New Game" button below to start a new game.
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div>
        {isGamePaused ? (
          <>
            You lost. 😢
            <br />
            The answer was {answer}
          </>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default Message;
