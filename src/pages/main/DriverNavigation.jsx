// src/pages/DriverNavigation.js
import React, { useEffect, useState } from 'react';
import MapView from '../../components/kalindu/MapView';
import axios from "axios"

const DriverNavigation = () => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {

    axios.get(`http://localhost:3000/api/notification-service/api/notifications/unread/`)

  }, [])

  useEffect(() => {
    const getDirections = async () => {



      const directionsService = new window.google.maps.DirectionsService();

      const result = await directionsService.route({
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
    };

    if (pickupLocation && dropoffLocation) {
      getDirections();
    }
  }, [pickupLocation, dropoffLocation]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center p-4 max-w-md">
          <p className="text-xl font-medium mb-2">Error loading restaurants</p>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600 mb-4">
            Make sure your backend server is running at http://localhost:3000
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#fe5725] text-white px-4 py-2 rounded hover:bg-[#e04a20] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MapView
      center={pickupLocation}
      directions={directions}
    />
  );
};

export default DriverNavigation;
