class WishlistValidator {

  static validate(title) {

    if (!title || typeof title !== 'string' || title.trim() === '') {

      return {
        isValid: false,
        error: 'Название является обязательным и должно быть непустой строкой.',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }
}

module.exports = WishlistValidator;
