import express from "express"
import { submitForm } from "../controllers/submission.controller.js"
import { upload } from "../middleware/upload.js"
import { verifyFormSubmissionToken } from "../middleware/auth.js"

const router = express.Router()

// POST form submission with optional file
router.post("/submit", verifyFormSubmissionToken, upload.single("file"), submitForm)

export default router
