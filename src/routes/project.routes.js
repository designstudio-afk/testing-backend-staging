import express from "express"
import { verifyGetToken, verifyAuthToken } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addSubCategoriesToProject,
  getProjectSubCategories,
  removeSubCategoryFromProject,
  getProjectsByFilter,
  searchProjects,
} from "../controllers/project.controller.js"

const router = express.Router()

// GET routes - require static token or JWT token
router.get("/", verifyGetToken, getAllProjects)
router.get("/id/:id", verifyGetToken, getProjectById)
router.get("/slug/:slug", verifyGetToken, getProjectBySlug)
router.get("/search", verifyGetToken, searchProjects)

// Using fields with maxCount to accept multiple file and text fields
router.post(
  "/",
  verifyAuthToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images1", maxCount: 1 },
    { name: "images2", maxCount: 1 },
    { name: "images3", maxCount: 1 },
    { name: "images4", maxCount: 1 },
    { name: "images5", maxCount: 1 },
    { name: "images6", maxCount: 1 },
    { name: "images7", maxCount: 1 },
    { name: "images8", maxCount: 1 },
    { name: "images9", maxCount: 1 },
    { name: "images10", maxCount: 1 },
    // Add text fields to multer's acceptable fields
    { name: "category_id" },
    { name: "title" },
    { name: "layout" },
    { name: "location_date" },
    { name: "architect" },
    { name: "type" },
    { name: "size" },
    { name: "status" },
    { name: "desc" },
  ]),
  createProject,
)

router.put(
  "/:id",
  verifyAuthToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images1", maxCount: 1 },
    { name: "images2", maxCount: 1 },
    { name: "images3", maxCount: 1 },
    { name: "images4", maxCount: 1 },
    { name: "images5", maxCount: 1 },
    { name: "images6", maxCount: 1 },
    { name: "images7", maxCount: 1 },
    { name: "images8", maxCount: 1 },
    { name: "images9", maxCount: 1 },
    { name: "images10", maxCount: 1 },
    // Add text fields to multer's acceptable fields
    { name: "category_id" },
    { name: "title" },
    { name: "layout" },
    { name: "location_date" },
    { name: "architect" },
    { name: "type" },
    { name: "size" },
    { name: "status" },
    { name: "desc" },
  ]),
  updateProject,
)

router.delete("/:id", verifyAuthToken, deleteProject)

router.delete("/:id", verifyAuthToken, deleteProject)

// Sub-category routes
router.post("/:projectId/sub-categories", verifyAuthToken, addSubCategoriesToProject)
router.get("/:projectId/sub-categories", verifyGetToken, getProjectSubCategories)
router.delete("/:projectId/sub-categories/:subCategoryId", verifyAuthToken, removeSubCategoryFromProject)

// Filter route
router.get("/filter/by-category", verifyGetToken, getProjectsByFilter)


export default router
