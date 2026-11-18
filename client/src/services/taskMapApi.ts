import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query/react';
import type { ApiError, ApiResponse } from '../interfaces/api';
import type { NewObject, NewPolygon, ObjectDto, PolygonDto } from '../interfaces/models';

const rawBaseQuery = fetchBaseQuery({ baseUrl: '/api' });

/**
 * Unwraps the server's envelope. A reply with IsSuccess false (any non-2xx code) rejects with the envelope's
 * Error text. A success resolves with the envelope's Result.
 */
const envelopeBaseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (args, api, extraOptions) => {
  const reply = await rawBaseQuery(args, api, extraOptions);

  if (reply.error) {
    const envelope = reply.error.data as Partial<ApiResponse<unknown>> | undefined;
    return {
      error: {
        message: envelope?.error || 'The server did not respond as expected.',
        status: envelope?.status ?? reply.error.status,
      },
    };
  }

  const envelope = reply.data as ApiResponse<unknown>;
  if (!envelope.isSuccess) {
    return { error: { message: envelope.error, status: envelope.status } };
  }
  return { data: envelope.result };
};

/**
 * Every server call, in one place. The routes follow the planned API calls (CreatePolygon, GetPolygons,
 * DeletePolygons, SaveObjects, GetObjects, DeleteObject) and are placeholders until the server has them.
 */
export const taskMapApi = createApi({
  reducerPath: 'taskMapApi',
  baseQuery: envelopeBaseQuery,
  tagTypes: ['Polygon', 'Object'],
  endpoints: (builder) => ({
    getPolygons: builder.query<PolygonDto[], void>({
      query: () => 'polygons',
      providesTags: ['Polygon'],
    }),
    createPolygon: builder.mutation<PolygonDto[], NewPolygon>({
      query: (body) => ({ url: 'polygons', method: 'POST', body }),
      invalidatesTags: ['Polygon'],
    }),
    deletePolygons: builder.mutation<PolygonDto[], string[]>({
      query: (ids) => ({ url: 'polygons', method: 'DELETE', body: { ids } }),
      invalidatesTags: ['Polygon'],
    }),
    getObjects: builder.query<ObjectDto[], void>({
      query: () => 'objects',
      providesTags: ['Object'],
    }),
    saveObjects: builder.mutation<ObjectDto[], NewObject[]>({
      query: (objects) => ({ url: 'objects', method: 'POST', body: { objects } }),
      invalidatesTags: ['Object'],
    }),
    deleteObject: builder.mutation<ObjectDto[], string>({
      query: (id) => ({ url: `objects/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: ['Object'],
    }),
  }),
});

export const {
  useGetPolygonsQuery,
  useCreatePolygonMutation,
  useDeletePolygonsMutation,
  useGetObjectsQuery,
  useSaveObjectsMutation,
  useDeleteObjectMutation,
} = taskMapApi;
