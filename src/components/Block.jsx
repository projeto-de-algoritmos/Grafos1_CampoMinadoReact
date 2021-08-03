import React, { memo } from "react";
import "./Block.css";
import { IconButton, Button, makeStyles } from "@material-ui/core";
import { FaBomb } from "react-icons/fa";
import clsx from "clsx";

const useStyles = makeStyles({
  button: {
    height: 40,
    width: 40,
    minWidth: "unset",
    border: "1px outset",
    borderRadius: 4,
    padding: 0,
    cursor: "pointer",
    backgroundColor: "#c4cad0",
  },
  opened: {
    backgroundColor: "#eeeeee",
    cursor: "unset",
  },
});

const Block = memo(
  ({ onClick, open, isBomb, neighbors }) => {
    const classes = useStyles();

    return (
      <IconButton
        className={clsx(classes.button, { [classes.opened]: open })}
        disabled={open}
        onClick={onClick}
      >
        {open && (isBomb ? <FaBomb /> : neighbors === 0 ? " " : neighbors)}
      </IconButton>
    );
  },
  (prev, next) => {
    if (
      prev.open !== next.open ||
      prev.isBomb !== next.isBomb ||
      prev.neighbors !== next.neighbors
    ) {
      return false;
    }

    return true;
  }
);

export default Block;
