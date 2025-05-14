import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    id: "",
    username: "",
    image: "",
    email: "",
    role: "",
    created_at: "",
  },
  reducers: {
    authUser: function (state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.created_at = action.payload.created_at;
      state.image = "";
    },
    setUserImage: function (state, action) {
      state.image = action.payload;
    },
    logoutUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const fetchUserImage = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:8000/api/users/image/${userId}`);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    dispatch(setUserImage(objectURL));
  } catch(error) {
    alert(error)
  }
};

export const { authUser, setUserImage, logoutUser } = userSlice.actions;
export default userSlice.reducer;

// [
//     {
//       message:
//         "Can you update the pricing for the Yoga Mats? They seem too high compared to other sellers.",
//       sellerId: 2,
//       timestamp: "2024-12-13 10:15",
//     },
//     {
//       message:
//         "I received a complaint about a delayed shipment for the Dumbbells set. Can you please look into it?",
//       sellerId: 4,
//       timestamp: "2024-12-13 10:30",
//     },
//     {
//       message:
//         "Is it possible to extend the return policy for the Resistance Bands? Some customers are requesting it.",
//       sellerId: 5,
//       timestamp: "2024-12-13 10:45",
//     },
//     {
//       message:
//         "I need more stock for the Adjustable Kettlebells. They’ve been selling fast. Can I place an order for more?",
//       sellerId: 1,
//       timestamp: "2024-12-13 11:00",
//     },
//     {
//       message:
//         "The images I uploaded for my Treadmills are not displaying correctly. Can you fix it?",
//       sellerId: 7,
//       timestamp: "2024-12-13 11:15",
//     },
//     {
//       message:
//         "I’m having trouble with the payment gateway. It says my account is linked incorrectly. Can you help?",
//       sellerId: 3,
//       timestamp: "2024-12-13 11:30",
//     },
//     {
//       message:
//         "Could you update the inventory for the Foam Rollers? It’s showing as out of stock, but we have more available.",
//       sellerId: 6,
//       timestamp: "2024-12-13 11:45",
//     },
//   ],

// const dashboardSlice = createSlice({
//   name: "dashboard",
//   initialState,
//   reducers: {
//     updateTotalSales(state, action) {
//       state.totalSales = action.payload;
//     },
//     updateTotalProducts(state, action) {
//       state.totalProducts = action.payload;
//     },
//     updateTotalSellers(state, action) {
//       state.totalSellers = action.payload;
//     },
//     updateTotalOrders(state, action) {
//       state.totalOrders = action.payload;
//     },
//     updateRecentSellerMessages(state, action) {
//       state.recentSellerMessages = action.payload;
//     },
//   },
// });

// export const {
//   updateTotalSales,
//   updateTotalProducts,
//   updateTotalSellers,
//   updateTotalOrders,
//   updateRecentSellerMessages,
// } = dashboardSlice.actions;

// export default dashboardSlice.reducer;




//   async function getProductDefaultPrice(product_id) {
    //     const response = await fetch(
    //       `http://localhost:8000/api/productDefaultPrice/${product_id}`
    //     );
    //     const data = await response.json();
    //     return data.price;
    //   }
    //   async function getProductDefaultImage(product_id) {
    //     const response = await fetch(
    //       `http://localhost:8000/api/productImage/${product_id}`
    //     );
    //     const data = await response.json();
    //     return data.image_url;
    //   }
    //   let price = "";
    //   let image = "";
    //   setProducts((prv) =>
    //     prv.map((item) => {
    //       price = getProductDefaultPrice(item.id);
    //       return { ...item, price };
    //     })
    //   );
    //   setProducts((prv) =>
    //     prv.map((item) => {
    //       image = getProductDefaultImage(item.id);
    //       return { ...item, image };
    //     })
    //   );
    // }

    // setProducts([
    //   {
    //     id: 1,
    //     name: "Men Apple Watch",
    //     price: 120.0,
    //     image: "/assets/products/men-apple-watch.jpg",
    //     rating: 4.3,
    //     colors: [
    //       { id: 1, name: "Red", colorCode: "#FF0000", selected: true },
    //       { id: 2, name: "Green", colorCode: "#00FF00", selected: false },
    //       { id: 3, name: "Blue", colorCode: "#0000FF", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "L", selected: false },
    //       { id: 3, name: "XS", selected: false },
    //     ],
    //   },
    //   {
    //     id: 2,
    //     name: "Men Black Shoes",
    //     price: 155.0,
    //     image: "/assets/products/men-black-shoes.jpg",
    //     rating: 4.7,
    //     colors: [
    //       { id: 4, name: "Gray", colorCode: "#808080", selected: true },
    //       { id: 9, name: "Cyan", colorCode: "#00FFFF", selected: false },
    //       { id: 12, name: "Magenta", colorCode: "#FF00FF", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "L", selected: false },
    //     ],
    //   },
    //   {
    //     id: 3,
    //     name: "Men Brown Shoes",
    //     price: 80.0,
    //     image: "/assets/products/men-brown-shoes.jpg",
    //     rating: 3.4,
    //     colors: [
    //       { id: 11, name: "Violet", colorCode: "#EE82EE", selected: true },
    //       { id: 55, name: "Peach", colorCode: "#FFDAB9", selected: false },
    //       { id: 100, name: "Coral", colorCode: "#FF7F50", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "L", selected: false },
    //       { id: 3, name: "2XL", selected: false },
    //       { id: 4, name: "XS", selected: false },
    //     ],
    //   },
    //   {
    //     id: 4,
    //     name: "Men T-Shirts",
    //     price: 140.0,
    //     image: "/assets/products/t-shirts.jpg",
    //     rating: 5,
    //     colors: [
    //       { id: 18, name: "Mint", colorCode: "#98FF98", selected: true },
    //       { id: 17, name: "Crimson", colorCode: "#DC143C", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "L", selected: false },
    //       { id: 3, name: "S", selected: false },
    //       { id: 4, name: "XS", selected: false },
    //     ],
    //   },
    //   {
    //     id: 5,
    //     name: "Women Beige Pants",
    //     price: 185.0,
    //     image: "/assets/products/women-beige-pants.jpg",
    //     rating: 3.1,
    //     colors: [
    //       { id: 27, name: "Gold", colorCode: "#FFD700", selected: true },
    //       { id: 29, name: "Silver", colorCode: "#C0C0C0", selected: false },
    //       { id: 30, name: "Beige", colorCode: "#F5F5DC", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "XS", selected: false },
    //     ],
    //   },
    //   {
    //     id: 6,
    //     name: "Reafonbgates Pants",
    //     price: 75.0,
    //     image: "/assets/products/reafonbgates-pants.jpg",
    //     rating: 4.7,
    //     colors: [
    //       { id: 622, name: "Turquoise", colorCode: "#40E0D0", selected: true },
    //       { id: 697, name: "Indigo", colorCode: "#4B0082", selected: false },
    //       { id: 498, name: "Violet", colorCode: "#EE82EE", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "3XL", selected: false },
    //       { id: 3, name: "XS", selected: false },
    //     ],
    //   },
    //   {
    //     id: 7,
    //     name: "Goumbik Brown Shoes",
    //     price: 135.0,
    //     image: "/assets/products/goumbik-brown-shoes.jpg",
    //     rating: 3.9,
    //     colors: [
    //       { id: 73, name: "Peach", colorCode: "#FFDAB9", selected: true },
    //       { id: 816, name: "Coral", colorCode: "#FF7F50", selected: false },
    //     ],
    //     sizes: [{ id: 1, name: "XL", selected: true }],
    //   },
    //   {
    //     id: 8,
    //     name: "Introspective design hat",
    //     price: 65.0,
    //     image: "/assets/products/introspective-design-hat.jpg",
    //     rating: 3.4,
    //     colors: [
    //       { id: 800, name: "Blue", colorCode: "#0000FF", selected: true },
    //       { id: 811, name: "Black", colorCode: "#000000", selected: false },
    //       { id: 922, name: "White", colorCode: "#FFFFFF", selected: false },
    //     ],
    //     sizes: [
    //       { id: 1, name: "M", selected: true },
    //       { id: 2, name: "2XL", selected: false },
    //       { id: 3, name: "XS", selected: false },
    //     ],
    //   },
    // ]);



//  {item.types?.find((i) => i.id == 1) && (
//                                   <div className="flex flex-col gap-2">
//                                     <div className="font-extrabold flex text-gray-900 text-xs">
//                                       COLOR:
//                                       <div className="w-0.5"></div>
//                                       {item.types
//                                         .find((i) => i.id == 1)
//                                         .values.map((color, index) => {
//                                           if (index == 0) {
//                                             return color.value;
//                                           }
//                                         })}
//                                     </div>
//                                     <div className="flex wf-full gap-2">
//                                       {item.types
//                                         .find((i) => i.id == 1)
//                                         .values?.map((color, index) => {
//                                           return (
//                                             <motion.div
//                                               key={index}
//                                               className="w-8 h-8 cursor-pointer p-0 m-0 flex justify-center items-center rounded-full  "
//                                               style={{
//                                                 borderWidth: "0.4px",
//                                                 borderStyle: "solid",
//                                                 borderColor: color.selected
//                                                   ? "#000"
//                                                   : "rgb(200, 200, 200)",
//                                               }}
//                                               whileHover={{
//                                                 borderColor: "#000",
//                                               }}
//                                               transition={{
//                                                 ease: "easeInOut",
//                                                 duration: 0.3,
//                                               }}
//                                               onClick={() => {
//                                                 setProducts((prevProducts) =>
//                                                   prevProducts.map(
//                                                     (product) => {
//                                                       if (
//                                                         product.id === item.id
//                                                       ) {
//                                                         const updatedTypes =
//                                                           product.types.map(
//                                                             (type) => {
//                                                               if (
//                                                                 type.id === 1
//                                                               ) {
//                                                                 return {
//                                                                   ...type,
//                                                                   values:
//                                                                     type.values.map(
//                                                                       (
//                                                                         colorItem
//                                                                       ) =>{
//                                                                         if(colorItem.id ==
//                                                                           color.id){
//                                                                             setSelectedType(
//                                                                               {
//                                                                                 productId:
//                                                                                   product.id,
//                                                                                 valueId:
//                                                                                   color.id,
//                                                                                 choice_id:
//                                                                                   color.choice_id,
//                                                                               }
//                                                                             );
//                                                                           }
//                                                                          return {
//                                                                         ...colorItem,
//                                                                         selected:
//                                                                           colorItem.id ===
//                                                                           color.id,
//                                                                       }}
//                                                                     ),
//                                                                 };
//                                                               }
//                                                               return type;
//                                                             }
//                                                           );

//                                                         return {
//                                                           ...product,
//                                                           types: updatedTypes,
//                                                         };
//                                                       }
//                                                       return product;
//                                                     }
//                                                   )
//                                                 );
//                                               }}
//                                             >
//                                               <div
//                                                 style={{
//                                                   backgroundColor:
//                                                     color.colorCode,
//                                                 }}
//                                                 className="w-7 h-7  rounded-full"
//                                               ></div>
//                                             </motion.div>
//                                           );
//                                         })}
//                                     </div>
//                                   </div>
//                                 )}