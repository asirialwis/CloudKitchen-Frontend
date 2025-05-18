// src/components/kalindu/MapView.js
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const MapView = ({
  center,
  markers = [],
  directions = null,
  initialZoom = 12,
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const mapRef = useRef();

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onZoomChanged={() => {
        if (mapRef.current) {
          setZoom(mapRef.current.getZoom());
        }
      }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          label={marker.label}
          title={marker.title}
        />
      ))}

      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapView;
