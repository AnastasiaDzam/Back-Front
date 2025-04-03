const router = require('express').Router();
const CommentController = require('../controllers/Comment.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router

  .get('/:id', CommentController.getById)
  .post('/', verifyAccessToken, CommentController.create)
  .put('/', verifyAccessToken, CommentController.update)
  .delete('/', verifyAccessToken, CommentController.delete);

module.exports = router;
