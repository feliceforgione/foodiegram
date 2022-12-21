import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Box } from "@mui/material";
import { Person } from "@mui/icons-material";
import Image from "mui-image";

function ProfilePicture({ size, image = "/avatar.png", isOwner }) {
  const classes = useProfilePictureStyles(size, isOwner);
  return (
    <>
      <Box component="section" sx={classes.section}>
        {image ? (
          <Image
            src={image}
            alt="user profile"
            style={classes.image}
            wrapperStyle={classes.wrapper}
          />
        ) : (
          <Box sx={classes.wrapper}>
            <Person sx={classes.person} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default ProfilePicture;
