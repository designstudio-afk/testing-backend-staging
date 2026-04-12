// import multer from "multer"

// const storage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//   // Accept images only
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only image files are allowed"), false)
//   }
//   cb(null, true)
// }

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB max file size
//   },
//   fileFilter,
// })

import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Accept images, PDF files, and ZIP files
  const allowedMimes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
  ]

  const isImage = file.mimetype.startsWith("image/")
  const isAllowedType = allowedMimes.includes(file.mimetype)

  if (!isImage && !isAllowedType) {
    return cb(new Error("Only image, PDF, and ZIP files are allowed"), false)
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter,
})
