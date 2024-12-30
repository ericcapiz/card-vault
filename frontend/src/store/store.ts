import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";
import collectionReducer from "./slices/collectionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    collections: collectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
