import { configureStore } from "@reduxjs/toolkit";
import personReducer from "../features/insuranceperson/personSlice";
export const store = configureStore({
  reducer: {
    person: personReducer,
  },
});
