import { Box } from "@mui/system";
import React from "react";
import Layout from "../components/shared/Layout";
import { useProfilePageStyles } from "../styles";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Divider,
  Typography,
  Zoom,
} from "@mui/material";
import ProfilePicture from "./../components/shared/ProfilePicture";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "./../auth";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_USER_PROFILE } from "./../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "./../App";
import { FOLLOW_USER, UNFOLLOW_USER } from "./../graphql/mutations";

function ProfilePage() {
  const { currentUserId } = React.useContext(UserContext);
  const { username } = useParams();
  const classes = useProfilePageStyles();

  const [showOptionsMenu, setOptionsMenu] = React.useState(false);
  const variables = { username };
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables,
    fetchPolicy: "no-cache",
  });

  if (loading) return <LoadingScreen />;
  const user = data.users[0];
  const isOwner = currentUserId === user.id;

  function handleOptionsMenuClick() {
    setOptionsMenu(true);
  }

  function handleCloseMenu() {
    setOptionsMenu(false);
  }
  return (
    <Layout title={`${user.name} (@${user.username})`}>
      <Box sx={classes.container}>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Card sx={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} image={user.profile_image} />
            <CardContent sx={classes.cardContentLarge}>
              <ProfileNameSection
                user={user}
                isOwner={isOwner}
                handleOptionsMenuClick={handleOptionsMenuClick}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <Card sx={classes.cardSmall}>
            <CardContent>
              <Box component="section" sx={classes.sectionSmall}>
                <ProfilePicture
                  size={77}
                  isOwner={isOwner}
                  image={user.profile_image}
                />
                <ProfileNameSection
                  user={user}
                  isOwner={isOwner}
                  handleOptionsMenuClick={handleOptionsMenuClick}
                />
              </Box>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card>
        </Box>
        {showOptionsMenu && <OptionsMenu handleCloseMenu={handleCloseMenu} />}
        <ProfileTabs user={user} isOwner={isOwner} />
      </Box>
    </Layout>
  );
}

function ProfileNameSection({ user, isOwner, handleOptionsMenuClick }) {
  const classes = useProfilePageStyles();
  const { currentUserId, followingIds, followerIds } =
    React.useContext(UserContext);
  const [showUnfollowDialog, setUnfollowDialog] = React.useState(false);
  let followButton;

  const isAlreadyFollowing = followingIds.some((id) => id === user.id);

  const [isFollowing, setFollowing] = React.useState(isAlreadyFollowing);
  const isFollower = !isFollowing && followerIds.some((id) => id === user.id);
  const variables = {
    userIdToFollow: user.id,
    currentUserId,
  };
  const [followUser] = useMutation(FOLLOW_USER);

  function handleFollowUser() {
    setFollowing(true);
    followUser({ variables });
  }

  const onUnfollowUser = React.useCallback(() => {
    setFollowing(false);
    setUnfollowDialog(false);
  }, []);

  if (isFollowing) {
    followButton = (
      <Button
        variant="outlined"
        sx={classes.button}
        onClick={() => setUnfollowDialog(true)}
      >
        Following
      </Button>
    );
  } else if (isFollower) {
    followButton = (
      <Button
        variant="contained"
        sx={classes.button}
        color="primary"
        onClick={handleFollowUser}
      >
        Follow Back
      </Button>
    );
  } else {
    followButton = (
      <Button
        variant="contained"
        sx={classes.button}
        color="primary"
        onClick={handleFollowUser}
      >
        Follow
      </Button>
    );
  }
  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Box component="section" sx={classes.usernameSection}>
          <Typography sx={classes.username}>{user.username}</Typography>
          {isOwner ? (
            <>
              <Link to={"/accounts/edit"}>
                <Button variant="outlined" sx={classes.editButton}>
                  Edit Profile
                </Button>
              </Link>
              <Box
                onClick={handleOptionsMenuClick}
                sx={classes.settingsWrapper}
              >
                <GearIcon sx={classes.settings} />
              </Box>
            </>
          ) : (
            <>{followButton}</>
          )}
        </Box>
      </Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Box component="section">
          <Box sx={classes.usernameDivSmall}>
            <Typography sx={classes.username}>{user.username}</Typography>
            {isOwner && (
              <Box
                onClick={handleOptionsMenuClick}
                sx={classes.settingsWrapper}
              >
                <GearIcon sx={classes.settings} />
              </Box>
            )}
          </Box>
          {isOwner ? (
            <Link to={"/accounts/edit"}>
              <Button variant="outlined" sx={classes.editButton}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            <>{followButton}</>
          )}
        </Box>
      </Box>
      {showUnfollowDialog && (
        <UnfollowDialog
          onUnfollowUser={onUnfollowUser}
          onClose={() => setUnfollowDialog(false)}
          user={user}
        />
      )}
    </>
  );
}

function UnfollowDialog({ onClose, user, onUnfollowUser }) {
  const classes = useProfilePageStyles();
  const { currentUserId } = React.useContext(UserContext);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  function handleUnfollowUser() {
    const variables = {
      currentUserId,
      userIdToFollow: user.id,
    };
    unfollowUser({ variables });
    onUnfollowUser();
  }
  return (
    <Dialog
      open
      sx={{
        "& .MuiDialog-scrollPaper": { ...classes.unfollowDialogScrollPaper },
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <Box sx={classes.wrapper}>
        <Avatar
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          sx={classes.avatar}
        />
      </Box>
      <Typography
        align="center"
        sx={classes.unfollowDialogText}
        variant="body2"
      >
        Unfollow @{user.username}?
      </Typography>
      <Divider />
      <Button onClick={handleUnfollowUser} sx={classes.unfollowButton}>
        Unfollow
      </Button>
      <Button onClick={onClose} sx={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  );
}

function PostCountSection({ user }) {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "following"];

  return (
    <>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Divider />
      </Box>
      <Box component="section" sx={classes.followingSection}>
        {options.map((option) => (
          <Box key={option} sx={classes.followingText}>
            <Typography sx={classes.followingCount}>
              {user[`${option}_aggregate`].aggregate.count}
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography>{option}</Typography>
            </Box>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <Typography color="textSecondary">{option}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Divider />
      </Box>
    </>
  );
}

function NameBioSection({ user }) {
  const classes = useProfilePageStyles();
  const { name, bio, website } = user;
  return (
    <Box component="section" sx={classes.section}>
      <Typography sx={classes.typography}>{name}</Typography>
      <Typography>{bio}</Typography>
      <Typography color="secondary" sx={classes.typography}>
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      </Typography>
    </Box>
  );
}

function OptionsMenu({ handleCloseMenu }) {
  const classes = useProfilePageStyles();
  const { signOut } = React.useContext(AuthContext);
  const client = useApolloClient();

  const [showLogOutMessage, setLogOutMessage] = React.useState(false);

  const navigate = useNavigate();

  function handleLogOutClick() {
    setLogOutMessage(true);
    setTimeout(async () => {
      await client.resetStore();
      signOut();
      navigate("/accounts/login");
    }, 2000);
  }

  return (
    <Dialog
      open
      TransitionComponent={Zoom}
      sx={{
        "& .MuiDialog-paper": { ...classes.dialogPaper },
        "& .MuiDialog-scrollPaper": { ...classes.dialogScrollPaper },
      }}
    >
      {showLogOutMessage ? (
        <DialogTitle sx={classes.dialogTitle}>
          Logging Out
          <Typography color="textSecondary">
            You need to log back in to continue using this application
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionItem text="Change Password" />
          <OptionItem text="Nametag" />
          <OptionItem text="Notifications" />
          <OptionItem text="Privacy and Security" />
          <OptionItem text="Log out" onClick={handleLogOutClick} />
          <OptionItem text="Cancel" onClick={handleCloseMenu} />
        </>
      )}
    </Dialog>
  );
}

function OptionItem({ text, onClick }) {
  return (
    <>
      <Button style={{ padding: "12px 8px" }} onClick={onClick}>
        {text}
      </Button>
      <Divider />
    </>
  );
}

export default ProfilePage;
