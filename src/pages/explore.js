import React from "react";
import ExploreGrid from "../components/explore/ExploreGrid";
import Layout from "../components/shared/Layout";
import { LoadingLargeIcon } from "../icons";
import SearchWithinRange from "../components/shared/SearchWithinRange";
import ExploreSuggestions from "./../components/explore/ExploreSuggestions";
import { useQuery } from "@apollo/client";
import {
  EXPLORE_POSTS_WITHIN_RANGE,
  EXPLORE_POSTS,
} from "./../graphql/queries";
import { UserContext } from "./../App";

function ExplorePage() {
  const { followingIds, currentUserId } = React.useContext(UserContext);
  const followingIdsAndMe = [...followingIds, currentUserId];
  const [useFilter, setUseFilter] = React.useState(false);
  const [queryVariables, setQueryVariables] = React.useState({
    followingIds: followingIdsAndMe,
  });

  function handleFilterPosts(variables) {
    setUseFilter(true);
    setQueryVariables({ followingIds: followingIdsAndMe, ...variables });
  }

  const { data, loading } = useQuery(
    useFilter ? EXPLORE_POSTS_WITHIN_RANGE : EXPLORE_POSTS,
    {
      variables: queryVariables,
      fetchPolicy: "no-cache",
    }
  );

  /*  let posts = establishmentIds
    ? data.posts.filter((post) =>
        establishmentIds.includes(post.establishment_id)
      )
    : data?.posts;
  console.log("posts", posts); */

  /*  const [getFilteredPosts, { loading, error, data }] = useLazyQuery(
    GET_POSTS_WITHIN_RANGE
  );

  function handleFilterPosts(variables) {
    getFilteredPosts({ variables });
  } */

  /*  if (error) return `Error! ${error}`;
  if (data) {
    establishmentIds = data.establishments.map((e) => e.id);
    console.log("establishmentidsmain", establishmentIds);
  } */
  return (
    <Layout>
      <SearchWithinRange handleFilterPosts={handleFilterPosts} />
      <ExploreSuggestions />
      {loading ? <LoadingLargeIcon /> : <ExploreGrid posts={data.posts} />}
    </Layout>
  );
}

export default ExplorePage;
