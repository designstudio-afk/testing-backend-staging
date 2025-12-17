import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../config/database.js"

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Check if user already exists
    const userExists = await pool.query("SELECT * FROM auth WHERE email = $1", [email])

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await pool.query(
      "INSERT INTO auth (id, email, password) VALUES (gen_random_uuid(), $1, $2) RETURNING id, email",
      [email, hashedPassword],
    )

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const result = await pool.query("SELECT * FROM auth WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    next(error)
  }
}
