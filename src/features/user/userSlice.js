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
