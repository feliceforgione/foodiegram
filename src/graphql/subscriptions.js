import { gql } from "@apollo/client";

export const ME = gql`
  subscription me($userId: String) {
    users(where: { user_id: { _eq: $userId } }) {
      id
      username
      name
      last_checked
      profile_image
      created_at
      user_id
      followers {
        user {
          id
          user_id
        }
      }
      following {
        user {
          id
          user_id
        }
      }
      notifications(order_by: { created_at: desc }) {
        id
        type
        created_at
        post {
          id
          media
        }
        user {
          id
          username
          profile_image
        }
      }
    }
  }
`;

export const GET_POST = gql`
  subscription getPost($postId: uuid!) {
    posts_by_pk(id: $postId) {
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
      comments(order_by: { created_at: desc }) {
        id
        content
        created_at
        user {
          username
          profile_image
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
