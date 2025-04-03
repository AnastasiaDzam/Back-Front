'use strict';
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const numberOfUsers = 3;

    const users = [];
    for (let i = 0; i < numberOfUsers; i++) {
      const passwordHash = await bcrypt.hash('Qwerty123@', 10);

      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: passwordHash,
        avatarSrc: faker.image.avatar(),
      });
    }

    await queryInterface.bulkInsert('Users', users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
