import React, { useState } from 'react';
import Header from './Header';
import Board from './Board';

function OthelloGameBoard() {
  let [blackDisksCount, setBlackDisksCount] = useState(2);
  let [whiteDisksCount, setWhiteDisksCount] = useState(2);
  let [skipCounter, setSkipCounter] = useState(0);
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);

  const changePlayer = () => {
    setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
  };

  return (
    <div className="App">
      <Header
        blackDisksCount={blackDisksCount}
        whiteDisksCount={whiteDisksCount}
        skipCounter={skipCounter}
        setSkipCounter={setSkipCounter}
      />
      <Board
        isNextPlayerBlack={isNextPlayerBlack}
        setWhiteDisksCount={setWhiteDisksCount}
        setBlackDisksCount={setBlackDisksCount}
        setSkipCounter={setSkipCounter}
        changePlayer={changePlayer}
      />
    </div>
  );
}

export default OthelloGameBoard;
