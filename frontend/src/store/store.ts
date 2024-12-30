import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uploadReducer from "./slices/uploadSlice";
import collectionReducer from "./slices/collectionSlice";
import { authMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    collections: collectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
