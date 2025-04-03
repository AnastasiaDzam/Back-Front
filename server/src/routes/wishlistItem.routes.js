const router = require('express').Router();
const WishlistItemController = require('../controllers/WishlistItem.controller');
const upload = require('../middleware/upload');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  .post(
    '/',
    verifyAccessToken,
    upload.array('images', 10),
    WishlistItemController.create
  )
  .put(
    '/:id',
    verifyAccessToken,
    upload.array('images', 10),
    WishlistItemController.update
  )

  .delete('/:id', verifyAccessToken, WishlistItemController.delete);

module.exports = router;
