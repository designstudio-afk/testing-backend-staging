import pool from "../config/database.js"
import { uploadImage } from "../utils/imageUpload.js"

// export const getAllNews = async (req, res, next) => {
//   try {
//     const result = await pool.query(`
//       SELECT n.*, nc.category_name 
//       FROM news n 
//       LEFT JOIN news_category nc ON n.category_id = nc.id 
//       ORDER BY n.date DESC
//     `)

//     res.json({
//       success: true,
//       data: result.rows,
//     })
//   } catch (error) {
//     next(error)
//   }
// }


export const getAllNews = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1)
    const limit = Math.max(1, Number.parseInt(req.query.limit) || 6)
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM news`)
    const total = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(total / limit)

    const result = await pool.query(
      `
      SELECT n.*, nc.category_name 
      FROM news n 
      LEFT JOIN news_category nc ON n.category_id = nc.id 
      ORDER BY n.date DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    )

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT n.*, nc.category_name 
      FROM news n 
      LEFT JOIN news_category nc ON n.category_id = nc.id 
      WHERE n.id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const createNews = async (req, res, next) => {
  try {
    const { title, date, category_id, link } = req.body

    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" })
    }

    // Handle image upload
    let images = null
    if (req.file) {
      images = await uploadImage(req.file, "news")
    }

    const result = await pool.query(
      `INSERT INTO news (id, images, title, date, category_id, link) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [images, title, date, category_id, link],
    )

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, date, category_id, link } = req.body

    // Get existing news
    const existingNews = await pool.query("SELECT * FROM news WHERE id = $1", [id])

    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: "News not found" })
    }

    let images = existingNews.rows[0].images

    // Handle image upload if new image provided
    if (req.file) {
      images = await uploadImage(req.file, "news")
    }

    const result = await pool.query(
      `UPDATE news SET
        images = COALESCE($1, images),
        title = COALESCE($2, title),
        date = COALESCE($3, date),
        category_id = COALESCE($4, category_id),
        link = COALESCE($5, link),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 RETURNING *`,
      [images, title, date, category_id, link, id],
    )

    res.json({
      success: true,
      message: "News updated successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query("DELETE FROM news WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News not found" })
    }

    res.json({
      success: true,
      message: "News deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
