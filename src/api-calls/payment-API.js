import stripePromise from "../stripe";
import { toast } from "react-toastify";
import api from "../auth/api";

export const createCheckoutSession = async (cartItems) => {
  try {
    const stripe = await stripePromise;

    const response = await api.post(
      "/payment-service/create-checkout-session",
      cartItems,
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": localStorage.getItem("userId"),
        },
      }
    );

    const session = response.data;

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
      toast.error(result.error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  } catch (error) {
    console.error("Checkout Error:", error.message);
    toast.error(error.message || "Something went wrong. Please try again!", {
      position: "top-right",
      autoClose: 5000,
    });
  }
};
