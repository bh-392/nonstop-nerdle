import { BLOCK_STATE } from "../../constants";
import styles from "./Block.module.css";

function getBlockClassNameByState(state) {
  const baseClassName = styles.base;

  let additionalClassName;
  switch (state) {
    case BLOCK_STATE.IN_SOLUTION.CORRECT_SPOT:
      additionalClassName = styles["in-solution-correct-spot"];
      break;
    case BLOCK_STATE.IN_SOLUTION.WRONG_SPOT:
      additionalClassName = styles["in-solution-wrong-spot"];
      break;
    case BLOCK_STATE.NOT_IN_SOLUTION:
      additionalClassName = styles["not-in-solution"];
      break;
    default:
  }

  return [baseClassName, additionalClassName].join(" ");
}

const Block = ({ state, value }) => {
  return <div className={getBlockClassNameByState(state)}>{value}</div>;
};

export default Block;
