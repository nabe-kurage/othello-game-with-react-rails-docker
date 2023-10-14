import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="title">Othello</h1>
        <div className="header">
          <div>blackPlayerInfoC</div>
          <div className="headerInfo">
            <button className="skipButton">skip</button>
          </div>
          <div>whitePlayerInfo</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Header;
