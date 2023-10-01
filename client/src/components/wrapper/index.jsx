import { observer } from "mobx-react-lite";
import { Context } from "../../App.jsx";
import { CircularProgress, Box } from "@mui/material";
import { useContext, useState } from "react";
const WrapperComponent = observer(({ children }) => {
  const store = useContext(Context);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      {children}
      <div
        style={{
          position: "fixed",
          zIndex: 5000,
        }}
      >
        {store.state.isLoading && (
          <Box
            sx={{
              position: "fixed",
              zIndex: 5000,
              top: "90%",
              left: "90%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </div>
    </div>
  );
});

export default WrapperComponent;
