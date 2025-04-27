import stripePromise from "../stripe";
import { toast } from "react-toastify"; // Correct import

export const createCheckoutSession = async (cartItems) => {
  try {
    const stripe = await stripePromise;

    const response = await fetch(
      "http://localhost:5006/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const session = await response.json();

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
