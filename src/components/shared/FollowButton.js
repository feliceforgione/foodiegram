import { Button } from "@mui/material";
import React, { useState } from "react";
import { useFollowButtonStyles } from "../../styles";
import { UserContext } from "./../../App";
import { useMutation } from "@apollo/client";
import { FOLLOW_USER, UNFOLLOW_USER } from "./../../graphql/mutations";

function FollowButton({ side, id }) {
  const classes = useFollowButtonStyles(side);
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(
    (followingId) => followingId === id
  );
  const [isFollowing, setFollowing] = useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const variables = {
    userIdToFollow: id,
    currentUserId,
  };

  function handleFollowUser() {
    setFollowing(true);
    followUser({ variables });
  }

  function handleUnfollowUser() {
    setFollowing(false);
    unfollowUser({ variables });
  }

  const followButton = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      sx={classes.button}
      onClick={handleFollowUser}
      fullWidth
    >
      {" "}
      Follow
    </Button>
  );

  const followingButton = (
    <Button
      variant={side ? "text" : "outlined"}
      sx={classes.button}
      onClick={handleUnfollowUser}
      fullWidth
    >
      {" "}
      Following
    </Button>
  );

  return isFollowing ? followingButton : followButton;
}

export default FollowButton;
