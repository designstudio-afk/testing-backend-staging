import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false)
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter,
})
