import type { CommentType } from '@/entities/comment';
import type { UserType } from '@/entities/user';

export type ImageType = {
  id: number;
  src: string;
  wishlistItemId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LinkType = ImageType;

export enum Priority {
  LOW = 'не особо нужно',
  MEDIUM = 'было бы славно',
  HIGH = 'очень нужно',
  CRITICAL = 'душу продать',
}

export type WishlistItemRawDataType = {
  title: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  priority: Priority;
  links: string[];
};

export type WishlistItemType = {
  id: number;
  title: string;
  description: string;
  maxPrice: number;
  minPrice: number;
  authorId: number;
  wishlistId: number;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  owner: UserType;
  links: LinkType[];
  images: ImageType[];
  comments: CommentType[];
};

export type CreateWishListData = {
  title: string;
};

export type WishListType = {
  id: number;
  title: string;
  backgroundPictureSrc: string;
  ownerId: number;
  owner: UserType;
  invitedUsers: UserType[];
  wishlistItems: WishlistItemType[];
  createdAt: Date;
  updatedAt: Date;
};
