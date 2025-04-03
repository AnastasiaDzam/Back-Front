'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [1, 2, 3];
    const wishlistId = 1;

    const wishlistItems = users.map((user, index) => ({
      title: `Wishlist Item ${index + 1}`,
      description: `This is item ${
        index + 1
      }'s description for wishlist #${wishlistId}.`,
      maxPrice: 100 + index * 50,
      minPrice: 50 + index * 25,
      authorId: user,
      wishlistId: wishlistId,
    }));

    await queryInterface.bulkInsert('WishlistItems', wishlistItems);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WishlistItems', null, {});
  },
};
