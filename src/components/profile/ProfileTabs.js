import React from "react";
import { useProfileTabsStyles } from "../../styles";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { GridIcon, SaveIcon } from "./../../icons";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import GridPost from "../shared/GridPost";

function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box component="section" sx={classes.section}>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Divider />
        </Box>
        <Box sx={isMobile ? classes.visibleFalse : classes.visibleTrue}>
          <Tabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            centered
            sx={{
              "& .MuiTabs-indicator": { ...classes.tabsIndicator },
            }}
          >
            <Tab
              icon={<Box component="span" sx={classes.postsIconLarge} />}
              label="POSTS"
              sx={{
                ...classes.tabRoot,
                "& .MuiTab-iconWrapper": { ...classes.tabWrapper },
              }}
            />

            <Tab
              icon={<Box component="span" sx={classes.savedIconLarge} />}
              label="SAVED"
              sx={{
                ...classes.tabRoot,
                "& .MuiTab-iconWrapper": { ...classes.tabWrapper },
              }}
              style={isOwner ? null : { visibility: "hidden" }}
            />
          </Tabs>
        </Box>
        <Box sx={isMobile ? classes.visibleTrue : classes.visibleFalse}>
          <Tabs
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            centered
            sx={classes.tabs}
          >
            <Tab
              icon={<GridIcon fill={value === 0 ? "#3897f0" : undefined} />}
              sx={{
                ...classes.tabRoot,
                "& .MuiTab-iconWrapper": { ...classes.tabWrapper },
              }}
            />

            <Tab
              sx={{
                ...classes.tabRoot,
                "& .MuiTab-iconWrapper": { ...classes.tabWrapper },
              }}
              style={isOwner ? null : { visibility: "hidden" }}
              icon={<SaveIcon fill={value === 1 ? "#3897f0" : undefined} />}
            />
          </Tabs>
        </Box>
        <Box sx={isMobile ? classes.visibleTrue : classes.visibleFalse}>
          {user.posts.length === 0 && <Divider />}
        </Box>
        {value === 0 && <ProfilePosts user={user} isOwner={isOwner} />}
        {value === 1 && <SavedPosts user={user} />}
      </Box>
    </>
  );
}

function ProfilePosts({ user, isOwner }) {
  const classes = useProfileTabsStyles();

  if (user.posts.length === 0) {
    return (
      <Box component="section" sx={classes.profilePostsSection}>
        <Box sx={classes.noContent}>
          <Box sx={classes.uploadPhotoIcon} />
          <Typography variant="h4">
            {isOwner ? "Upload a Photo" : "No Photos"}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="article" sx={classes.article}>
      <Box sx={classes.postContainer}>
        {user.posts.map((post) => (
          <GridPost key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}

function SavedPosts({ user }) {
  const classes = useProfileTabsStyles();

  console.log(user);
  if (user.saved_posts.length === 0)
    return (
      <Box component="section" sx={classes.savedPostsSection}>
        <Box sx={classes.noContent}>
          <Box sx={classes.savePhotoIcon} />
          <Typography variant="h4">Save</Typography>
          <Typography align="center">
            Save photos and videos that you want to see again.
          </Typography>
        </Box>
      </Box>
    );

  return (
    <Box component="article" sx={classes.article}>
      <Box sx={classes.postContainer}>
        {user.saved_posts.map(({ post }) => (
          <GridPost key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}

export default ProfileTabs;
