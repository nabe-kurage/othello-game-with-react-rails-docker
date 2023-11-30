import React from 'react';
import Player from '../images/othello-character-player.png';
import Monster from '../images/othello-character-monster.png';
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

  const skipButtonHandler = () => {
    if (props.skipCounter > 1) {
      props.judgeLoser();
      return;
    }
    props.setSkipCounter(props.skipCounter + 1);
    props.changePlayer();
  };

  return (
    <React.Fragment>
      <h1 className="title">Othello</h1>
      <div className="header">
        <div className="player">
          <img src={Player} alt="" className="headerPlayerImg" />
          <div>{playerName(1, COLUMN.BLACK)}</div>
          <div>
            color:
            <span className="headerPlayerInfoBlackSquare">&nbsp;●</span>
          </div>
          <div className="headerPlayerInfoCount">
            Count:{props.disksCount.black}
          </div>
        </div>
        <div className="headerInfo">
          <div className="headerInfoSkipCount"> {props.skipCounter} </div>
          <button onClick={skipButtonHandler} className="skipButton">
            skip
          </button>
          {props.winnerColor ? <div> Winner: {props.winnerColor}</div> : null}
        </div>
        <div className="player">
          <img src={Monster} alt="" className="headerPlayerImg" />
          <div>{playerName(1, COLUMN.WHITE)}</div>
          <div>
            color:
            <span className="headerPlayerInfoWhiteSquare">&nbsp;●</span>
            <div className="headerPlayerInfoCount">
              Count:{props.disksCount.white}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;
