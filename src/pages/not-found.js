import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/shared/Layout";

function NotFoundPage() {
  return (
    <Layout minimalNabar title="Page Not Found" marginTop={120}>
      <Typography variant="h5" align="center" component="p">
        Sorry, this page isn't available.
      </Typography>
      <Typography align="center">
        The page may have been removed or the link you followed may be broken.
      </Typography>
      <Link to="/">
        <Typography align="center" color="primary" component="p">
          Go back to Foodiegram.
        </Typography>
      </Link>
    </Layout>
  );
}

export default NotFoundPage;
