import { ROW, COL } from "./constants";

export function insideMatrix(i, j) {
  return i >= 0 && i < ROW && j >= 0 && j < COL; // && não tem bomba em (i,j)
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sleep(fn, ms) {
  await timeout(ms);
  return fn();
}

export async function floodFillDFS(x, y, vis, stopCondition, isBomb, callback) {
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
      }
    }
  }
}

export async function floodFillBFS(x, y, vis, stopCondition, isBomb, callback) {
  const queue = [{ x, y }];

  while (queue.length) {
    const { x, y } = queue.shift();

    if (vis[x][y]) continue;

    vis[x][y] = true;
    callback(x, y);

    if (isBomb(x, y) || stopCondition(x, y)) continue;

    const dx = Array.from({ length: 3 }, (_, i) => i - 1);

    for (const i of dx) {
      for (const j of dx) {
        if (i === 0 && j === 0) continue;
        if (insideMatrix(x + i, y + j) && !isBomb(x + i, y + j)) {
          await sleep(() => queue.push({ x: x + i, y: y + j }), 15);
        }
      }
    }
  }
}
