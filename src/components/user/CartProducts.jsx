"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import QuantityCalculator from "@/components/QuantityCalculator";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  updateCartItem,
  removeFromCart,
  createCheckout,
} from "@/features/cart/cartSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";

export default function CartProducts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.userReducer);
  const { cart, totalPrice, removeItem, updateQuantity, refreshCart } =
    useCart();
  const { couponCode, setCouponCode, checkoutLoading } = useCart();

  const [totals, setTotals] = useState({
    totalPrice: 0,
    savings: 0,
    tax: 0,
    storePickup: 0,
    total: 0,
  });

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    notes: "",
    payment_method: "cash_on_delivery",
  });

  // Ensure cart is refreshed when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  function calculateTotals() {
    const subtotal = cart.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    // Calculate shipping, tax, etc. if needed

    return {
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2), // Add shipping, discounts, etc. if needed
    };
  }

  function handleQuantityChange(itemId, newQuantity) {
    updateQuantity(itemId, null, newQuantity);
  }

  function handleInputChange(e) {
    setCouponCode(e.target.value);
  }

  async function handleCheckout(e) {
    e.preventDefault();

    if (!isAuthenticated) {
      // Redirect to login page with return URL
      router.push("/user/login?redirectTo=/user/cart");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckoutLoading(true);

    try {
      // Navigate to checkout page
      router.push("/user/checkout");
    } catch (error) {
      toast.error("Failed to process checkout");
      console.error(error);
    } finally {
      setCheckoutLoading(false);
    }
  }

  useEffect(() => {
    // Load cart items when component mounts
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function removeFromCart(cartItemId) {
    removeItem(cartItemId);
  }

  if (loading && items.length === 0) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { subtotal, total } = calculateTotals();

  return (
    <section className="bg-white py-8 transition-colors dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-6 2xl:px-0">
        <h2 className="text-xl font-semibold mt-12 md:mt-10 text-gray-800 transition-colors dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <div className="space-y-6">
                {items.length === 0 && !loading && (
                  <div className="text-center py-10">
                    <p className="text-lg font-medium text-gray-800 transition-colors dark:text-white mb-4">
                      Your cart is empty
                    </p>
                    <Link
                      href="/products"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                )}
                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <Link
                        href={`/products/${item.product_id}`}
                        className="shrink-0 md:order-1"
                      >
                        {item.product?.images?.length > 0 ? (
                          <Image
                            src={`http://localhost:8000/api/image/${item.product.images[0]}`}
                            width={80}
                            height={80}
                            alt={item.product.name}
                            className="object-cover rounded-md"
                            unoptimized
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </Link>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <QuantityCalculator
                          key={item.id}
                          itemId={item.id}
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
                          href={`/products/${item.product_id}`}
                          className="text-base font-medium text-gray-900 transition-colors hover:underline dark:text-white"
                        >
                          {item.product?.name || "Product"}
                        </Link>

                        {item.choice && (
                          <div className="flex flex-wrap gap-2">
                            {item.choice.typeValuePairs.map((pair, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md dark:bg-gray-700 dark:text-gray-200"
                              >
                                {pair.typeName}: {pair.value}
                              </span>
                            ))}
                          </div>
                        )}

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
                            onClick={() => removeFromCart(item.id)}
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
                ))}
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <p className="text-xl font-semibold text-gray-900 transition-colors dark:text-white">
                  Order summary
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                        Original price
                      </div>
                      <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                        ${totals.totalPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                        Savings
                      </div>
                      <div className="text-base font-medium text-green-600">
                        -${totals.savings.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                        Store Pickup
                      </div>
                      <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                        ${totals.storePickup.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                        Tax
                      </div>
                      <div className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                        ${totals.tax.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 transition-colors dark:border-gray-700">
                    <div className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                      Total
                    </div>
                    <div className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                      ${totals.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutForm(!showCheckoutForm)}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
                >
                  {showCheckoutForm ? "Cancel Checkout" : "Proceed to Checkout"}
                </button>

                {!showCheckoutForm && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      or
                    </span>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 underline hover:no-underline dark:text-blue-500"
                    >
                      Continue Shopping
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {showCheckoutForm && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delivery Information
                  </h3>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={checkoutData.address}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            address: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={checkoutData.city}
                          onChange={(e) =>
                            setCheckoutData({
                              ...checkoutData,
                              city: e.target.value,
                            })
                          }
                          required
                          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postal_code"
                          value={checkoutData.postal_code}
                          onChange={(e) =>
                            setCheckoutData({
                              ...checkoutData,
                              postal_code: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={checkoutData.phone}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            phone: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={checkoutData.notes}
                        onChange={(e) =>
                          setCheckoutData({
                            ...checkoutData,
                            notes: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Payment Method
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="cash"
                            name="payment_method"
                            value="cash_on_delivery"
                            checked={
                              checkoutData.payment_method === "cash_on_delivery"
                            }
                            onChange={(e) =>
                              setCheckoutData({
                                ...checkoutData,
                                payment_method: e.target.value,
                              })
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <label
                            htmlFor="cash"
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            Cash on Delivery
                          </label>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={checkoutLoading || cart.length === 0}
                      className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 disabled:opacity-70"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="voucher"
                      className="mb-2 block text-sm font-medium text-gray-900 transition-colors dark:text-white"
                    >
                      Do you have a voucher or gift card?
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="voucher"
                        value={couponCode}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-700"
                        placeholder="Enter voucher code"
                      />
                      <button
                        type="button"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
