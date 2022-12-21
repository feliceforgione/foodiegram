import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import theme from "./themes/theme.js";
import { CssBaseline, Typography } from "@mui/material";
import { ApolloProvider } from "@apollo/client";

import client from "./graphql/client";
import AuthProvider from "./auth";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography component="h1" variant="h6" align="center">
          Oops! Something went wrong.
        </Typography>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme>
              <App />
            </CssBaseline>
          </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
