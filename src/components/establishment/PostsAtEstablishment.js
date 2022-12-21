import React from "react";
import { LoadingLargeIcon } from "./../../icons";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { usePostsAtEstablishment as classes } from "../../styles";
import { useQuery } from "@apollo/client";
import { GET_POSTS_AT_ESTABLISHMENT } from "../../graphql/queries";
import GridPost from "./../shared/GridPost";

function PostsAtEstablishment({ establishment }) {
  const { id, name } = establishment;
  const variables = { establishmentId: id };
  const { data, loading } = useQuery(GET_POSTS_AT_ESTABLISHMENT, {
    variables,
    fetchPolicy: "no-cache",
  });

  if (loading) return <LoadingLargeIcon />;

  return (
    <Box sx={classes.container}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        gutterBottom
        sx={classes.typography}
      >
        More Posts at{" "}
        <Link to={`/${id}`} sx={classes.link}>
          {name}
        </Link>
      </Typography>

      <Box component="article" sx={classes.article}>
        <Box sx={classes.postContainer}>
          {data?.posts.map((post) => (
            <GridPost key={post.id} post={post} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default PostsAtEstablishment;
