import { Button, Dialog, Divider, Zoom } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOptionsDialogStyles as classes } from "../../styles";
import { UserContext } from "./../../App";
import { useMutation } from "@apollo/client";
import { UNFOLLOW_USER, DELETE_POST } from "../../graphql/mutations";

function OptionsDialog({ onClose, authorId, postId }) {
  const { currentUserId, followingIds } = React.useContext(UserContext);
  const isOwner = currentUserId === authorId;
  const buttonText = isOwner ? "Delete" : "Unfollow";
  const isFollowing = followingIds.some((id) => id === authorId);
  const onClick = isOwner ? handleDeletePost : handleUnfollowUser;
  const isUnrelatedUser = !isOwner && !isFollowing;
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const navigate = useNavigate();

  async function handleDeletePost() {
    const variables = {
      postId,
      userId: currentUserId,
    };
    await deletePost({ variables });
    onClose();
    navigate("/");
    window.location.reload();
  }

  function handleUnfollowUser() {
    const variables = {
      userIdToFollow: authorId,
      currentUserId,
    };
    unfollowUser({ variables });
    onClose();
  }

  return (
    <Dialog
      open
      PaperProps={{ sx: classes.dialogScrollPaper }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      {!isUnrelatedUser && (
        <Button sx={classes.redButton} onClick={onClick}>
          {buttonText}
        </Button>
      )}
      <Divider />
      <Button sx={classes.button}>
        <Link to={`/p/${postId}`}>Go to post</Link>
      </Button>
      <Divider />
      <Button sx={classes.button}>Share</Button>
      <Divider />
      <Button sx={classes.button}>Copy Link</Button>
    </Dialog>
  );
}

export default OptionsDialog;
