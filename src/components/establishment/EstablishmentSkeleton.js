import React from "react";
import { useEstablishmentSkeletonStyles as classes } from "../../styles";
import { Box } from "@mui/system";

function EstablishmentSkeleton() {
  return (
    <>
      <Box sx={classes.mediaSkeleton}>
        <Box component="article" sx={classes.article}></Box>
      </Box>
    </>
  );
}

export default EstablishmentSkeleton;
