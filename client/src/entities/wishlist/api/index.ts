import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { ApiResponseRejectType, ApiResponseSuccessType } from '@/shared/types';
import { handleAxiosError } from '@/shared/utils/handleAxiosError';
import type { WishlistItemType, WishListType } from '../model';

enum WISHLIST_THUNKS_TYPES {
  GET_ALL = 'wishlist/getAll',
  GET_BY_ID = 'wishlist/getById',
  CREATE = 'wishlist/create',
  UPDATE = 'wishlist/update',
  DELETE = 'wishlist/delete',
  INVITE_USER = 'wishlist/invite',
  KICK_OUT = 'wishlist/kick-out',
  CREATE_WISHLIST_ITEM = 'wishlist/create-wishlist-item',
  DELETE_ITEM = 'wishlist/delete-wishlist-item',
  UPDATE_ITEM = 'wishlist/update-wishlist-item',
}

export const getAllUserWishListsThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType[]>,
  undefined,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ApiResponseSuccessType<WishListType[]>>('/wishlists');

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getUserWishListByIdThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  number,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.GET_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ApiResponseSuccessType<WishListType>>(
      `/wishlists/${id}`,
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createWishListThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  FormData,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.CREATE, async (newWishlistData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<WishListType>>(
      `/wishlists`,
      newWishlistData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateWishListByIdThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  { id: number; updatedWishlistData: FormData },
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.UPDATE, async ({ id, updatedWishlistData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put<ApiResponseSuccessType<WishListType>>(
      `/wishlists/${id}`,
      updatedWishlistData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteWishListByIdThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  number,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<ApiResponseSuccessType<WishListType>>(
      `/wishlists/${id}`,
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const inviteUserToWishListThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  { id: number; userId: number },
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.INVITE_USER, async ({ id, userId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<WishListType>>(
      `/wishlists/invite/${id}`,
      { userId },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const kickOutUserToWishListThunk = createAsyncThunk<
  ApiResponseSuccessType<WishListType>,
  { id: number; userId: number },
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.KICK_OUT, async ({ id, userId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<WishListType>>(
      `/wishlists/kick-out/${id}`,
      { userId },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createWishListItemThunk = createAsyncThunk<
  ApiResponseSuccessType<WishlistItemType>,
  FormData,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.CREATE_WISHLIST_ITEM, async (newWishlistItemData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<WishlistItemType>>(
      `/wishlistItem`,
      newWishlistItemData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteWishListItemByIdThunk = createAsyncThunk<
  ApiResponseSuccessType<WishlistItemType>,
  number,
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.DELETE_ITEM, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<ApiResponseSuccessType<WishlistItemType>>(
      `/wishlistItem/${id}`,
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateWishListItemThunk = createAsyncThunk<
  ApiResponseSuccessType<WishlistItemType>,
  { id: number; formData: FormData },
  { rejectValue: ApiResponseRejectType }
>(WISHLIST_THUNKS_TYPES.UPDATE_ITEM, async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put<ApiResponseSuccessType<WishlistItemType>>(
      `/wishlistItem/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
