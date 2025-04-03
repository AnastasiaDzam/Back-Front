class CommentValidator {
 
  static validate(text) {

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return {
        isValid: false,
        error: 'Текст комментария не должен быть пустой строкой.',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}

module.exports = CommentValidator;
