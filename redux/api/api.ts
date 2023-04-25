// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API,
        prepareHeaders: headers => {
            const token = localStorage.getItem('token')
            if (token) headers.set('authorization', `Bearer ${token}` as string)
        }
    }),
    endpoints: builder => ({
        getAllLots: builder.query({
            query: () => 'lots'
        }),
        getLotCategories: builder.query({
            query: (lotId: string) => `categories/lot/${lotId}`
        }),
        getLotCategoriesFather: builder.query({
            query: (lotId: string) => `categories/lot/${lotId}/father`
        }),
        getLotDocuments: builder.query({
            query: (lotId: string) => `documents/lot/${lotId}`
        }),
        getSingleDocument: builder.query({
            query: (docId: number) => `documents/${docId}`
        }),
        getSingleLot: builder.query({
            query: (lotId: string) => `lots/${lotId}`
        }),
        getCategory: builder.query({
            query: (categoryId: number) => `categories/${categoryId}`
        }),
        getCategoryChilds: builder.query({
            query: (categoryId: number) => `categories/child/${categoryId}`
        }),
        removeCategory: builder.mutation({
            query: catId => ({
                url: `categories/${catId}`,
                method: 'DELETE'
            }),
            transformResponse: (response: any, meta, arg) => response.data
        }),
        removeDocument: builder.mutation({
            query: docId => ({
                url: `documents/${docId}`,
                method: 'DELETE'
            }),
            transformResponse: (response: any, meta, arg) => response.data
        }),
        createSubCategory: builder.mutation({
            query: body => ({
                url: `categories`,
                method: 'POST',
                body
            }),
            transformResponse: (response: any, meta, arg) => response.data
        }),
        editSubCategory: builder.mutation({
            query: body => ({
                url: `categories/${body.id}`,
                method: 'PATCH',
                body
            }),
            transformResponse: (response: any, meta, arg) => response.data
        }),
        getLotsMedia: builder.query({
            query: (params: { lotId: string; type: string }) =>
                `media/${params.type}/lot/${params.lotId}`
        }),
        createMedia: builder.mutation({
            query: body => ({
                url: `media`,
                method: 'POST',
                body
            }),
            transformResponse: (response: any, meta, arg) => response.data
        }),
        removeMedia: builder.mutation({
            query: mediaId => ({
                url: `media/${mediaId}`,
                method: 'DELETE'
            }),
            transformResponse: (response: any, meta, arg) => response
        }),
        removeLot: builder.mutation({
            query: loteId => ({
                url: `lots/${loteId}`,
                method: 'DELETE'
            }),
            transformResponse: (response: any, meta, arg) => response.data
        })
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetAllLotsQuery,
    useGetLotCategoriesQuery,
    useGetCategoryQuery,
    useGetCategoryChildsQuery,
    useGetLotDocumentsQuery,
    useGetSingleLotQuery,
    useGetSingleDocumentQuery,
    useRemoveCategoryMutation,
    useRemoveDocumentMutation,
    useCreateSubCategoryMutation,
    useEditSubCategoryMutation,
    useGetLotsMediaQuery,
    useCreateMediaMutation,
    useRemoveMediaMutation,
    useRemoveLotMutation,
    useGetLotCategoriesFatherQuery
} = api
