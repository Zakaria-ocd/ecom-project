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

  const [updatingItems, setUpdatingItems] = useState({});

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleQuantityChange = (productId, choiceValueId, newQuantity) => {
    setUpdatingItems((prev) => ({
      ...prev,
      [`${productId}-${choiceValueId || "null"}`]: true,
    }));

    updateQuantity(productId, choiceValueId, newQuantity).finally(() => {
      setUpdatingItems((prev) => ({
        ...prev,
        [`${productId}-${choiceValueId || "null"}`]: false,
      }));
    });
  };

  const getItemId = (item) => {
    if (isAuthenticated()) {
      return item.id;
    } else {
      return item.product_id;
    }
  };

  const renderChoiceDetails = (item) => {
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

    return null;
  };

  const getChoiceValueId = (item) => {
    if (item.choice_value_id !== undefined) {
      return item.choice_value_id;
    }

    if (item.choiceValue && item.choiceValue.id) {
      return item.choiceValue.id;
    }

    return null;
  };

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
                        className="mt-4 inline-block text-cyan-600 hover:underline"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemId = getItemId(item);
                      const choiceValueId = getChoiceValueId(item);
                      const productName =
                        item.product_name ||
                        (item.product ? item.product.name : "Product");
                      const productId =
                        item.product_id ||
                        (item.product ? item.product.id : "");
                      const imageUrl =
                        item.image ||
                        `http://localhost:8000/api/productImage/${productId}`;

                      return (
                        <motion.div
                          layout
                          key={`${productId}-${choiceValueId || "no-choice"}`}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 md:p-6"
                        >
                          <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                            <Link
                              href={`/products/${productId}`}
                              className="shrink-0 md:order-1"
                            >
                              <div className="relative w-20 h-20">
                                <Image
                                  src={imageUrl}
                                  fill
                                  alt={productName}
                                  className="object-cover rounded-md"
                                />
                              </div>
                            </Link>

                            <div className="flex items-center justify-between md:order-3 md:justify-end">
                              <div className="flex items-center">
                                <QuantityCalculator
                                  productId={itemId}
                                  choiceValueId={choiceValueId}
                                  itemQuantity={item.quantity}
                                  onQuantityChange={handleQuantityChange}
                                  max={100}
                                />
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                aria-label="Remove from cart"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>

                            <div className="flex-1 md:order-2">
                              <Link
                                href={`/products/${productId}`}
                                className="text-lg font-medium text-gray-900 hover:text-cyan-600 dark:text-white dark:hover:text-blue-400"
                              >
                                {productName}
                              </Link>
                              {renderChoiceDetails(item)}
                              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                ${Number(item.price).toFixed(2)}
                              </p>
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
                    className="flex w-full items-center justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:bg-gray-400"
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
