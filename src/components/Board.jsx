import React, { useState, useEffect } from "react";
import Block from "./Block";

const Board = () => {
  const [map, setMap] = useState([[]]);
  const Row = 12;
  const Col = 30;

  useEffect(() => {
    setMap((oldMap) => {
      let initMap = [];
      for (let i = 0; i < Row; i++) {
        initMap[i] = [];
        for (let j = 0; j < Col; j++) {
          initMap[i][j] = { key: `block-${i}-${j}`, open: false };
        }
      }
      return initMap;
    });
  }, []);

  const handleBlockClick = (i, j) => {
    setMap((map) => {
      const newMap = Array.from(map);
      if (newMap[i][j].open === false) newMap[i][j].open = true;
      return newMap;
    });
  };

  return (
    <>
      {map.map((row, i) => (
        <div key={"row" + i}>
          {row.map((col, j) => (
            <Block
              key={col.key}
              open={col.open}
              onClick={() => handleBlockClick(i, j)}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default Board;
