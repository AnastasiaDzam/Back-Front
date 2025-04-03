'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [1, 2, 3];

    const wishlist = {
      title: 'Holiday Gifts Wishlist',
      backgroundPictureSrc: 'wishlistsBackgrounds/holiday-background.png',
      ownerId: users[0],
    };

    await queryInterface.bulkInsert('Wishlists', [wishlist]);

    const wishlistUsers = users.map((user) => ({
      userId: user,
      wishlistId: 1,
    }));

    await queryInterface.bulkInsert('WishlistsUsers', wishlistUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WishlistsUsers', null, {});
    await queryInterface.bulkDelete('Wishlists', null, {});
  },
};
