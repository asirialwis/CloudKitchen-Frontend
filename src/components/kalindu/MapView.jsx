// src/components/MapView.js
import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const MapView = ({ center, markers = [], directions = null }) => {
  const apiKey = "AIzaSyCjgDOFzVZR8aWVM4SoZMRO0Hw4Lb883Ec"; // store it in .env

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} />
        ))}
        
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
