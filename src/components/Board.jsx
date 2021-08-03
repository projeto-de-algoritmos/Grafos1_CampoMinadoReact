import React, { useState, useEffect, useRef, memo } from "react";
import Block from "./Block";

const ROW = 12;
const COL = 24;
const BOMB_RATIO = 0.2;

function insideMatrix(i, j) {
  return i >= 0 && i < ROW && j >= 0 && j < COL; // && não tem bomba em (i,j)
}

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

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleep(fn, ms) {
  await timeout(ms);
  return fn();
}

async function floodFillDFS(x, y, vis, stopCondition, isBomb, callback) {
  if (vis[x][y]) return;

  vis[x][y] = true;
  callback(x, y);

  if (isBomb(x, y) || stopCondition(x, y)) return;

  const dx = Array.from({ length: 3 }, (_, i) => i - 1);

  for (const i of dx) {
    for (const j of dx) {
      if (i === 0 && j === 0) continue;
      if (insideMatrix(x + i, y + j) && !isBomb(x + i, y + j)) {
        await sleep(
          () =>
            floodFillDFS(x + i, y + j, vis, stopCondition, isBomb, callback),
          15
        );
      } else {
        insideMatrix(x + i, y + j) &&
          !isBomb(x + i, y + j) &&
          callback(x + i, y + j);
      }
    }
  }
}

async function floodFillBFS(x, y, vis, isInsideMatrix, callback) {
  const queue = [{ x, y }];

  while (queue.length) {
    const { x, y } = queue.shift();

    if (vis[x][y]) continue;

    vis[x][y] = true;
    callback(x, y);

    const dx = Array.from({ length: 3 }, (_, i) => i - 1);

    for (const i of dx) {
      for (const j of dx) {
        if (i === 0 && j === 0) continue;
        if (isInsideMatrix(x + i, y + j)) {
          await sleep(() => queue.push({ x: x + i, y: y + j }), 15);
        }
      }
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const Board = () => {
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
    return insideMatrix(i, j) && map[i][j].neighbors === 0 && !map[i][j].isBomb;
  };

  const isBomb = (i, j) => map[i][j].isBomb;

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

  const handleBlockClick = (i, j) => {
    // Pílula vermelha / Pílula azul
    // CHOOSE ONE
    //floodFillBFS(i, j, vis.current, stopCondition, isBomb, openNode);
    floodFillDFS(i, j, vis.current, stopCondition, isBomb, openNode);
  };

  return (
    <>
      {map.map((row, i) => (
        <Row row={row} i={i} key={"row" + i} onClick={handleBlockClick} />
      ))}
    </>
  );
};

export default Board;
