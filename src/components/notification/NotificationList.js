import { Avatar, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { useNotificationListStyles as classes } from "../../styles";
import FollowButton from "../shared/FollowButton";
import { useOutsideClick } from "rooks";
import { useMutation } from "@apollo/client";
import { CHECK_NOTIFICATIONS } from "../../graphql/mutations";
import { formatDateToNowShort } from "../../utils/formatDate";

function NotificationList({ handleHideList, notifications, currentUserId }) {
  const listContainerRef = React.useRef();
  const [checkNotifications] = useMutation(CHECK_NOTIFICATIONS);

  useOutsideClick(listContainerRef, handleHideList);

  React.useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString(),
    };
    checkNotifications({ variables });
  }, [currentUserId, checkNotifications]);

  return (
    <Grid sx={classes.listContainer} container>
      {notifications.map((notification) => {
        const isLike = notification.type === "like";
        const isFollow = notification.type === "follow";
        return (
          <Grid
            key={notification.id}
            item
            sx={classes.listItem}
            ref={listContainerRef}
          >
            <Box sx={classes.listItemWrapper}>
              <Box sx={classes.avatarWrapper}>
                <Avatar
                  src={notification.user.profile_image}
                  alt="User avatar"
                />
              </Box>
              <Box sx={classes.nameWrapper}>
                <Link to={`/${notification.user.username}`}>
                  <Typography variant="body1">
                    {notification.user.username}
                  </Typography>
                </Link>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={classes.typography}
                >
                  {isLike &&
                    `likes your photo. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                  {isFollow &&
                    `started following you. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                </Typography>
              </Box>
            </Box>
            <Box>
              {isLike && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt="post cover" />
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id} />}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NotificationList;
