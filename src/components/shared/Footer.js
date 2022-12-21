import { Typography, Box } from "@mui/material";
import React from "react";
import { useLayoutStyles } from "../../styles";

function Footer({ size }) {
  const copyright = (
    <Typography variant="body2" align="center" style={{ color: "#BBB" }}>
      &copy; {new Date().getFullYear()} FOODIEGRAM - FELICE FORGIONE
    </Typography>
  );
  if (size === "mini") {
    return <Box>{copyright}</Box>;
  }
  return (
    <Box component="footer" sx={useLayoutStyles.footer}>
      {copyright}
    </Box>
  );
}

export default Footer;
