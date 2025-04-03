export type ApiResponseSuccessType<T> = {
  data: T;
  message: string;
  statusCode: number;
  error: null;
};

export type ApiResponseRejectType = {
  data: null;
  message: string;
  statusCode: number;
  error: string;
};
