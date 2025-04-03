'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Wishlist, WishlistUser, WishlistItem, Comment }) {
      this.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
      this.hasMany(Wishlist, { foreignKey: 'ownerId', as: 'ownedWishlists' });
      this.belongsToMany(Wishlist, {
        through: {
          model: WishlistUser,
        },
        foreignKey: 'userId',
        as: 'participatingWishlists',
      });
      this.hasMany(WishlistItem, {
        foreignKey: 'authorId',
        as: 'wishlistItems',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      avatarSrc: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    }
  );
  return User;
};
