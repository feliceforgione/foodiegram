import React from "react";
import Autocomplete from "react-google-autocomplete";

function GooglePlacesAutoComplete({ targetRef }) {
  console.log("googleplaces");
  return (
    <Autocomplete
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onPlaceSelected={(place) => {
        console.log(place);
        targetRef.current = place;
      }}
      style={{ width: "100%" }}
      options={{
        componentRestrictions: { country: "us" },
        //fields: ["geometry", "name", "website"],
        fields: ["geometry", "name", "url"],
        strictBounds: false,
        types: ["establishment"],
      }}
    />
  );
}

export default GooglePlacesAutoComplete;
