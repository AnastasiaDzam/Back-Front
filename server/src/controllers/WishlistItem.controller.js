const WishlistItemService = require('../services/WishlistItem.service');
const isValidId = require('../utils/validation/isValidId');
const WishlistItemValidator = require('../utils/validation/WishlistItem.validator');
const formatResponse = require('../utils/formatResponse');
const LinkService = require('../services/Link.service');
const ImageService = require('../services/Image.service');
const path = require('path');

class WishlistItemController {
  static async create(req, res) {
    const {
      title,
      description,
      maxPrice,
      minPrice,
      links,
      wishlistId,
      priority,
    } = req.body;

    console.log('description++++++++++++=', description);
    const { user } = res.locals;
    const { isValid, error } = WishlistItemValidator.validate({
      title,
      description,
      maxPrice: Number(maxPrice),
      minPrice: Number(minPrice),
      links,
      priority,
    });
    if (!isValid || !isValidId(wishlistId)) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {
      const newWishlistItem = await WishlistItemService.create({
        title,
        description,
        maxPrice: Number(maxPrice),
        minPrice: Number(minPrice),
        links,
        wishlistId: Number(wishlistId),
        authorId: user.id,
        priority,
      });
      if (!newWishlistItem) {
        return res
          .status(400)
          .json(formatResponse(400, `Не удалось создать новую запись.`));
      }

      await LinkService.createLinks(links, newWishlistItem.id);

      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json(
          formatResponse(
            400,
            'Image files is required for wishlist item creation'
          )
        );
      }

      const images = files.map((file) => ({
        src: path.join('wishlistItem', file.filename),
        wishlistItemId: newWishlistItem.id,
      }));

      await ImageService.createImages(images);
      const wishListItemToSend = await WishlistItemService.getById(
        newWishlistItem.id
      );
      res
        .status(201)
        .json(
          formatResponse(201, 'Запись успешно создана', wishListItemToSend)
        );
    } catch ({ message }) {
      console.error(message);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, message));
    }
  }
  static async update(req, res) {
    const { id } = req.params;
    const {
      title,
      description,
      maxPrice,
      minPrice,
      linksToAdd,
      linksToRemove,
      priority,
    } = req.body;

    const linksToRemoveToNumber = linksToRemove?.map((el) => +el);
    const { user } = res.locals;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json(formatResponse(400, 'Невалидные данные по ID.'));
    }

    const { isValid, error } = WishlistItemValidator.validate({
      title,
      description,
      maxPrice: Number(maxPrice),
      minPrice: Number(minPrice),
      priority,
    });
    if (!isValid) {
      return res.status(400).json(formatResponse(400, error, null, error));
    }

    try {

      const wishlistItem = await WishlistItemService.getById(+id);
      if (!wishlistItem) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Запись не найдена.`,
              null,
              'Запись не найдена.'
            )
          );
      }

      if (wishlistItem.authorId !== user.id) {
        return res
          .status(403)
          .json(
            formatResponse(
              403,
              'У вас нет прав на изменение этой записи.',
              null,
              'У вас нет прав на изменение этой записи.'
            )
          );
      }

      let updatedWishlistItem = await WishlistItemService.update(id, {
        title,
        description,
        maxPrice: Number(maxPrice),
        minPrice: Number(minPrice),
        priority,
      });

      if (linksToAdd?.length > 0) {
        const { isValid: isValidLinksToAdd, error: errorValidationLinksToAdd } =
          WishlistItemValidator.validate({
            links: linksToAdd,
          });

        if (!isValidLinksToAdd) {
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                errorValidationLinksToAdd,
                null,
                errorValidationLinksToAdd
              )
            );
        }

        await LinkService.createLinks(linksToAdd, id);
      }

      if (linksToRemove?.length > 0) {
        const {
          isValid: isValidLinksToRemove,
          error: errorValidationLinksToRemove,
        } = WishlistItemValidator.validateIds(linksToRemoveToNumber);

        if (!isValidLinksToRemove) {
          return res
            .status(400)
            .json(
              formatResponse(
                400,
                errorValidationLinksToRemove,
                null,
                errorValidationLinksToRemove
              )
            );
        }

        await LinkService.deleteLinks(linksToRemove);
      }

      const files = req.files;
      if (!files || files.length === 0) {
        return res
          .status(400)
          .json(
            formatResponse(400, 'Картинки обязательны для изменения записи')
          );
      }
      const existingImages = await ImageService.getByWishlistItemId(id);
      const existingImagePaths = existingImages.map((img) => img.src);
      const newImages = files.map((file) => ({
        src: path.join('wishlistItem', file.path),
        wishlistItemId: updatedWishlistItem.id,
      }));

      await ImageService.createImages(newImages);
      const receivedImagePaths = newImages.map((img) => img.src);
      const imagesToDelete = existingImagePaths.filter(
        (path) => !receivedImagePaths.includes(path)
      );
      for (const imgPath of imagesToDelete) {
        await ImageService.deleteBySrc(imgPath);
      }
      updatedWishlistItem = await WishlistItemService.getById(id);

      res
        .status(200)
        .json(
          formatResponse(200, 'Запись успешно обновлена', updatedWishlistItem)
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
      return res.status(400).json(
        formatResponse(
          400,
          'Невалидный ID записи.',
          null,
          'Невалидный ID записи.'
        )
      );
    }

    try {
      const wishlistItem = await WishlistItemService.getById(+id);

      if (!wishlistItem) {
        return res.status(404).json(
          formatResponse(
            404,
            `Запись не найдена.`,
            null,
            `Запись не найдена.`
          )
        );
      }
      if (wishlistItem.authorId !== user.id) {
        return res.status(403).json(
          formatResponse(
            403,
            'У вас нет прав на удаление этой записи.',
            null, // Данные ответа (null)
            'У вас нет прав на удаление этой записи.'
          )
        );
      }
      const deletedWishlistItem = await WishlistItemService.delete(+id);
      return res
        .status(200)
        .json(
          formatResponse(
            200,
            'Запись успешно удалена.',
            deletedWishlistItem
          )
        );
    } catch (error) {
      console.error(error.message);
      res.status(500).json(
        formatResponse(
          500,
          'Внутренняя ошибка сервера',
          null,
          error.message
        )
      );
    }
  }
}

module.exports = WishlistItemController;
