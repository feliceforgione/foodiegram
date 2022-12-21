import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button, Checkbox, Divider, Typography } from "@mui/material";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import GeoLocation from "./GeoLocation";
import Autocomplete from "react-google-autocomplete";

function SearchWithinRange({ handleFilterPosts }) {
  const [distance, setDistance] = React.useState(5);
  const [useCurrentLocation, setCurrentLocation] = React.useState(false);
  const [userCurrentCoordinates, setUserCurrentCoordiantes] =
    React.useState(null);

  function handleCurrentLocation(event) {
    setCurrentLocation(event.target.checked);
  }

  const handleDistance = (event, newValue) => {
    setDistance(newValue);
  };

  function handleFilterData() {
    const variables = {
      distance: distance * 1609,
      longitude: userCurrentCoordinates.longitude,
      latitude: userCurrentCoordinates.latitude,
    };
    handleFilterPosts(variables);
  }
  return (
    <Accordion style={{ margin: "0 0 20px 0" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography component={"h5"} variant={"h5"}>
          Filter Posts By Distance
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <FormGroup>
            {!useCurrentLocation && (
              <Autocomplete
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                onPlaceSelected={(place) => {
                  setUserCurrentCoordiantes({
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                  });
                }}
                style={{
                  width: "100%",
                  height: "40px",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
                placeholder="Enter Location"
                options={{
                  componentRestrictions: { country: "us" },
                  fields: ["geometry"],
                  strictBounds: false,
                  types: ["address"],
                }}
              />
            )}
            <Box style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<PinDropOutlinedIcon />}
                    checkedIcon={<PinDropIcon />}
                    checked={useCurrentLocation}
                    onChange={handleCurrentLocation}
                  />
                }
                label="Use Current Location"
              />
              {useCurrentLocation && (
                <GeoLocation
                  setUserCurrentCoordiantes={setUserCurrentCoordiantes}
                />
              )}
            </Box>
          </FormGroup>
          <Divider style={{ margin: "20px 0" }} />
          <Typography id="milage-slider">Miles Range</Typography>
          <Slider
            value={distance}
            valueLabelDisplay="on"
            min={1}
            max={20}
            aria-labelledby="milage-slider"
            onChange={handleDistance}
          />
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" size="large" onClick={handleFilterData}>
              Filter
            </Button>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default SearchWithinRange;
