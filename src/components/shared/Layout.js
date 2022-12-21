import React from "react";
import SEO from "../shared/Seo";
import Navbar from "../shared/Navbar";
import { Box } from "@mui/system";
import { useLayoutStyles } from "../../styles";
import Footer from "./Footer";

function Layout({ children, minimalNabar = false, title, marginTop = 60 }) {
  return (
    <Box component="section" sx={useLayoutStyles.section}>
      <SEO title={title} />
      <Navbar minimalNabar={minimalNabar} />
      <Box component="main" sx={useLayoutStyles.main} style={{ marginTop }}>
        <Box component="section" sx={useLayoutStyles.childrenWrapper}>
          <Box sx={useLayoutStyles.children}>{children}</Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

export default Layout;
