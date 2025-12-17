// import express from "express"
// import cors from "cors"
// import helmet from "helmet"
// import dotenv from "dotenv"
// import categoryRoutes from "./src/routes/category.routes.js"
// import projectRoutes from "./src/routes/project.routes.js"
// import newsCategoryRoutes from "./src/routes/newsCategory.routes.js"
// import newsRoutes from "./src/routes/news.routes.js"
// import authRoutes from "./src/routes/auth.routes.js"
// import { errorHandler } from "./src/middleware/errorHandler.js"

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(helmet())
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// // Routes
// app.use("/api/auth", authRoutes)
// app.use("/api/categories", categoryRoutes)
// app.use("/api/projects", projectRoutes)
// app.use("/api/news-categories", newsCategoryRoutes)
// app.use("/api/news", newsRoutes)

// // Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "ok", message: "API is running" })
// })

// // Error handler
// app.use(errorHandler)

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })

import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import categoryRoutes from "./src/routes/category.routes.js"
import projectRoutes from "./src/routes/project.routes.js"
import newsCategoryRoutes from "./src/routes/newsCategory.routes.js"
import newsRoutes from "./src/routes/news.routes.js"
import authRoutes from "./src/routes/auth.routes.js"
import { errorHandler } from "./src/middleware/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/news-categories", newsCategoryRoutes)
app.use("/api/news", newsRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
