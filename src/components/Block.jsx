import React, { memo } from "react";
import "./Block.css";
import { Button, makeStyles } from "@material-ui/core";
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
  ({ onClick, open }) => {
    const classes = useStyles();

    return (
      <Button
        className={clsx(classes.button, { [classes.opened]: open })}
        disabled={open}
        onClick={onClick}
      />
    );
  },
  (prev, next) => {
    if (prev.open !== next.open) {
      return false;
    }

    return true;
  }
);

export default Block;
