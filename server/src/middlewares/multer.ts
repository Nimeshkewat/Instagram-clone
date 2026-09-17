import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fieldSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed"));
    }
  },
});
