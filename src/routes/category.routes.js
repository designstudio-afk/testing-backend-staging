import express from "express"
import { verifyStaticToken, verifyAuthToken } from "../middleware/auth.js"
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js"

const router = express.Router()

// GET routes - require static token
router.get("/", verifyStaticToken, getAllCategories)
router.get("/:id", verifyStaticToken, getCategoryById)

// CUD routes - require auth token
router.post("/", verifyAuthToken, createCategory)
router.put("/:id", verifyAuthToken, updateCategory)
router.delete("/:id", verifyAuthToken, deleteCategory)

export default router
