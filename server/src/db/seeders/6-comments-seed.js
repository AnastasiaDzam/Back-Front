'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [1, 2, 3];

    const wishlistItems = [1, 2, 3];

    const comments = wishlistItems.flatMap((item, index) => {
      return users.map((user) => ({
        text: `This is a comment ${
          index + 1
        }-${user} for WishlistItem ${item}.`,
        userId: user,
        wishlistItemId: item,
      }));
    });

    await queryInterface.bulkInsert('Comments', comments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
