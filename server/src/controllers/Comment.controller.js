const CommentService = require('../services/Comment.service');
const isValidId = require('../utils/validation/isValidId');
const CommentValidator = require('../utils/validation/Comment.validator');
const formatResponse = require('../utils/formatResponse');

class CommentController {
  static async getById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'Невалидный ID',
            null,
            'ID должен быть положительным целым числом.'
          )
        );
    }

    try {

      const comment = await CommentService.getById(+id);
      if (!comment) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Комментарий с id ${id} не найден`,
              null,
              `Комментарий с id ${id} не найден`
            )
          );
      }
      res
        .status(200)
        .json(
          formatResponse(200, `Комментарий с id ${id} успешно получен`, comment)
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }


  static async create(req, res) {
    const { text, wishlistItemId } = req.body;
    const { user } = res.locals;
    if (!isValidId(wishlistItemId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'ID записи из списка желаний должен быть положительным целым числом.',
            null,
            'ID записи из списка желаний должен быть положительным целым числом.'
          )
        );
    }
    const { isValid, error } = CommentValidator.validate(text);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      const newComment = await CommentService.create({
        text,
        userId: user.id,
        wishlistItemId,
      });
      if (!newComment) {
        return res
          .status(400)
          .json(formatResponse(400, `Не удалось создать новый комментарий`));
      }
      res
        .status(201)
        .json(formatResponse(201, 'Комментарий успешно создан', newComment));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const { text, wishlistItemId } = req.body;
    const { user } = res.locals;
    if (!isValidId(id) || !isValidId(wishlistItemId)) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            'ID должен быть положительным целым числом.',
            null
          )
        );
    }
    const { isValid, error } = CommentValidator.validate(text);
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      const commentToUpdate = await CommentService.getById(+id);

      if (!commentToUpdate) {
        return res
          .status(404)
          .json(formatResponse(404, `Комментарий с ID ${id} не найден.`, null));
      }
      if (commentToUpdate.userId !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, `Нет прав на изменение комментария.`));
      }
      const updatedComment = await CommentService.update(+id, {
        text,
      });
      res
        .status(200)
        .json(
          formatResponse(
            200,
            `Комментарий с ID ${id} успешно изменён.`,
            updatedComment
          )
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
        .json(formatResponse(400, 'Невалидный ID комментария'));
    }

    try {
      const commentToDelete = await CommentService.getById(+id);
      if (commentToDelete.userId !== user.id) {
        return res
          .status(403)
          .json(
            formatResponse(
              403,
              `Недостаточно прав для удаления комментария с ID ${id}`
            )
          );
      }
      const deletedComment = await CommentService.delete(+id);
      if (!deletedComment) {
        return res
          .status(404)
          .json(formatResponse(404, `Комментарий с ID ${id} не найден.`));
      }
      res
        .status(200)
        .json(formatResponse(200, `Комментарий с ID ${id} успешно удалён.`));
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
}

module.exports = CommentController;
