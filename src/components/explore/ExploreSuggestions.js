import { Box, Typography } from "@mui/material";
import React from "react";
import { useExploreSuggestionsStyles as classes } from "../../styles";
import FollowSuggestions from "../shared/FollowSuggestions";

function ExploreSuggestions() {
  return (
    <Box sx={{ display: { xs: "none", md: "block" }, width: "90%" }}>
      <Box>
        <Typography
          color="textSecondary"
          variant="subtitle2"
          component="h2"
          sx={classes.typography}
        >
          Discover People
        </Typography>
        <FollowSuggestions hideHeader slidesToShow={5} />
      </Box>
    </Box>
  );
}

export default ExploreSuggestions;
