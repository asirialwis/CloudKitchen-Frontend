// src/pages/CustomerTracking.js
import React, { useState, useEffect } from 'react';
import MapView from '../../components/kalindu/MapView';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CustomerOrderTracking = ({ route }) => {

  const {orderID} = useParams();

  const [driverLocation, setDriverLocation] = useState({ lat: 6.9271, lng: 79.8612 });

  useEffect(() => {
    let delivery
    axios.get(`http://localhost:3000/api/delivery-service/deliveryByOrder/${orderID}`).then(res => delivery = res.data).catch(err => alert(err.response.data.message));
    // Polling or WebSocket to fetch driver's latest location
    const interval = setInterval(async () => {
      const driverLoc = await axios.get(`http://localhost:3000/api/delivery-service/drivers/${delivery.driverId._id}/location`)

      // console.log(driverLoc)

      setDriverLocation({
        lat: driverLoc.data.currentLocation.lat,
        lng: driverLoc.data.currentLocation.lng
      });
    }, 7000); // Update every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <MapView
      center={driverLocation}
      markers={[{ position: driverLocation }]}
    />
  );
};

export default CustomerOrderTracking;
