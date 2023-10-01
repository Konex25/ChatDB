import React from "react";
import { Typography, Button, Box } from "@mui/material";
const GettingStarted = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Witaj w "Talk to your data"
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Aplikacja do rozmowy z bazami danych
      </Typography>
      <Typography variant="body1" gutterBottom>
        Żeby zacząć stwórz nową rozmowę
      </Typography>
      <Typography variant="body1" gutterBottom>
        lub wybierz jedną z istniejących
      </Typography>
    </Box>
  );
};

export default GettingStarted;
