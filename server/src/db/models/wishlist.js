'use strict';
const fs = require('fs');
const path = require('path');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate({ User, WishlistUser, WishlistItem }) {
      this.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
      this.belongsToMany(User, {
        through: {
          model: WishlistUser,
        },
        foreignKey: 'wishlistId',
        as: 'invitedUsers',
      });
      this.hasMany(WishlistItem, {
        foreignKey: 'wishlistId',
        as: 'wishlistItems',
      });
    }
  }
  Wishlist.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      backgroundPictureSrc: {
        type: DataTypes.STRING,
      },
      ownerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Wishlist',
    }
  );

  // Хуки для удаления файлов
  Wishlist.addHook('beforeUpdate', async (wishlist, options) => {
    // Проверяем, была ли изменена фотография
    if (wishlist.changed('backgroundPictureSrc')) {
      const oldFilePath = path.join(
        __dirname,
        '../../public/images/', // Путь к файлу на сервере
        wishlist._previousDataValues.backgroundPictureSrc
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Удаляем старый файл
      }
    }
  });

  Wishlist.addHook('beforeDestroy', async (wishlist, options) => {
    if (wishlist.backgroundPictureSrc) {
      const filePath = path.join(
        __dirname,
        '../../public/images/', // Путь к файлу на сервере
        wishlist.backgroundPictureSrc
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Удаляем файл при удалении сущности
      }
    }
  });

  return Wishlist;
};
