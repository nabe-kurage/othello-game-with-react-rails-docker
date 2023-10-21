import React, { useState } from 'react';
import {
  squareNum,
  directionsArray,
  squareAllNum,
  defaultDiskSet,
  COLUMN,
} from './constData';

function Board() {
  const [diskSet, setDiskSet] = useState({ ...defaultDiskSet });
  console.log('diskSet', diskSet);
  const columns = [];
  for (let i = 0; i < squareNum.column; i++) {
    columns.push(<Column key={i} columnNum={i} diskSet={diskSet} />);
  }
  return <div className="board">{columns}</div>;
}

class Column extends React.Component {
  render() {
    const squares = [];
    for (let i = 0; i < squareNum.row; i++) {
      squares.push(
        <Square
          key={i}
          columnNum={this.props.columnNum}
          rowNum={i}
          diskSet={this.props.diskSet}
        />
      );
    }
    return <div className="column">{squares}</div>;
  }
}

class Square extends React.Component {
  checkFirstSet(column, row) {
    if (this.props.diskSet.blackCol[column]?.indexOf(row) > -1) {
      return <Disk color="black" />;
    }
    if (this.props.diskSet.whiteCol[column]?.indexOf(row) > -1) {
      return <Disk color="white" />;
    }
  }

  render() {
    return (
      <div
        className="square"
        data-column={this.props.columnNum}
        data-row={this.props.rowNum}
      >
        {' '}
        {this.checkFirstSet(this.props.columnNum, this.props.rowNum)}
      </div>
    );
  }
}

// コマ●◯
class Disk extends React.Component {
  render() {
    if (this.props.color === 'black') {
      return <div className="disk disk--black"></div>;
    } else {
      return <div className="disk disk--white"></div>;
    }
  }
}

export default Board;
