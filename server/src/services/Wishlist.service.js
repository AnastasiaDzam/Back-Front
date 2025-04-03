const { Op } = require("sequelize");
const { WISHLIST_INCLUDES } = require("../consts/modelsFields");
const { Wishlist, WishlistUser } = require("../db/models");

class WishlistService {
  static async getAll(userId) {
    const ownedWishlists = await Wishlist.findAll({
      where: { ownerId: userId },

      include: WISHLIST_INCLUDES.map((include) => {
        if (include.as === "wishlistItems") {
          return {
            ...include,
            separate: true,
            order: [["maxPrice", "DESC"]],
          };
        }
        return include;
      }),
    });

    const invitedWishlists = await Wishlist.findAll({
      include: WISHLIST_INCLUDES.map((include) => {
        if (include.as === "wishlistItems") {
          return {
            ...include,
            separate: true,
            order: [["maxPrice", "DESC"]],
          };
        }
        return include;
      }),
    });

    return [
      ...ownedWishlists,
      ...invitedWishlists.filter((invitedWishlist) =>
        invitedWishlist.invitedUsers.some(
          (invitedUser) => invitedUser.id === userId
        )
      ),
    ];
  }

  static async getById(id) {
    return await Wishlist.findOne({
      where: { id },
      include: WISHLIST_INCLUDES.map((include) => {
        if (include.as === "wishlistItems") {
          return {
            ...include,
            separate: true,
            order: [["maxPrice", "DESC"]],
          };
        }
        return include;
      }),
    });
  }

  static async create(data) {
    const newWishlist = await Wishlist.create(data);

    return await this.getById(newWishlist.id);
  }

  static async update(id, data) {
    const wishlist = await this.getById(id);

    if (wishlist) {
      if (data.title) {
        wishlist.title = data.title;
      }
      if (data.backgroundPictureSrc) {
        wishlist.backgroundPictureSrc = data.backgroundPictureSrc;
      }

      await wishlist.save();
    }

    return wishlist;
  }

  static async delete(id) {
    const wishlist = await this.getById(id);
    if (wishlist) {
      await wishlist.destroy();
    }
    return wishlist;
  }

  static async inviteUser(data) {
    const newInviteEntry = await WishlistUser.create(data);

    if (newInviteEntry) {
      return await this.getById(data.wishlistId);
    }
  }

  static async kickOutUser(data) {
    const deletedInviteEntry = await WishlistUser.destroy({ where: data });

    if (deletedInviteEntry) {
      return await this.getById(data.wishlistId);
    }
  }
}

module.exports = WishlistService;
