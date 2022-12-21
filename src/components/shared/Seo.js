import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

function SEO({ title }) {
  const titleText = title ? title : "Foodiegram";
  return (
    <HelmetProvider>
      <Helmet>
        <title>{titleText}</title>
      </Helmet>
    </HelmetProvider>
  );
}

export default SEO;
