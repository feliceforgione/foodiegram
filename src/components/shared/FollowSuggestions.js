import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { LoadingLargeIcon } from "../../icons";
import { useFollowSuggestionsStyles as classes } from "../../styles";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import { UserContext } from "./../../App";
import { useQuery } from "@apollo/client";
import { SUGGEST_USERS } from "../../graphql/queries";

function FollowSuggestions({ hideHeader, slidesToShow = 3 }) {
  const { followerIds, me } = React.useContext(UserContext);
  const [queryParameters, setQueryParameters] = React.useState({
    limit: 5,
    followerIds,
    createdAt: me.created_at,
  });

  const { data, loading } = useQuery(SUGGEST_USERS, {
    variables: queryParameters,
  });

  if (loading) return;
  if (data?.users.length === 0)
    setQueryParameters({
      limit: 5,
      followerIds,
      createdAt: "2021-12-20T08:57:53.517323+00:00",
    });

  return (
    <Box sx={classes.container}>
      {!hideHeader && (
        <Typography
          color="textSecondary"
          variant="subtitle2"
          sx={classes.typography}
        >
          Suggestions For You
        </Typography>
      )}
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <Box sx={classes.slide}>
          <Slider
            dots={false}
            infinite
            speed={1200}
            touchThreshold={1200}
            variableWidth
            swiptToSlide
            arrows
            rows={1}
            slidesToShow={3}
            slideToScroll={2}
            easing="ease-in-out"
          >
            {data.users.map((user) => (
              <FollowSuggestionsItem key={user.id} user={user} />
            ))}
          </Slider>
        </Box>
      )}
    </Box>
  );
}

function FollowSuggestionsItem({ user }) {
  const { profile_image, username, name, id } = user;

  return (
    <Box>
      <Box sx={classes.card}>
        <Link to={`/${username}`}>
          <Avatar
            src={profile_image}
            alt={`${username}'s profile`}
            sx={classes.avatar}
          />
        </Link>
        <Link to={`/${username}`}>
          <Typography variant="subtitle2" sx={classes.text} align="center">
            {username}
          </Typography>
          <Typography
            color="textSecondary"
            varinat="body2"
            sx={classes.text}
            align="center"
          >
            {name}
          </Typography>
          <FollowButton id={id} side={false} />
        </Link>
      </Box>
    </Box>
  );
}

export default FollowSuggestions;
