export type SignInDataType = {
  email: string;
  password: string;
};

export type SignUpDataType = SignInDataType & {
  firstName: string;
  lastName: string;
};

export type CatType = SignUpDataType & {
  id: number;
  avatarSrc: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithTokenType = {
  user: CatType;
  accessToken: string;
};

export type IsUserEmailExistsType = {
  exists: boolean;
};
