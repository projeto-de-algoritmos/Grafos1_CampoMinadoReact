import React from "react";
import Board from "./Board";
import "./MainPage.css";

const MainPage = () => {
  return (
    <>
      <h1>Campo Minado - Projeto de algoritmos</h1>

      <div className="main-container">
        <div>
          <Board />
        </div>
      </div>
    </>
  );
};

export default MainPage;
