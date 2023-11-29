import React, { useState } from 'react';
import Header from './Header';
import Board from './Board';
import { defaultDiskSet } from './constData';

function OthelloGameBoard() {
  let [disksCount, setDisksCount] = useState({
    black: 2,
    white: 2,
  });
  let [skipCounter, setSkipCounter] = useState(0);
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
  const [diskSet, setDiskSet] = useState({ ...defaultDiskSet });
  const [winnerColor, setwinnerColor] = useState(null);

  const changePlayer = () => {
    setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
  };

  const judgeWinner = () => {
    let blackDiskNumber = 0;
    // for (let key in diskSet.blackCol) {
    //   blackDiskNumber += diskSet.blackCol[key].length;
    // }

    // let whiteDiskNumber = 0;
    // for (let key in diskSet.whiteCol) {
    //   whiteDiskNumber += diskSet.whiteCol[key].length;
    // }

    // if (blackDiskNumber === whiteDiskNumber) {
    //   setwinnerColor('draw');
    // } else if (blackDiskNumber > whiteDiskNumber) {
    //   setwinnerColor('black');
    // } else {
    //   setwinnerColor('white');
    // }
  };

  return (
    <div className="App">
      <Header
        disksCount={disksCount}
        skipCounter={skipCounter}
        setSkipCounter={setSkipCounter}
        judgeWinner={judgeWinner}
        changePlayer={changePlayer}
      />
      <Board
        isNextPlayerBlack={isNextPlayerBlack}
        setDisksCount={setDisksCount}
        setSkipCounter={setSkipCounter}
        diskSet={diskSet}
        setDiskSet={setDiskSet}
        changePlayer={changePlayer}
      />
    </div>
  );
}

export default OthelloGameBoard;
