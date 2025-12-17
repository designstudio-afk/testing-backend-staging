import imagekit from "../config/imagekit.js"

export const uploadImage = async (file, folder = "uploads") => {
  try {
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
    })

    return result.url
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

export const uploadMultipleImages = async (files, folder = "uploads") => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`)
  }
}

export const deleteImage = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId)
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`)
  }
}
