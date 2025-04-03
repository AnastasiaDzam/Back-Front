'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const wishlistItems = [1, 2, 3];

    const images = wishlistItems.flatMap((item) => [
      {
        src: `wishlistItem/item-${item.id}-image-1.png`,
        wishlistItemId: item,
      },
      {
        src: `wishlistItem/item-${item.id}-image-2.png`,
        wishlistItemId: item,
      },
    ]);

    await queryInterface.bulkInsert('Images', images);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Images', null, {});
  },
};
