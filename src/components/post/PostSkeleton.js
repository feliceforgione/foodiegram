import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { usePostSkeletonStyles as classes } from "../../styles";

export function PostSkeleton() {
  const matches = useMediaQuery("(min-width: 900px)");

  return (
    <Box
      sx={classes.container}
      style={{ gridTemplateColumns: matches && "600px 335px" }}
    >
      <Box sx={classes.mediaSkeleton} />
      <Box>
        <Box sx={classes.headerSkeleton}>
          <Box sx={classes.avatarSkeleton} />
          <Box sx={classes.headerTextSkeleton}>
            <Box sx={classes.primaryTextSkeleton} />
            <Box sx={classes.secondaryTextSkeleton} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PostSkeleton;
