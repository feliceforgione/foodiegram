import { Typography } from "@mui/material";
import React from "react";
import { useGeolocated } from "react-geolocated";

const GeoLocation = ({ setUserCurrentCoordiantes }) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  React.useEffect(() => {
    if (isGeolocationAvailable && coords)
      setUserCurrentCoordiantes({
        longitude: coords.longitude,
        latitude: coords.latitude,
      });
  }, [coords, setUserCurrentCoordiantes, isGeolocationAvailable]);

  return !isGeolocationAvailable ? (
    <Typography>Geolocation not Supported</Typography>
  ) : !isGeolocationEnabled ? (
    <Typography>Geolocation not enabled</Typography>
  ) : coords ? (
    <Typography component={"span"} variant="h6">
      {`[${coords.longitude}, ${coords.latitude}]`}{" "}
    </Typography>
  ) : (
    <div>Getting the location data&hellip; </div>
  );
};

export default GeoLocation;
