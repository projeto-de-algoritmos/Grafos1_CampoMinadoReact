import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import React from "react";

const EndDialog = ({ open, isVictory, onRestartClick }) => {
  return (
    <Dialog maxWidth="xs" open={open} disableEscapeKeyDown>
      <DialogTitle>
        {isVictory ? (
          "Parabéns você ganhou!!"
        ) : (
          <span>Que pena, você perdeu... &#128517;</span>
        )}
      </DialogTitle>
      <DialogActions>
        <Grid container direction="row" justifyContent="space-between">
          <Button
            color="secondary"
            onClick={() => {
              window.location.href =
                "https://www.google.com/search?q=campo+minado";
            }}
          >
            Finalizar
          </Button>
          <Button color="primary" variant="outlined" onClick={onRestartClick}>
            Recomeçar
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EndDialog;
