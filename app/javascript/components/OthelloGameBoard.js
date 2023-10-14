import React from 'react';
import Header from './Header';
import Board from './Board';

class OthelloGameBoard extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Board />
      </div>
    );
  }
}

export default OthelloGameBoard;
