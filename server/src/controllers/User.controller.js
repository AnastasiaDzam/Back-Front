const bcrypt = require('bcrypt');
const axios = require('axios');
const UserService = require('../services/User.service');
const formatResponse = require('../utils/formatResponse');
const UserValidator = require('../utils/validation/User.validator');
const cookiesConfig = require('../config/cookiesConfig');
const generateTokens = require('../utils/generateTokens');

class UserController {
  static async checkEmailExistence(req, res) {
    const { email } = req.body;
    if (!email || !UserValidator.validateEmail(email)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Email обязателен для проверки и должен быть корректным.',
            null, // Нет данных (поскольку это ошибка).
            'Email обязателен для проверки и должен быть корректным.'
          )
        );
    }

    try {
      const apiKey = process.env.CHECK_EMAIL_API_KEY;
      const response = await axios.get(
        `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
      );
      const { data } = response;


      if (data.data && data.data.result === 'undeliverable') {
        return res.status(200).json(
          formatResponse(
            200,
            'Email не существует',
            { exists: false },
            'Email не существует'
          )
        );
      }
      return res.status(200).json(
        formatResponse(
          200,
          'Email найден',
          {
            exists:
              data.data.result === 'deliverable' ||
              data.data.result === 'risky',
          },
          'Email найден'
        )
      );
    } catch ({ message }) {
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async refreshTokens(req, res) {
    try {
      const { user } = res.locals;
      const { accessToken, refreshToken } = generateTokens({ user });
      res.status(200).cookie('refreshToken', refreshToken, cookiesConfig).json(
        formatResponse(200, 'Токены успешно созданы.', {
          user,
          accessToken,
        })
      );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async signUp(req, res) {
    const { email, password, firstName, lastName } = req.body;
    const { isValid, error } = UserValidator.validateSignUp({
      email,
      firstName,
      lastName,
      password,
    });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }
    const normalizedEmail = email.toLowerCase();

    try {
      const userFound = await UserService.getByEmail(normalizedEmail);
      if (userFound) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              'Пользователь с таким email уже существует',
              null,
              'Пользователь с таким email уже существует'
            )
          );
      }
      if (!req.file) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Avatar file is required for user registration')
          );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const avatarSrc = `avatars/${req.file.filename}`;
      const newUser = await UserService.create({
        email: normalizedEmail,
        firstName,
        lastName,
        password: hashedPassword,
        avatarSrc,
      });
      const plainUser = newUser.get({ plain: true });
      delete plainUser.password;
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });
      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(201, 'Вы успешно зарегистрированы.', {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async signIn(req, res) {
    const { email, password } = req.body;
    const { isValid, error } = UserValidator.validateSignIn({
      email,
      password,
    });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }
    const normalizedEmail = email.toLowerCase();

    try {
      const user = await UserService.getByEmail(normalizedEmail);
      if (!user) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              'Пользователь с таким email не найден.',
              null,
              'Пользователь с таким email не найден.'
            )
          );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json(
            formatResponse(401, 'Неверный пароль.', null, 'Неверный пароль.')
          );
      }
      const plainUser = user.get({ plain: true });
      delete plainUser.password;
      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      res
        .status(200)
        .cookie('refreshToken', refreshToken, cookiesConfig)
        .json(
          formatResponse(200, 'Вы успешно вошли.', {
            user: plainUser,
            accessToken,
          })
        );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(
        formatResponse(500, 'Внутренняя ошибка сервера', null, message)
      );
    }
  }
  static async signOut(req, res) {
    try {
      res
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Вы успешно вышли.'));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
  static async getAll(req, res) {
    try {

      const users = await UserService.getAll();
      if (users.length === 0) {
        return res.status(404).json(
          formatResponse(
            404,
            'Пользователи не найдены в системе.',
            [],
            'Пользователи не найдены в системе.'
          )
        );
      }

      res
        .status(200)
        .json(formatResponse(200, 'success', users));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
}

module.exports = UserController;
