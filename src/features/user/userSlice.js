import { createSlice } from "@reduxjs/toolkit";
import { getUserImageUrl } from "@/lib/userImage";

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

export const fetchUserImage = (user) => async (dispatch) => {
  const imageUrl = getUserImageUrl(user);
  if (!imageUrl) {
    dispatch(setUserImage(""));
    return;
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) {
      dispatch(setUserImage(""));
      return;
    }

    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    dispatch(setUserImage(objectURL));
  } catch (error) {
    console.error("Error fetching user image:", error);
    dispatch(setUserImage(""));
  }
};

export const { authUser, setUserImage, logoutUser } = userSlice.actions;
export default userSlice.reducer;
