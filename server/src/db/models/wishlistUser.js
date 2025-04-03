'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistUser extends Model {
    static associate() {}
  }
  WishlistUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wishlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WishlistUser',
      tableName: 'WishlistsUsers',
    }
  );
  return WishlistUser;
};
