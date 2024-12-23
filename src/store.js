import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './reducers/dashboardReducer';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

export default store;