import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavbarStyles as classes } from "../../styles";

function NotificationTooltip({ notifications }) {
  const likes = notifications.filter(
    (notification) => notification.type === "like"
  ).length;
  const follows = notifications.filter(
    (notification) => notification.type === "follow"
  ).length;
  return (
    <Box sx={classes.tooltipContainer}>
      {likes > 0 && (
        <Box sx={classes.tooltip}>
          <Box component="span" sx={classes.followers} aria-label="Followers" />
          <Typography>{likes}</Typography>
        </Box>
      )}
      {follows > 0 && (
        <Box sx={classes.tooltip}>
          <Box component="span" sx={classes.likes} aria-label="Likes" />
          <Typography>{follows}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default NotificationTooltip;
