"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import useCart from "../../../hooks/useCart";
import useCheckout from "../../../hooks/useCheckout";
import { isAuthenticated } from "../../../lib/auth";
import QuantityCalculator from "../../../components/QuantityCalculator";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    totalPrice,
    loading,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart,
  } = useCart();
  const { canCheckout } = useCheckout(cart, clearCart);

  // State for optimistic UI updates
  const [updatingItems, setUpdatingItems] = useState({});

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleQuantityChange = (productId, choiceValueId, newQuantity) => {
    // Set updating flag for this specific item
    setUpdatingItems((prev) => ({
      ...prev,
      [`${productId}-${choiceValueId || "null"}`]: true,
    }));

    // Update quantity and then clear the updating flag
    updateQuantity(productId, choiceValueId, newQuantity).finally(() => {
      setUpdatingItems((prev) => ({
        ...prev,
        [`${productId}-${choiceValueId || "null"}`]: false,
      }));
    });
  };

  // Helper function to get the correct item ID for authenticated vs guest users
  const getItemId = (item) => {
    if (isAuthenticated()) {
      return item.id; // For authenticated users, use the cart_item_id
    } else {
      return item.productId || item.product_id; // For guests, use product ID
    }
  };

  // Helper function to display choice details
  const renderChoiceDetails = (item) => {
    // First try to use the choiceDetails array if it exists
    if (item.choiceDetails && item.choiceDetails.length > 0) {
      return (
        <div className="mt-2 space-y-1">
          {item.choiceDetails.map((choice, index) => (
            <p
              key={index}
              className="text-sm text-gray-500 dark:text-gray-400 flex items-center"
            >
              <span className="font-medium">{choice.type}:</span>
              <span className="ml-1">{choice.value}</span>
              {choice.colorCode && (
                <span
                  className="ml-2 inline-block h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: choice.colorCode }}
                ></span>
              )}
            </p>
          ))}
        </div>
      );
    }

    // Fallback to individual color and size properties
    const hasOptions = item.color || item.size;
    if (!hasOptions) return null;

    return (
      <div className="mt-2 space-y-1">
        {item.color && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span className="font-medium">Color:</span>
            <span className="ml-1">{item.color.name}</span>
            {item.color.colorCode && (
              <span
                className="ml-2 inline-block h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: item.color.colorCode }}
              ></span>
            )}
          </p>
        )}
        {item.size && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Size:</span>{" "}
            <span className="ml-1">{item.size.name}</span>
          </p>
        )}
      </div>
    );
  };

  // Get the choice value ID for an item
  const getChoiceValueId = (item) => {
    // For authenticated users, this comes directly from the API
    if (item.choice_value_id) {
      return item.choice_value_id;
    }

    // For old format items, try to get from choiceValue
    if (item.choiceValue && item.choiceValue.id) {
      return item.choiceValue.id;
    }

    return null;
  };

  // Handle removing item from cart
  const handleRemoveItem = (item) => {
    try {
      const itemId = getItemId(item);
      const choiceValueId = getChoiceValueId(item);

      console.log("Removing item:", { itemId, choiceValueId, item });

      removeItem(itemId, choiceValueId);
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  return (
    <>
      <section className="bg-white py-8 transition-colors dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-6 2xl:px-0">
          <h2 className="text-xl font-semibold mt-12 md:mt-10 text-gray-800 transition-colors dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-800 transition-colors dark:text-white">
                        Loading your cart...
                      </p>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-800 transition-colors dark:text-white">
                        Your cart is empty
                      </p>
                      <Link
                        href="/products"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemId = getItemId(item);
                      const choiceValueId = getChoiceValueId(item);

                      return (
                        <motion.div
                          layout
                          key={item.id}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 md:p-6"
                        >
                          <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                            <Link
                              href={`/products/${
                                item.productId || item.product_id
                              }`}
                              className="shrink-0 md:order-1"
                            >
                              <div className="relative w-20 h-20">
                                <Image
                                  src={item.image}
                                  fill
                                  alt={item.name}
                                  className="object-cover rounded-md"
                                />
                              </div>
                            </Link>

                            <div className="flex items-center justify-between md:order-3 md:justify-end">
                              <QuantityCalculator
                                key={item.id}
                                itemId={item.id}
                                productId={itemId}
                                choiceValueId={choiceValueId}
                                itemQuantity={item.quantity}
                                onQuantityChange={handleQuantityChange}
                              />
                              <div className="text-end md:order-4 md:w-32">
                                <p className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                                  ${item.price}
                                </p>
                              </div>
                            </div>

                            <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                              <Link
                                href={`/products/${
                                  item.productId || item.product_id
                                }`}
                                className="text-base font-medium text-gray-900 transition-colors hover:underline dark:text-white"
                              >
                                {item.name}
                              </Link>

                              {renderChoiceDetails(item)}

                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors group hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                >
                                  <i className="fa-regular fa-heart me-1.5"></i>
                                  <span className="group-hover:underline">
                                    Add to Favorites
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item)}
                                  className="inline-flex items-center text-sm font-medium text-red-600 transition-colors group dark:text-red-500"
                                >
                                  <i className="fa-regular fa-xmark me-1.5"></i>
                                  <span className="group-hover:underline">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {!loading && cart.length > 0 && (
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                  <p className="text-xl font-semibold text-gray-900 transition-colors dark:text-white">
                    Order summary
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                          Subtotal
                        </div>
                        <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                          ${totalPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                          Shipping
                        </div>
                        <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                          ${totalPrice > 100 ? "10.00" : "30.00"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                          Tax
                        </div>
                        <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                          ${(totalPrice * 0.05).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 transition-colors dark:border-gray-700">
                      <div className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                        Total
                      </div>
                      <div className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                        $
                        {(
                          totalPrice +
                          (totalPrice > 100 ? 10 : 30) +
                          totalPrice * 0.05
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!canCheckout()) {
                        if (!isAuthenticated()) {
                          toast.error("Please login to proceed to checkout");
                          router.push("/user/login?redirect=checkout");
                        }
                      } else {
                        router.push("/user/checkout");
                      }
                    }}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:bg-gray-400"
                    disabled={!canCheckout()}
                  >
                    {isAuthenticated()
                      ? "Proceed to Checkout"
                      : "Login to Checkout"}
                  </button>

                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="flex w-full items-center justify-center rounded-lg bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:focus:ring-red-800"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
