import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Context } from "../../App";

const AddSourceModal = observer(({ open, onClose, list, setList }) => {
  AddSourceModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  const store = useContext(Context);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (data) => {
    const { url, name } = data;
    if (url.trim() === "" || name.trim() === "") {
      return;
    }
    const newSource = { name, url };
    list.forEach((source) => {
      if (source.url === url) {
        setError("Źródło o podanym adresie już istnieje");
        return;
      }
    });
    setList([...list, newSource]);
    store.setShouldUpdateSourceList(true);
    onClose();
  };

  const handleSubmit = (event) => {
    setError("");
    event.preventDefault();
    if (url.trim() === "" || name.trim() === "") {
      setError("Proszę wypełnić wszystkie pola");
      return;
    }
    onSubmit({ url, name });
    onClose();
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Dodaj źródło</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="URL"
            value={url}
            onChange={handleUrlChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Dodaj
          </Button>
        </form>
        <Typography color="error">{error}</Typography>
      </DialogContent>
    </Dialog>
  );
});

export default AddSourceModal;
