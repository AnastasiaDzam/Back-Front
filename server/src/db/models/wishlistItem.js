'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    static associate({ User, Wishlist, Link, Image, Comment }) {
      this.belongsTo(User, { foreignKey: 'authorId', as: 'owner' });
      this.belongsTo(Wishlist, { foreignKey: 'wishlistId', as: 'wishlist' });
      this.hasMany(Link, { foreignKey: 'wishlistItemId', as: 'links' });
      this.hasMany(Image, { foreignKey: 'wishlistItemId', as: 'images' });
      this.hasMany(Comment, { foreignKey: 'wishlistItemId', as: 'comments' });
    }
  }
  WishlistItem.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      maxPrice: {
        type: DataTypes.INTEGER,
      },
      minPrice: {
        type: DataTypes.INTEGER,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wishlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(
          'не особо нужно',
          'было бы славно',
          'очень нужно',
          'душу продать'
        ),
        allowNull: false, // Поле нельзя оставить пустым
        defaultValue: 'не особо нужно', // Значение по умолчанию
      },
    },
    {
      sequelize,
      modelName: 'WishlistItem',
    }
  );
  return WishlistItem;
};
