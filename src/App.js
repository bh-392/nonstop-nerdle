import { useState, useEffect, useCallback } from "react";
import {
  GAME_STATE,
  KEYBOARD_FIRST_ROW_BUTTONS,
  KEYBOARD_SECOND_ROW_BUTTONS,
  KEYBOARD_BUTTON_STATE,
  BLOCK_STATE,
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
import Keyboard from "./Keyboard";
import NewGameButton from "./components/NewGameButton";
import CopyLinkButton from "./components/CopyLinkButton";
import Message from "./components/Message";
import styles from "./App.module.css";

let messageTimer;

const App = () => {
  const [gameState, setGameState] = useState(GAME_STATE.RUNNING);
  const [answer, setAnswer] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [keyboardFirstRowButtons, setKeyboardFirstRowButtons] = useState(
    KEYBOARD_FIRST_ROW_BUTTONS.map((value) => ({
      value,
      state: KEYBOARD_BUTTON_STATE.INITIAL,
    }))
  );
  const [keyboardSecondRowButtons, setKeyboardSecondRowButtons] = useState(
    KEYBOARD_SECOND_ROW_BUTTONS.map((value) => ({
      value,
      state: KEYBOARD_BUTTON_STATE.INITIAL,
    }))
  );
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const newAnswer = generateNewAnswer();
    setAnswer(newAnswer);
    console.log(newAnswer);
  }, []);

  const reduceKeyboardStateHelper = (newHistory, blockState, buttonState) => {
    newHistory
      .filter((history) => history.state === blockState)
      .forEach(({ value }) => {
        setKeyboardFirstRowButtons((prevState) =>
          prevState.map((button) =>
            button.value === value ? { ...button, state: buttonState } : button
          )
        );
        setKeyboardSecondRowButtons((prevState) =>
          prevState.map((button) =>
            button.value === value ? { ...button, state: buttonState } : button
          )
        );
      });
  };

  const reduceKeyboardState = useCallback((newHistory) => {
    reduceKeyboardStateHelper(
      newHistory,
      BLOCK_STATE.NOT_IN_SOLUTION,
      KEYBOARD_BUTTON_STATE.NOT_IN_SOLUTION
    );
    reduceKeyboardStateHelper(
      newHistory,
      BLOCK_STATE.IN_SOLUTION.CORRECT_SPOT,
      KEYBOARD_BUTTON_STATE.IN_SOLUTION.CORRECT_SPOT
    );
    reduceKeyboardStateHelper(
      newHistory,
      BLOCK_STATE.IN_SOLUTION.WRONG_SPOT,
      KEYBOARD_BUTTON_STATE.IN_SOLUTION.WRONG_SPOT
    );
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
    reduceKeyboardState(newHistory);
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
  }, [currentGuess, answer, reduceKeyboardState, historyList]);

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
      setKeyboardFirstRowButtons(
        KEYBOARD_FIRST_ROW_BUTTONS.map((value) => ({
          value,
          state: KEYBOARD_BUTTON_STATE.INITIAL,
        }))
      );
      setKeyboardSecondRowButtons(
        KEYBOARD_SECOND_ROW_BUTTONS.map((value) => ({
          value,
          state: KEYBOARD_BUTTON_STATE.INITIAL,
        }))
      );
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
        <Keyboard
          firstRowButtons={keyboardFirstRowButtons}
          secondRowButtons={keyboardSecondRowButtons}
          handleKeyDown={handleKeyDown}
        />
        <div className={styles.buttonsContainer}>
          <NewGameButton startNewGame={startNewGame} />
          <CopyLinkButton setMessage={setMessage} />
        </div>

        {message && <Message message={message} />}
      </div>
    </div>
  );
};

export default App;
