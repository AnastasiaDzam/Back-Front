class UserValidator {
  static validateSignUp(data) {
    const { firstName, lastName, email, password } = data;
    if (
      !firstName ||
      typeof firstName !== "string" ||
      firstName.trim() === ""
    ) {
      return {
        isValid: false,
        error: "Имя - обязательное поле для регистрации.",
      };
    }

    if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
      return {
        isValid: false,
        error: "Фамилия - обязательное поле для регистрации.",
      };
    }

    if (
      !email ||
      typeof email !== "string" ||
      email.trim() === "" ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: "Email обязателен и должен быть валидным.",
      };
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.trim() === "" ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          "Пароль обязателен, должен быть непустой строкой, содержать не менее 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.",
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignIn(data) {
    const { email, password } = data;

    if (
      !email ||
      typeof email !== "string" ||
      email.trim() === "" ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error: "Email обязателен и должен быть валидным.",
      };
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
      return {
        isValid: false,
        error: "Пароль не должен быть пустой строкой",
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password) {
    const hasUpperCase = /[A-Z]/; // Проверка наличия хотя бы одной заглавной буквы.
    const hasLowerCase = /[a-z]/; // Проверка наличия хотя бы одной строчной буквы.
    const hasNumbers = /\d/; // Проверка наличия хотя бы одной цифры.
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/; // Проверка наличия хотя бы одного спецсимвола.
    const isValidLength = password.length >= 8; // Проверка, что длина пароля не менее 8 символов.

    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false;
    }

    return true;
  }
}

module.exports = UserValidator;
