'use strict';
const fs = require('fs');
const path = require('path');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate({ WishlistItem }) {
      this.belongsTo(WishlistItem, {
        foreignKey: 'wishlistItemId',
        as: 'wishlistItem',
      });
    }
  }
  Image.init(
    {
      src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      wishlistItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );

  Image.addHook('beforeDestroy', async (image, options) => {
    const filePath = path.join(__dirname, '../../public/images/', image.src);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Удаляем файл при удалении записи
    }
  });

  return Image;
};
