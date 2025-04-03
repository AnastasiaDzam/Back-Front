import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { IsUserEmailExistsType } from '../model';
import type { ApiResponseRejectType, ApiResponseSuccessType } from '@/shared/types';
import { handleAxiosError } from '@/shared/utils/handleAxiosError';

export const isEmailExistsChecker = async (
  email: string,
): Promise<ApiResponseSuccessType<IsUserEmailExistsType> | ApiResponseRejectType> => {
  try {
    const { data } = await axiosInstance.post<ApiResponseSuccessType<IsUserEmailExistsType>>(
      '/auth/check-email',
      { email },
    );
    return data;
  } catch (error) {
    return handleAxiosError(error);
  }
};
