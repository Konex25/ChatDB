import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../App";
import TableComponent from "../tableComponent";
const HistoryComponent = observer(({ context }) => {
  const store = useContext(Context);
  return (
    <Box sx={{ height: "75vh", width: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          padding: '1rem'
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#277fbd"
          }}
        >
          {" "}
          {context && context.talkName
            ? context.talkName
            : "Create one"}{" "}
        </Typography>
        {context && context.mode === "source" ? (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#277ebdb5"
            }}
          >
            {" "}
            URI: {context && context.source
              ? context.source
              : "Choose one"}{" "}
          </Typography>
        ) : (
          <Typography> Test Database</Typography>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {context && context.history && context.history.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
              padding: "10px",
            }}
          >
            {context.history.map((item, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  backgroundColor: index % 2 === 0 ? "#277ebd14" : "#ffffff",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography>Zapytanie: &nbsp;</Typography>
                    <Typography> {item.text}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", marginTop: '0.5rem' }}>
                    <Typography>Zapytanie SQL: &nbsp;</Typography>
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        color: "#742f16",
                      }}
                    >{item.sqlQuery}</Typography>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, marginTop: '0.5rem' }}>
                  <TableComponent queryResult={item.queryResult} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography> Historia jest pusta </Typography>
        )}
      </Box>
    </Box>
  );
});

export default HistoryComponent;
