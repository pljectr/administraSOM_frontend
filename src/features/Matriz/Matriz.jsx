import React from "react";
import { Stack } from "@mui/material";

export default function Matriz(props) {
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%", height: "100%" }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        sx={{ width: "99%",  height: "100%" }}
      >
        {props.children}
      </Stack>
    </Stack>
  );
}
