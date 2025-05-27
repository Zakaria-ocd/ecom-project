import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  username: "",
  image: "",
  email: "",
  role: "",
  created_at: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    authUser: function (state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.created_at = action.payload.created_at;
      state.image = action.payload.image || "";
      state.isAuthenticated = true;
    },
    setUserImage: function (state, action) {
      state.image = action.payload;
    },
    logoutUser(state) {
      return { ...initialState };
    },
  },
});

export const fetchUserImage = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`http://localhost:8000/api/users/image/${userId}`);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    dispatch(setUserImage(objectURL));
  } catch (error) {
    console.error("Error fetching user image:", error);
  }
};

export const { authUser, setUserImage, logoutUser } = userSlice.actions;
export default userSlice.reducer;
