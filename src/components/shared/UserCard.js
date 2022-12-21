import React from "react";
import { useUserCardStyles } from "../../styles";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@mui/material";

function UserCard({ user, avatarSize = 44, location }) {
  const { username, profile_image, name } = user;
  const classes = useUserCardStyles(avatarSize);
  return (
    <Box sx={classes.wrapper}>
      <Link to={`/${username}`}>
        <Avatar src={profile_image} alt="User avatar" sx={classes.avatar} />
      </Link>
      <Box sx={classes.nameWrapper}>
        <Link to={`/${username}`}>
          <Typography variant="subtitle2" sx={classes.typography}>
            {username}
          </Typography>
        </Link>
        <Typography
          color="textSecondary"
          variant="body2"
          sx={classes.typography}
        >
          {location || name}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserCard;
