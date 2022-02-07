export const BLOCK_STATE = {
  INITIAL: 0,
  IN_SOLUTION: {
    CORRECT_SPOT: 1,
    WRONG_SPOT: 2,
  },
  NOT_IN_SOLUTION: 3,
};

export const GAME_STATE = {
  RUNNING: 0,
  WON: 1,
  LOST: 2,
};

export const NUM_OF_ATTEMPTS = 6;
export const NUM_OF_BLOCKS_PER_ROW = 8;

export const TOKENS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "+",
  "-",
  "*",
  "/",
  "=",
];
