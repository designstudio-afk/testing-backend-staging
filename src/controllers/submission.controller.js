import { transporter, getSubmissionEmailHTML, getConfirmationEmailHTML } from "../config/email.js"
import { getImageKit } from "../config/imagekit.js"

export const submitForm = async (req, res) => {
  try {
    const { type, name, phone_number, email, role, project, location, size, message, link } = req.body
    let file_url = null

    // Upload file to ImageKit if provided
    if (req.file) {
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ error: "File size exceeds 2MB limit" })
      }

      try {
        const imagekit = getImageKit()
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `submission-${Date.now()}-${req.file.originalname}`,
          folder: "/submissions/",
        })
        file_url = uploadResponse.url
      } catch (uploadError) {
        console.error("[v0] ImageKit upload error:", uploadError.message)
        // Don't fail the submission if ImageKit is not configured
        if (uploadError.message.includes("ImageKit environment variables are missing")) {
          console.warn("[v0] ImageKit not configured, continuing without file upload")
        } else {
          return res.status(500).json({ error: "File upload failed" })
        }
      }
    }

    // Prepare submission data
    const submissionData = {
      type,
      name,
      phone_number,
      email,
      role,
      project,
      location,
      size,
      message,
      link,
      file_url,
    }

    // Send email to user (confirmation)
    if (email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Form Submission Confirmation",
          html: getConfirmationEmailHTML(name),
        })
      } catch (error) {
        console.error("[v0] Error sending user confirmation email:", error.message)
      }
    }

    // Send email to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: "New Form Submission",
        html: getSubmissionEmailHTML(submissionData),
      })
    } catch (error) {
      console.error("[v0] Error sending admin email:", error.message)
    }

    res.status(200).json({
      success: true,
      message: "Form submitted successfully. Emails have been sent.",
    })
  } catch (error) {
    console.error("[v0] Form submission error:", error)
    res.status(500).json({ error: "Form submission failed" })
  }
}
