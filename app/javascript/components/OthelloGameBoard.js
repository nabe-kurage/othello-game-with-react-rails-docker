import React from 'react';
import Columns from './Columns';

class OthelloGameBoard extends React.Component {
  render() {
    return (
      <div className="App">
        <h1 className="title">Othello</h1>
        <div className="header">
          <div>blackPlayerInfoC</div>
          <div className="headerInfo">
            <button className="skipButton">skip</button>
          </div>
          <div>whitePlayerInfo</div>
        </div>

        <div className="board">
          <Columns />
        </div>
      </div>
    );
  }
}

export default OthelloGameBoard;
