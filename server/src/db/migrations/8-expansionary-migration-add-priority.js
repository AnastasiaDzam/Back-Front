//! npx sequelize db:migrate --name [название миграции].js

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('WishlistItems', 'priority', {
      type: Sequelize.ENUM(
        'не особо нужно',
        'было бы славно',
        'очень нужно',
        'душу продать'
      ),
      allowNull: false,
      defaultValue: 'не особо нужно',
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('WishlistItems', 'priority');
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_WishlistItems_priority";'
    );
  },
};
