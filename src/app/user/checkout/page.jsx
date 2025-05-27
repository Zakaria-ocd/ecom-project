"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import useCart from "@/hooks/useCart";
import useCheckout from "@/hooks/useCheckout";
import { isAuthenticated } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, loading } = useCart();
  const {
    processCheckout,
    loading: checkoutLoading,
    error,
  } = useCheckout(cart);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Redirect if not authenticated or cart is empty
  if (typeof window !== "undefined" && !loading) {
    if (!isAuthenticated()) {
      router.push("/user/login?redirect=checkout");
      return null;
    }

    if (cart.length === 0) {
      router.push("/user/cart");
      return null;
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ["fullName", "address", "city", "state", "phone"];
    const emptyFields = requiredFields.filter((field) => !deliveryInfo[field]);

    if (emptyFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    // Format the address to include all address components in a single string
    // Make sure not to include any fields that are empty
    const addressParts = [
      deliveryInfo.address,
      deliveryInfo.city,
      deliveryInfo.state,
    ];
    if (deliveryInfo.zipCode) {
      addressParts.push(deliveryInfo.zipCode);
    }
    const formattedAddress = addressParts.join(", ");

    try {
      await processCheckout({
        address: formattedAddress,
        phone: deliveryInfo.phone,
      });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <>
      <section className="bg-white py-8 transition-colors dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-6 2xl:px-0">
          <h2 className="text-xl font-semibold mt-12 md:mt-10 text-gray-800 transition-colors dark:text-white sm:text-2xl">
            Checkout
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Loading checkout information...
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Delivery Information Form */}
              <div className="lg:col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delivery Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={deliveryInfo.fullName}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={deliveryInfo.email}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={deliveryInfo.state}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={deliveryInfo.zipCode}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Order Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={deliveryInfo.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    ></textarea>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Payment Method
                    </h4>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <input
                          id="cash-on-delivery"
                          name="payment-method"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                          disabled
                        />
                        <label
                          htmlFor="cash-on-delivery"
                          className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Cash on Delivery
                        </label>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <div className="sticky top-20 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Order Summary
                  </h3>

                  <div className="max-h-64 overflow-y-auto space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 border-b border-gray-200 pb-4 dark:border-gray-700"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} x $
                            {Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Subtotal
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Shipping
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${totalPrice > 100 ? "10.00" : "30.00"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tax
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(totalPrice * 0.05).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Total
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      $
                      {(
                        totalPrice +
                        (totalPrice > 100 ? 10 : 30) +
                        totalPrice * 0.05
                      ).toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={checkoutLoading}
                    className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {checkoutLoading ? "Processing..." : "Complete Order"}
                  </button>

                  {error && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="mt-4">
                    <Link
                      href="/user/cart"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Return to Cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
