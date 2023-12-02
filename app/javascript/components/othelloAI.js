import { COLUMN, GRID_COUNT } from './constData.js';

const diskSymbol = {
  BLACK: 'B',
  EMPTY: '-',
  WHITE: 'W',
};

//
// GreedyPlayer only looks at the current diskSet
// and decide the next "best" move based on
// how many disks the move would flip (or "capture").
//
export class GreedyPlayer {
  /**
   * Compute the best move for a given player on the given board.
   * @param {Object} diskSet - see DEFAULT_DISK_SET for how this is stored
   * @param {bool} willAiPlayBlack
   */
  computeBestMove(diskSet, willAiPlayBlack) {
    let boardGrid = this.convertDiskSetIntoSquareGrid(diskSet);
    let playerColor = willAiPlayBlack ? diskSymbol.BLACK : diskSymbol.WHITE;
    let XYtoCaptureCounts = this.computeCaptureCounts(
      boardGrid,
      diskSet,
      playerColor
    );
    if (XYtoCaptureCounts.length === 0) {
      return {}; // board full
    }

    // e.g. bestMoveInt == 23 (2nd column, 3rd row)
    let bestMoveInt = this.decideBestMove(XYtoCaptureCounts);

    return {
      column: this.getCol(bestMoveInt),
      row: this.getRow(bestMoveInt),
    };
  }

  decideBestMove(XYtoCaptureCounts) {
    let bestCaptureCount = -1;
    let bestMove = -1; // not set
    Object.keys(XYtoCaptureCounts).forEach((xyInt) => {
      // Note: this if statement currently tie-breaks
      //       just by keeping the earliest xyInt
      if (XYtoCaptureCounts[xyInt] > bestCaptureCount) {
        bestMove = xyInt;
        bestCaptureCount = XYtoCaptureCounts[xyInt];
      }
    });
    return bestMove;
  }

  computeCaptureCounts(boardGrid, diskSet, playerColor) {
    let diskXYs = this.convertDiskSetIntoCoordinates(diskSet);
    let potentialXYs = this.getSurroundingSquares(diskXYs);
    if (potentialXYs.length === 0) {
      return {};
    }
    let XYtoCaptureCounts = {};
    for (let i = 0; i < potentialXYs.length; i++) {
      let xyInt = potentialXYs[i];
      let row = this.getRow(xyInt);
      let col = this.getCol(xyInt);
      let directions = [
        //    top-left    up        top-right
        //        left                  right
        // bottom-left   down    bottom-right
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ];
      directions.forEach((delta_xy) => {
        let dx = delta_xy[0];
        let dy = delta_xy[1];
        let newCol = col + dx;
        let newRow = row + dy;
        if (
          this.isWithinBoard(newCol, newRow) &&
          this.isOpponentColor(boardGrid[newRow][newCol], playerColor)
        ) {
          newCol = newCol + dx;
          newRow = newRow + dy;
          let potentialCaptureCount = 1;
          while (
            this.isWithinBoard(newCol, newRow) &&
            boardGrid[newRow][newCol] !== diskSymbol.EMPTY
          ) {
            if (!this.isOpponentColor(boardGrid[newRow][newCol], playerColor)) {
              if (XYtoCaptureCounts[xyInt] === undefined) {
                XYtoCaptureCounts[xyInt] = potentialCaptureCount;
              } else {
                XYtoCaptureCounts[xyInt] += potentialCaptureCount;
              }
              return;
            }
            potentialCaptureCount += 1;
            newCol = newCol + dx;
            newRow = newRow + dy;
          }
          return;
        }
      });
    }

    return XYtoCaptureCounts;
  }

  getRow(xyInt) {
    return xyInt % 10;
  }
  getCol(xyInt) {
    return Math.floor(xyInt / 10);
  }
  isOpponentColor(squareSymbol, playerSymbol) {
    return playerSymbol === diskSymbol.BLACK
      ? squareSymbol === diskSymbol.WHITE
      : squareSymbol === diskSymbol.BLACK;
  }
  isWithinBoard(col, row) {
    return (
      0 <= col && col < GRID_COUNT.column && 0 <= row && row < GRID_COUNT.row
    );
  }

  getSurroundingSquares(diskXYs) {
    let candidates = new Set();
    diskXYs.forEach((xy) => {
      let x = xy[0];
      let y = xy[1];
      let maxCol = GRID_COUNT.column - 1;
      let maxRow = GRID_COUNT.row - 1;
      // Array as a Set element doesn't work somehow..
      candidates.add(Math.max(x - 1, 0) * 10 + y - 1);
      candidates.add(Math.max(x - 1, 0) * 10 + y);
      candidates.add(Math.max(x - 1, 0) * 10 + y + 1);
      candidates.add(Math.min(x + 1, maxCol) * 10 + y - 1);
      candidates.add(Math.min(x + 1, maxCol) * 10 + y);
      candidates.add(Math.min(x + 1, maxCol) * 10 + y + 1);
      candidates.add(x * 10 + Math.max(y - 1, 0));
      candidates.add(x * 10 + Math.min(y + 1, maxRow));
    });
    let diskLocations = new Set(diskXYs.map((xy) => xy[0] * 10 + xy[1]));
    let XYints = new Set(
      [...candidates].filter((xy) => {
        return !diskLocations.has(xy);
      })
    );
    return Array.from(XYints).sort();
  }

  convertDiskSetIntoSquareGrid(diskSet) {
    let x = diskSymbol.EMPTY;

    var othelloBoard = [
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
      [x, x, x, x, x, x, x, x],
    ];
    var column2rows = diskSet[COLUMN.WHITE];
    Object.keys(column2rows).forEach((col) => {
      column2rows[col].forEach((row) => {
        othelloBoard[row][col] = diskSymbol.WHITE;
      });
    });
    column2rows = diskSet[COLUMN.BLACK];
    Object.keys(column2rows).forEach((col) => {
      column2rows[col].forEach((row) => {
        othelloBoard[row][col] = diskSymbol.BLACK;
      });
    });
    return othelloBoard;
  }

  convertDiskSetIntoCoordinates(diskSet) {
    let coordinates = [];
    var column2rows = diskSet[COLUMN.WHITE];
    Object.keys(column2rows).forEach((col) => {
      column2rows[col].forEach((row) => {
        // Note: col is x, row is y. Do not reverse them!
        coordinates.push([parseInt(col), row]);
      });
    });
    column2rows = diskSet[COLUMN.BLACK];
    Object.keys(column2rows).forEach((col) => {
      column2rows[col].forEach((row) => {
        coordinates.push([parseInt(col), row]);
      });
    });
    return coordinates;
  }
}
