import { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import AddSourceModal from "../addSourceModal";
import { Add } from "@mui/icons-material";
import useStateLS from "../../hooks/useStateLS";

const DataSourceList = observer(({ selected, onChange }) => {
  const [list, setList] = useStateLS("dataSources", []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
      <Box fullWidth>
        <FormControl
          sx={{
            "&.MuiFormControl-root": {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "1rem 0",
              fullWidth: true,
            },
          }}
        >
          <InputLabel id="demo-multiple-name-label">URL</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            fullWidth
            value={selected}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            input={<OutlinedInput label="URL" />}
          >
            {list &&
              list.length > 0 &&
              list.map((item) => (
                <MenuItem key={item.url} value={item.url}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography fontSize="0.75rem">
                      Nazwa: {item.name}
                    </Typography>
                    <Typography fontSize="1rem">url: {item.url}</Typography>
                  </Box>
                </MenuItem>
              ))}
          </Select>

          <IconButton
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Add />
          </IconButton>
        </FormControl>
      </Box>

      {isModalOpen && (
        <AddSourceModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          list={list}
          setList={setList}
        />
      )}
    </Box>
  );
});

export default DataSourceList;
