'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ User, WishlistItem }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'author' });
      this.belongsTo(WishlistItem, {
        foreignKey: 'wishlistItemId',
        as: 'wishlistItem',
      });
    }
  }
  Comment.init(
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wishlistItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
