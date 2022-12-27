import React from "react";
import { Button, Dialog, Divider, Typography } from "@mui/material";
import {
  EmailShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
} from "react-share";
import { useOptionsDialogStyles as classes } from "../../styles";

function SharePost({ shareUrl, onClose, title = "Foodiegram Post" }) {
  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{ sx: classes.dialogScrollPaper }}
    >
      <Typography component="h3" variant="h5" align="center">
        Share Post
      </Typography>
      <Divider />
      <Button sx={classes.shareButton}>
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={24} round /> Facebook
        </FacebookShareButton>
      </Button>
      <Divider />
      <Button sx={classes.shareButton}>
        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={24} round /> Twitter
        </TwitterShareButton>
      </Button>
      <Divider />
      <Button sx={classes.shareButton}>
        <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
          <WhatsappIcon size={24} round /> Whats App
        </WhatsappShareButton>
      </Button>
      <Divider />
      <Button sx={classes.shareButton}>
        <RedditShareButton url={shareUrl} windowWidth={660} windowHeight={460}>
          <RedditIcon size={24} round /> Reddit
        </RedditShareButton>
      </Button>
      <Divider />
      <Button sx={classes.shareButton}>
        <EmailShareButton url={shareUrl} subject={title} body="body">
          <EmailIcon size={24} round /> Email
        </EmailShareButton>
      </Button>
    </Dialog>
  );
}

export default SharePost;
