import {
  Box,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableCell,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../App";
import PropTypes from "prop-types";

const TableComponent = observer(({ queryResult }) => {
  TableComponent.propTypes = {
    queryResult: PropTypes.object,
  };
  const store = useContext(Context);
  const { data, headers } = queryResult;

  return (
    <TableContainer component={Paper}>
      {data && data.length > 0 && (
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headers &&
                headers.length > 0 &&
                headers.map((header) => <TableCell key={header}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#0c283c",
                  }}
                >{header}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row[0]}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.map((cell) => (
                  <TableCell key={cell}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
});

export default TableComponent;
