import {
  AppBar,
  Avatar,
  Grid,
  InputBase,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import {
  useNavbarStyles as classes,
  whiteTooltip,
  redTooltip,
} from "../../styles";
import { Box } from "@mui/system";
import {
  LoadingIcon,
  AddIcon,
  LikeIcon,
  LikeActiveIcon,
  ExploreIcon,
  ExploreActiveIcon,
  HomeIcon,
  HomeActiveIcon,
} from "../../icons";

import NotificationTooltip from "./../notification/NotificationTooltip";
import NotificationList from "../notification/NotificationList";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_USERS } from "../../graphql/queries";
import { UserContext } from "./../../App";
import UploadWidget from "./UploadWidget";
import AddPostDialog from "./../post/AddPostDialog";
import isAfter from "date-fns/isAfter";

function Navbar({ minimalNabar }) {
  const { pathname: path } = useLocation();

  return (
    <AppBar sx={classes.appBar}>
      <Box sx={classes.section} component="section">
        <Logo />
        <Search />
        {!minimalNabar && <Links path={path} />}
      </Box>
    </AppBar>
  );
}

function Logo() {
  return (
    <Box sx={classes.logoContainer}>
      <Link to="/">
        <Box sx={classes.logoWrapper}>
          <Box src={logo} alt="Foodiegram" sx={classes.logo} component="img" />
        </Box>
      </Link>
    </Box>
  );
}

function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);

  const hasResults = Boolean(query) && results.length > 0;

  React.useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    searchUsers({ variables: { query: `%${query}%` } });

    if (data) {
      setResults(data.users);
      setLoading(false);
    }
  }, [query, searchUsers, data]);

  function handleClearInput() {
    setQuery("");
  }

  return (
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <Tooltip
        arrow
        interactive="true"
        componentsProps={{
          tooltip: { sx: whiteTooltip.tooltip },
          arrow: { sx: whiteTooltip.arrow },
        }}
        open={hasResults}
        title={
          hasResults && (
            <Grid sx={classes.resultContainer} container>
              {results.map((result) => (
                <Grid
                  item
                  key={result.id}
                  sx={classes.resultLink}
                  onClick={() => {
                    navigate(`/${result.username}`);
                    handleClearInput();
                  }}
                >
                  <Box sx={classes.resultWrapper}>
                    <Box sx={classes.avatarWrapper}>
                      <Avatar src={result.profile_image} alt="user avatar" />
                    </Box>
                    <Box sx={classes.nameWrapper}>
                      <Typography variant="body1">{result.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
        <InputBase
          sx={classes.input}
          value={query}
          placeholder="Search users"
          onChange={(e) => setQuery(e.target.value)}
          startAdornment={<Box component="span" sx={classes.searchIcon} />}
          endAdornment={
            loading ? (
              <LoadingIcon />
            ) : (
              <Box
                component="span"
                sx={classes.clearIcon}
                onClick={handleClearInput}
              />
            )
          }
        />
      </Tooltip>
    </Box>
  );
}

function Links({ path }) {
  const { me, currentUserId } = React.useContext(UserContext);
  const newNotifications = me.notifications.filter((notification) =>
    isAfter(new Date(notification.created_at), new Date(me.last_checked))
  );
  const hasNotifications = newNotifications.length > 0;
  const [showList, setShowList] = useState(false);
  const [showTooltip, setTooltip] = useState(hasNotifications);
  const [showAddPostDialog, setAddPostDialog] = useState(false);
  const [media, setMedia] = useState(null);

  React.useEffect(() => {
    const timeout = setTimeout(handleHideToolTip, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function handleToggleList() {
    setShowList((prevState) => !prevState);
  }

  function handleHideToolTip() {
    setTooltip(false);
  }

  function handleHideList() {
    setShowList(false);
  }

  //Cloudinary Post Image
  async function handleOnUpload(error, result, widget) {
    if (error) {
      console.log(error);
      widget.close({
        quiet: true,
      });
      return;
    }

    console.log("Image Uploaded to Cloudinary", result);
    setMedia(result.info);
    setAddPostDialog(true);
  }

  return (
    <Box sx={classes.linksContainer}>
      {showList && (
        <NotificationList
          notifications={me.notifications}
          handleHideList={handleHideList}
          currentUserId={currentUserId}
        />
      )}
      <Box sx={classes.linksWrapper}>
        {/* Add New Post Button */}

        {showAddPostDialog && (
          <AddPostDialog
            media={media}
            handleClose={() => setAddPostDialog(false)}
          />
        )}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <UploadWidget onUpload={handleOnUpload}>
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return <AddIcon onClick={handleOnClick} />;
            }}
          </UploadWidget>
        </Box>
        {/* Home button */}
        <Link to="/">{path === "/" ? <HomeActiveIcon /> : <HomeIcon />}</Link>
        {/* Explore Button  */}
        <Link to="/explore">
          {path === "/explore" ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        {/* Notifcation Tooltip */}
        <Tooltip
          arrow
          interactive="true"
          componentsProps={{
            tooltip: { sx: redTooltip.tooltip },
            arrow: { sx: redTooltip.arrow },
            popper: { sx: redTooltip.popper },
          }}
          open={showTooltip}
          onOpen={handleHideToolTip}
          TransitionComponent={Zoom}
          title={<NotificationTooltip notifications={newNotifications} />}
        >
          <Box
            sx={hasNotifications ? classes.notifications : null}
            onClick={handleToggleList}
          >
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </Box>
        </Tooltip>
        {/* User Profile Button*/}
        <Link to={`/${me.username}`}>
          <Box sx={path === `/${me.username}` ? classes.profileActive : null} />
          <Avatar src={me.profile_image} sx={classes.profileImage} />
        </Link>
      </Box>
    </Box>
  );
}

export default Navbar;
