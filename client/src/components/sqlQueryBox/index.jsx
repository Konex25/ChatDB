import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../App";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

const SQLQueryBox = observer(({ query, setQuery, isEditable, onSend }) => {
  SQLQueryBox.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
    onSend: PropTypes.func.isRequired,
  };
  const store = useContext(Context);
  const validateQuery = () => {
    return query.trim() !== "";
  };
  const handleSend = () => {
    if (validateQuery()) {
      onSend(query);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      handleSend();
    }
  };
  return isEditable ? (
    <Box>
      <TextField
        label="Zapytanie SQL"
        fullWidth
        maxRows={1}
        multiline
        value={query}
        sx={{
          "& .MuiInputBase-root": {},
        }}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  handleSend();
                }}
              >
                <Send />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  ) : (
    <Box>
      <TextField
        label="Zapytanie SQL"
        multiline
        rows={4}
        value={query}
        variant="outlined"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
    </Box>
  );
});

export default SQLQueryBox;
