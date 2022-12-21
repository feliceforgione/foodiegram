import { gql } from "@apollo/client";

export const CHECK_IF_USERNAME_TAKEN = gql`
  query checkIfUsernameTaken($username: String!) {
    users(where: { username: { _eq: $username } }) {
      username
    }
  }
`;

export const GET_USER_EMAIL = gql`
  query getUserEmail($input: String!) {
    users(
      where: {
        _or: [{ phone_number: { _eq: $input } }, { username: { _eq: $input } }]
      }
    ) {
      email
    }
  }
`;

export const GET_EDIT_USER_PROFILE = gql`
  query getEditUserProfile($id: uuid!) {
    users_by_pk(id: $id) {
      id
      username
      name
      email
      bio
      profile_image
      website
      phone_number
    }
  }
`;

export const SEARCH_USERS = gql`
  query searchUsers($query: String!) {
    users(
      where: {
        _or: [{ name: { _ilike: $query } }, { username: { _ilike: $query } }]
      }
    ) {
      id
      username
      name
      profile_image
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    users(where: { username: { _eq: $username } }) {
      id
      name
      username
      website
      bio
      profile_image
      posts_aggregate {
        aggregate {
          count
        }
      }
      followers_aggregate {
        aggregate {
          count
        }
      }
      following_aggregate {
        aggregate {
          count
        }
      }
      saved_posts(order_by: { created_at: desc }) {
        post {
          media
          id
          likes_aggregate {
            aggregate {
              count
            }
          }
          comments_aggregate {
            aggregate {
              count
            }
          }
        }
      }
      posts(order_by: { created_at: desc }) {
        media
        id
        likes_aggregate {
          aggregate {
            count
          }
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

// find uses who follow you are created an account close to the time you did
export const SUGGEST_USERS = gql`
  query suggestUsers(
    $limit: Int!
    $followerIds: [uuid!]!
    $createdAt: timestamptz!
  ) {
    users(
      limit: $limit
      where: {
        _or: [
          { id: { _in: $followerIds } }
          { created_at: { _gt: $createdAt } }
        ]
      }
      order_by: { posts_aggregate: { count: desc } }
    ) {
      id
      username
      name
      profile_image
    }
  }
`;

// sort posts by  most comments and likes from people user is not following
export const EXPLORE_POSTS = gql`
  query explorePosts($followingIds: [uuid!]!) {
    posts(
      order_by: {
        created_at: desc
        likes_aggregate: { count: desc }
        comments_aggregate: { count: desc }
      }
      where: { user_id: { _nin: $followingIds } }
    ) {
      media
      id
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      establishment_id
    }
  }
`;

export const EXPLORE_POSTS_WITHIN_RANGE = gql`
  query explorePosts(
    $followingIds: [uuid!]!
    $distance: Float!
    $longitude: float8
    $latitude: float8
  ) {
    posts(
      order_by: {
        created_at: desc
        likes_aggregate: { count: desc }
        comments_aggregate: { count: desc }
      }
      where: {
        user_id: { _nin: $followingIds }
        establishment: {
          location_geom: {
            _st_d_within: {
              distance: $distance
              from: { type: "Point", coordinates: [$longitude, $latitude] }
            }
          }
        }
      }
    ) {
      media
      id
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      establishment_id
    }
  }
`;

export const GET_MORE_POSTS_FROM_USER = gql`
  query getMorePostsFromUser($userId: uuid!, $postId: uuid!) {
    posts(
      limit: 6
      where: { user_id: { _eq: $userId }, _not: { id: { _eq: $postId } } }
    ) {
      id
      media
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_POST = gql`
  query getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
      id
      user {
        id
        username
      }
    }
  }
`;

export const GET_FEED = gql`
  query getFeed($limit: Int!, $feedIds: [uuid!]!, $lastTimestamp: timestamptz) {
    posts(
      limit: $limit
      where: { user_id: { _in: $feedIds }, created_at: { _lt: $lastTimestamp } }
      order_by: { created_at: desc }
    ) {
      caption
      created_at
      location
      id
      media
      user_id
      user {
        id
        username
        name
        profile_image
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
      saved_posts {
        id
        user_id
      }
      likes {
        id
        user_id
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      comments(order_by: { created_at: desc }, limit: 2) {
        id
        content
        created_at
        user {
          username
        }
      }
      establishment {
        id
        name
        google_url
      }
    }
  }
`;

export const GET_ESTABLISHMENT = gql`
  query getEstablishment($establishmentId: uuid!) {
    establishments_by_pk(id: $establishmentId) {
      id
      name
      longitude
      latitude
      google_url
      address
      coordinates
    }
  }
`;

export const GET_POSTS_AT_ESTABLISHMENT = gql`
  query getPostsAtEstablishment($establishmentId: uuid!) {
    posts(
      where: { establishment_id: { _eq: $establishmentId } }
      limit: 6
      order_by: { created_at: desc }
    ) {
      id
      media
      likes_aggregate {
        aggregate {
          count
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_POSTS_WITHIN_RANGE_ORIGINAL = gql`
  query getPostsWithinRange(
    $distance: Float!
    $longitude: float8
    $latitude: float8
  ) {
    establishments(
      where: {
        location_geom: {
          _st_d_within: {
            distance: $distance
            from: { type: "Point", coordinates: [$longitude, $latitude] }
          }
        }
      }
    ) {
      id
    }
  }
`;
