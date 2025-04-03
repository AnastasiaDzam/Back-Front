const { Image } = require("../db/models");

class ImageService {
  static async createImages(images) {
    return await Image.bulkCreate(images, { validate: true });
  }

  static async deleteById(imageId) {
    const image = await Image.findByPk(imageId);
    if (image) {
      await image.destroy();
    }
  }

  static async deleteBySrc(imageSrc) {
    const image = await Image.findOne({ where: { src: imageSrc } });
    if (image) {
      await image.destroy();
    }
  }

  static async getByWishlistItemId(wishlistItemId) {
    return await Image.findAll({
      where: { wishlistItemId },
      attributes: ["id", "src"],
    });
  }
}

module.exports = ImageService;
