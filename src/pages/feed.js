import React, { useState } from "react";
import { UserContext } from "./../App";
import { useFeedPageStyles as classes } from "../styles";
import Layout from "../components/shared/Layout";
import { useQuery } from "@apollo/client";
import { GET_FEED } from "../graphql/queries";
import { Box } from "@mui/system";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import FeedSideSuggestions from "./../components/feed/FeedSideSuggestions";
import UserCard from "./../components/shared/UserCard";
import LoadingScreen from "../components/shared/LoadingScreen";
import Footer from "../components/shared/Footer";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const FeedPost = React.lazy(() => import("./../components/feed/FeedPost"));

function FeedPage() {
  const { me, feedIds } = React.useContext(UserContext);
  const variables = {
    limit: 1,
    feedIds,
    lastTimestamp: new Date().toISOString().slice(0, -5),
  };

  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });

  const [isEndOfFeed, setEndofFeed] = useState(false);

  function handleUpdateQuery(prev, { fetchMoreResult }) {
    if (fetchMoreResult.posts.length === 0) {
      setEndofFeed(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }

  function fetchMorePosts() {
    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const variables = { limit: 1, feedIds, lastTimestamp };

    fetchMore({
      variables,
      updateQuery: handleUpdateQuery,
    });
  }

  /*   React.useEffect(() => {
    const scrolling_function = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 10 &&
        data
      ) {
        console.log("fetching more.........");
        window.removeEventListener("scroll", scrolling_function);
        console.log("data inside", data);
        const lastTimestamp = data.posts[data.posts.length - 1].created_at;
        const variables = { limit: 1, feedIds, lastTimestamp };

        const resp = fetchMore({
          variables,
          updateQuery: handleUpdateQuery,
        });
        console.log("resp", resp);
      }
    };
    window.addEventListener("scroll", scrolling_function);
  }, [data, feedIds, fetchMore]); */

  if (loading) return <LoadingScreen />;
  const isFeedEmpty = data.posts.length === 0;

  return (
    <Layout>
      <Box sx={classes.container}>
        <Box>
          {/*     {data.posts.map((post, index) => (
            <React.Suspense
              key={post.id + index}
              fallback={<FeedPostSkeleton />}
            >
              <FeedPost post={post} index={index} />
            </React.Suspense>
          ))} */}
          {isFeedEmpty ? (
            <ExploreNotification />
          ) : (
            <InfiniteScroll
              dataLength={data.posts.length}
              next={fetchMorePosts}
              hasMore={!isEndOfFeed}
              loader={<LoadingLargeIcon />}
            >
              {data.posts.map((post, index) => (
                <React.Suspense
                  key={post.id + index}
                  fallback={<FeedPostSkeleton />}
                >
                  <FeedPost post={post} index={index} />
                </React.Suspense>
              ))}
            </InfiniteScroll>
          )}
        </Box>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={classes.sidebarContainer}>
            <Box sx={classes.sidebarWrapper}>
              <UserCard user={me} avatarSize={52} />
              <FeedSideSuggestions />

              <Footer size="mini" />
            </Box>
          </Box>
        </Box>
        {!isFeedEmpty && !isEndOfFeed && <LoadingLargeIcon />}
      </Box>
    </Layout>
  );
}

function ExploreNotification() {
  return (
    <Link to="/explore">
      <Box sx={classes.exploreNotificationWrapper}>
        <ExploreOutlinedIcon style={{ width: "100px", height: "100px" }} />

        <Typography variant="h6">Populate Your Feed</Typography>
        <Typography variant="body1">
          Find people to follow on the Explore Page
        </Typography>
      </Box>
    </Link>
  );
}
export default FeedPage;
