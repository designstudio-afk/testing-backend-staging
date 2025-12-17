import express from "express"
import { verifyGetToken, verifyAuthToken } from "../middleware/auth.js"
import {
  getAllNewsCategories,
  getNewsCategoryById,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
} from "../controllers/newsCategory.controller.js"

const router = express.Router()

// GET routes - require static token
router.get("/", verifyGetToken, getAllNewsCategories)
router.get("/:id", verifyGetToken, getNewsCategoryById)

// CUD routes - require auth token
router.post("/", verifyAuthToken, createNewsCategory)
router.put("/:id", verifyAuthToken, updateNewsCategory)
router.delete("/:id", verifyAuthToken, deleteNewsCategory)

export default router
