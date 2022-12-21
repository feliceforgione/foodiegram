import React from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "../shared/Map";
import { useEstablishmentStyles as classes } from "../../styles";
import { Box } from "@mui/system";
import { Typography, Link as MaterialLink } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Establishment({ establishment }) {
  const { name, coordinates, google_url, address } = establishment;

  let [lat, lng] = coordinates
    .replace(/[()]/g, "")
    .split(",")
    .map((cor) => parseFloat(cor));

  const center = { lat, lng };
  return (
    <>
      <Box sx={classes.establishmentContainer}>
        <Box component="article" sx={classes.article}>
          <Box sx={classes.establishmentHeader}>
            <Typography variant="h5" component="h2">
              {name}
            </Typography>
            <MaterialLink
              href={`${google_url}`}
              target="_blank"
              rel="noopener"
              style={{ display: "flex" }}
            >
              <OpenInNewIcon />
              <Typography>Google Info</Typography>
            </MaterialLink>
          </Box>
          <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Map
              center={center}
              style={{ ...classes.establishmentMap }}
              zoom={20}
            />
          </Wrapper>
          <MaterialLink
            href={`${google_url}`}
            target="_blank"
            rel="noopener"
            underline="none"
            style={{ display: "flex" }}
          >
            <Typography variant="body1" component="h3">
              {address}
            </Typography>
          </MaterialLink>
        </Box>
      </Box>
    </>
  );
}

export default Establishment;
