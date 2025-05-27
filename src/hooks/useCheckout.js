import { useState } from "react";
import { createOrder } from "../lib/order";
import { isAuthenticated } from "../lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useCart from "./useCart";

export default function useCheckout(cart) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { removeItem, clearCart } = useCart();

  // Check if user can proceed to checkout
  const canCheckout = () => {
    return isAuthenticated() && cart.length > 0;
  };

  // Process checkout
  const processCheckout = async (deliveryInfo) => {
    if (!canCheckout()) {
      if (!isAuthenticated()) {
        toast.error("Please log in to proceed with checkout");
        router.push("/user/login?redirect=checkout");
        return;
      }

      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure we have only the necessary fields for the API
      const orderData = {
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        payment_method: "cash_on_delivery",
      };

      // Create order with fixed payment method (Cash on Delivery)
      const order = await createOrder(orderData);

      // The backend should clear the cart for us, but let's make sure our local state is updated
      // by calling clearCart instead of manually removing each item
      clearCart();

      toast.success("Order placed successfully!");

      // Redirect to order confirmation page if we have an order ID
      if (order && order.id) {
        router.push(`/user/orders/${order.id}`);
      } else {
        // If we don't have an order ID, just go to the orders page
        router.push("/user/orders");
      }

      return order;
    } catch (error) {
      setError(error.message || "Checkout failed");
      toast.error(`Checkout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    canCheckout,
    processCheckout,
  };
}
