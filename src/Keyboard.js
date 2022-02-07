import { KEYBOARD_BUTTON_STATE } from "./constants";
import styles from "./Keyboard.module.css";

function getKeyboardButtonClassNameByState(state) {
  const baseClassName = styles.button;

  let additionalClassName;
  switch (state) {
    case KEYBOARD_BUTTON_STATE.IN_SOLUTION.CORRECT_SPOT:
      additionalClassName = styles["button-in-solution-correct-spot"];
      break;
    case KEYBOARD_BUTTON_STATE.IN_SOLUTION.WRONG_SPOT:
      additionalClassName = styles["button-in-solution-wrong-spot"];
      break;
    case KEYBOARD_BUTTON_STATE.NOT_IN_SOLUTION:
      additionalClassName = styles["button-not-in-solution"];
      break;
    default:
  }

  return [baseClassName, additionalClassName].join(" ");
}

const Keyboard = ({ firstRowButtons, secondRowButtons, handleKeyDown }) => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {firstRowButtons.map(({ value, state }) => (
          <KeyboardButton
            key={value}
            handleKeyDown={handleKeyDown}
            value={value}
            state={state}
          />
        ))}
      </div>
      <div className={styles.row}>
        {secondRowButtons.map(({ value, state }) => (
          <KeyboardButton
            key={value}
            handleKeyDown={handleKeyDown}
            value={value}
            state={state}
          />
        ))}
      </div>
    </div>
  );
};

const KeyboardButton = ({ handleKeyDown, value, state }) => {
  return (
    <div
      className={getKeyboardButtonClassNameByState(state)}
      onClick={() => handleKeyDown({ key: value })}
    >
      {value}
    </div>
  );
};

export default Keyboard;
