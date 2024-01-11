import React, { useState } from 'react';
import './App.css';
import useSound from 'use-sound';
// import hover from 'hover.mp3';
// import click from 'click.mp3';

import {
  GRID_COUNT,
  DIRECTIONS_ARRAY,
  TOTAL_GRID_COUNT,
  DEFAULT_DISK_SET,
  COLUMN,
} from './constData.js';
import { GreedyPlayer } from './othelloAI';

const othelloAi = new GreedyPlayer();

// column = |||, row = 三
// class App extends .. でもできる。その場合constructorやthis.stateといった感じでobujectを定義する形になる
function App() {
  let [count, setCount] = useState(0);
  let [blackDisksCount, setBlackDisksCount] = useState(2);
  let [whiteDisksCount, setWhiteDisksCount] = useState(2);
  let [skipCounter, setSkipCounter] = useState(0);
  const [diskSet, setDiskSet] = useState({ ...DEFAULT_DISK_SET });
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
  const [winnerColor, setwinnerColor] = useState(null);
  const [hoverSoundPlay, { stop }] = useSound(hover, {
    playbackRate: 1.5,
    volume: 0.1,
  });
  const [aiColor, setAiColor] = useState(COLUMN.WHITE);

  // TODO: add stop sound
  const [clickSoundPlay] = useSound(click);
  const squareClickHandlar = (column, row) => {
    if (winnerColor || !checkAbleToPutDisk(column, row)) {
      return;
    }

    let newDiskSet, colName;
    if (isNextPlayerBlack) {
      colName = COLUMN.BLACK;
      newDiskSet = diskSet.blackCol;
    } else {
      colName = COLUMN.WHITE;
      newDiskSet = diskSet.whiteCol;
    }

    if (newDiskSet[column]) {
      newDiskSet[column].push(row);
    } else {
      newDiskSet[column] = [row];
    }
    setDiskSet({ ...diskSet, [colName]: newDiskSet });

    changePlayer();

    setCount(count + 1);
    setSkipCounter(0);

    countDisks();
    checkFinish();
    // TODO: AI使わない場合は分岐を追加
    if (aiColor.length > 0) {
      setTimeout(() => {
        aiCheck();
      }, 1500);
    }
  };

  const aiCheck = () => {
    const afterChangesNextPlayer = !isNextPlayerBlack;

    if (!afterChangesNextPlayer) {
      const aiDesc = othelloAi.computeBestMove(DEFAULT_DISK_SET, false);
      let newDiskSet;
      newDiskSet = diskSet.whiteCol;

      if (newDiskSet[aiDesc.column]) {
        newDiskSet[aiDesc.column].push(aiDesc.row);
      } else {
        newDiskSet[aiDesc.column] = [aiDesc.row];
      }
      setDiskSet({ ...diskSet, [aiDesc.colName]: newDiskSet });

      DIRECTIONS_ARRAY.forEach((direction) => {
        if (
          checkPossibilityToTurnOverOneDirection(
            aiDesc.column,
            aiDesc.row,
            direction,
            0,
            true
          )
        ) {
          turnOverDisk(aiDesc.column, aiDesc.row, direction, true);
        }
      });

      setNextPlayerBlack((isNextPlayerBlack) => true);
      setCount(count + 1);
      setSkipCounter(0);
      countDisks();
      checkFinish();
    }
  };

  const checkAbleToPutDisk = (column, row) => {
    if (isItAlreadyPlacedSquares(column, row)) {
      alert('すでに置かれたマスです');
      return false;
    }

    for (let i = 0; i < DIRECTIONS_ARRAY.length; i++) {
      if (
        checkPossibilityToTurnOverOneDirection(
          column,
          row,
          DIRECTIONS_ARRAY[i],
          0,
          false
        )
      ) {
        putDisk(column, row);
        return true;
      }
    }
    return false;
  };

  const isItAlreadyPlacedSquares = (column, row) => {
    return (
      diskSet.whiteCol[column]?.indexOf(row) > -1 ||
      diskSet.blackCol[column]?.indexOf(row) > -1
    );
  };

  const checkPossibilityToTurnOverOneDirection = (
    column,
    row,
    incrementArray,
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

    const incrementedColumn = column + incrementArray[0];
    const incrementedRow = row + incrementArray[1];

    if (
      foundOpponentDisk(
        OpponentPlayerDiskSet,
        incrementedColumn,
        incrementedRow
      )
    ) {
      if (isAi) {
        return checkPossibilityToTurnOverOneDirection(
          incrementedColumn,
          incrementedRow,
          incrementArray,
          index + 1,
          true
        );
      } else {
        return checkPossibilityToTurnOverOneDirection(
          incrementedColumn,
          incrementedRow,
          incrementArray,
          index + 1,
          false
        );
      }
    }

    // 最終的に自分のコマがあるかチェック
    return foundMyDisk(index, PlayerDiskSet, incrementedColumn, incrementedRow);
  };

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

  const foundMyDisk = (
    index,
    PlayerDiskSet,
    incrementedColumn,
    incrementedRow
  ) => {
    return (
      index > 0 &&
      diskSet[PlayerDiskSet][incrementedColumn]?.indexOf(incrementedRow) > -1
    );
  };

  const turnOverDisk = (column, row, incrementArray, isAi) => {
    let PlayerDiskSet, OpponentPlayerDiskSet;
    if (isAi) {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.WHITE : COLUMN.BLACK;
    } else {
      PlayerDiskSet = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
      OpponentPlayerDiskSet = !isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
    }

    // ERROR: 一個以上ひっくり返すときに一個しかひっくり返らない -> SOLVE: whileして繰り返す
    let incrementedColumn = column + incrementArray[0];
    let incrementedRow = row + incrementArray[1];
    let newDiskSet = diskSet;

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

      incrementedColumn = incrementedColumn + incrementArray[0];
      incrementedRow = incrementedRow + incrementArray[1];
    }

    //ERROR: はじめ白→黒で白にする際になってくれないのを直す→[-1,-1]のところが値が間違っていた
    setDiskSet({
      ...diskSet,
      [PlayerDiskSet]: newDiskSet[PlayerDiskSet],
      [OpponentPlayerDiskSet]: newDiskSet[OpponentPlayerDiskSet],
    });
  };

  const putDisk = (column, row) => {
    DIRECTIONS_ARRAY.forEach((direction) => {
      if (
        checkPossibilityToTurnOverOneDirection(column, row, direction, 0, false)
      ) {
        turnOverDisk(column, row, direction, false);
      }
    });
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

  const checkFinish = () => {
    if (count === TOTAL_GRID_COUNT - 1 - 4) {
      judgeWinner();
    }
  };

  const judgeWinner = () => {
    let blackDiskNumber = 0;
    for (let key in diskSet.blackCol) {
      blackDiskNumber += diskSet.blackCol[key].length;
    }

    let whiteDiskNumber = 0;
    for (let key in diskSet.whiteCol) {
      whiteDiskNumber += diskSet.whiteCol[key].length;
    }

    if (blackDiskNumber === whiteDiskNumber) {
      setwinnerColor('draw');
    } else if (blackDiskNumber > whiteDiskNumber) {
      setwinnerColor('black');
    } else {
      setwinnerColor('white');
    }
  };

  const changePlayer = async () => {
    // MEMO: setNextPlayerBlackfが走るのは関数が走った後なので、もし新しい値が取りたければこの値を使う
    const afterChangesNextPlayer = !isNextPlayerBlack;
    await setNextPlayerBlack((isNextPlayerBlack) => afterChangesNextPlayer);
  };

  const skipButtonHandler = () => {
    if (skipCounter > 0) {
      judgeWinner();
      return;
    }

    setSkipCounter(skipCounter + 1);
    changePlayer();
  };

  const columns = [];
  for (let i = 0; i < GRID_COUNT.column; i++) {
    columns.push(
      <Column
        key={i}
        columnNum={i}
        diskSet={diskSet}
        squareClickHandlar={squareClickHandlar}
        hoverSoundLoadHandlar={hoverSoundPlay}
        hoverSoundStopHandlar={stop}
        clickSoundLoadHandlar={clickSoundPlay}
      />
    );
  }

  const blackPlayerInfoClassName = isNextPlayerBlack
    ? 'headerPlayerInfo headerPlayerInfo--myTurn'
    : 'headerPlayerInfo';

  const whitePlayerInfoClassName = isNextPlayerBlack
    ? 'headerPlayerInfo'
    : 'headerPlayerInfo headerPlayerInfo--myTurn';

  const playerName = (index, squareColor) => {
    if (
      (aiColor === COLUMN.WHITE && squareColor === COLUMN.WHITE) ||
      (aiColor === COLUMN.BLACK && squareColor === COLUMN.BLACK)
    ) {
      return `Computer`;
    }
    return `Player ${index}`;
  };

  return (
    <div className="App">
      <h1 className="title">Othello</h1>
      <div className="header">
        <div className={blackPlayerInfoClassName}>
          <img
            src={`${process.env.PUBLIC_URL}/othello-character.svg`}
            alt=""
            className="headerPlayerImg"
          />
          <div className="headerPlayerInfoName">
            {playerName(1, COLUMN.BLACK)}
          </div>
          <div>
            color:
            <span className="headerPlayerInfoBlackSquare">&nbsp;●</span>
          </div>
          <div className="headerPlayerInfoCount">Count:{blackDisksCount}</div>
          {/* TODO: adjust draw */}
          {winnerColor}
        </div>
        <div className="headerInfo">
          <button onClick={skipButtonHandler} className="skipButton">
            skip
          </button>
        </div>
        <div className={whitePlayerInfoClassName}>
          <img
            src={`${process.env.PUBLIC_URL}/othello-character.svg`}
            alt=""
            className="headerPlayerImg"
          />
          <div className="headerPlayerInfoName">
            {playerName(1, COLUMN.WHITE)}
          </div>
          <div>
            color:
            <span className="headerPlayerInfoWhiteSquare">&nbsp;●</span>
          </div>
          <div className="headerPlayerInfoCount">Count:{whiteDisksCount}</div>
          {winnerColor}
        </div>
      </div>

      <div className="board">{columns}</div>
    </div>
  );
}

// renderしかないものはfunction コンポーネントにしても良いはず
// function Column (props){ ... this.propsがpropsで参照できるように}
// 縦1ライン
class Column extends React.Component {
  render() {
    const squares = [];
    for (let i = 0; i < GRID_COUNT.row; i++) {
      squares.push(
        <Square
          key={i}
          columnNum={this.props.columnNum}
          rowNum={i}
          diskSet={this.props.diskSet}
          squareClickHandlar={this.props.squareClickHandlar}
          hoverSoundLoadHandlar={this.props.hoverSoundLoadHandlar}
          hoverSoundStopHandlar={this.props.hoverSoundStopHandlar}
          clickSoundLoadHandlar={this.props.clickSoundLoadHandlar}
        />
      );
    }

    return <div className="column">{squares}</div>;
  }
}

// 横1マス
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
        onClick={() => {
          this.props.hoverSoundStopHandlar();
          this.props.hoverSoundLoadHandlar();
          this.props.squareClickHandlar(
            this.props.columnNum,
            this.props.rowNum
          );
        }}
        onMouseOver={() => {
          this.props.hoverSoundStopHandlar();
          this.props.hoverSoundLoadHandlar();
        }}
        data-column={this.props.columnNum}
        data-row={this.props.rowNum}
      >
        {this.checkFirstSet(this.props.columnNum, this.props.rowNum)}
      </div>
    );
  }
}

// コマ
class Disk extends React.Component {
  render() {
    if (this.props.color === 'black') {
      return <div className="disk disk--black"></div>;
    } else {
      return <div className="disk disk--white"></div>;
    }
  }
}

export default App;
