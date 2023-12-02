import React, { useState } from 'react';
import Header from './Header';
import Board from './Board';
import { DEFAULT_DISK_SET, COLUMN } from './constData';

function OthelloGameBoard() {
  let [disksCount, setDisksCount] = useState({
    black: 2,
    white: 2,
  });
  let [skipCounters, setSkipCounters] = useState({ black: 0, white: 0 });
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
  const [diskSet, setDiskSet] = useState({ ...DEFAULT_DISK_SET });
  const [winnerColor, setwinnerColor] = useState(null);
  // とりあえずAI=白設定しておく;
  const [aiColor, setAiColor] = useState(COLUMN.WHITE);

  const changePlayer = () => {
    setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
  };

  const judgeLoser = () => {
    if (skipCounters.black > 2) {
      setwinnerColor('white');
    } else {
      setwinnerColor('black');
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

  return (
    <div className="App">
      <Header
        isNextPlayerBlack={isNextPlayerBlack}
        disksCount={disksCount}
        skipCounters={skipCounters}
        setSkipCounters={setSkipCounters}
        judgeLoser={judgeLoser}
        changePlayer={changePlayer}
        winnerColor={winnerColor}
        aiColor={aiColor}
      />
      <Board
        isNextPlayerBlack={isNextPlayerBlack}
        setDisksCount={setDisksCount}
        skipCounters={skipCounters}
        setSkipCounters={setSkipCounters}
        diskSet={diskSet}
        setDiskSet={setDiskSet}
        changePlayer={changePlayer}
        winnerColor={winnerColor}
        judgeWinner={judgeWinner}
        aiColor={aiColor}
        setAiColor={setAiColor}
      />
    </div>
  );
}

export default OthelloGameBoard;
