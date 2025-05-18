import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadScript } from "@react-google-maps/api";
import MapView from "../../components/kalindu/MapView";

const DriverNavigation = () => {
  const navigate = useNavigate();
  const { orderID } = useParams();
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState("toRestaurant"); // 'toRestaurant' or 'toCustomer'

  // Helper function to calculate distance between two points
  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth radius in km
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

  const calculateDirections = async (from, to) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: from,
          destination: to,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    } catch (err) {
      console.error("Error calculating directions:", err);
    }
  };

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps?.DirectionsService) {
        setIsGoogleMapsLoaded(true);
        return true;
      }
      return false;
    };

    if (!checkGoogleMaps()) {
      const timer = setInterval(() => {
        if (checkGoogleMaps()) {
          clearInterval(timer);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, []);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  // Main data fetching and polling effect
  useEffect(() => {
    if (!isGoogleMapsLoaded) return;

    let intervalId;

    const fetchDeliveryDetails = async () => {
      try {
        // Fetch delivery details
        const deliveryRes = await axios.get(
          `http://localhost:3000/api/delivery-service/deliveryByOrder/${orderID}`
        );

        const delivery = deliveryRes.data;
        console.log(delivery);
        setDeliveryDetails(delivery);

        // Set restaurant and customer locations
        const restaurantLoc = {
          lat: delivery.pickupLocation.lat,
          lng: delivery.pickupLocation.lng,
        };
        setRestaurantLocation(restaurantLoc);

        const customerLoc = {
          lat: delivery.dropoffLocation.lat,
          lng: delivery.dropoffLocation.lng,
        };
        setCustomerLocation(customerLoc);

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

          // Check if driver is close to restaurant
          const distanceToRestaurant = calculateDistance(
            initialDriverLocation,
            restaurantLoc
          );
          if (distanceToRestaurant < 0.02) {
            // ~20 meters
            setCurrentStep("toCustomer");
            calculateDirections(restaurantLoc, customerLoc);
          } else {
            calculateDirections(initialDriverLocation, restaurantLoc);
          }
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

            // Check if driver reached restaurant
            if (currentStep === "toRestaurant") {
              const distance = calculateDistance(
                newDriverLocation,
                restaurantLoc
              );
              if (distance < 0.02) {
                // ~20 meters
                setCurrentStep("toCustomer");
                calculateDirections(restaurantLoc, customerLoc);
              }
            }
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
  }, [isGoogleMapsLoaded, orderID, currentStep]);

  if (!isGoogleMapsLoaded) {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyCjgDOFzVZR8aWVM4SoZMRO0Hw4Lb883Ec"
        onLoad={() => setIsGoogleMapsLoaded(true)}
      >
        <div>Loading Google Maps...</div>
      </LoadScript>
    );
  }

  if (loading) return <div>Loading delivery details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deliveryDetails) return <div>No delivery details found</div>;

  // Prepare markers
  const markers = [];

  if (driverLocation) {
    markers.push({
      position: driverLocation,
      label: "🚗",
      title: "Your location",
    });
  }

  if (restaurantLocation) {
    markers.push({
      position: restaurantLocation,
      label: "🍔",
      title: "Restaurant",
    });
  }

  if (customerLocation) {
    markers.push({
      position: customerLocation,
      label: "🏠",
      title: "Customer",
    });
  }

  // Determine center point
  const calculateCenter = () => {
    if (!driverLocation)
      return (
        restaurantLocation || customerLocation || { lat: 6.9271, lng: 79.8612 }
      );

    if (currentStep === "toRestaurant" && restaurantLocation) {
      // Center between driver and restaurant
      return {
        lat: (driverLocation.lat + restaurantLocation.lat) / 2,
        lng: (driverLocation.lng + restaurantLocation.lng) / 2,
      };
    } else if (customerLocation) {
      // Center between restaurant and customer
      return {
        lat: (restaurantLocation.lat + customerLocation.lat) / 2,
        lng: (restaurantLocation.lng + customerLocation.lng) / 2,
      };
    }
    return driverLocation;
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", padding: "8px 16px" }}
      >
        ← Back
      </button>

      <h2 style={{ marginBottom: "20px" }}>
        Delivery Navigation - Order #{orderID}
      </h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#f0f8ff",
          borderRadius: "8px",
          borderLeft: `5px solid ${
            currentStep === "toRestaurant" ? "#FFA500" : "#32CD32"
          }`,
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {currentStep === "toRestaurant"
            ? "🚗 Heading to Restaurant"
            : "📦 Delivering to Customer"}
        </h3>
        <p>
          <strong>Restaurant:</strong>{" "}
          {deliveryDetails.restaurantId?.name || "N/A"}
        </p>
        <p>
          <strong>Customer:</strong> {deliveryDetails.customerId?.name || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {deliveryDetails.status || "In progress"}
        </p>
      </div>

      <MapView
        center={calculateCenter()}
        markers={markers}
        directions={directions}
        initialZoom={14}
      />

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#fffaf0",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginTop: 0 }}>Delivery Instructions</h4>
        {currentStep === "toRestaurant" ? (
          <p>Follow the route to pick up the order at the restaurant.</p>
        ) : (
          <p>
            You have the order. Follow the route to deliver to the customer.
          </p>
        )}
      </div>
    </div>
  );
};

export default DriverNavigation;
