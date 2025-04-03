const { WISHLIST_ITEM_INCLUDES } = require("../consts/modelsFields");
const { WishlistItem } = require("../db/models");

class WishlistItemService {
  static async getById(id) {
    return await WishlistItem.findOne({
      where: { id },
      include: WISHLIST_ITEM_INCLUDES,
    });
  }

  static async create(data) {
    const newWishlistItem = await WishlistItem.create(data);
    return await this.getById(newWishlistItem.id);
  }

  static async update(id, data) {
    const wishlistItem = await this.getById(id);

    if (wishlistItem) {
      if (data.title) {
        wishlistItem.title = data.title;
      }
      if (data.description) {
        wishlistItem.description = data.description;
      }
      if (data.maxPrice) {
        wishlistItem.maxPrice = data.maxPrice;
      }
      if (data.minPrice) {
        wishlistItem.minPrice = data.minPrice;
      }
      if (data.priority) {
        wishlistItem.priority = data.priority;
      }

      await wishlistItem.save();
    }

    return wishlistItem;
  }

  static async delete(id) {
    const wishlistItem = await this.getById(id);

    if (wishlistItem) {
      await wishlistItem.destroy();
    }

    return wishlistItem;
  }
}

module.exports = WishlistItemService;
