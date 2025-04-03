const router = require('express').Router();
const WishlistController = require('../controllers/Wishlist.controller');
const upload = require('../middleware/upload');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  .get('/', verifyAccessToken, WishlistController.getAll)
  .get('/:id', verifyAccessToken, WishlistController.getById)
  .post(
    '/',
    verifyAccessToken,
    upload.single('image'),
    WishlistController.create
  )
  .put(
    '/:id',
    verifyAccessToken,
    upload.single('image'),
    WishlistController.update
  )
  .delete('/:id', verifyAccessToken, WishlistController.delete)
  .post(
    '/invite/:id',
    verifyAccessToken,
    WishlistController.inviteUserToWishlist
  )
  .post(
    '/kick-out/:id',
    verifyAccessToken,
    WishlistController.kickOutUserFromWishlist
  );

module.exports = router;
