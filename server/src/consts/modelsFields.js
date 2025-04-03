const { User, WishlistItem, Link, Image, Comment } = require('../db/models');
const USER_FIELDS = ['id', 'email', 'firstName', 'lastName', 'avatarSrc'];
const LINK_IMAGE_FIELDS = ['src'];
const COMMENT_FIELDS = ['text'];
const WISHLIST_ITEM_FIELDS = [
  'id',
  'title',
  'description',
  'maxPrice',
  'minPrice',
  'authorId',
  'priority',
];
const WISHLIST_ITEM_INCLUDES = [
  {
    model: Link,
    as: 'links',
    attributes: LINK_IMAGE_FIELDS,
  },
  {
    model: Image,
    as: 'images',
    attributes: LINK_IMAGE_FIELDS,
  },
  {
    model: Comment,
    as: 'comments',
    attributes: COMMENT_FIELDS,
    include: {
      model: User,
      attributes: USER_FIELDS,
      as: 'author',
    },
  },
];


const WISHLIST_INCLUDES = [
  {
    model: User,
    as: 'owner',
    attributes: USER_FIELDS,
  },
  {
    model: User,
    as: 'invitedUsers',
    attributes: USER_FIELDS,
    through: {
      attributes: [],
    },
  },
  {
    model: WishlistItem,
    as: 'wishlistItems',
    attributes: WISHLIST_ITEM_FIELDS,
    include: WISHLIST_ITEM_INCLUDES,
  },
];
module.exports = {
  WISHLIST_INCLUDES,
  USER_FIELDS,
  WISHLIST_ITEM_FIELDS,
  LINK_IMAGE_FIELDS,
  COMMENT_FIELDS,
  WISHLIST_ITEM_INCLUDES,
};
