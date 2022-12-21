import { Box, Typography } from "@mui/material";
import React from "react";
import Image from "mui-image";
import { useGridPostStyles as classes } from "../../styles";
import { Link } from "react-router-dom";

function GridPost({ post }) {
  const commentsCount = post.comments_aggregate.aggregate.count;
  const likesCount = post.likes_aggregate.aggregate.count;

  return (
    <Link to={`/p/${post.id}`}>
      <Box sx={classes.gridPostContainer}>
        <Box sx={classes.gridPostOverlay}>
          <Box sx={classes.gridPostInfo}>
            <Box component="span" sx={classes.likes} />
            <Typography>{likesCount}</Typography>
          </Box>
          <Box sx={classes.gridPostInfo}>
            <Box component="span" sx={classes.comments} />
            <Typography>{commentsCount}</Typography>
          </Box>
        </Box>
        <Image
          src={post.media}
          alt="Post cover"
          sx={classes.image}
          position="static"
        />
      </Box>
    </Link>
  );
}

export default GridPost;
