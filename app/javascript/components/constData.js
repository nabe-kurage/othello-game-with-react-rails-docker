export const squareNum = { column: 8, row: 8 };
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
export const squareAllNum = 64;

export const COLUMN = {
    BLACK: "blackCol",
    WHITE: "whiteCol",
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
