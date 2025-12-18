import pool from "../config/database.js"
import { uploadImage } from "../utils/imageUpload.js"
import { generateSlug } from "../utils/slugify.js"

export const getAllProjects = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1)
    const limit = Number.parseInt(req.query.limit) || 6
    const offset = (page - 1) * limit

    // Get total count
    const countResult = await pool.query("SELECT COUNT(*) FROM projects")
    const total = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(total / limit)

    // Get paginated results
    const result = await pool.query(
      `
      SELECT p.*, c.category_name 
      FROM projects p 
      LEFT JOIN category c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
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

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `
      SELECT p.*, c.category_name 
      FROM projects p 
      LEFT JOIN category c ON p.category_id = c.id 
      WHERE p.id = $1
    `,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

// export const getProjectBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params

//     const result = await pool.query(
//       `
//       SELECT p.*, c.category_name 
//       FROM projects p 
//       LEFT JOIN category c ON p.category_id = c.id 
//       WHERE p.slug = $1
//     `,
//       [slug],
//     )

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Project not found" })
//     }

//     res.json({
//       success: true,
//       data: result.rows[0],
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// export const getProjectBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params

//     const result = await pool.query(
//       `
//       WITH current_project AS (
//         SELECT p.*, c.category_name, 
//                ROW_NUMBER() OVER (ORDER BY p.created_at DESC) as row_num
//         FROM projects p 
//         LEFT JOIN category c ON p.category_id = c.id 
//         WHERE p.slug = $1
//       ),
//       adjacent_projects AS (
//         SELECT p.slug, 
//                ROW_NUMBER() OVER (ORDER BY p.created_at DESC) as row_num
//         FROM projects p
//       )
//       SELECT 
//         cp.*,
//         (SELECT slug FROM adjacent_projects WHERE row_num = cp.row_num - 1 LIMIT 1) as previous_slug,
//         (SELECT slug FROM adjacent_projects WHERE row_num = cp.row_num + 1 LIMIT 1) as next_slug
//       FROM current_project cp
//     `,
//       [slug],
//     )

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Project not found" })
//     }

//     res.json({
//       success: true,
//       data: result.rows[0],
//     })
//   } catch (error) {
//     next(error)
//   }
// }

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params

    const result = await pool.query(
      `
      WITH ranked_projects AS (
        SELECT p.id, p.slug, p.title, p.category_id, p.cover, p.layout, 
               p.location_date, p.architect, p.type, p.size, p.status, p."desc",
               p.images1, p.images2, p.images3, p.images4, p.images5,
               p.images6, p.images7, p.images8, p.images9, p.images10,
               p.created_at, p.updated_at, c.category_name,
               ROW_NUMBER() OVER (ORDER BY p.created_at DESC) as row_num
        FROM projects p 
        LEFT JOIN category c ON p.category_id = c.id
      )
      SELECT 
        rp.id, rp.slug, rp.title, rp.category_id, rp.category_name, rp.cover, rp.layout,
        rp.location_date, rp.architect, rp.type, rp.size, rp.status, rp."desc",
        rp.images1, rp.images2, rp.images3, rp.images4, rp.images5,
        rp.images6, rp.images7, rp.images8, rp.images9, rp.images10,
        rp.created_at, rp.updated_at,
        (SELECT json_build_object('slug', rp2.slug, 'title', rp2.title) FROM ranked_projects rp2 WHERE rp2.row_num = rp.row_num - 1) as previous,
        (SELECT json_build_object('slug', rp3.slug, 'title', rp3.title) FROM ranked_projects rp3 WHERE rp3.row_num = rp.row_num + 1) as next
      FROM ranked_projects rp
      WHERE rp.slug = $1
    `,
      [slug],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}



export const createProject = async (req, res, next) => {
  try {
    const { category_id, title, layout, location_date, architect, type, size, status, desc } = req.body

    if (!title || !location_date) {
      return res.status(400).json({ error: "Title and location_date are required" })
    }

    // Generate slug
    const slug = generateSlug(title, location_date)

    // Handle image uploads sequentially
    let cover = null
    const images = {}

    if (req.files) {
      // Upload cover image
      if (req.files.cover && req.files.cover[0]) {
        cover = await uploadImage(req.files.cover[0], "projects/covers")
      }

      // Upload additional images sequentially
      for (let i = 1; i <= 10; i++) {
        const fieldName = `images${i}`
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images[fieldName] = await uploadImage(req.files[fieldName][0], "projects/images")
        } else {
          images[fieldName] = null
        }
      }
    }

    const result = await pool.query(
      `INSERT INTO projects (
        id, category_id, cover, slug, title, layout, location_date, 
        architect, type, size, status, "desc", 
        images1, images2, images3, images4, images5,
        images6, images7, images8, images9, images10
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *`,
      [
        category_id,
        cover,
        slug,
        title,
        layout,
        location_date,
        architect,
        type,
        size,
        status,
        desc,
        images.images1,
        images.images2,
        images.images3,
        images.images4,
        images.images5,
        images.images6,
        images.images7,
        images.images8,
        images.images9,
        images.images10,
      ],
    )

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const { category_id, title, layout, location_date, architect, type, size, status, desc } = req.body

    // Get existing project
    const existingProject = await pool.query("SELECT * FROM projects WHERE id = $1", [id])

    if (existingProject.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    const project = existingProject.rows[0]

    // Generate new slug if title or location_date changed
    let slug = project.slug
    if (title || location_date) {
      slug = generateSlug(title || project.title, location_date || project.location_date)
    }

    // Handle image uploads
    let cover = project.cover
    const images = {
      images1: project.images1,
      images2: project.images2,
      images3: project.images3,
      images4: project.images4,
      images5: project.images5,
      images6: project.images6,
      images7: project.images7,
      images8: project.images8,
      images9: project.images9,
      images10: project.images10,
    }

    if (req.files) {
      // Upload new cover image
      if (req.files.cover && req.files.cover[0]) {
        cover = await uploadImage(req.files.cover[0], "projects/covers")
      }

      // Upload new additional images sequentially
      for (let i = 1; i <= 10; i++) {
        const fieldName = `images${i}`
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images[fieldName] = await uploadImage(req.files[fieldName][0], "projects/images")
        }
      }
    }

    const result = await pool.query(
      `UPDATE projects SET
        category_id = COALESCE($1, category_id),
        cover = COALESCE($2, cover),
        slug = COALESCE($3, slug),
        title = COALESCE($4, title),
        layout = COALESCE($5, layout),
        location_date = COALESCE($6, location_date),
        architect = COALESCE($7, architect),
        type = COALESCE($8, type),
        size = COALESCE($9, size),
        status = COALESCE($10, status),
        "desc" = COALESCE($11, "desc"),
        images1 = COALESCE($12, images1),
        images2 = COALESCE($13, images2),
        images3 = COALESCE($14, images3),
        images4 = COALESCE($15, images4),
        images5 = COALESCE($16, images5),
        images6 = COALESCE($17, images6),
        images7 = COALESCE($18, images7),
        images8 = COALESCE($19, images8),
        images9 = COALESCE($20, images9),
        images10 = COALESCE($21, images10),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $22 RETURNING *`,
      [
        category_id,
        cover,
        slug,
        title,
        layout,
        location_date,
        architect,
        type,
        size,
        status,
        desc,
        images.images1,
        images.images2,
        images.images3,
        images.images4,
        images.images5,
        images.images6,
        images.images7,
        images.images8,
        images.images9,
        images.images10,
        id,
      ],
    )

    res.json({
      success: true,
      message: "Project updated successfully",
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
