import express from "express"
import { verifyStaticToken, verifyAuthToken } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js"

const router = express.Router()

// GET routes - require static token
router.get("/", verifyStaticToken, getAllProjects)
router.get("/id/:id", verifyStaticToken, getProjectById)
router.get("/slug/:slug", verifyStaticToken, getProjectBySlug)

// CUD routes - require auth token
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
  ]),
  updateProject,
)

router.delete("/:id", verifyAuthToken, deleteProject)

export default router
