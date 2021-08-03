import { Grid, Switch, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Board from "./Board";
import "./MainPage.css";
import { floodFillDFS, floodFillBFS } from "../utils";

const MainPage = () => {
  const [isDFS, setIsDFS] = useState(true);

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
            <Switch checked={isDFS} onChange={(e) => setIsDFS(!isDFS)} />
          </Grid>
          <Typography component={Grid} item>
            DFS
          </Typography>
        </Grid>
      </Grid>
      <div className="main-container">
        <div>
          <Board onClick={isDFS ? floodFillDFS : floodFillBFS} />
        </div>
      </div>
    </>
  );
};

export default MainPage;
