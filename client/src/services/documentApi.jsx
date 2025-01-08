import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    uploadDocument: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "document/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    placeSignature: builder.mutation({
      query: ({ id, data }) => ({
        url: `document/${id}/signature`,
        method: "POST",
        body: data,
      }),
    }),
    shareDocument: builder.mutation({
      query: ({ id, data }) => ({
        url: `document/${id}/share`,
        method: "POST",
        body: data,
      }),
    }),
    fetchReceivedDocuments: builder.query({
      query: (email) => `document/received?email=${email}`,
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  usePlaceSignatureMutation,
  useShareDocumentMutation,
  useFetchReceivedDocumentsQuery,
} = documentApi;
