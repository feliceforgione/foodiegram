import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const wslink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_URI_WS,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
        "content-type": "application/json",
      },
    },
  })
);

const client = new ApolloClient({
  link: wslink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: false,

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
        },
      },
    },
  }),
});

export default client;
