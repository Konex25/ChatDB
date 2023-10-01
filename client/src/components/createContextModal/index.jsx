import { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { Context } from "../../App";
import { observer } from "mobx-react-lite";
import DataSourceList from "../dataSourceList";

const createContextModal = observer(
  ({ open, onClose, contexts, setContexts }) => {
    createContextModal.propTypes = {
      open: PropTypes.bool.isRequired,
      onClose: PropTypes.func.isRequired,
    };

  const store = useContext(Context);
  const mods = [
    { value: "testDatabase", label: "Testowa baza danych JPK" },
    { value: "source", label: "URI bazy danych" },
  ];

    const [talkName, setTalkName] = useState("");
    const [chosenMod, setChosenMod] = useState();
    const [chosenSource, setChosenSource] = useState();

  const [error, setError] = useState("");
  const onSubmit = (data) => {
    const { mode, talkName } = data;
    if (mode !== "source" && mode !== "testDatabase") {
      setError("Proszę wybrać typ źródła");
      return;
    }
    store.setCurrentContext(talkName);
    onClose();
  };

  const handleSubmit = (event) => {
    setError("");
    event.preventDefault();
    if (chosenMod !== "source" && chosenMod !== "testDatabase") {
      setError("Proszę wybrać typ źródła");
      return;
    }
    const newContext = { mode: chosenMod, source: chosenSource, talkName, history: [] };
    onSubmit(newContext)
    setContexts([...contexts, newContext]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nowa rozmowa</DialogTitle>
      <DialogContent
        sx={{
          minWidth: "550px",
          minHeight: "200px",
        }}
      >
        <form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Nazwa rozmowy"
              sx={{
                marginTop: "1rem",
              }}
              value={talkName}
              onChange={(e) => {
                setTalkName(e.target.value)
              }}
            />
            <TextField
              label="Źródło"
              select
              sx={{
                marginTop: "1rem",
              }}
              value={chosenMod}
              onChange={(e) => {
                setChosenMod(e.target.value);
              }}
            >
              {mods.map((mod) => (
                <MenuItem key={mod.value} value={mod.value}>
                  {mod.label}
                </MenuItem>
              ))}
            </TextField>
            {
              chosenMod === "source" && (
                <DataSourceList selected={chosenSource} onChange={setChosenSource} />
              )
            }
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                marginTop: "3rem",
              }}
              onClick={handleSubmit}
            >
              Stwórz
            </Button>
          </Box>
        </form>
        <Typography color="error">{error}</Typography>
      </DialogContent>
    </Dialog>
  );
});

export default createContextModal;
