import React, { useState } from 'react';
import Header from './Header';
import Board from './Board';

function OthelloGameBoard() {
  let [blackDisksCount, setBlackDisksCount] = useState(2);
  let [whiteDisksCount, setWhiteDisksCount] = useState(2);

  const checkFinish = () => {
    if (count === squareAllNum - 1 - 4) {
      judgeWinner();
    }
  };

  return (
    <div className="App">
      <Header
        blackDisksCount={blackDisksCount}
        whiteDisksCount={whiteDisksCount}
      />
      <Board
        setWhiteDisksCount={(updatedCount) => setWhiteDisksCount(updatedCount)}
        setBlackDisksCount={(updatedCount) => setBlackDisksCount(updatedCount)}
      />
    </div>
  );
}

export default OthelloGameBoard;
