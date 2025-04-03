const multer = require('multer');
const path = require('path');


const getUploadPath = (req) => {
  if (req.baseUrl.includes('wishlists')) {
    return path.join(__dirname, '../public/images/wishlistsBackgrounds');
  }

  if (req.baseUrl.includes('wishlistItem')) {
    return path.join(__dirname, '../public/images/wishlistItem');
  }

  if (req.baseUrl.includes('auth')) {
    return path.join(__dirname, '../public/images/avatars');
  }

  return path.join(__dirname, '../public/images');
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath(req);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Unsupported file type'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
