import jwt from "jsonwebtoken"

export const verifyStaticToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!token || token !== process.env.STATIC_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid static token" })
  }

  next()
}

export const verifyAuthToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" })
  }
}
