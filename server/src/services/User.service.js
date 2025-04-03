const { USER_FIELDS } = require("../consts/modelsFields");
const { User } = require("../db/models");

class UserService {
  static async create(data) {
    return await User.create(data);
  }

  static async getByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async getById(id) {
    return await User.findByPk(id);
  }

  static async getAll() {
    return await User.findAll({ attributes: USER_FIELDS });
  }
}

module.exports = UserService;
