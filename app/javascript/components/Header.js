import React from 'react';
import Player from '../images/othello-character-player.png';
import Monster from '../images/othello-character-monster.png';
import { COLUMN } from './constData';

function Header(props) {
  const playerName = (index, squareColor) => {
    if (
      (props.aiColor === COLUMN.WHITE && squareColor === COLUMN.WHITE) ||
      (props.aiColor === COLUMN.BLACK && squareColor === COLUMN.BLACK)
    ) {
      return `Computer`;
    }
    return `Player ${index}`;
  };

  const skipButtonHandler = () => {
    if (props.winnerColor) return;
    // useEffectを使えば非同期でnextCounter不要になるかも
    if (props.isNextPlayerBlack) {
      const nextCounter = props.skipCounters.black + 1;
      props.setSkipCounters({
        ...props.skipCounters,
        black: nextCounter,
      });
      if (nextCounter > 2) {
        props.judgeLoser();
        return;
      }
    } else {
      const nextCounter = props.skipCounters.white + 1;
      props.setSkipCounters({
        ...props.skipCounters,
        white: nextCounter,
      });
      if (nextCounter > 2) {
        props.judgeLoser();
        return;
      }
    }

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
            Color:
            <span className="headerPlayerInfoBlackSquare">&nbsp;●</span>
          </div>
          <div className="headerPlayerInfoCount">
            Count: {props.disksCount.black}
          </div>
          <div>SkipCount: {props.skipCounters.black}</div>
        </div>
        <div className="headerInfo">
          <div>It's {props.isNextPlayerBlack ? 'black' : 'white'}'s turn</div>
          <button onClick={skipButtonHandler} className="skipButton">
            skip
          </button>
          {props.winnerColor ? (
            <div className="winnerInfo"> Winner: {props.winnerColor}</div>
          ) : null}
        </div>
        <div className="player">
          <img src={Monster} alt="" className="headerPlayerImg" />
          <div>{playerName(1, COLUMN.WHITE)}</div>
          <div>
            Color:
            <span className="headerPlayerInfoWhiteSquare">&nbsp;●</span>
            <div className="headerPlayerInfoCount">
              Count: {props.disksCount.white}
            </div>
            <div>SkipCount: {props.skipCounters.white}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;
