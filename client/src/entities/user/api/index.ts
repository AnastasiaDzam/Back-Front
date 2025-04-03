import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import type { ApiResponseRejectType, ApiResponseSuccessType } from '@/shared/types';
import type { SignInDataType, CatType, UserWithTokenType } from '../model';
import { handleAxiosError } from '@/shared/utils/handleAxiosError';

enum AUTH_API_ROUTES {
  REFRESH_TOKENS = '/auth/refreshTokens',
  SIGN_UP = '/auth/signUp',
  SIGN_IN = '/auth/signIn',
  SIGN_OUT = '/auth/signOut',
  USERS = '/auth/users',
}

enum USER_THUNKS_TYPES {
  REFRESH_TOKENS = 'user/refreshTokens',
  SIGN_UP = 'user/signUp',
  SIGN_IN = 'user/signIn',
  SIGN_OUT = 'user/signOut',
  GET_ALL_USERS = 'user/allUsers',
}

export const refreshTokensThunk = createAsyncThunk<
  ApiResponseSuccessType<UserWithTokenType>,
  undefined,
  { rejectValue: ApiResponseRejectType }
>(USER_THUNKS_TYPES.REFRESH_TOKENS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ApiResponseSuccessType<UserWithTokenType>>(
      AUTH_API_ROUTES.REFRESH_TOKENS,
    );

    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signUpThunk = createAsyncThunk<
  ApiResponseSuccessType<UserWithTokenType>,
  FormData,
  { rejectValue: ApiResponseRejectType }
>(USER_THUNKS_TYPES.SIGN_UP, async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<UserWithTokenType>>(
      AUTH_API_ROUTES.SIGN_UP,
      userData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signInThunk = createAsyncThunk<
  ApiResponseSuccessType<UserWithTokenType>,
  SignInDataType,
  { rejectValue: ApiResponseRejectType }
>(USER_THUNKS_TYPES.SIGN_IN, async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<UserWithTokenType>>(
      AUTH_API_ROUTES.SIGN_IN,
      userData,
    );

    setAccessToken(data.data.accessToken);
    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const signOutThunk = createAsyncThunk<
  ApiResponseSuccessType<null>,
  undefined,
  { rejectValue: ApiResponseRejectType }
>(USER_THUNKS_TYPES.SIGN_OUT, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ApiResponseSuccessType<null>>(
      AUTH_API_ROUTES.SIGN_OUT,
    );

    setAccessToken('');
    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getAllUsersThunk = createAsyncThunk<
  ApiResponseSuccessType<CatType[]>,
  undefined,
  { rejectValue: ApiResponseRejectType }
>(USER_THUNKS_TYPES.GET_ALL_USERS, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ApiResponseSuccessType<CatType[]>>(
      AUTH_API_ROUTES.USERS,
    );

    return data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
