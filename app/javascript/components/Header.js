import React from 'react';
import Image from '../images/othello-character.svg';
import { COLUMN } from './constData';

function Header(props) {
  const playerName = (index, squareColor) => {
    if (
      //   ここあとで修正
      // (aiColor === COLUMN.WHITE && squareColor === COLUMN.WHITE) ||
      // (aiColor === COLUMN.BLACK && squareColor === COLUMN.BLACK)
      squareColor === COLUMN.WHITE
    ) {
      return `Computer`;
    }
    return `Player ${index}`;
  };

  return (
    <React.Fragment>
      <h1 className="title">Othello</h1>
      <div className="header">
        <div className="player">
          <img src={Image} alt="" className="headerPlayerImg" />
          <div>{playerName(1, COLUMN.BLACK)}</div>
          <div>
            color:
            <span className="headerPlayerInfoBlackSquare">&nbsp;●</span>
          </div>
          <div className="headerPlayerInfoCount">
            Count:{props.blackDisksCount}
          </div>
        </div>
        <div className="headerInfo">
          <button className="skipButton">skip</button>
        </div>
        <div className="player">
          <img src={Image} alt="" className="headerPlayerImg" />
          <div>{playerName(1, COLUMN.WHITE)}</div>
          <div>
            color:
            <span className="headerPlayerInfoWhiteSquare">&nbsp;●</span>
            <div className="headerPlayerInfoCount">
              Count:{props.whiteDisksCount}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;
