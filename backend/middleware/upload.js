const multer = require("multer");
const path = require("path");

// Use memory storage to process uploads in RAM
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png/;
    const isValid =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);

    if (isValid) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

module.exports = upload;
