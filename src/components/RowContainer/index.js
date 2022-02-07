import {
  GAME_STATE,
  NUM_OF_BLOCKS_PER_ROW,
  BLOCK_STATE,
  NUM_OF_ATTEMPTS,
} from "../../constants";
import Block from "./Block";
import styles from "./index.module.css";

const RowContainer = ({ gameState, currentGuess, historyList }) => {
  return (
    <div className={styles.container}>
      <HistoryList historyList={historyList} />
      {gameState === GAME_STATE.RUNNING && (
        <CurrentGuess currentGuess={currentGuess} />
      )}
      <PlaceholderRows gameState={gameState} historyList={historyList} />
    </div>
  );
};

const HistoryList = ({ historyList }) => {
  return historyList.map((rowData, i) => <Row key={i} data={rowData} />);
};

const CurrentGuess = ({ currentGuess }) => {
  const rowData = `${currentGuess}${" ".repeat(
    NUM_OF_BLOCKS_PER_ROW - currentGuess.length
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
        <Block key={i} state={state} value={value} />
      ))}
    </div>
  );
};

const PlaceholderRow = () => {
  return (
    <div className={styles.row}>
      {new Array(NUM_OF_BLOCKS_PER_ROW).fill(null).map((_, i) => (
        <Block key={i} state={BLOCK_STATE.UNDEFINED} />
      ))}
    </div>
  );
};

export default RowContainer;
