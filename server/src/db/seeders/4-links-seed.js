'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const wishlistItems = [1, 2, 3];

    const links = wishlistItems.flatMap((item, index) => [
      {
        src: `https://example.com/item-${index + 1}-link-1`,
        wishlistItemId: item,
      },
      {
        src: `https://example.com/item-${index + 1}-link-2`,
        wishlistItemId: item,
      },
    ]);

    await queryInterface.bulkInsert('Links', links);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Links', null, {});
  },
};
