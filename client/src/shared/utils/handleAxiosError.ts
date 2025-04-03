import { AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponseRejectType } from '../types';
import { defaultRejectedAxiosError } from '../consts';

type ICustomAxiosResponse = AxiosResponse & {
  data: ApiResponseRejectType;
};

export function handleAxiosError(error: unknown): ApiResponseRejectType {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_CANCELED') {
      return {
        ...defaultRejectedAxiosError,
        error: 'Время ожидания истекло. Повторите позднее или проверьте настройки интернета.',
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        ...defaultRejectedAxiosError,
        error: 'Ошибка подключения к серверу, повторите позднее',
      };
    }

    if (error.response) {
      const response = error.response as ICustomAxiosResponse;
      return response.data;
    }
  }

  return defaultRejectedAxiosError;
}
