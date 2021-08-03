import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import Block from "./Block";
import {
  ROW,
  COL,
  BOMB_RATIO,
  floodFillDFS,
  floodFillBFS,
  insideMatrix,
  shuffleArray,
} from "../utils";

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
      if (next.row[j].open !== col.open) {
        return false;
      }
      return true;
    });
  }
);

const Board = ({ onClick }) => {
  const [map, setMap] = useState([[]]);
  const vis = useRef(
    Array.from({ length: ROW }, (v, i) =>
      Array.from({ length: COL }, (v, j) => false)
    )
  );

  const openNode = (i, j) => {
    setMap((map) => {
      const newMap = [...map];
      const newLine = [...map[i]];
      newLine.splice(j, 1, { ...newLine[j], open: true });
      newMap.splice(i, 1, newLine);
      return newMap;
    });
  };

  const stopCondition = (i, j) => {
    return map[i][j].neighbors !== 0;
  };

  const isBomb = (i, j) => map[i][j].isBomb;

  const handleBlockClick = (i, j) => {
    onClick(i, j, vis.current, stopCondition, isBomb, openNode);
  };
  useEffect(() => {
    const mock = Array.from({ length: ROW * COL }, (v, i) => i);
    const pairs = mock.map((i) => [Math.floor(i / COL), i % COL]);
    shuffleArray(pairs);
    const bombs = pairs.slice(0, Math.floor(ROW * COL * BOMB_RATIO));

    let initMap = [];
    for (let i = 0; i < ROW; i++) {
      initMap[i] = [];
      for (let j = 0; j < COL; j++) {
        initMap[i][j] = {
          key: `block-${i}-${j}`,
          open: false,
          isBomb: false,
          neighbors: 0,
        };
      }
    }

    bombs.forEach(([i, j]) => {
      initMap[i][j].isBomb = true;
      for (let x = -1; x <= 1; ++x) {
        for (let y = -1; y <= 1; ++y) {
          if (x === 0 && y === 0) continue;
          if (insideMatrix(i + x, y + j)) initMap[i + x][y + j].neighbors++;
        }
      }
    });
    setMap(initMap);
  }, []);

  return (
    <>
      {map.map((row, i) => (
        <Row row={row} i={i} key={"row" + i} onClick={handleBlockClick} />
      ))}
    </>
  );
};

export default Board;
