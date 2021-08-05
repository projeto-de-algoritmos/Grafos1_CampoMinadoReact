import React, { memo } from "react";
import Block from "./Block";

const Row = memo(
  ({ row, i, onClick }) => (
    <div>
      {row.map((col, j) => (
        <Block
          key={col.key}
          open={col.open}
          isBomb={col.isBomb}
          neighbors={col.neighbors}
          onClick={() => onClick(i, j)}
        />
      ))}
    </div>
  ),
  (prev, next) => {
    prev.row.forEach((col, j) => {
      if (
        next.row[j].open !== col.open ||
        next.row[j].isBomb !== col.isBomb ||
        next.row[j].neighbors !== col.neighbors
      ) {
        return false;
      }
      return true;
    });
  }
);

const Board = ({ map, onClick }) => {
  return (
    <>
      {map.map((row, i) => (
        <Row row={row} i={i} key={"row" + i} onClick={onClick} />
      ))}
    </>
  );
};

export default Board;
