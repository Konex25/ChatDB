import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import { Context } from "../../App";

const ContextList = observer(({ contexts }) => {
  const store = useContext(Context);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "0.5rem",
      }}
    >
      {contexts &&
        contexts.length > 0 &&
        contexts.map((context, idx) => (
          <Box
            key={idx}
            sx={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "0.3rem",
              cursor: "pointer",
              backgroundColor:
                store.state.currentContext === context.talkName
                  ? "#ffffff"
                  : "rgba(255,255,255,0.3)",
              "&:hover": {
                backgroundColor: store.state.currentContext === context.talkName
                  ? "#ffffff"
                  : "rgba(255,255,255,0.5)",
              },
              transition: "background-color 0.2s ease-in-out",
            }}
            onClick={() => {
              store.setCurrentContext(context.talkName);
            }}
          >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "var(--color-primary)",
                  }}
                >
                  {context.talkName}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {context.source}
                </Typography>
          </Box>
        ))}
    </Box>
  );
});

export default ContextList;
