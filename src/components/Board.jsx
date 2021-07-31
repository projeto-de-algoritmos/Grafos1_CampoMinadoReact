import React, { useState, useEffect, useRef, memo } from "react";
import Block from "./Block";

const ROW = 12;
const COL = 24;

function insideMatrix(i, j) {
  return i >= 0 && i < ROW && j >= 0 && j < COL; // && não tem bomba em (i,j)
}

const Row = memo(
  ({ row, i, onClick }) => (
    <div>
      {row.map((col, j) => (
        <Block key={col.key} open={col.open} onClick={() => onClick(i, j)} />
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

async function floodFillDFS(x, y, vis, callback) {
  if (vis[x][y]) return;

  vis[x][y] = true;
  callback(x, y);

  const dx = Array.from({ length: 3 }, (_, i) => i - 1);

  for (const i of dx) {
    for (const j of dx) {
      if (i === 0 && j === 0) continue;
      if (insideMatrix(x + i, y + j)) {
        await sleep(() => floodFillDFS(x + i, y + j, vis, callback), 15);
      }
    }
  }
}

async function floodFillBFS(x, y, vis, callback) {
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
        if (insideMatrix(x + i, y + j)) {
          await sleep(() => queue.push({ x: x + i, y: y + j }), 15);
        }
      }
    }
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

  useEffect(() => {
    setMap((oldMap) => {
      let initMap = [];
      for (let i = 0; i < ROW; i++) {
        initMap[i] = [];
        for (let j = 0; j < COL; j++) {
          initMap[i][j] = { key: `block-${i}-${j}`, open: false };
        }
      }
      return initMap;
    });
  }, []);

  const handleBlockClick = (i, j) => {
    // Pílula vermelha / Pílula azul
    // CHOOSE ONE
    floodFillBFS(i, j, vis.current, openNode);
    // floodFillDFS(i, j, vis.current, openNode);
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
