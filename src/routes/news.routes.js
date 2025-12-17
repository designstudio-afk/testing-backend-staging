import express from "express"
import { verifyGetToken, verifyAuthToken } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
import { getAllNews, getNewsById, createNews, updateNews, deleteNews } from "../controllers/news.controller.js"

const router = express.Router()

// GET routes - require static token
router.get("/", verifyGetToken, getAllNews)
router.get("/:id", verifyGetToken, getNewsById)

// CUD routes - require auth token
router.post("/", verifyAuthToken, upload.single("images"), createNews)
router.put("/:id", verifyAuthToken, upload.single("images"), updateNews)
router.delete("/:id", verifyAuthToken, deleteNews)

export default router
