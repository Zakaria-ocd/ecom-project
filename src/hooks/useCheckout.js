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

  const canCheckout = () => {
    return isAuthenticated() && cart.length > 0;
  };

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
      const orderData = {
        address: deliveryInfo.address,
        phone: deliveryInfo.phone,
        payment_method: "cash_on_delivery",
      };

      const order = await createOrder(orderData);

      clearCart();

      toast.success("Order placed successfully!");

      if (order && order.id) {
        router.push(`/user/orders/${order.id}`);
      } else {
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
