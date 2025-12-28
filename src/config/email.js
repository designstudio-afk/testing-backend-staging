import nodemailer from "nodemailer"

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export const transporter = createTransporter()

// Email templates
export const getSubmissionEmailHTML = (data) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>New Form Submission</h2>
        <p><strong>Type:</strong> ${data.type || "N/A"}</p>
        <p><strong>Name:</strong> ${data.name || "N/A"}</p>
        <p><strong>Phone Number:</strong> ${data.phone_number || "N/A"}</p>
        <p><strong>Email:</strong> ${data.email || "N/A"}</p>
        <p><strong>Role:</strong> ${data.role || "N/A"}</p>
        <p><strong>Project:</strong> ${data.project || "N/A"}</p>
        <p><strong>Location:</strong> ${data.location || "N/A"}</p>
        <p><strong>Size:</strong> ${data.size || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || "N/A"}</p>
        <p><strong>Link:</strong> ${data.link ? `<a href="${data.link}">${data.link}</a>` : "N/A"}</p>
        ${data.file_url ? `<p><strong>File:</strong> <a href="${data.file_url}">Download</a></p>` : ""}
      </body>
    </html>
  `
}

export const getConfirmationEmailHTML = (name) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Thank You for Your Submission</h2>
        <p>Hi ${name || "there"},</p>
        <p>We have received your form submission and will get back to you shortly.</p>
        <p>Best regards,<br>SAO ARC Team</p>
      </body>
    </html>
  `
}
