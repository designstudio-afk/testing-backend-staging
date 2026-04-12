import { transporter, getSubmissionEmailHTML, getConfirmationEmailHTML } from "../config/email.js"
import ImageKit from "imagekit"

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

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
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `submission-${Date.now()}-${req.file.originalname}`,
          folder: "/submissions/",
        })
        file_url = uploadResponse.url
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError)
        return res.status(500).json({ error: "File upload failed" })
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
        console.error("Error sending user confirmation email:", error)
      }
    }

    // Send email to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `${type} - Form Submission`,
        html: getSubmissionEmailHTML(submissionData),
      })
    } catch (error) {
      console.error("Error sending admin email:", error)
    }

    res.status(200).json({
      success: true,
      message: "Form submitted successfully. Emails have been sent.",
    })
  } catch (error) {
    console.error("Form submission error:", error)
    res.status(500).json({ error: "Form submission failed" })
  }
}
