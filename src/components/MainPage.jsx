import { Grid, Switch, Typography } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import "./MainPage.css";
import {
  ROW,
  COL,
  BOMB_RATIO,
  floodFillDFS,
  floodFillBFS,
  insideMatrix,
  shuffleArray,
} from "../utils";
import EndDialog from "./EndDialog";

const NODES = ROW * COL - Math.floor(ROW * COL * BOMB_RATIO);

const MainPage = () => {
  const [isDFS, setIsDFS] = useState(true);
  const [map, setMap] = useState([[]]);
  const [isLoading, setIsLoading] = useState(new Map());
  const traverse = useRef(floodFillDFS);
  const [openModal, setOpenModal] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const pendingRestart = useRef(false);
  const [openedNodes, setOpenedNodes] = useState(0);

  const vis = useRef(
    Array.from({ length: ROW }, (v, i) =>
      Array.from({ length: COL }, (v, j) => false)
    )
  );

  useEffect(() => {
    if (isDFS) {
      traverse.current = floodFillDFS;
    } else {
      traverse.current = floodFillBFS;
    }
  }, [isDFS]);

  useEffect(() => {
    if (pendingRestart.current && isLoading.size === 0) {
      pendingRestart.current = false;
      setOpenModal(true);
      setOpenedNodes(0);
      createMap();
      vis.current = Array.from({ length: ROW }, (v, i) =>
        Array.from({ length: COL }, (v, j) => false)
      );
      setOpenModal(false);
    }
  }, [isLoading, pendingRestart]);

  useEffect(() => {
    if (openedNodes === NODES && !openModal) {
      setIsVictory(true);
      setOpenModal(true);
    }
  }, [openedNodes, openModal]);

  const createMap = () => {
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
  };

  useEffect(() => {
    createMap();
  }, []);

  const openNode = (i, j) => {
    if (!isBomb(i, j)) setOpenedNodes((oldValue) => oldValue + 1);
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
    setIsLoading((old) => {
      const cp = new Map(old);
      cp.set(`i${i}+j${j}`, true);
      return cp;
    });

    if (isBomb(i, j)) {
      openBoard(i, j);
      setIsVictory(false);
      setOpenModal(true);
    }

    traverse
      .current(i, j, vis.current, stopCondition, isBomb, openNode)
      .finally(() =>
        setIsLoading((old) => {
          const cp = new Map(old);
          cp.delete(`i${i}+j${j}`);
          return cp;
        })
      );
  };

  const openBoard = (i, j) => {
    setIsLoading((old) => {
      const cp = new Map(old);
      cp.set(`i${i}+j${j}`, true);
      return cp;
    });

    const mock = () => false;

    traverse.current(i, j, vis.current, mock, mock, openNode).finally(() =>
      setIsLoading((old) => {
        const cp = new Map(old);
        cp.delete(`i${i}+j${j}`);
        return cp;
      })
    );
  };

  const handleRestart = () => {
    pendingRestart.current = true;
  };

  return (
    <>
      <h1>Campo Minado - Projeto de algoritmos</h1>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item container xs={2} alignItems="center" justifyContent="center">
          <Typography component={Grid} item>
            BFS
          </Typography>
          <Grid>
            <Switch
              disabled={isLoading.size > 0}
              checked={isDFS}
              onChange={(e) => setIsDFS(!isDFS)}
            />
          </Grid>
          <Typography component={Grid} item>
            DFS
          </Typography>
        </Grid>

        {openedNodes > 0 && (
          <Grid item>
            <Typography variant="h5">{`Nós abertos: ${openedNodes}`}</Typography>
          </Grid>
        )}
      </Grid>
      <div className="main-container">
        <div>
          <Board map={map} onClick={handleBlockClick} />
        </div>
      </div>
      <EndDialog
        open={openModal}
        isVictory={isVictory}
        onRestartClick={handleRestart}
      />
    </>
  );
};

export default MainPage;
