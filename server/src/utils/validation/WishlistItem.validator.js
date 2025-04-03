class WishlistItemValidator {
  static validate(data) {
    const { title, description, maxPrice, minPrice, links, priority } = data;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return {
        isValid: false,
        error: "Название является обязательным и должно быть непустой строкой.",
      };
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return {
        isValid: false,
        error: "Описание является обязательным и должно быть непустой строкой.",
      };
    }

    if (!maxPrice || typeof maxPrice !== "number" || maxPrice < 0) {
      return {
        isValid: false,
        error:
          "MaxPrice является обязательным полем и должен быть положительным числом.",
      };
    }

    if (!minPrice || typeof minPrice !== "number" || minPrice < 0) {
      return {
        isValid: false,
        error:
          "MinPrice является обязательным полем и должен быть положительным числом.",
      };
    }

    if (links) {
      if (!Array.isArray(links) || links.length === 0) {
        return {
          isValid: false,
          error:
            "Links является обязательным и должен содержать хотя бы один элемент в виде строки ссылки.",
        };
      }

      for (const link of links) {
        if (typeof link !== "string" || !WishlistItemValidator.isURL(link)) {
          return {
            isValid: false,
            error:
              "Каждая ссылка в массиве ссылок должна быть строкой, содержащей действительно существующий URL.",
          };
        }
      }
    }

    const validPriorities = [
      "не особо нужно",
      "было бы славно",
      "очень нужно",
      "душу продать",
    ];

    if (
      !priority ||
      typeof priority !== "string" ||
      !validPriorities.includes(priority)
    ) {
      return {
        isValid: false,
        error: `Поле "priority" является обязательным и должно быть одним из следующих значений: ${validPriorities.join(
          ", "
        )}.`,
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateIds(ids) {
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "number")) {
      return {
        isValid: false,
        error: "IDs должны быть массивом целых чисел.",
      };
    }
    return {
      isValid: true,
      error: null,
    };
  }

  static isURL(str) {
    // Регулярное выражение для проверки URL. Оно учитывает как http, так и https протокол.
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-./?=%&]*)?$/i;
    return urlRegex.test(str);
  }
}

module.exports = WishlistItemValidator;
