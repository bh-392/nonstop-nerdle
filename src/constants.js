export const NUM_OF_BLOCKS_PER_ROW = 8;
export const NUM_OF_ATTEMPTS = 6;

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

export const GAME_STATE = {
  RUNNING: 0,
  PAUSED: 1,
};

export const BLOCK_TYPE = {
  UNDEFINED: 0,
  IN_SOLUTION: {
    CORRECT_SPOT: 1,
    WRONG_SPOT: 2,
  },
  NOT_IN_SOLUTION: 3,
};
