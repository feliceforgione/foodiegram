import React from "react";

const Map = ({ center, style, zoom }) => {
  const ref = React.useRef();

  React.useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });
  return <div ref={ref} id="map" style={style} />;
};

export default Map;
