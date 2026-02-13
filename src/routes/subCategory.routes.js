import express from "express"
import { verifyGetToken, verifyAuthToken } from "../middleware/auth.js"
import {
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js"

const router = express.Router()

// GET routes
router.get("/", verifyGetToken, getAllSubCategories)
router.get("/category/:categoryId", verifyGetToken, getSubCategoriesByCategory)
router.get("/:id", verifyGetToken, getSubCategoryById)

// CRUD routes
router.post("/", verifyAuthToken, createSubCategory)
router.put("/:id", verifyAuthToken, updateSubCategory)
router.delete("/:id", verifyAuthToken, deleteSubCategory)

export default router
