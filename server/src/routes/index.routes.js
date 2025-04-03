const router = require('express').Router();
const wishlistRoutes = require('./wishlist.routes');
const wishlistItemRoutes = require('./wishlistItem.routes');
const authRoutes = require('./auth.routes');
const commentRoutes = require('./comment.routes');

router
  .use('/auth', authRoutes)
  .use('/wishlists', wishlistRoutes)
  .use('/wishlistItem', wishlistItemRoutes)
  .use('/comments', commentRoutes);

module.exports = router;
