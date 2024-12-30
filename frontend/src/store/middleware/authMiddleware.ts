import { Middleware } from "@reduxjs/toolkit";
import { clearCollections } from "../slices/collectionSlice";

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === "auth/logout") {
    store.dispatch(clearCollections());
  }
  return next(action);
};
