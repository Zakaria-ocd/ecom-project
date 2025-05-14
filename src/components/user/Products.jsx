"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import Rating from "../Rating";
import CategoriesSide from "./CategoriesSide";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ProductSkeleton from "./ProductSkeleton";
import { toast } from "sonner";

export default function Products({ cartProducts, setCartProducts }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteTransform, setFavoriteTransform] = useState(false);
  const [quantities, setQuantities] = useState({});

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });

  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
  });
  const [sortList, setSortList] = useState([]);
  const [pricesList, setPricesList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [resultsList, setResultsList] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [productsQuantity, setProductsQuantity] = useState(1);
  const [productsTypes, setProductsTypes] = useState([]);
  const [productsTypeValues, setProductsTypeValues] = useState([]);
  const [choices, setChoices] = useState([]);
  const [productChecked, setProductChecked] = useState("");
  console.log(products);
  const uniqueById = (array, id) => {
    const seen = new Set();
    return array.filter((item) => {
      if (seen.has(item[id])) return false;
      seen.add(item[id]);
      return true;
    });
  };
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
      console.log(products);
      let pp = [];
      let choicesValues = [];
      setProducts((prv) => {
        console.log(prv);
        pp = [...prv];
        return prv;
      });
      selectedTypes.length > 0 &&
        (await Promise.all(
          selectedTypes.map(async (selectedType) => {
            const response = await fetch(
              `http://localhost:8000/api/getProductChoices/${selectedType.productId}`
            );
            const choices = await response.json();
            choicesValues.push({ product_id: selectedType.productId, choices });
            let selectedChoice = {};
            const types = choices
              .filter((item) => {
                return item.choice_id == selectedType.choice_id;
              })
              .map((item) => {
                selectedChoice = { ...item };
                const type = productsTypes
                  .find((i) => i.productId == selectedType.productId)
                  .types.find((i) => item.type_id == i.type_id);
                return {
                  id: type.type_id,
                  name: type.name,
                  values: productsTypeValues
                    .find((i) => i.productId == selectedType.productId)
                    .values.filter((i) => item.type_id == i.type_id)
                    .map((i) => {
                      let value = {
                        id: i.type_value_id,
                        value: i.value,
                        choice_id: i.choice_id,
                      };
                      if (item.type_value_id == i.type_value_id) {
                        value = { ...value, selected: true };
                      } else {
                        value = { ...value, selected: false };
                      }
                      if (i.colorCode) {
                        return {
                          ...value,
                          colorCode: i.colorCode,
                        };
                      } else {
                        return value;
                      }
                    }),
                };
              });
            console.log(selectedType);

            pp = pp.map((item) => {
              if (selectedType.productId == item.id) {
                if (selectedChoice.price && selectedChoice.quantity) {
                  return {
                    ...item,
                    price: selectedChoice.price,
                    quantity: selectedChoice.quantity,
                    types,
                  };
                } else {
                  return {
                    ...item,
                    types,
                  };
                }
              } else {
                return item;
              }
            });
          })
        ));
      console.log(choicesValues);
      setProducts(pp);
      setChoices(choicesValues);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedTypes]);
  useEffect(() => {
    console.log(productChecked);

    const selectedValues =
      products
        .find((item) => item.id === productChecked.id)
        ?.types?.map((item) => item.values?.find((i) => i.selected)?.id)
        ?.filter(Boolean) || [];

    // Add proper null checks and array validation
    const productChoices =
      choices.length > 0
        ? choices.find((item) => item.product_id === productChecked.id)?.choices
        : [];

    let selectedChoices = (productChoices || []).filter((item) =>
      selectedValues.includes(item.type_value_id)
    );

    function getMatchingValue(targetCount, choicesArray) {
      // Add validation for choicesArray
      if (!Array.isArray(choicesArray)) return null;

      const count = {};
      // Count occurrences of each choice_id
      for (const val of choicesArray) {
        count[val.choice_id] = (count[val.choice_id] || 0) + 1;
      }

      // Find the first object whose choice_id occurs targetCount times
      for (const val of choicesArray) {
        if (count[val.choice_id] === targetCount) {
          return val;
        }
      }
      return null;
    }

    const matchingValue = getMatchingValue(
      selectedValues.length,
      selectedChoices
    );

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productChecked.id) {
          return {
            ...item,
            price: matchingValue?.price || 0,
            quantity: matchingValue?.quantity || 0,
          };
        }
        return item;
      })
    );

    console.log(selectedChoices);
    console.log(selectedValues);
  }, [productChecked]);
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
      const response = await fetch("http://localhost:8000/api/showProducts");
      const products = await response.json();
      // Now enrich with price after base products are set
      // const productsWithPrices = await Promise.all(
      //   products.map(async (product) => {
      //     const res = await fetch(
      //       `http://localhost:8000/api/productDefaultPrice/${product.id}`
      //     );
      //     const data = await res.json();
      //     return { ...product, price: data.price };
      //   })
      // );

      // setProducts(productsWithPrices);
      let sTypes = [];
      let typesSelcet = [];
      let valuesSelcet = [];
      const productswithOptions = await Promise.all(
        products.map(async (product) => {
          const res = await fetch(
            `http://localhost:8000/api/productOptions/${product.id}`
          );
          const data = await res.json();

          const types = uniqueById(data, "type_id");
          const values = uniqueById(data, "type_value_id");
          typesSelcet.push({ productId: product.id, types });
          valuesSelcet.push({ productId: product.id, values });
          return {
            ...product,
            types: types
              .filter((_, index) => index === 0)
              .map((item) => {
                return {
                  id: item.type_id,
                  name: item.name,
                  values: values
                    .filter((i) => item.type_id == i.type_id)
                    .map((i, index) => {
                      let value = {
                        id: i.type_value_id,
                        value: i.value,
                        choice_id: i.choice_id,
                      };
                      if (index == 0) {
                        value = { ...value, selected: true };
                        sTypes.push({
                          productId: product.id,
                          valueId: i.type_value_id,
                          choice_id: i.choice_id,
                          type_id: item.type_id,
                        });
                        setSelectedTypes({
                          productId: product.id,
                          valueId: i.type_value_id,
                          choice_id: i.choice_id,
                          type_id: item.type_id,
                        });
                      } else {
                        value = { ...value, selected: false };
                      }
                      if (i.colorCode) {
                        return {
                          ...value,
                          colorCode: i.colorCode,
                        };
                      } else {
                        return value;
                      }
                    }),
                };
              }),
          };
        })
      );
      console.log(sTypes);
      console.log(typesSelcet);
      console.log(valuesSelcet);
      const productswithImages = await Promise.all(
        productswithOptions.map(async (product) => {
          const res = await fetch(
            `http://localhost:8000/api/productImage/${product.id}`
          );
          const blob = await res.blob();
          const image = URL.createObjectURL(blob);
          return { ...product, image };
        })
      );
      setProducts(productswithImages); // override previous state with prices
      setSelectedTypes(sTypes);
      setProductsTypes(typesSelcet);
      setProductsTypeValues(valuesSelcet);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    setFilters({
      categories: [
        { id: 1, name: "fashion" },
        { id: 2, name: "electronics" },
        { id: 3, name: "beauty" },
        { id: 4, name: "sport" },
        { id: 5, name: "toys" },
      ],
      colors: [
        { id: 1, name: "Red" },
        { id: 2, name: "Blue" },
        { id: 3, name: "Green" },
        { id: 4, name: "Black" },
        { id: 5, name: "White" },
      ],
      sizes: [
        { id: 1, name: "Small" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Large" },
        { id: 4, name: "Extra Large" },
      ],
    });

    setSortList([
      { id: 1, name: "most popular" },
      { id: 2, name: "newest arrivals" },
      { id: 3, name: "best rating" },
    ]);

    setPricesList([
      { id: 1, name: 50 },
      { id: 2, name: 100 },
      { id: 3, name: 200 },
      { id: 4, name: 300 },
      { id: 5, name: 500 },
    ]);

    setRatingList([
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
    ]);

    setResultsList([
      { id: 1, name: 24 },
      { id: 2, name: 48 },
      { id: 3, name: 96 },
    ]);

    // async function fetchProducts() {
    //   try {
    //     const response = await fetch("http://localhost:8000/api/products");
    //     const data = await response.json();
    //     // setProducts(data);
    //     console.log(data);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // }
    // fetchProducts();
  }, []);

  const handleQuantityChange = (itemId, value) => {
    // Ensure the value is a number and within bounds
    const numValue = parseInt(value) || 1;
    const boundedValue = Math.min(Math.max(numValue, 1), 100);
    
    setQuantities(prev => ({
      ...prev,
      [itemId]: boundedValue
    }));
  };

  const generateCartItemId = (productId, selectedColor, selectedSize) => {
    return `${productId}-${selectedColor?.id || 'no-color'}-${selectedSize?.id || 'no-size'}`;
  };

  const isItemInCart = (productId, selectedColor, selectedSize) => {
    return cartProducts?.some(item => 
      item.productId === productId && 
      item.color?.id === selectedColor?.id && 
      item.size?.id === selectedSize?.id
    );
  };

  const handleAddToCart = (item) => {
    if (item.price <= 0) {
      toast.error("Cannot add to cart", {
        description: "This product is not available for purchase",
        duration: 3000,
      });
      return;
    }
    
    const quantity = quantities[item.id] || 1;
    const selectedColor = item.types?.find(t => t.id === 1)?.values.find(v => v.selected);
    const selectedSize = item.types?.find(t => t.id === 2)?.values.find(v => v.selected);
    
    if (isItemInCart(item.id, selectedColor, selectedSize)) {
      toast.info("Already in cart", {
        description: "This item with selected color and size is already in your cart",
        duration: 2000,
      });
      return;
    }

    setCartProducts((prv) => {
      const { id, name, price, rating } = item;
      
      toast.success("Added to cart", {
        description: `${name} (${selectedColor?.value || ''} ${selectedSize?.value || ''}) has been added to your cart`,
        duration: 2000,
      });

      return [
        ...prv,
        {
          id: generateCartItemId(id, selectedColor, selectedSize),
          productId: id,
          name,
          price,
          rating,
          image: `http://localhost:8000/api/productImage/${id}`,
          quantity,
          color: selectedColor ? {
            id: selectedColor.id,
            name: selectedColor.value,
            colorCode: selectedColor.colorCode
          } : null,
          size: selectedSize ? {
            id: selectedSize.id,
            name: selectedSize.value
          } : null
        },
      ];
    });
  };

  const handleRemoveFromCart = (item, selectedColor, selectedSize) => {
    const cartItemId = generateCartItemId(item.id, selectedColor, selectedSize);
    setCartProducts((prv) => {
      const newCart = prv.filter((cartItem) => cartItem.id !== cartItemId);
      toast.success("Removed from cart", {
        description: `${item.name} (${selectedColor?.value || ''} ${selectedSize?.value || ''}) has been removed from your cart`,
        duration: 2000,
      });
      return newCart;
    });
  };

  return (
    <div className="w-full max-w-screen bg-white flex flex-col items-center border-t border-white transition-colors dark:bg-slate-900 dark:border-t-slate-700">
      <div className="w-full z-0 bg-white flex justify-center items-center py-14 transition-colors dark:bg-slate-900">
        <p className="bg-white z-10 text-2xl text-slate-800 font-bold px-4 py-2 transition-colors dark:text-slate-100 dark:bg-slate-900">
          OUR PRODUCTS
        </p>
        <div className="absolute -z-0 w-96 h-0.5 bg-slate-800 transition-colors dark:bg-slate-300" />
      </div>

      <div className="w-full flex md:flex-row flex-col justify-between items-start px-4">
        <CategoriesSide
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <div className="w-full bg-white flex flex-col gap-4 px-3 transition-colors dark:bg-slate-900">
          <FiltersBar
            pricesList={pricesList}
            ratingList={ratingList}
            sortList={sortList}
            resultsList={resultsList}
            selectedFilters={selectedFilters}
            setSelectedFilters={(value) => setSelectedFilters(value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 sm:py-4">
            {loading ? (
              <>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
              </>
            ) : (
              products.length !== 0 &&
              products?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="w-full flex flex-col gap-4 place-self-center"
                  >
                    <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg">
                        <Image
                          width={200}
                          height={100}
                        className="w-full h-full peer rounded-md object-cover"
                        src={`http://localhost:8000/api/productImage/${item.id}`}
                          alt={item.name}
                        />
                      <i
                        className={`fa-${
                          favoriteTransform ? "solid" : "regular"
                        } fa-heart text-white absolute name-4 top-3 left-3 opacity-0 cursor-pointer peer-hover:opacity-100 ease-in-out duration-300 peer-hover:translate-x-0 hover:translate-x-0 -translate-x-8 hover:opacity-100 hover:text-rose-500`}
                        onMouseOver={() => setFavoriteTransform(true)}
                        onMouseOut={() => setFavoriteTransform(false)}
                      ></i>
                      <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
                        <Dialog
                          onOpenChange={(open) => {
                            if (!open) {
                              setProductsQuantity(1);
                              setProducts((prevProducts) =>
                                prevProducts?.map((product) =>
                                  product.id === item.id
                                    ? {
                                        ...product,
                                        colors: product.colors?.map(
                                          (color, i) =>
                                            i === 0
                                              ? { ...color, selected: true }
                                              : { ...color, selected: false }
                                        ),
                                        sizes: product.sizes?.map((size, i) =>
                                          i === 0
                                            ? { ...size, selected: true }
                                            : { ...size, selected: false }
                                        ),
                                      }
                                    : product
                                )
                              );
                            }
                          }}
                        >
                          <DialogTrigger>
                            <div className="w-32 hover:hover:bg-zinc-900 duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800 dark:hover:bg-zinc-900">
                              <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                                <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                                  Quick view
                                </div>
                                <div className="w-full h-1/2 flex justify-center items-center text-white">
                                  <i className="fa-light fa-eye"></i>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle></DialogTitle>
                            <DialogDescription></DialogDescription>
                            <div className="w-full absolute h-full flex">
                                <Image
                                className="w-1/2 object-cover h-full"
                                src={`http://localhost:8000/api/productImage/${item.id}`}
                                  alt={item.name}
                                  width={500}
                                  height={300}
                                />
                              <div className="p-8 w-1/2 flex flex-col gap-[26px]">
                                <div className=" w-full justify-between h-[3.25rem] flex flex-col ">
                                  <div className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                                    {item.name}
                                  </div>
                                  <div className="w-full flex justify-between items-center">
                                    <p className="text-gray-600 transition-colors dark:text-gray-400">
                                      ${item.price}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
                                        {item.rating}
                                      </p>
                                      <Rating
                                        rating={item.rating}
                                        starClass="text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[#878787] text-[0.85rem] transition-colors dark:text-gray-500">
                                  {item.description}
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">Stock:</span>
                                    {item.quantity > 10 ? (
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                        In Stock
                                      </span>
                                    ) : item.quantity > 0 ? (
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                        Low Stock ({item.quantity} left)
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                  {console.log(item.types)}
                                  {item.types?.find((i) => i.id == 1) && (
                                    <div className="flex flex-col gap-2">
                                      <div className="font-extrabold flex text-gray-900 text-xs">
                                        COLOR:
                                        <div className="w-0.5"></div>
                                        {item.types
                                          .find((i) => i.id == 1)
                                          .values.map((color, index) => {
                                            if (index == 0) {
                                              return color.value;
                                            }
                                          })}
                                      </div>
                                      <div className="flex wf-full gap-2">
                                        {item.types
                                          .find((i) => i.id == 1)
                                          .values?.map((color, index) => {
                                            return (
                                              <motion.div
                                                key={index}
                                                className="w-8 h-8 cursor-pointer p-0 m-0 flex justify-center items-center rounded-full  "
                                                style={{
                                                  borderWidth: "0.4px",
                                                  borderStyle: "solid",
                                                  borderColor: color.selected
                                                    ? "#000"
                                                    : "rgb(200, 200, 200)",
                                                }}
                                                whileHover={{
                                                  borderColor: "#000",
                                                }}
                                                transition={{
                                                  ease: "easeInOut",
                                                  duration: 0.3,
                                                }}
                                                onClick={() => {
                                                  setProducts((prevProducts) =>
                                                    prevProducts.map(
                                                      (product) => {
                                                        if (
                                                          product.id === item.id
                                                        ) {
                                                          const updatedTypes =
                                                            product.types.map(
                                                              (type) => {
                                                                if (
                                                                  type.id === 1
                                                                ) {
                                                                  return {
                                                                    ...type,
                                                                    values:
                                                                      type.values.map(
                                                                        (
                                                                          colorItem
                                                                        ) => {
                                                                          if (
                                                                            colorItem.id ==
                                                                            color.id
                                                                          ) {
                                                                            setProductChecked(
                                                                              {
                                                                                id: product.id,
                                                                                value_id:
                                                                                  color.id,
                                                                              }
                                                                            );
                                                                            // setSelectedTypes(
                                                                            //   {
                                                                            //     productId:
                                                                            //       product.id,
                                                                            //     valueId:
                                                                            //       color.type_value_id,
                                                                            //     choice_id:
                                                                            //       color.choice_id,
                                                                            //     type_id: 1,
                                                                            //   }
                                                                            // );
                                                                          }
                                                                          return {
                                                                            ...colorItem,
                                                                            selected:
                                                                              colorItem.id ===
                                                                              color.id,
                                                                          };
                                                                        }
                                                                      ),
                                                                  };
                                                                }
                                                                return type;
                                                              }
                                                            );

                                                          return {
                                                            ...product,
                                                            types: updatedTypes,
                                                          };
                                                        }
                                                        return product;
                                                      }
                                                    )
                                                  );
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    backgroundColor:
                                                      color.colorCode,
                                                  }}
                                                  className="w-7 h-7  rounded-full"
                                                ></div>
                                              </motion.div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  )}
                                  {item.types?.find((i) => i?.id == 2) && (
                                    <div className="flex flex-col gap-2">
                                      <div className="font-extrabold flex  text-gray-900 text-xs">
                                        Size:
                                        <div className="w-0.5"></div>
                                        {item.types
                                          .find((i) => i.id == 2)
                                          .values.map((size) => {
                                            if (size.selected) {
                                              return size.value;
                                            }
                                          })}
                                      </div>
                                      <div className="flex w-full gap-2">
                                        {item.types
                                          .find((i) => i.id == 2)
                                          .values?.map((size, index) => {
                                            return (
                                              <motion.div
                                                key={index}
                                                className="w-8 h-8 hover:bg-[rgb(33, 30, 30)] hover:text-white  transition-colors duration-300   cursor-pointer flex justify-center items-center rounded-full  "
                                                style={{
                                                  borderWidth: "1px",
                                                  borderStyle: "solid",
                                                  backgroundColor: size.selected
                                                    ? "rgb(33, 30, 30)"
                                                    : "white",
                                                  color: size.selected
                                                    ? "white"
                                                    : "rgb(33, 30, 30)",
                                                }}
                                                whileHover={{
                                                  backgroundColor:
                                                    "rgb(33, 30, 30)",
                                                  color: "white",
                                                }}
                                                transition={{
                                                  ease: "easeInOut",
                                                  duration: 2,
                                                }}
                                                onClick={() => {
                                                  setProducts((prevProducts) =>
                                                    prevProducts.map(
                                                      (product) => {
                                                        if (
                                                          product.id === item.id
                                                        ) {
                                                          const updatedTypes =
                                                            product.types.map(
                                                              (type) => {
                                                                if (
                                                                  type.id === 2
                                                                ) {
                                                                  setProductChecked(
                                                                    product.id
                                                                  );

                                                                  return {
                                                                    ...type,
                                                                    values:
                                                                      type.values.map(
                                                                        (
                                                                          sizeItem
                                                                        ) => {
                                                                          if (
                                                                            sizeItem.id ==
                                                                            size.id
                                                                          ) {
                                                                            setProductChecked(
                                                                              {
                                                                                id: product.id,
                                                                                value_id:
                                                                                  size.id,
                                                                              }
                                                                            );
                                                                            // setSelectedTypes(
                                                                            //   {
                                                                            //     productId:
                                                                            //       product.id,
                                                                            //     valueId:
                                                                            //       size.type_value_id,
                                                                            //     choice_id:
                                                                            //       size.choice_id,
                                                                            //     type_id: 2,
                                                                            //   }
                                                                            // );
                                                                          }
                                                                          return {
                                                                            ...sizeItem,
                                                                            selected:
                                                                              sizeItem.id ===
                                                                              size.id,
                                                                          };
                                                                        }
                                                                      ),
                                                                  };
                                                                }
                                                                return type;
                                                              }
                                                            );
                                                          return {
                                                            ...product,
                                                            types: updatedTypes,
                                                          };
                                                        }
                                                        return product;
                                                      }
                                                    )
                                                  );
                                                }}
                                              >
                                                <div className="text-[0.9rem]">
                                                  {size.value}
                                                </div>
                                              </motion.div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-3">
                                    {item.price <= 0 || item.quantity <= 0 ? (
                                      <button
                                        disabled
                                        className="relative w-full rounded-lg bg-gray-300 px-6 py-2.5 text-gray-500 cursor-not-allowed"
                                      >
                                        <span className="flex items-center justify-center gap-2">
                                          <i className="fa-regular fa-circle-xmark"></i>
                                          <span className="text-sm font-medium">
                                            {item.price <= 0 ? "Not Available" : "Out of Stock"}
                                          </span>
                                        </span>
                                      </button>
                                    ) : (() => {
                                      const selectedColor = item.types?.find(t => t.id === 1)?.values.find(v => v.selected);
                                      const selectedSize = item.types?.find(t => t.id === 2)?.values.find(v => v.selected);
                                      const inCart = isItemInCart(item.id, selectedColor, selectedSize);

                                      return inCart ? (
                                        <button
                                          onClick={() => handleRemoveFromCart(item, selectedColor, selectedSize)}
                                          className="group relative w-full overflow-hidden rounded-lg bg-red-500 px-6 py-2.5 transition-all duration-300 ease-in-out hover:bg-red-600"
                                        >
                                          <span className="relative flex items-center justify-center gap-2 text-white">
                                            <i className="fa-regular fa-trash-can"></i>
                                            <span className="text-sm font-medium">Remove from Cart</span>
                                          </span>
                                          <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-red-700 text-white duration-300 group-hover:translate-y-0">
                                            <i className="fa-regular fa-trash-can"></i>
                                          </span>
                                        </button>
                                      ) : (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max={item.quantity}
                                              value={quantities[item.id] || 1}
                                              onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val > item.quantity) {
                                                  toast.error("Cannot exceed available stock", {
                                                    description: `Only ${item.quantity} items available`,
                                                    duration: 2000,
                                                  });
                                                  return;
                                                }
                                                handleQuantityChange(item.id, val);
                                              }}
                                              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            />
                                            <button
                                              onClick={() => handleAddToCart(item)}
                                              className="group relative overflow-hidden rounded-lg bg-blue-600 px-6 py-2.5 transition-all duration-300 ease-in-out hover:bg-blue-700"
                                            >
                                              <span className="relative flex items-center justify-center gap-2 text-white">
                                                <i className="fa-regular fa-cart-plus"></i>
                                                <span className="text-sm font-medium">Add to Cart</span>
                                              </span>
                                              <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-blue-800 text-white duration-300 group-hover:translate-y-0">
                                                <i className="fa-regular fa-cart-plus"></i>
                                              </span>
                                            </button>
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                                <div className="w-full flex justify-center h-full items-center">
                                  <Link
                                    href={""}
                                    className="flex w-52 h-10 justify-center text-slate-900 transition-colors hover:text-cyan-500 cursor-pointer group items-center gap-[6px]"
                                  >
                                    <p className="font-bold text-[1.2rem]">
                                      View full details
                                    </p>
                                    <i className="fa-solid fa-arrow-right-long w-6 transition-all group-hover:translate-x-2 ease-in-out"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger>
                            <div
                              className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800"
                              href={`/products/${item.id}`}
                            >
                              <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                                <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                                  Quick shop
                                </div>
                                <div className="w-full h-1/2 flex justify-center items-center text-white">
                                  <i className="fa-light fa-cart-plus"></i>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="w-[28%]  h-[80%] rounded">
                            <DialogTitle></DialogTitle>
                            <div className="w-full  flex absolute h-full gap-4 flex-col p-5">
                              <div className="w-full items-start  flex gap-6 justify-start h-[30%] ">
                                <Image
                                  className="w-[100px] rounded-sm h-[120px] object-cover"
                                  src={`http://localhost:8000/api/productImage/${item.id}`}
                                  alt={item.name}
                                  width={500}
                                  height={300}
                                />
                                <div className="  justify-between h-[3.25rem] flex flex-col ">
                                  <p className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                                    {item.name}
                                  </p>
                                  <p className="text-gray-600 transition-colors dark:text-gray-400">
                                    ${item.price}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full flex justify-center">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="font-extrabold text-[15px] flex   text-slate-900 ">
                                    COLOR:
                                    <div className="w-0.5"></div>
                                    {item.colors?.map((color) => {
                                      if (color.selected) {
                                        return color.name;
                                      }
                                    })}
                                  </div>
                                  <div className="flex wf-full gap-2">
                                    {item.colors?.map((color, index) => {
                                      return (
                                        <motion.div
                                          key={index}
                                          className="w-8 h-8 cursor-pointer p-0 m-0 flex justify-center items-center rounded-full  "
                                          style={{
                                            borderWidth: "0.4px",
                                            borderStyle: "solid",
                                            borderColor: color.selected
                                              ? "#000"
                                              : "rgb(200, 200, 200)",
                                          }}
                                          whileHover={{
                                            borderColor: "#000",
                                          }}
                                          transition={{
                                            ease: "easeInOut",
                                            duration: 0.3,
                                          }}
                                          onClick={() => {
                                            setProducts((prevProducts) =>
                                              prevProducts?.map((product) => {
                                                if (product.id === item.id) {
                                                  return {
                                                    ...product,
                                                    colors: product.colors?.map(
                                                      (colorItem) => ({
                                                        ...colorItem,
                                                        selected:
                                                          colorItem.id ===
                                                          color.id,
                                                      })
                                                    ),
                                                  };
                                                }
                                                return product;
                                              })
                                            );
                                          }}
                                        >
                                          <div
                                            style={{
                                              backgroundColor: color.colorCode,
                                            }}
                                            className="w-7 h-7  rounded-full"
                                          ></div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex justify-center">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="font-extrabold flex text-[15px]  text-gray-900 text-xs">
                                    Size:
                                    <div className="w-0.5"></div>
                                    {item.sizes?.map((size) => {
                                      if (size.selected) {
                                        return size.name;
                                      }
                                    })}
                                  </div>
                                  <div className="flex w-full gap-2">
                                    {item.sizes?.map((size, index) => {
                                      return (
                                        <motion.div
                                          key={index}
                                          className="w-8 h-8 hover:bg-[rgb(33, 30, 30)] hover:text-white  transition-colors duration-300   cursor-pointer flex justify-center items-center rounded-full  "
                                          style={{
                                            borderWidth: "1px",
                                            borderStyle: "solid",
                                            backgroundColor: size.selected
                                              ? "rgb(33, 30, 30)"
                                              : "white",
                                            color: size.selected
                                              ? "white"
                                              : "rgb(33, 30, 30)",
                                          }}
                                          whileHover={{
                                            backgroundColor: "rgb(33, 30, 30)",
                                            color: "white",
                                          }}
                                          transition={{
                                            ease: "easeInOut",
                                            duration: 2,
                                          }}
                                          onClick={() => {
                                            setProducts((prevProducts) =>
                                              prevProducts?.map((product) => {
                                                if (product.id === item.id) {
                                                  return {
                                                    ...product,
                                                    sizes: product.sizes?.map(
                                                      (sizeItem) => ({
                                                        ...sizeItem,
                                                        selected:
                                                          sizeItem.id ===
                                                          size.id,
                                                      })
                                                    ),
                                                  };
                                                }
                                                return product;
                                              })
                                            );
                                          }}
                                        >
                                          <div className="text-[0.9rem]">
                                            {size.name}
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="w-full flex flex-col items-center gap-4">
                                {item.price <= 0 || item.quantity <= 0 ? (
                                  <button
                                    disabled
                                    className="relative w-full rounded-lg bg-gray-300 px-6 py-3 text-gray-500 cursor-not-allowed"
                                  >
                                    <span className="flex items-center justify-center gap-2">
                                      <i className="fa-regular fa-circle-xmark"></i>
                                      <span className="text-sm font-medium">
                                        {item.price <= 0 ? "Not Available" : "Out of Stock"}
                                      </span>
                                    </span>
                                  </button>
                                ) : (() => {
                                  const selectedColor = item.types?.find(t => t.id === 1)?.values.find(v => v.selected);
                                  const selectedSize = item.types?.find(t => t.id === 2)?.values.find(v => v.selected);
                                  const inCart = isItemInCart(item.id, selectedColor, selectedSize);

                                  return inCart ? (
                                    <button
                                      onClick={() => handleRemoveFromCart(item, selectedColor, selectedSize)}
                                      className="group relative w-full overflow-hidden rounded-lg bg-red-500 px-6 py-3 transition-all duration-300 ease-in-out hover:bg-red-600"
                                    >
                                      <span className="relative flex items-center justify-center gap-2 text-white">
                                        <i className="fa-regular fa-trash-can"></i>
                                        <span className="text-sm font-medium">Remove from Cart</span>
                                      </span>
                                      <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-red-700 text-white duration-300 group-hover:translate-y-0">
                                        <i className="fa-regular fa-trash-can"></i>
                                      </span>
                                    </button>
                                  ) : (
                                    <>
                                      <div className="border px-3 flex justify-between items-center rounded-3xl border-black w-32 h-9">
                                  <i
                                    onClick={() => {
                                      setProductsQuantity((prv) =>
                                        prv > 1 ? prv - 1 : prv
                                      );
                                    }}
                                          className="fa-solid hover:text-cyan-500 fa-minus cursor-pointer"
                                  ></i>
                                  <input
                                          className="w-7 text-center outline-none"
                                    value={productsQuantity}
                                    onChange={() => {}}
                                          type="text"
                                  />
                                  <i
                                    onClick={() => {
                                      setProductsQuantity((prv) =>
                                        prv < 100 ? prv + 1 : prv
                                      );
                                    }}
                                          className="fa-solid fa-plus cursor-pointer hover:text-cyan-500"
                                  ></i>
                                </div>
                                      <button
                                        onClick={() => handleAddToCart(item)}
                                        className="group relative w-full overflow-hidden rounded-lg bg-blue-600 px-6 py-3 transition-all duration-300 ease-in-out hover:bg-blue-700"
                                      >
                                        <span className="relative flex items-center justify-center gap-2 text-white">
                                          <i className="fa-regular fa-cart-plus"></i>
                                          <span className="text-sm font-medium">Add to Cart</span>
                                        </span>
                                        <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-blue-800 text-white duration-300 group-hover:translate-y-0">
                                          <i className="fa-regular fa-cart-plus"></i>
                                        </span>
                                    </button>
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="w-full h-full flex justify-center items-center">
                                <div className="w-full flex justify-center h-full items-center">
                                  <motion.div
                                    whileTap={{
                                      border: "1px solid rgb(6 182 212)",
                                      borderRadius: "6px",
                                    }}
                                    transition={{
                                      ease: "easeInOut",
                                      duration: "0.3",
                                    }}
                                    className="flex w-48 h-9 justify-center hover:text-cyan-500 cursor-pointer group  items-center gap-[6px]"
                                  >
                                    <p className="font-bold group-hover:text-cyan-500 text-slate-900 text-[1.1rem]">
                                      View full details
                                    </p>
                                    <i className="fa-solid fa-arrow-right-long w-6 group-hover:translate-x-2 ease-in-out duration-300"></i>{" "}
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="relative w-full flex flex-col px-1">
                      <Link
                        className="w-fit text-gray-900 transition-colors font-semibold hover:underline dark:text-gray-200"
                        href={`/products/${item.id}`}
                      >
                        {item.name}
                      </Link>
                      <div className="w-full flex justify-between items-center">
                        <div className="flex flex-col">
                          <p className="text-gray-600 transition-colors dark:text-gray-400">
                            ${item.price}
                          </p>
                          <div className="mt-1">
                            {item.quantity > 10 ? (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                In Stock
                              </span>
                            ) : item.quantity > 0 ? (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                Low Stock ({item.quantity} left)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
                            {item.rating}
                          </p>
                          <Rating rating={item.rating} starClass="text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
