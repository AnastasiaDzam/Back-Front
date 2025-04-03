import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import type { WishlistItemType, WishListType } from '../model';
import {
  getAllUserWishListsThunk,
  getUserWishListByIdThunk,
  createWishListThunk,
  updateWishListByIdThunk,
  deleteWishListByIdThunk,
  inviteUserToWishListThunk,
  kickOutUserToWishListThunk,
  createWishListItemThunk,
  deleteWishListItemByIdThunk,
  updateWishListItemThunk,
} from '../api';

type WishListState = {
  wishlists: WishListType[] | [];
  currentWishlist: WishListType | null;
  currentUserWishListItems: WishlistItemType[] | [];
  selectedUserInWishlistId: number | null;
  error: string | null;
  loading: boolean;
};

const initialState: WishListState = {
  wishlists: [],
  currentWishlist: null,
  currentUserWishListItems: [],
  selectedUserInWishlistId: null,
  error: null,
  loading: false,
};

const wishlistSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentWishlist: (state, action) => {
      state.currentWishlist =
        state.wishlists.find((el) => el.id === action.payload) ?? state.wishlists[0];

      state.currentUserWishListItems =
        state.currentWishlist?.wishlistItems.filter(
          (wishlistItem) => wishlistItem.authorId === state.currentWishlist?.ownerId,
        ) ?? [];

      if (state.currentWishlist) {
        state.selectedUserInWishlistId = state.currentWishlist.ownerId;
      }

      state.selectedUserInWishlistId = action.payload;
    },

    setCurrentSelectedUserOnWishlist: (state, action) => {
      state.selectedUserInWishlistId = action.payload;
    },

    setCurrentUserWishListItems: (state, action) => {
      state.currentUserWishListItems =
        state.currentWishlist?.wishlistItems.filter(
          (wishlistItem) => wishlistItem.authorId === action.payload,
        ) ?? [];
    },
  },
  extraReducers: (builder) => {
    builder
      //* getAllUserWishListsThunk
      .addCase(getAllUserWishListsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserWishListsThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const [firstWishlist] = data;
        state.loading = false;
        state.wishlists = data;
        state.currentWishlist = firstWishlist;
        state.currentUserWishListItems =
          firstWishlist?.wishlistItems.filter(
            (wishlistItem) => wishlistItem.authorId === firstWishlist.ownerId,
          ) ?? [];
        state.selectedUserInWishlistId = firstWishlist.ownerId;
        state.error = null;
      })
      .addCase(getAllUserWishListsThunk.rejected, (state, action) => {
        state.loading = false;
        state.wishlists = [];
        state.error = action.payload!.error;
      })

      //* getUserWishListByIdThunk
      .addCase(getUserWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWishlist = action.payload.data;
        state.error = null;
      })
      .addCase(getUserWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.currentWishlist = null;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* createWishListThunk
      .addCase(createWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = [...state.wishlists, action.payload.data];
        state.currentWishlist = action.payload.data;
        state.currentUserWishListItems =
          action.payload.data?.wishlistItems.filter(
            (wishlistItem) => wishlistItem.authorId === action.payload.data.ownerId,
          ) ?? [];
        state.selectedUserInWishlistId = action.payload.data.ownerId;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(createWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* updateWishListByIdThunk
      .addCase(updateWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        state.selectedUserInWishlistId = action.payload.data.ownerId;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(updateWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* inviteUserToWishListThunk
      .addCase(inviteUserToWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(inviteUserToWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(inviteUserToWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* kickOutUserToWishListThunk
      .addCase(kickOutUserToWishListThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(kickOutUserToWishListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.map((el) =>
          el.id === action.payload.data.id ? action.payload.data : el,
        );
        state.currentWishlist = action.payload.data;
        if (
          !action.payload.data.invitedUsers
            .map((el) => el.id)
            .includes(state.currentUserWishListItems[0].authorId)
        ) {
          state.currentUserWishListItems = [];
        }
        message.success(action.payload.message);
        state.error = null;
      })
      .addCase(kickOutUserToWishListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* deleteWishListByIdThunk
      .addCase(deleteWishListByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWishListByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlists = state.wishlists.filter((el) => el.id !== action.payload.data.id);
        message.success(action.payload.message);
        state.currentWishlist = null;
        state.currentUserWishListItems = [];
        state.selectedUserInWishlistId = null;
        state.error = null;
      })
      .addCase(deleteWishListByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* createWishListItemThunk
      .addCase(createWishListItemThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWishListItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        message.success(action.payload.message);

        state.wishlists = state.wishlists.map((el) => {
          if (el.id === action.payload.data.wishlistId) {
            el.wishlistItems.push(action.payload.data);
          }
          return el;
        });

        if (state.currentWishlist?.id === action.payload.data.wishlistId) {
          state.currentWishlist?.wishlistItems.push(action.payload.data);
        }

        if (state.selectedUserInWishlistId === action.payload.data.authorId) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          state.currentUserWishListItems.push(action.payload.data);
        }
      })
      .addCase(createWishListItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* deleteWishListItemByIdThunk
      .addCase(deleteWishListItemByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWishListItemByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        message.success(action.payload.message);

        state.wishlists = state.wishlists.map((el) => {
          if (el.id === action.payload.data.wishlistId) {
            el.wishlistItems = el.wishlistItems.filter(
              (elem) => elem.id !== action.payload.data.id,
            );
          }
          return el;
        });

        if (state.currentWishlist?.id === action.payload.data.wishlistId) {
          state.currentWishlist.wishlistItems = state.currentWishlist?.wishlistItems.filter(
            (elem) => elem.id !== action.payload.data.id,
          );
        }

        if (state.selectedUserInWishlistId === action.payload.data.authorId) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          state.currentUserWishListItems = state.currentUserWishListItems.filter(
            (elem) => elem.id !== action.payload.data.id,
          );
        }
      })
      .addCase(deleteWishListItemByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      })

      //* updateWishListItemThunk
      .addCase(updateWishListItemThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWishListItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        message.success(action.payload.message);

        state.wishlists = state.wishlists.map((el) => {
          if (el.id === action.payload.data.wishlistId) {
            el.wishlistItems = el.wishlistItems.map((elem) =>
              elem.id === action.payload.data.id ? action.payload.data : elem,
            );
          }
          return el;
        });

        if (state.currentWishlist?.id === action.payload.data.wishlistId) {
          state.currentWishlist.wishlistItems = state.currentWishlist?.wishlistItems.map((elem) =>
            elem.id === action.payload.data.id ? action.payload.data : elem,
          );
        }

        if (state.selectedUserInWishlistId === action.payload.data.authorId) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          state.currentUserWishListItems = state.currentUserWishListItems.map((elem) =>
            elem.id === action.payload.data.id ? action.payload.data : elem,
          );
        }
      })
      .addCase(updateWishListItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!.error;
        message.error(action.payload!.error);
      });
  },
});

export const { setCurrentWishlist, setCurrentUserWishListItems, setCurrentSelectedUserOnWishlist } =
  wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
