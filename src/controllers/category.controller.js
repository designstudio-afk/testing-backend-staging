import pool from "../config/database.js"

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM category ORDER BY category_name ASC")

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

// export const getAllCategories = async (req, res, next) => {
//   try {
//     const result = await pool.query(`
//       SELECT 
//         c.id,
//         c.category_name,
//         c.created_at,
//         c.updated_at,
//         json_agg(
//           json_build_object(
//             'id', p.id,
//             'title', p.title,
//             'slug', p.slug,
//             'cover', p.cover
//           ) ORDER BY p.created_at DESC
//         ) FILTER (WHERE p.id IS NOT NULL) as projects
//       FROM category c
//       LEFT JOIN projects p ON c.id = p.category_id
//       GROUP BY c.id, c.category_name, c.created_at, c.updated_at
//       ORDER BY c.category_name ASC
//     `)

//     res.json({
//       success: true,
//       data: result.rows.map((row) => ({
//         ...row,
//         projects: row.projects || [],
//       })),
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// export const getCategoryById = async (req, res, next) => {
//   try {
//     const { id } = req.params

//     const categoryResult = await pool.query("SELECT * FROM category WHERE id = $1", [id])

//     if (categoryResult.rows.length === 0) {
//       return res.status(404).json({ error: "Category not found" })
//     }

//     // Get all projects related to this category
//     const projectsResult = await pool.query("SELECT * FROM projects WHERE category_id = $1 ORDER BY created_at DESC", [
//       id,
//     ])

//     res.json({
//       success: true,
//       data: {
//         ...categoryResult.rows[0],
//         projects: projectsResult.rows,
//       },
//     })
//   } catch (error) {
//     next(error)
//   }
// }

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 6
    const offset = (page - 1) * limit

    const categoryResult = await pool.query("SELECT * FROM category WHERE id = $1", [id])

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" })
    }

    const projectsResult = await pool.query(
      "SELECT * FROM projects WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [id, limit, offset],
    )

    const totalResult = await pool.query("SELECT COUNT(*) FROM projects WHERE category_id = $1", [id])
    const total = Number.parseInt(totalResult.rows[0].count, 10)
    const totalPages = Math.ceil(total / limit)

    res.json({
      success: true,
      data: {
        ...categoryResult.rows[0],
        projects: projectsResult.rows,
      },
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

export const createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const result = await pool.query(
      "INSERT INTO category (id, category_name) VALUES (gen_random_uuid(), $1) RETURNING *",
      [category_name],
    )

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { category_name } = req.body

    if (!category_name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const result = await pool.query("UPDATE category SET category_name = $1 WHERE id = $2 RETURNING *", [
      category_name,
      id,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query("DELETE FROM category WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
