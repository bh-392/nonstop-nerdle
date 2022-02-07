import { useState, useEffect, useCallback } from "react";
import {
  GAME_STATE,
  NUM_OF_BLOCKS_PER_ROW,
  NUM_OF_ATTEMPTS,
  TOKENS,
} from "./constants";
import {
  generateNewAnswer,
  isValidEquation,
  getHistoryByGuessAndAnswer,
} from "./utils";
import RowContainer from "./components/RowContainer";
import NewGameButton from "./components/NewGameButton";
import Message from "./components/Message";
import styles from "./App.module.css";

let messageTimer;

const App = () => {
  const [gameState, setGameState] = useState(GAME_STATE.RUNNING);
  const [answer, setAnswer] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const newAnswer = generateNewAnswer();
    setAnswer(newAnswer);
    console.log(newAnswer);
  }, []);

  const doGuess = useCallback(() => {
    if (
      currentGuess.length !== NUM_OF_BLOCKS_PER_ROW ||
      !isValidEquation(currentGuess)
    ) {
      clearTimeout(messageTimer);
      setMessage({ type: "error", content: "The guess doesn't compute." });
      messageTimer = setTimeout(() => setMessage(null), 3000);
      return;
    }

    const newHistory = getHistoryByGuessAndAnswer(currentGuess, answer);
    setHistoryList((prevValue) => [...prevValue, newHistory]);
    setCurrentGuess("");

    if (currentGuess === answer) {
      setGameState(GAME_STATE.WON);
      setMessage({
        type: "success",
        content: (
          <>
            You won! 🥳
            <br />
            Click the "New Game" button below to start a new game.
          </>
        ),
      });
    } else if (historyList.length + 1 === NUM_OF_ATTEMPTS) {
      setGameState(GAME_STATE.LOST);
      setMessage({
        type: "error",
        content: (
          <>
            You lost. 😢
            <br />
            The answer was {answer}.
          </>
        ),
      });
    }
  }, [currentGuess, answer, historyList]);

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (gameState !== GAME_STATE.RUNNING) {
        return;
      }
      if (TOKENS.includes(key) && currentGuess.length < NUM_OF_BLOCKS_PER_ROW) {
        setCurrentGuess((prevValue) => `${prevValue}${key}`);
      }
      if (
        (key === "Backspace" || key === "Delete") &&
        currentGuess.length > 0
      ) {
        setCurrentGuess((prevValue) => prevValue.slice(0, -1));
      }
      if (key === "Enter") {
        doGuess();
      }
    },
    [gameState, currentGuess, doGuess]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const startNewGame = () => {
    if (window.confirm("Are you sure to start a new game?")) {
      const newAnswer = generateNewAnswer();

      setGameState(GAME_STATE.RUNNING);
      setAnswer(newAnswer);
      setCurrentGuess("");
      setHistoryList([]);
      setMessage(null);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <h1>Nonstop Nerdle</h1>
        <RowContainer
          gameState={gameState}
          currentGuess={currentGuess}
          historyList={historyList}
        />
        <Inputs handleKeyDown={handleKeyDown} />
        <NewGameButton startNewGame={startNewGame} />
        {/* <div>Share</div> */}
        <div>Special thanks: Amber Tseng</div>

        {message && <Message message={message} />}
      </div>
    </div>
  );
};

const Inputs = ({ handleKeyDown }) => {
  return (
    <div>
      <div className={styles.inputButtonsContainer}>
        {"1234567890".split("").map((v) => (
          <div
            key={v}
            className={styles.inputButton}
            onClick={() => handleKeyDown({ key: v })}
          >
            {v}
          </div>
        ))}
      </div>
      <div className={styles.inputButtonsContainer}>
        {"+-*/="
          .split("")
          .concat("Enter", "Delete")
          .map((v) => (
            <div
              key={v}
              className={styles.inputButton}
              onClick={() => handleKeyDown({ key: v })}
            >
              {v}
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
