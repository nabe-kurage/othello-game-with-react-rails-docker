export const GRID_COUNT = { column: 8, row: 8 };
export const directionsArray = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];
export const TOTAL_GRID_COUNT = 64;
export const FIRST_DISK_COUNT = 4;
export const TOTAL_PLAYABLE_COUNT = TOTAL_GRID_COUNT - FIRST_DISK_COUNT;

export const COLUMN = {
  BLACK: 'blackCol',
  WHITE: 'whiteCol',
};

export const defaultDiskSet = {
  [COLUMN.WHITE]: {
    3: [3],
    4: [4],
  },
  [COLUMN.BLACK]: {
    3: [4],
    4: [3],
  },
};
