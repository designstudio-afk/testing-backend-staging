import pool from "../config/database.js"

export const getAllSubCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sub_category ORDER BY sub_category_name ASC"
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

export const getSubCategoriesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params

    const result = await pool.query(
      "SELECT * FROM sub_category WHERE category_id = $1 ORDER BY sub_category_name ASC",
      [categoryId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

export const getSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "SELECT * FROM sub_category WHERE id = $1",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sub-category not found" })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const createSubCategory = async (req, res, next) => {
  try {
    const { sub_category_name, category_id } = req.body

    if (!sub_category_name) {
      return res.status(400).json({
        error: "Sub-category name is required",
      })
    }

    // If category_id is provided, verify it exists
    if (category_id) {
      const categoryExists = await pool.query(
        "SELECT id FROM category WHERE id = $1",
        [category_id]
      )
      if (categoryExists.rows.length === 0) {
        return res.status(404).json({ error: "Category not found" })
      }
    }

    const result = await pool.query(
      "INSERT INTO sub_category (category_id, sub_category_name) VALUES ($1, $2) RETURNING *",
      [category_id || null, sub_category_name]
    )

    res.status(201).json({
      success: true,
      message: "Sub-category created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { sub_category_name } = req.body

    if (!sub_category_name) {
      return res.status(400).json({ error: "Sub-category name is required" })
    }

    const result = await pool.query(
      "UPDATE sub_category SET sub_category_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [sub_category_name, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sub-category not found" })
    }

    res.json({
      success: true,
      message: "Sub-category updated successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "DELETE FROM sub_category WHERE id = $1 RETURNING *",
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sub-category not found" })
    }

    res.json({
      success: true,
      message: "Sub-category deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
