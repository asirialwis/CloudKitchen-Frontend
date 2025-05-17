import React, { useState, useEffect } from "react";
import MapView from "../../components/kalindu/MapView";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

// Helper function to calculate distance between two points
const calculateDistance = (point1, point2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
  const dLon = (point2.lng - point1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * (Math.PI / 180)) *
      Math.cos(point2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const apiKey = "AIzaSyCjgDOFzVZR8aWVM4SoZMRO0Hw4Lb883Ec";

const CustomerOrderTracking = ({ route }) => {
  const navigate = useNavigate();
  const { orderID } = useParams();

  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDirections = async (driverLoc, pickupLoc, dropoffLoc) => {
    try {
      // First leg: driver to restaurant (if driver hasn't reached restaurant)
      const isAtRestaurant = calculateDistance(driverLoc, pickupLoc) < 0.02; // ~20 meters

      if (!isAtRestaurant) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: driverLoc,
            destination: pickupLoc,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            }
          }
        );
      } else {
        // Second leg: restaurant to customer
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: pickupLoc,
            destination: dropoffLoc,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            }
          }
        );
      }
    } catch (err) {
      console.error("Error calculating directions:", err);
    }
  };

  useEffect(() => {
    let intervalId;

    const fetchDeliveryDetails = async () => {
      try {
        // Fetch delivery details
        const deliveryRes = await axios.get(
          `http://localhost:3000/api/delivery-service/deliveryByOrder/${orderID}`
        );

        const delivery = deliveryRes.data;
        setDeliveryDetails(delivery);

        // Set restaurant and customer locations
        setRestaurantLocation({
          lat: delivery.pickupLocation.lat,
          lng: delivery.pickupLocation.lng,
        });

        setCustomerLocation({
          lat: delivery.dropoffLocation.lat,
          lng: delivery.dropoffLocation.lng,
        });

        // Initial driver location fetch
        if (delivery.driverId && delivery.driverId._id) {
          const driverLocRes = await axios.get(
            `http://localhost:3000/api/delivery-service/drivers/${delivery.driverId._id}/location`
          );
          const initialDriverLocation = {
            lat: driverLocRes.data.currentLocation.lat,
            lng: driverLocRes.data.currentLocation.lng,
          };
          setDriverLocation(initialDriverLocation);

          // Calculate directions
          calculateDirections(
            initialDriverLocation,
            delivery.pickupLocation,
            delivery.dropoffLocation
          );
        }

        setLoading(false);

        // Set up polling for driver location updates
        intervalId = setInterval(async () => {
          try {
            const driverLocRes = await axios.get(
              `http://localhost:3000/api/delivery-service/drivers/${delivery.driverId._id}/location`
            );
            const newDriverLocation = {
              lat: driverLocRes.data.currentLocation.lat,
              lng: driverLocRes.data.currentLocation.lng,
            };
            setDriverLocation(newDriverLocation);

            // Recalculate directions when driver moves
            calculateDirections(
              newDriverLocation,
              delivery.pickupLocation,
              delivery.dropoffLocation
            );
          } catch (err) {
            console.error("Error fetching driver location:", err);
          }
        }, 7000); // Update every 7 seconds
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load delivery details"
        );
        setLoading(false);
      }
    };

    fetchDeliveryDetails();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderID]);

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deliveryDetails) return <div>No delivery details found</div>;

  // Prepare markers for all locations
  const markers = [];

  if (driverLocation) {
    markers.push({
      position: driverLocation,
      label: "🚗", // Driver icon
      title: "Your delivery driver",
    });
  }

  if (restaurantLocation) {
    markers.push({
      position: restaurantLocation,
      label: "🍔", // Restaurant icon
      title: "Restaurant",
    });
  }

  if (customerLocation) {
    markers.push({
      position: customerLocation,
      label: "🏠", // Customer icon
      title: "Your location",
    });
  }

  // Determine the best center point for the map
  const calculateCenter = () => {
    if (!driverLocation || !restaurantLocation || !customerLocation) {
      return (
        driverLocation ||
        restaurantLocation ||
        customerLocation || { lat: 6.9271, lng: 79.8612 }
      );
    }

    // Calculate midpoint between all points
    const lat =
      (driverLocation.lat + restaurantLocation.lat + customerLocation.lat) / 3;
    const lng =
      (driverLocation.lng + restaurantLocation.lng + customerLocation.lng) / 3;
    return { lat, lng };
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "8px 16px" }}
      >
        ← Back to Order
      </button>

      <h2 style={{ marginBottom: "20px" }}>Track Your Order #{orderID}</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          <strong>Status:</strong> {deliveryDetails.status || "In progress"}
        </p>
        <p>
          <strong>Restaurant:</strong>{" "}
          {deliveryDetails.restaurantId?.name || "Unknown restaurant"}
        </p>
        <p>
          <strong>Driver:</strong>{" "}
          {deliveryDetails.driverId?.name || "Driver not assigned yet"}
        </p>
      </div>

      <LoadScript googleMapsApiKey={apiKey}>
        <MapView
          center={calculateCenter()}
          markers={markers}
          directions={directions}
          initialZoom={12}
        />
      </LoadScript>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          background: "#f5f5f5",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>Delivery Progress:</strong>
        </p>
        {!driverLocation ? (
          <p>Waiting for driver assignment...</p>
        ) : (
          <p>
            Driver is{" "}
            {calculateDistance(driverLocation, restaurantLocation) < 0.02
              ? "on the way to you"
              : "heading to the restaurant"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderTracking;
