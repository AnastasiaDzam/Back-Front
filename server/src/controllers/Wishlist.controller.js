const WishlistService = require('../services/Wishlist.service');
const UserService = require('../services/User.service');
const isValidId = require('../utils/validation/isValidId');
const WishlistValidator = require('../utils/validation/Wishlist.validator');
const formatResponse = require('../utils/formatResponse');

class WishlistController {
  static async getAll(req, res) {
    const { user } = res.locals;

    try {
      const wishlists = await WishlistService.getAll(user.id);
      if (wishlists.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, 'Не найдено вишлистов.', []));
      }
      res
        .status(200)
        .json(
          formatResponse(200, 'Успешное получение списка вишлистов.', wishlists)
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
  static async getById(req, res) {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID вишлиста.',
            null,
            'Невалидный ID вишлиста.'
          )
        );
    }

    try {

      const wishlist = await WishlistService.getById(+id);
      if (!wishlist) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Вишлист не найден.`,
              null,
              `Вишлист не найден.`
            )
          );
      }

      res
        .status(200)
        .json(formatResponse(200, 'Вишлист успешно получен.', wishlist));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async create(req, res) {
    const { title } = req.body;
    const { user } = res.locals;
    const { isValid, error } = WishlistValidator.validate(title);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }
    if (!req.file) {
      return res
        .status(400)
        .json(
          formatResponse(400, 'Картинка обязательна при создании вишлиста.')
        );
    }

    try {
      const backgroundPictureSrc = `wishlistsBackgrounds/${req.file.filename}`;
      const newWishlist = await WishlistService.create({
        title,
        ownerId: user.id,
        backgroundPictureSrc,
      });

      if (!newWishlist) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              `Не удалось создать вишлист.`,
              null,
              `Не удалось создать вишлист.`
            )
          );
      }

      res
        .status(201)
        .json(formatResponse(201, 'Вишлист успешно создан.', newWishlist));
    } catch ({ message }) {

      console.error(message);

      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }


  static async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    const { user } = res.locals;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Передан невалидный ID.',
            null,
            'Передан невалидный ID.'
          )
        );
    }

    const { isValid, error } = WishlistValidator.validate(title);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      const wishlistToUpdate = await WishlistService.getById(+id);
      if (!wishlistToUpdate) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Вишлист не найден.`,
              null,
              `Вишлист не найден.`
            )
          );
      }

      if (wishlistToUpdate.ownerId !== user.id) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              `У вас нет прав на изменение этого вишлиста.`,
              null,
              `У вас нет прав на изменение этого вишлиста.`
            )
          );
      }
      let backgroundPictureSrc = wishlistToUpdate.backgroundPictureSrc;

      if (req.file) {
        backgroundPictureSrc = `wishlistsBackgrounds/${req.file.filename}`;
      }
      const updatedWishlist = await WishlistService.update(+id, {
        title,
        backgroundPictureSrc,
      });

      if (!updatedWishlist) {
        return res.status(400).json(
          formatResponse(
            400,
            `Не удалось обновить вишлист.`,
            null,
            `Не удалось обновить вишлист.`
          )
        );
      }

      res
        .status(200)
        .json(
          formatResponse(200, 'Вишлист успешно обновлен.', updatedWishlist)
        );
    } catch ({ message }) {

      console.error(message);
 
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async delete(req, res) {

    const { id } = req.params;

    const { user } = res.locals;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Вишлист не найден.',
            null,
            'Вишлист не найден.'
          )
        );
    }

    try {
      const wishlistToDelete = await WishlistService.getById(+id);
      if (!wishlistToDelete) {
        return res.status(404).json(
          formatResponse(
            404,
            `Вишлист не найден.`,
            null,
            `Вишлист не найден.`
          )
        );
      }

      if (wishlistToDelete.ownerId !== user.id) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              `У вас нет прав на удаление этого вишлиста.`,
              null,
              `У вас нет прав на удаление этого вишлиста.`
            )
          );
      }

      const deletedWishlist = await WishlistService.delete(+id);
      if (!deletedWishlist) {
        return res.status(400).json(
          formatResponse(
            400,
            `Не удалось удалить вишлист.`,
            null,
            `Не удалось удалить вишлист.`
          )
        );
      }

      res
        .status(200)
        .json(
          formatResponse(200, `Вишлист успешно удалён.`, deletedWishlist)
        );
    } catch ({ message }) {

      console.error(message);
      res
        .status(500)
        .json(
          formatResponse(500, 'Внутренняя ошибка сервера', null, message)
        );
    }
  }
  static async inviteUserToWishlist(req, res) {

    const { id } = req.params;
    const { user } = res.locals;
    const { userId } = req.body;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID вишлиста.',
            null,
            'Невалидный ID вишлиста.'
          )
        );
    }

    if (!isValidId(userId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID приглашаемого пользователя.',
            null,
            'Невалидный ID приглашаемого пользователя.'
          )
        );
    }

    try {
      const wishlistToUpdate = await WishlistService.getById(+id);
      if (wishlistToUpdate.ownerId !== user.id) {
        return res.status(400).json(
          formatResponse(
            400,
            `Нет прав на приглашение пользователей в этот вишлист.`,
            null,
            `Нет прав на приглашение пользователей в этот вишлист.`
          )
        );
      }
      const invitedUser = await UserService.getById(userId);
      if (!invitedUser) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Приглашаемый пользователь не найден.`,
              null,
              `Приглашаемый пользователь не найден.`
            )
          );
      }

      const updatedWishlist = await WishlistService.inviteUser({
        userId,
        wishlistId: id,
      });
      if (!updatedWishlist) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Вишлист не найден.`,
              null,
              `Вишлист не найден.`
            )
          );
      }

      res.status(201).json(
        formatResponse(
          201,
          `Пользователь успешно приглашен в вишлист.`,
          updatedWishlist
        )
      );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }

  static async kickOutUserFromWishlist(req, res) {
    const { id } = req.params;
    const { user } = res.locals;
    const { userId } = req.body;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID вишлиста.',
            null,
            'Невалидный ID вишлиста.'
          )
        );
    }
    console.log('=============>>>>>> ', userId);
    if (!isValidId(userId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID приглашаемого пользователя.',
            null,
            'Невалидный ID приглашаемого пользователя.'
          )
        );
    }

    try {
      const wishlistToUpdate = await WishlistService.getById(+id);
      if (wishlistToUpdate.ownerId !== user.id) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              `Нет прав на удаление пользователя из вишлиста.`,
              null,
              `Нет прав на удаление пользователя из вишлиста.`
            )
          );
      }

      const deletedUser = await UserService.getById(userId);
      if (!deletedUser) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Пользователь не найден.`,
              null,
              `Пользователь не найден.`
            )
          );
      }

      const updatedWishlist = await WishlistService.kickOutUser({
        userId,
        wishlistId: id,
      });

      if (!updatedWishlist) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Вишлист не найден.`,
              null,
              `Вишлист не найден.`
            )
          );
      }

      res.status(200).json(
        formatResponse(
          200, // HTTP статус "ОК"
          `Пользователь успешно удален из вишлиста.`,
          updatedWishlist
        )
      );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
}

module.exports = WishlistController;
