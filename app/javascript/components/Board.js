// tsに変更したい…
import React, { useState } from 'react';
import {
  squareNum,
  directionsArray,
  squareAllNum,
  defaultDiskSet,
  COLUMN,
} from './constData';

function Board() {
  let [count, setCount] = useState(0);
  let [skipCounter, setSkipCounter] = useState(0);
  let [blackDisksCount, setBlackDisksCount] = useState(2);
  let [whiteDisksCount, setWhiteDisksCount] = useState(2);
  const [diskSet, setDiskSet] = useState({ ...defaultDiskSet });
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
  const [winnerColor, setwinnerColor] = useState(null);

  const squareClickHandlar = (column, row) => {
    // ゲーム終了、コマの置けるかどうかのチェック
    if (isGameOver() || !isPlaceableSquare(column, row)) return;

    putDisk(column, row);
    checkSurroundingAndFlip(column, row);

    changePlayer();
    setCount(count + 1);
    setSkipCounter(0);

    countDisks();
  };

  const isGameOver = () => {
    return !!winnerColor;
  };

  const isPlaceableSquare = (column, row) => {
    if (isOccupiedSquare(column, row)) {
      return false;
    }

    // となりあったマスのコマの状態を見て置けるかどうかを判断
    for (let i = 0; i < directionsArray.length; i++) {
      if (
        isPossibleToTurnOverOneDirection(
          column,
          row,
          directionsArray[i],
          0,
          false
        )
      ) {
        return true;
      }
    }
    return false;
  };

  const isOccupiedSquare = (column, row) => {
    return (
      diskSet.whiteCol[column]?.indexOf(row) > -1 ||
      diskSet.blackCol[column]?.indexOf(row) > -1
    );
  };

  const isPossibleToTurnOverOneDirection = (
    column,
    row,
    direction,
    index,
    isAi
  ) => {
    let PlayerDiskSet, OpponentPlayerDiskSet;
    if (isAi) {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
    } else {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
    }

    const incrementedColumn = column + direction[0];
    const incrementedRow = row + direction[1];

    // 　敵のコマがある場合は、再帰関数で次のマスをチェック
    if (
      foundOpponentDisk(
        OpponentPlayerDiskSet,
        incrementedColumn,
        incrementedRow
      )
    ) {
      return isPossibleToTurnOverOneDirection(
        incrementedColumn,
        incrementedRow,
        direction,
        index + 1,
        isAi
      );
    }

    // はじめ(0)は自分のコマなので除外
    if (index === 0) return false;
    // 最終的に自分のコマがあるかチェック
    return foundMyDisk(PlayerDiskSet, incrementedColumn, incrementedRow);
  };

  // foundOpponentDiskとfoundMyDiskはまとめられそう
  const foundOpponentDisk = (
    OpponentPlayerDiskSet,
    incrementedColumn,
    incrementedRow
  ) => {
    return (
      diskSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
        incrementedRow
      ) > -1
    );
  };
  const foundMyDisk = (PlayerDiskSet, incrementedColumn, incrementedRow) => {
    return (
      diskSet[PlayerDiskSet][incrementedColumn]?.indexOf(incrementedRow) > -1
    );
  };

  const checkSurroundingAndFlip = (column, row) => {
    directionsArray.forEach((direction) => {
      if (isPossibleToTurnOverOneDirection(column, row, direction, 0, false)) {
        turnOverDisk(column, row, direction, false);
      }
    });
  };

  const turnOverDisk = (column, row, direction, isAi) => {
    let PlayerDiskSet, OpponentPlayerDiskSet;
    if (isAi) {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
    } else {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
    }

    let incrementedColumn = column + direction[0];
    let incrementedRow = row + direction[1];
    let newDiskSet = { ...diskSet };

    while (
      diskSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
        incrementedRow
      ) > -1
    ) {
      // 自分の増える持ちコマ
      if (newDiskSet[PlayerDiskSet][incrementedColumn]) {
        newDiskSet[PlayerDiskSet][incrementedColumn].push(incrementedRow);
      } else {
        newDiskSet[PlayerDiskSet][incrementedColumn] = [incrementedRow];
      }

      // 相手の減る持ちコマ
      newDiskSet[OpponentPlayerDiskSet][incrementedColumn].splice(
        diskSet[OpponentPlayerDiskSet][incrementedColumn].indexOf(
          incrementedRow
        ),
        1
      );

      incrementedColumn = incrementedColumn + direction[0];
      incrementedRow = incrementedRow + direction[1];
    }

    setDiskSet({
      ...diskSet,
      [PlayerDiskSet]: newDiskSet[PlayerDiskSet],
      [OpponentPlayerDiskSet]: newDiskSet[OpponentPlayerDiskSet],
    });
  };

  const putDisk = (column, row) => {
    let newDiskSet, colName;

    // プレイヤーの色によってセットするデータを変更
    colName = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
    newDiskSet = isNextPlayerBlack ? diskSet.blackCol : diskSet.whiteCol;

    //　新しい板の作成。一度も置かれていない列の場合は列データ新規作成
    newDiskSet[column]
      ? newDiskSet[column].push(row)
      : (newDiskSet[column] = [row]);

    setDiskSet({ ...diskSet, [colName]: newDiskSet });
  };

  const changePlayer = () => {
    setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
  };

  const countDisks = () => {
    let currentBlackSum = 0;
    for (const i in diskSet.blackCol) {
      currentBlackSum += diskSet.blackCol[i].length;
    }
    setBlackDisksCount(currentBlackSum);

    let currentWhiteSum = 0;
    for (const i in diskSet.whiteCol) {
      currentWhiteSum += diskSet.whiteCol[i].length;
    }
    setWhiteDisksCount(currentWhiteSum);
  };

  const columns = [];
  for (let i = 0; i < squareNum.column; i++) {
    columns.push(
      <Column
        key={i}
        columnNum={i}
        diskSet={diskSet}
        squareClickHandlar={squareClickHandlar}
      />
    );
  }

  return <div className="board">{columns}</div>;
}

class Column extends React.Component {
  render() {
    const squares = [];
    for (let i = 0; i < squareNum.row; i++) {
      squares.push(
        <Square
          key={i}
          columnNum={this.props.columnNum}
          rowNum={i}
          diskSet={this.props.diskSet}
          squareClickHandlar={this.props.squareClickHandlar}
        />
      );
    }
    return <div className="column">{squares}</div>;
  }
}

class Square extends React.Component {
  checkFirstSet(column, row) {
    if (this.props.diskSet.blackCol[column]?.indexOf(row) > -1) {
      return <Disk color="black" />;
    }
    if (this.props.diskSet.whiteCol[column]?.indexOf(row) > -1) {
      return <Disk color="white" />;
    }
  }

  render() {
    return (
      <div
        className="square"
        data-column={this.props.columnNum}
        data-row={this.props.rowNum}
        onClick={() => {
          this.props.squareClickHandlar(
            this.props.columnNum,
            this.props.rowNum
          );
        }}
      >
        {this.checkFirstSet(this.props.columnNum, this.props.rowNum)}
      </div>
    );
  }
}

// コマ●◯
class Disk extends React.Component {
  render() {
    return <div className={`disk disk--${this.props.color}`}></div>;
  }
}

export default Board;
