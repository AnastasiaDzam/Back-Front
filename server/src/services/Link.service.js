const { Link } = require("../db/models");

class LinkService {
  static async createLinks(links, wishlistItemId) {
    const linkObjects = links.map((src) => ({
      src,
      wishlistItemId,
    }));

    const newLinks = await Link.bulkCreate(linkObjects, { validate: true });

    return newLinks;
  }

  static async deleteLinks(linkIds) {
    return await Link.destroy({
      where: {
        id: linkIds,
      },
    });
  }
}

module.exports = LinkService;
