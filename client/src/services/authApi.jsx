import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://100.24.4.111" }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/api/User/sign-up",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/api/User/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
