import { useState, useEffect, useCallback } from "react";
import {
  GAME_STATE,
  NUM_OF_BLOCKS_PER_ROW,
  TOKENS,
  BLOCK_STATE,
  NUM_OF_ATTEMPTS,
} from "./constants";
import {
  generateNewAnswer,
  isValidEquation,
  getHistoryByGuessAndAnswer,
} from "./utils";
import Message from "./components/Message";
import styles from "./App.module.css";

function getBlockClassNameByState(state) {
  const baseClassName = styles.block;

  let additionalClassName;
  switch (state) {
    case BLOCK_STATE.IN_SOLUTION.CORRECT_SPOT:
      additionalClassName = styles["block-in-solution-correct-spot"];
      break;
    case BLOCK_STATE.IN_SOLUTION.WRONG_SPOT:
      additionalClassName = styles["block-in-solution-wrong-spot"];
      break;
    case BLOCK_STATE.NOT_IN_SOLUTION:
      additionalClassName = styles["block-not-in-solution"];
      break;
    default:
  }

  return [baseClassName, additionalClassName].join(" ");
}

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

  const handleNewGameButtonClick = () => {
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
        <div className={styles.rowContainer}>
          <HistoryList historyList={historyList} />
          {gameState === GAME_STATE.RUNNING && (
            <UserInput userInput={currentGuess} />
          )}
          <PlaceholderRows gameState={gameState} historyList={historyList} />
        </div>
        <Inputs handleKeyDown={handleKeyDown} />
        <NewGameButton handleNewGameButtonClick={handleNewGameButtonClick} />
        <div>Special thanks: Amber Tseng</div>
        {/* <div>Share</div> */}
        {message && <Message message={message} />}
      </div>
    </div>
  );
};

const HistoryList = ({ historyList }) => {
  return historyList.map((rowData, i) => <Row key={i} data={rowData} />);
};

const UserInput = ({ userInput }) => {
  const rowData = `${userInput}${" ".repeat(
    NUM_OF_BLOCKS_PER_ROW - userInput.length
  )}`
    .split("")
    .map((value) => ({ value, state: BLOCK_STATE.UNDEFINED }));
  return <Row data={rowData} />;
};

const PlaceholderRows = ({ gameState, historyList }) => {
  if (gameState === GAME_STATE.LOST) {
    return null;
  }

  let numOfRows = NUM_OF_ATTEMPTS - historyList.length;
  if (gameState === GAME_STATE.RUNNING) {
    numOfRows--;
  }

  return numOfRows > 0
    ? new Array(numOfRows).fill(null).map((_, i) => <PlaceholderRow key={i} />)
    : null;
};

const Row = ({ data }) => {
  return (
    <div className={styles.row}>
      {data.map(({ value, state }, i) => (
        <div key={i} className={getBlockClassNameByState(state)}>
          {value}
        </div>
      ))}
    </div>
  );
};

const PlaceholderRow = () => {
  return (
    <div className={styles.row}>
      {new Array(NUM_OF_BLOCKS_PER_ROW).fill(null).map((_, i) => (
        <div
          key={i}
          className={getBlockClassNameByState(BLOCK_STATE.UNDEFINED)}
        >
          {" "}
        </div>
      ))}
    </div>
  );
};

const NewGameButton = ({ handleNewGameButtonClick }) => {
  return (
    <button className={styles.newGameButton} onClick={handleNewGameButtonClick}>
      New Game
    </button>
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
