import fs from "fs";
import constants from "../constants.mjs";
const { TOKENS, NUM_OF_BLOCKS_PER_ROW } = constants;
const CHUNK_SIZE = 1e5;

Array.prototype.appendCharacters = function (character, targetLength) {
  return new Array(targetLength - this.length).fill(character).concat(this);
};

function convert(num) {
  const radix = TOKENS.length;

  return num
    .toString(radix)
    .split("")
    .appendCharacters("0", NUM_OF_BLOCKS_PER_ROW)
    .map((character) => Number.parseInt(character, radix))
    .map((idx) => TOKENS[idx])
    .join("");
}

function clearContent(filepath) {
  console.log(`${filepath} cleared`);
  fs.writeFileSync(filepath, "");
}

function toPercentage(num) {
  return `${Math.floor(num * 10000) / 100}%`;
}

function main() {
  const numOfPossibleAnswers = TOKENS.length ** NUM_OF_BLOCKS_PER_ROW;
  let filepath;

  for (let i = 0; i < numOfPossibleAnswers; i++) {
    if (i % CHUNK_SIZE === 0) {
      filepath = `outputs/${i}.txt`;
      if (fs.existsSync(filepath)) {
        const { size } = fs.statSync(filepath);
        if (size === (NUM_OF_BLOCKS_PER_ROW + 1) * CHUNK_SIZE) {
          console.log(`${filepath} exists`);
          i = i + CHUNK_SIZE - 1;
          continue;
        } else {
          console.log(`${filepath} exists but size isn't correct`);
        }
      }
      clearContent(filepath);
    }

    fs.appendFileSync(filepath, `${convert(i)}\n`);
    process.stdout.write(`${toPercentage(i / numOfPossibleAnswers)}\r`);
  }
}

main();
