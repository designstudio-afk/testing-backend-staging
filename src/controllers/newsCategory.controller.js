import pool from "../config/database.js"

export const getAllNewsCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        nc.id,
        nc.category_name,
        COALESCE(json_agg(
          json_build_object(
            'id', n.id,
            'title', n.title,
            'images', n.images,
            'date', n.date,
            'link', n.link
          ) ORDER BY n.date DESC
        ) FILTER (WHERE n.id IS NOT NULL), '[]'::json) as news
      FROM news_category nc
      LEFT JOIN news n ON nc.id = n.category_id
      GROUP BY nc.id, nc.category_name
      ORDER BY nc.category_name ASC`,
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

export const getNewsCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    const categoryResult = await pool.query("SELECT * FROM news_category WHERE id = $1", [id])

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "News category not found" })
    }

    // Get all news related to this category
    const newsResult = await pool.query("SELECT * FROM news WHERE category_id = $1 ORDER BY date DESC", [id])

    res.json({
      success: true,
      data: {
        ...categoryResult.rows[0],
        news: newsResult.rows,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const createNewsCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const result = await pool.query(
      "INSERT INTO news_category (id, category_name) VALUES (gen_random_uuid(), $1) RETURNING *",
      [category_name],
    )

    res.status(201).json({
      success: true,
      message: "News category created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateNewsCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { category_name } = req.body

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const result = await pool.query("UPDATE news_category SET category_name = $1 WHERE id = $2 RETURNING *", [
      category_name,
      id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News category not found" })
    }

    res.json({
      success: true,
      message: "News category updated successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNewsCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query("DELETE FROM news_category WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "News category not found" })
    }

    res.json({
      success: true,
      message: "News category deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
