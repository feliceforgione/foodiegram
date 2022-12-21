import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useMorePostsFromUserStyles as classes } from "../../styles";
import { LoadingLargeIcon } from "./../../icons";
import GridPost from "./../shared/GridPost";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_POST, GET_MORE_POSTS_FROM_USER } from "../../graphql/queries";

function MorePostsFromUser({ postId }) {
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });

  const [getMorePostsFromUser, { data: morePosts, loading: loading2 }] =
    useLazyQuery(GET_MORE_POSTS_FROM_USER);

  React.useEffect(() => {
    if (loading) return;
    const userId = data.posts_by_pk.user.id;
    const postId = data.posts_by_pk.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables, fetchPolicy: "no-cache" });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <Box sx={classes.container}>
      {loading || loading2 ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            component="h2"
            gutterBottom
            sx={classes.typography}
          >
            More Posts From{" "}
            <Link to={`/${data.posts_by_pk.user.username}`} sx={classes.link}>
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>

          <Box component="article" sx={classes.article}>
            <Box sx={classes.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost key={post.id} post={post} />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default MorePostsFromUser;
