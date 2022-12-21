import { Box } from "@mui/material";
import React from "react";
import { useFeedPostSkeletonStyles as classes } from "../../styles";

function FeedPostSkeleton() {
  return (
    <Box sx={classes.container}>
      <Box sx={classes.headerSkeleton}>
        <Box sx={classes.avatarSkeleton} />
        <Box sx={classes.headerTextSkeleton}>
          <Box sx={classes.primaryTextSkeleton} />
          <Box sx={classes.secondaryTextSkeleton} />
        </Box>
      </Box>
      <Box sx={classes.mediaSkeleton} />
    </Box>
  );
}

export default FeedPostSkeleton;
