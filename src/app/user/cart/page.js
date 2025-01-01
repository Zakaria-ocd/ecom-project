"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function App() {
  const [cartProducts, setCartProducts] = useState([]);

  const [totals, setTotals] = useState({
    totalPrice: 0,
    savings: 0,
    tax: 0,
    storePickup: 0,
    total: 0,
  });

  const updateQuantity = (id, increment) => {
    setCartProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + increment, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotals = () => {
    const totalPrice = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const savings = totalPrice * 0.05;
    const tax = (totalPrice - savings) * 0.05;
    const storePickup = totalPrice > 100 ? 10 : 30;
    const total = totalPrice - savings + tax + storePickup;

    setTotals({ totalPrice, savings, tax, storePickup, total });
  };

  useEffect(() => {
    calculateTotals();
  }, [cartProducts]);

  useEffect(() => {
    setCartProducts([
      {
        id: 1,
        name: 'PC system All in One APPLE iMac (2023), Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Keyboard layout INT',
        price: 1499,
        quantity: 2,
        image: "/assets/cart-products/imac-front-light.svg",
      },
      {
        id: 2,
        name: "Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case with Midnight Sport Band",
        price: 598,
        quantity: 1,
        image: "/assets/cart-products/apple-watch-light.svg",
      },
      {
        id: 3,
        name: 'Apple - MacBook Pro 16" Laptop, M3 Pro chip, 36GB Memory, 18-core GPU, 512GB SSD, Space Black',
        price: 1799,
        quantity: 1,
        image: "/assets/cart-products/macbook-pro-light.svg",
      },
      {
        id: 4,
        name: 'Tablet APPLE iPad Pro 12.9" 6th Gen, 128GB, Wi-Fi, Gold',
        price: 699,
        quantity: 1,
        image: "/assets/cart-products/ipad-light.svg",
      },
      {
        id: 5,
        name: "APPLE iPhone 15 5G phone, 256GB, Gold",
        price: 2997,
        quantity: 3,
        image: "/assets/cart-products/iphone-light.svg",
      },
      {
        id: 6,
        name: "Sony PlayStation 5 Digital Edition",
        price: 249,
        quantity: 1,
        image: "/assets/cart-products/ps5-light.svg",
      },
      {
        id: 7,
        name: "Microsoft Xbox Series X",
        price: 499,
        quantity: 1,
        image: "/assets/cart-products/xbox-light.svg",
      },
    ]);
  }, []);

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
                {cartProducts.length === 0 && (
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800 transition-colors dark:text-white">
                      Your cart is empty
                    </p>
                  </div>
                )}
                {cartProducts.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <a href="#" className="shrink-0 md:order-1">
                        <Image
                          src={item.image}
                          width={80}
                          height={80}
                          alt="cart-product-image"
                        />
                      </a>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            <i className="fa-solid fa-minus text-gray-800 text-xs ml-px transition-colors dark:text-white"></i>
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-gray-900 transition-colors dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            <i className="fa-solid fa-plus text-gray-800 text-xs ml-px transition-colors dark:text-white"></i>
                          </button>
                        </div>
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                            ${item.price}
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <a
                          href="#"
                          className="text-base font-medium text-gray-900 transition-colors hover:underline dark:text-white"
                        >
                          {item.name}
                        </a>

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
                            onClick={() => removeItem(item.id)}
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 transition-colors dark:text-white">
                Order summary
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                      ${totals.totalPrice.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                      Savings
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      -${totals.savings.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                      Store Pickup
                    </dt>
                    <dd className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                      ${totals.storePickup.toFixed(2)}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 transition-colors dark:text-gray-400">
                      Tax
                    </dt>
                    <dd className="text-base font-medium text-gray-900 transition-colors dark:text-white">
                      ${totals.tax.toFixed(2)}
                    </dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 transition-colors dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                    Total
                  </dt>
                  <dd className="text-base font-bold text-gray-900 transition-colors dark:text-white">
                    ${totals.total.toFixed(2)}
                  </dd>
                </dl>
              </div>

              <a
                href="#"
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
              >
                Proceed to Checkout
              </a>

              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  or
                </span>
                <a
                  href="#"
                  title=""
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
                </a>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="voucher"
                    className="mb-2 block text-sm font-medium text-gray-900 transition-colors dark:text-white"
                  >
                    Do you have a voucher or gift card?
                  </label>
                  <input
                    type="text"
                    id="voucher"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder=""
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
                >
                  Apply Code
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
