import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./reducers/dashboardReducer";

export const Wrapper = ({ children }) => {
  const store = configureStore({
    dashboard: dashboardReducer,
  });

  return <Provider store={store}>{children}</Provider>;
};
