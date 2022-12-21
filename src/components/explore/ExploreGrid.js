import { Box, Typography } from "@mui/material";
import React from "react";
import { useExploreGridStyles as classes } from "../../styles";
import GridPost from "./../shared/GridPost";

function ExploreGrid({ posts }) {
  return (
    <>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        gutterBottom
        sx={classes.typography}
      >
        Explore
      </Typography>

      <Box component="article" sx={classes.article}>
        <Box sx={classes.postContainer}>
          {posts.map((post) => (
            <GridPost key={post.id} post={post} />
          ))}
        </Box>
      </Box>
    </>
  );
}

export default ExploreGrid;
