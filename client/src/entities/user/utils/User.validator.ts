import type { SignInDataType, SignUpDataType } from '../model';

type IValidationResult = {
  isValid: boolean;
  error: string;
};

export class UserValidator {
  static validateSignUp(data: SignUpDataType): IValidationResult {
    const { firstName, lastName, email, password } = data;

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
      return {
        isValid: false,
        error: 'Имя - обязательное поле для регистрации.',
      };
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
      return {
        isValid: false,
        error: 'Фамилия - обязательное поле для регистрации.',
      };
    }

    if (!email || typeof email !== 'string' || email.trim() === '' || !this.validateEmail(email)) {
      return {
        isValid: false,
        error: 'Email обязателен и должен быть валидным.',
      };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim() === '' ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Пароль обязателен, должен быть непустой строкой, содержать не менее 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ.',
      };
    }

    return {
      isValid: true,
      error: '',
    };
  }

  static validateSignIn(data: SignInDataType): IValidationResult {
    const { email, password } = data;

    if (!email || typeof email !== 'string' || email.trim() === '' || !this.validateEmail(email)) {
      return {
        isValid: false,
        error: 'Email обязателен и должен быть валидным.',
      };
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return {
        isValid: false,
        error: 'Пароль не должен быть пустой строкой',
      };
    }

    return {
      isValid: true,
      error: '',
    };
  }

  static validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumbers = /\d/;
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|[\]<>]/;
    const isValidLength = password.length >= 8;

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
