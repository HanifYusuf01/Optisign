import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { documentApi } from "./services/documentApi";

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, documentApi.middleware),
});
