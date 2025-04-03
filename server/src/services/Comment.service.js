const { COMMENT_FIELDS, USER_FIELDS } = require("../consts/modelsFields");
const { Comment, User } = require("../db/models");

class CommentService {
  static async getById(id) {
    return await Comment.findOne({
      where: { id },
      attributes: COMMENT_FIELDS,
      include: {
        model: User,
        attributes: USER_FIELDS,
        as: "author",
      },
    });
  }

  static async create(data) {
    const newComment = await Comment.create(data);
    return await this.getById(newComment.id);
  }

  static async update(id, data) {
    const comment = await this.getById(id);

    if (comment) {
      if (data.text) {
        comment.title = data.text;
      }
      await comment.save();
    }
    return comment;
  }

  static async delete(id) {
    const comment = await this.getById(id);
    if (comment) {
      await comment.destroy();
    }
    return comment;
  }
}

module.exports = CommentService;
