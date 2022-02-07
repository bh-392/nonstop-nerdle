import { NUM_OF_BLOCKS_PER_ROW, TOKENS } from "./constants";
import { evaluate } from "mathjs";

function generateNewAnswer() {
  let answer;

  do {
    answer = generateExpression();
  } while (!isValidEquation(answer));

  return answer;
}

function generateExpression() {
  return new Array(NUM_OF_BLOCKS_PER_ROW)
    .fill(null)
    .map(() => getRandomElement(TOKENS))
    .join("");
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isValidEquation(expression) {
  const subExpressions = expression.split("=");
  if (subExpressions.length < 2 || subExpressions.includes("")) {
    return false;
  }

  try {
    let firstSubExpressionResult = evaluate(subExpressions[0]);
    for (let i = 1; i < subExpressions.length; i++) {
      const subExpression = subExpressions[i];
      if (evaluate(subExpression) !== firstSubExpressionResult) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

export { generateNewAnswer, isValidEquation };
