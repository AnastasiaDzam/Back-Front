'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    static associate({ WishlistItem }) {
      this.belongsTo(WishlistItem, {
        foreignKey: 'wishlistItemId',
        as: 'wishlistItem',
      });
    }
  }
  Link.init(
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
      modelName: 'Link',
    }
  );
  return Link;
};
