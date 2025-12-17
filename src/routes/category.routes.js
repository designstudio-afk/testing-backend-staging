import express from "express"
import { verifyGetToken, verifyAuthToken } from "../middleware/auth.js"
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js"

const router = express.Router()

// GET routes - require static token
router.get("/", verifyGetToken, getAllCategories)
router.get("/:id", verifyGetToken, getCategoryById)

// CUD routes - require auth token
router.post("/", verifyAuthToken, createCategory)
router.put("/:id", verifyAuthToken, updateCategory)
router.delete("/:id", verifyAuthToken, deleteCategory)

export default router
