import { useQuery } from "@apollo/client";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { SUGGEST_USERS } from "../../graphql/queries";
import { LoadingIcon } from "../../icons";
import { useFeedSideSuggestionsStyles as classes } from "../../styles";
import UserCard from "../shared/UserCard";
import FollowButton from "./../shared/FollowButton";
import { UserContext } from "./../../App";

function FeedSideSuggestions() {
  const { me, followerIds } = React.useContext(UserContext);
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
    <Box sx={classes.article} component="article">
      <Paper sx={classes.paper}>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          component="h2"
          align="left"
          gutterBottom
          sx={classes.typography}
        >
          Suggestions For You
        </Typography>
        {loading ? (
          <LoadingIcon />
        ) : (
          data.users.map((user) => (
            <Box key={user.id} sx={classes.card}>
              <UserCard user={user} />
              <FollowButton id={user.id} side />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

export default FeedSideSuggestions;
