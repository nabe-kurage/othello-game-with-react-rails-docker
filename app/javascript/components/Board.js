// tsに変更したい…
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
  const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);

  const squareClickHandlar = (column, row) => {
    let newDiskSet, colName;

    // プレイヤーの色によってセットするデータを変更
    colName = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
    newDiskSet = isNextPlayerBlack ? diskSet.blackCol : diskSet.whiteCol;

    //　新しい板の作成。一度も置かれていない列の場合は列データ新規作成
    newDiskSet[column]
      ? newDiskSet[column].push(row)
      : (newDiskSet[column] = [row]);

    setDiskSet({ ...diskSet, [colName]: newDiskSet });
  };

  const columns = [];
  for (let i = 0; i < squareNum.column; i++) {
    columns.push(
      <Column
        key={i}
        columnNum={i}
        diskSet={diskSet}
        squareClickHandlar={squareClickHandlar}
      />
    );
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
          squareClickHandlar={this.props.squareClickHandlar}
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
        onClick={() => {
          this.props.squareClickHandlar(
            this.props.columnNum,
            this.props.rowNum
          );
        }}
      >
        {this.checkFirstSet(this.props.columnNum, this.props.rowNum)}
      </div>
    );
  }
}

// コマ●◯
class Disk extends React.Component {
  render() {
    return <div className={`disk disk--${this.props.color}`}></div>;
  }
}

export default Board;
