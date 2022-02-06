import {
  NUM_OF_BLOCKS_PER_ROW,
  TOKENS,
  BLOCK_TYPE,
  NUM_OF_ATTEMPTS,
} from "./constants";
import { evaluate } from "mathjs";
import { useState, useEffect, useCallback } from "react";
import styles from "./App.module.css";

function generateExpression() {
  return new Array(NUM_OF_BLOCKS_PER_ROW)
    .fill(null)
    .map(() => getRandomElement(TOKENS))
    .join("");
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isValid(expression) {
  const subExpressions = expression.split("=");
  if (subExpressions.length < 2 || subExpressions.includes("")) {
    return false;
  }

  try {
    let firstExpressionResult = evaluate(subExpressions[0]);
    // Make zero fewer
    if (firstExpressionResult === 0 && Math.random() > 0.5) {
      return false;
    }
    for (let i = 1; i < subExpressions.length; i++) {
      const expression = subExpressions[i];
      if (evaluate(expression) !== firstExpressionResult) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

function compareUserInputAndAnswer(guess, answer) {
  const result = guess.split("").map((value) => ({ value, state: null }));
  const guessCollection = {};
  const answerCollection = {};

  for (let i = 0; i < NUM_OF_BLOCKS_PER_ROW; i++) {
    const guessToken = guess[i];
    const answerToken = answer[i];

    if (guessToken === answerToken) {
      result[i].state = BLOCK_TYPE.IN_SOLUTION.CORRECT_SPOT;
    } else {
      guessCollection[guessToken] = (guessCollection[guessToken] || 0) + 1;
      answerCollection[answerToken] = (answerCollection[answerToken] || 0) + 1;
    }
  }

  for (let i = 0; i < NUM_OF_BLOCKS_PER_ROW; i++) {
    if (result[i].state !== null) {
      continue;
    }

    const guessToken = guess[i];
    if (guessToken in answerCollection && answerCollection[guessToken] > 0) {
      result[i].state = BLOCK_TYPE.IN_SOLUTION.WRONG_SPOT;
      answerCollection[guessToken]--;
    } else {
      result[i].state = BLOCK_TYPE.NOT_IN_SOLUTION;
    }
  }

  return result;
}

function getBlockClassNameByState(state) {
  const baseClassName = styles.block;

  let additionalClassName;
  switch (state) {
    case BLOCK_TYPE.IN_SOLUTION.CORRECT_SPOT:
      additionalClassName = styles["block-in-solution-correct-spot"];
      break;
    case BLOCK_TYPE.IN_SOLUTION.WRONG_SPOT:
      additionalClassName = styles["block-in-solution-wrong-spot"];
      break;
    case BLOCK_TYPE.NOT_IN_SOLUTION:
      additionalClassName = styles["block-not-in-solution"];
      break;
    default:
  }

  return [baseClassName, additionalClassName].join(" ");
}

let messageTimer;

const App = () => {
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [message, setMessage] = useState(null);
  const [won, setWon] = useState(false);
  const isGamePaused = historyList.length === NUM_OF_ATTEMPTS || won;

  useEffect(() => {
    let expression;
    do {
      expression = generateExpression();
    } while (!isValid(expression));
    setAnswer(expression);
    console.log(expression);
  }, []);

  const guess = useCallback(
    (userInput) => {
      if (userInput.length !== NUM_OF_BLOCKS_PER_ROW || !isValid(userInput)) {
        clearTimeout(messageTimer);
        setMessage({ type: "error", content: "The guess doesn't compute" });
        messageTimer = setTimeout(() => setMessage(null), 3000);
        return;
      }
      if (userInput !== answer) {
        setUserInput("");
        setHistoryList((prevValue) => [
          ...prevValue,
          compareUserInputAndAnswer(userInput, answer),
        ]);
      } else {
        setUserInput("");
        setHistoryList((prevValue) => [
          ...prevValue,
          compareUserInputAndAnswer(userInput, answer),
        ]);
        setMessage({ type: "success", content: "You Won!" });
        setWon(true);
      }
    },
    [answer]
  );

  const handleKeyDown = useCallback(
    ({ key }) => {
      if (isGamePaused) {
        return;
      }
      if (TOKENS.includes(key) && userInput.length < NUM_OF_BLOCKS_PER_ROW) {
        setUserInput((prevValue) => `${prevValue}${key}`);
      }
      if ((key === "Backspace" || key === "Delete") && userInput.length > 0) {
        setUserInput((prevValue) => prevValue.slice(0, -1));
      }
      if (key === "Enter") {
        guess(userInput);
      }
    },
    [guess, isGamePaused, userInput]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNewGameButtonClick = () => {
    if (window.confirm("Are you sure to start a new game?")) {
      let expression;
      do {
        expression = generateExpression();
      } while (!isValid(expression));
      setAnswer(expression);
      setUserInput("");
      setHistoryList([]);
      setMessage(null);
      setWon(false);
    }
  };

  return (
    <>
      <h1>Nonstop Nerdle</h1>
      <div className={styles.rowContainer}>
        <HistoryList historyList={historyList} />
        {(!isGamePaused || !won) && <UserInput userInput={userInput} />}
        <PlaceholderBlocks historyList={historyList} won={won} />
      </div>
      <Inputs handleKeyDown={handleKeyDown} />
      <NewGameButton handleNewGameButtonClick={handleNewGameButtonClick} />
      {/* <div>Share</div> */}
      {(message || isGamePaused) && (
        <Message
          isGamePaused={isGamePaused}
          won={won}
          answer={answer}
          message={message}
        />
      )}
    </>
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
    .map((value) => ({ value, state: BLOCK_TYPE.UNDEFINED }));
  return <Row data={rowData} />;
};

const PlaceholderBlocks = ({ historyList, won }) => {
  let numOfRows = NUM_OF_ATTEMPTS - historyList.length - 1;
  if (won) {
    numOfRows++;
  }
  return numOfRows > 0
    ? new Array(numOfRows).fill(null).map((_, i) => <DummyRow key={i} />)
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

const DummyRow = () => {
  return (
    <div className={styles.row}>
      {new Array(NUM_OF_BLOCKS_PER_ROW).fill(null).map((_, i) => (
        <div key={i} className={getBlockClassNameByState(BLOCK_TYPE.UNDEFINED)}>
          {" "}
        </div>
      ))}
    </div>
  );
};

const Message = ({ message, won, isGamePaused, answer }) => {
  if (won) {
    return (
      <div className={`${styles.messageContainer} ${styles.messageGreen}`}>
        <div>
          You won! 🥳
          <br />
          Click the "New Game" button below to start a new game.
        </div>
      </div>
    );
  }
  return (
    <div className={styles.messageContainer}>
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
