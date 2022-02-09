import { NUM_OF_BLOCKS_PER_ROW, TOKENS, BLOCK_STATE } from "./constants";
import { evaluate } from "mathjs";

function generateNewAnswer() {
  const startTime = new Date();
  let answer;
  let attemptTimes = 0;

  do {
    answer = generateExpression();
    attemptTimes++;
  } while (
    !isValidEquation(answer) ||
    hasNumberStartsWithMultipleZeros(answer) ||
    hasConsecutiveOperators(answer) ||
    hasLeadingSign(answer) ||
    (isAnswerZero(answer) && Math.random() > 0.25)
  );

  return {
    answer,
    attemptTimes,
    generatingLog: `Generate new answer: ${attemptTimes} attempts in ${
      new Date() - startTime
    }ms, answer: ${answer}`,
  };
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

function hasNumberStartsWithMultipleZeros(answer) {
  return ~answer.search(/^0+/) || ~answer.search(/[^\d]0+/);
}

function hasConsecutiveOperators(answer) {
  const cases = ["++", "+-", "-+", "--", "*+", "/+"];
  for (let str of cases) {
    if (answer.includes(str)) {
      return true;
    }
  }
  return false;
}

function hasLeadingSign(answer) {
  return answer.startsWith("+") || answer.startsWith("-");
}

function isAnswerZero(answer) {
  return evaluate(answer.split("=")[0]) === 0;
}

function getHistoryByGuessAndAnswer(guess, answer) {
  const history = guess.split("").map((value) => ({ value, state: null }));
  const guessCollection = {};
  const answerCollection = {};

  for (let i = 0; i < NUM_OF_BLOCKS_PER_ROW; i++) {
    const guessToken = guess[i];
    const answerToken = answer[i];

    if (guessToken === answerToken) {
      history[i].state = BLOCK_STATE.IN_SOLUTION.CORRECT_SPOT;
    } else {
      guessCollection[guessToken] = (guessCollection[guessToken] || 0) + 1;
      answerCollection[answerToken] = (answerCollection[answerToken] || 0) + 1;
    }
  }

  for (let i = 0; i < NUM_OF_BLOCKS_PER_ROW; i++) {
    if (history[i].state === BLOCK_STATE.IN_SOLUTION.CORRECT_SPOT) {
      continue;
    }

    const guessToken = guess[i];
    if (guessToken in answerCollection && answerCollection[guessToken] > 0) {
      history[i].state = BLOCK_STATE.IN_SOLUTION.WRONG_SPOT;
      answerCollection[guessToken]--;
    } else {
      history[i].state = BLOCK_STATE.NOT_IN_SOLUTION;
    }
  }

  return history;
}

export { generateNewAnswer, isValidEquation, getHistoryByGuessAndAnswer };
