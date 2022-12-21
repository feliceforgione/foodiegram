import React from "react";
import { useLoadingScreenStyles as classes } from "../../styles";
import { Box } from "@mui/system";
import LogoSvg from "./LogoSvg";

function LoadingScreen() {
  return (
    <Box component="section" sx={classes.section}>
      <span>
        <LogoSvg />
      </span>
    </Box>
  );
}

export default LoadingScreen;
