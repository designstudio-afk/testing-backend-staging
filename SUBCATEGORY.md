# Sub-Category API Documentation

This document provides comprehensive documentation for the Sub-Category API. Subcategories are now **standalone** - they don't require a parent category when created. You can optionally link them to a category, or use them independently and assign them directly to projects.

## Table of Contents
1. [Sub-Category CRUD Operations](#sub-category-crud-operations)
2. [Project Sub-Categories Management](#project-sub-categories-management)
3. [Filtering Projects by Category & Sub-Category](#filtering-projects-by-category--sub-category)
4. [Postman Step-by-Step Tutorial](#postman-step-by-step-tutorial)
5. [Complete Workflow Examples](#complete-workflow-examples)

## Sub-Category CRUD Operations

### Get All Sub-Categories
- **Path**: `GET /api/sub-categories`
- **Auth**: Static Token or JWT Token
- **Response**: Array of all sub-categories (both standalone and category-linked)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category_id": null,
      "sub_category_name": "Architect",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    },
    {
      "id": "uuid",
      "category_id": "uuid",
      "sub_category_name": "Interior",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Get Sub-Categories by Parent Category (Optional)
- **Path**: `GET /api/sub-categories/category/:categoryId`
- **Auth**: Static Token or JWT Token
- **URL Params**: `categoryId` (uuid) - Parent category ID
- **Response**: Array of sub-categories linked to that category (or empty if none)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "sub_category_name": "Interior",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Get Sub-Category by ID
- **Path**: `GET /api/sub-categories/:id`
- **Auth**: Static Token or JWT Token
- **URL Params**: `id` (uuid) - Sub-category ID
- **Response**: Single sub-category object

### Create Sub-Category (Standalone)
- **Path**: `POST /api/sub-categories`
- **Auth**: JWT Token (Bearer)
- **Request Body**:
  - `sub_category_name` (string, required) - Sub-category name
  - `category_id` (uuid, optional) - Parent category ID (can be added later)
- **Response**: Created sub-category object
- **Examples**:

**Create standalone subcategory (no category required):**
```json
{
  "sub_category_name": "Modern Architecture"
}
```

**Create subcategory linked to a category:**
```json
{
  "sub_category_name": "Interior Design",
  "category_id": "category-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": "uuid",
    "category_id": null,
    "sub_category_name": "Modern Architecture",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

### Update Sub-Category
- **Path**: `PUT /api/sub-categories/:id`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `id` (uuid) - Sub-category ID
- **Request Body**:
  - `sub_category_name` (string, required) - New name
- **Response**: Updated sub-category object
```json
{
  "success": true,
  "message": "Sub-category updated successfully",
  "data": {
    "id": "uuid",
    "category_id": null,
    "sub_category_name": "Contemporary Design",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

### Delete Sub-Category
- **Path**: `DELETE /api/sub-categories/:id`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `id` (uuid) - Sub-category ID
- **Response**: Success message
```json
{
  "success": true,
  "message": "Sub-category deleted successfully"
}
```
**Note**: Deleting a sub-category does NOT delete projects; it only removes the relationship from the junction table.

## Project Sub-Categories Management

### Create a Project with Required Sub-Categories

When creating a project, you **must** provide at least one sub-category ID. The sub-categories are automatically assigned to the project during creation.

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects`
- **Auth**: JWT Token (Bearer)
- **Content-Type**: multipart/form-data

**Required Fields:**
- `title` (string) - Project title
- `location_date` (string) - Location and date
- `sub_category_ids` (JSON array, required) - Array of at least one subcategory UUID

**Optional Fields:**
- `category_id` (uuid) - Parent category
- `layout` (string)
- `architect` (string)
- `type` (string)
- `size` (string)
- `status` (string)
- `desc` (string)
- `cover` (file) - Cover image
- `images1` to `images10` (files) - Additional images

**Example Request (in Postman Form-data):**
```
Key: category_id, Value: commercial-uuid
Key: title, Value: Modern Office Building
Key: location_date, Value: New York, 2024
Key: sub_category_ids, Value: ["architect-uuid", "interior-uuid"]
Key: cover, Value: (image file)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "project-uuid",
    "category_id": "commercial-uuid",
    "title": "Modern Office Building",
    "slug": "modern-office-building-new-york-2024",
    "cover": "image-url",
    "location_date": "New York, 2024",
    "sub_categories": [
      {
        "id": "architect-uuid",
        "sub_category_name": "Architect"
      },
      {
        "id": "interior-uuid",
        "sub_category_name": "Interior"
      }
    ]
  }
}
```

**Error Response (Missing sub_category_ids):**
```json
{
  "error": "At least one sub_category_id is required"
}
```

### Add Multiple Sub-Categories to Project
Assign additional sub-categories to an existing project
- **Path**: `POST /api/projects/:projectId/sub-categories`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `projectId` (uuid) - Project ID
- **Request Body**:
  ```json
  {
    "sub_category_ids": ["uuid1", "uuid2", "uuid3"]
  }
  ```
- **Response**: Array of added sub-categories
```json
{
  "success": true,
  "message": "Sub-categories added to project successfully",
  "data": [
    {
      "id": "uuid1",
      "category_id": "uuid",
      "sub_category_name": "Architect",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Get Project Sub-Categories
Retrieve all sub-categories assigned to a project
- **Path**: `GET /api/projects/:projectId/sub-categories`
- **Auth**: Static Token or JWT Token
- **URL Params**: `projectId` (uuid) - Project ID
- **Response**: Array of all sub-categories for the project
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "sub_category_name": "Architect",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Remove Sub-Category from Project
Unassign a sub-category from a project
- **Path**: `DELETE /api/projects/:projectId/sub-categories/:subCategoryId`
- **Auth**: JWT Token (Bearer)
- **URL Params**: 
  - `projectId` (uuid) - Project ID
  - `subCategoryId` (uuid) - Sub-category ID
- **Response**: Success message
```json
{
  "success": true,
  "message": "Sub-category removed from project successfully"
}
```

## Filtering Projects by Category & Sub-Category

### Real-World Example
Assume you have:
- **Categories**: Residential, Commercial
- **Sub-Categories**: Architect, Interior

**Projects**:
- **Project A**: Category=Residential, Sub-Categories=[Architect]
- **Project B**: Category=Commercial, Sub-Categories=[Interior]
- **Project C**: Category=Commercial, Sub-Categories=[Architect, Interior]

### Filter Projects by Category Only
Get all projects in a specific category (regardless of sub-categories)
- **Path**: `GET /api/projects/filter/by-category?categoryId=uuid`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `categoryId` (uuid) - Parent category ID
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Example - Get all Residential projects**:
  ```bash
  # Returns: Project A
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=residential-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```
- **Example - Get all Commercial projects**:
  ```bash
  # Returns: Project B, Project C
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```

### Filter Projects by Sub-Category Only
Get all projects with a specific sub-category (regardless of parent category)
- **Path**: `GET /api/projects/filter/by-category?subCategoryId=uuid`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `subCategoryId` (uuid) - Sub-category ID
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Example - Get all Architect projects**:
  ```bash
  # Returns: Project A, Project C (both have Architect sub-category)
  curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=architect-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```
- **Example - Get all Interior projects**:
  ```bash
  # Returns: Project B, Project C (both have Interior sub-category)
  curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=interior-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```

### Filter Projects by Category AND Sub-Category (Hierarchical)
Get projects in a specific category that also have a specific sub-category
- **Path**: `GET /api/projects/filter/by-category?categoryId=uuid&subCategoryId=uuid`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `categoryId` (uuid) - Parent category ID
  - `subCategoryId` (uuid) - Sub-category ID (must belong to the category)
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Example - Get Commercial projects with Architect sub-category**:
  ```bash
  # Returns: Project C only (Commercial + Architect)
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid&subCategoryId=architect-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```
- **Example - Get Commercial projects with Interior sub-category**:
  ```bash
  # Returns: Project B, Project C (both Commercial with Interior)
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid&subCategoryId=interior-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```

## Postman Step-by-Step Tutorial (Standalone Subcategories)

This tutorial shows how to create subcategories **independently**, then assign them to projects.

### Prerequisites
- Postman installed
- API running locally on `http://localhost:3000`
- JWT Token from login (for admin operations)
- Static Token for GET requests

### Option 1: Create Subcategories Without Category (Standalone)

**Step 1: Create First Sub-Category (Architect)**

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "sub_category_name": "Architect"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": "architect-uuid-1",
    "category_id": null,
    "sub_category_name": "Architect",
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

**Save this ID!** Copy: `architect-uuid-1`

---

**Step 2: Create Second Sub-Category (Interior)**

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/sub-categories`
- **Headers**: Same as above
- **Body** (raw JSON):
```json
{
  "sub_category_name": "Interior"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": "interior-uuid-2",
    "category_id": null,
    "sub_category_name": "Interior",
    "created_at": "2024-01-15T10:40:00.000Z",
    "updated_at": "2024-01-15T10:40:00.000Z"
  }
}
```

**Save this ID!** Copy: `interior-uuid-2`

---

**Step 3: Create a Project**

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body**: Form-data (NOT JSON)

Add fields:
- Key: `category_id`, Value: `commercial-uuid` (Commercial category)
- Key: `title`, Value: `Modern Office`
- Key: `location_date`, Value: `New York, 2024`

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "project-uuid-1",
    "category_id": "commercial-uuid",
    "title": "Modern Office",
    "slug": "modern-office-new-york-2024",
    "location_date": "New York, 2024"
  }
}
```

**Save this ID!** Copy: `project-uuid-1`

---

**Step 4: Add Multiple Subcategories to Project**

Now assign both Architect and Interior subcategories to the project

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects/project-uuid-1/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "sub_category_ids": [
    "architect-uuid-1",
    "interior-uuid-2"
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-categories added to project successfully",
  "data": [
    {
      "id": "architect-uuid-1",
      "category_id": null,
      "sub_category_name": "Architect",
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": "interior-uuid-2",
      "category_id": null,
      "sub_category_name": "Interior",
      "created_at": "2024-01-15T10:40:00.000Z",
      "updated_at": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

✓ Success! Your project now has both subcategories assigned.

---

**Step 5: Verify - Get Project Sub-Categories**

**Request Details:**
- **Method**: GET
- **URL**: `http://localhost:3000/api/projects/project-uuid-1/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_STATIC_TOKEN` (or JWT)

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "architect-uuid-1",
      "category_id": null,
      "sub_category_name": "Architect"
    },
    {
      "id": "interior-uuid-2",
      "category_id": null,
      "sub_category_name": "Interior"
    }
  ]
}
```

---

### Option 2: Create Project with Subcategories in One Step

You can now create a project with subcategories directly in the creation request:

**Step 1: Get all available subcategories**

**Request Details:**
- **Method**: GET
- **URL**: `http://localhost:3000/api/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_STATIC_TOKEN`

This returns all standalone subcategories you can assign.

**Step 2: Create a project with subcategories in Postman**

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`

**In Postman (Body -> form-data):**
1. Add fields:
   - Key: `category_id`, Value: `commercial-uuid`
   - Key: `title`, Value: `Modern Office`
   - Key: `location_date`, Value: `New York, 2024`
   - Key: `sub_category_ids`, Value: `["architect-uuid-1", "interior-uuid-2"]`
   - Key: `cover`, Value: (image file - optional)

2. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "project-uuid",
    "category_id": "commercial-uuid",
    "title": "Modern Office",
    "slug": "modern-office-new-york-2024",
    "location_date": "New York, 2024",
    "sub_categories": [
      {
        "id": "architect-uuid-1",
        "sub_category_name": "Architect"
      },
      {
        "id": "interior-uuid-2",
        "sub_category_name": "Interior"
      }
    ]
  }
}
```

✓ Project created with subcategories in one step!

**Step 3: Update existing project with additional subcategories**

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects/project-uuid/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "sub_category_ids": ["new-subcategory-uuid"]
}
```

**Step 4: Remove a subcategory if needed**

**Request Details:**
- **Method**: DELETE
- **URL**: `http://localhost:3000/api/projects/project-uuid/sub-categories/architect-uuid-1`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-category removed from project successfully"
}
```

## Complete Workflow Examples

### Workflow 1: Setup Categories, Sub-Categories, and Projects
```bash
# Step 1: Create categories
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"category_name": "Residential"}'
# Response: residential-uuid

curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"category_name": "Commercial"}'
# Response: commercial-uuid

# Step 2: Create sub-categories
curl -X POST http://localhost:3000/api/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"category_id": "residential-uuid", "sub_category_name": "Architect"}'
# Response: architect-uuid

curl -X POST http://localhost:3000/api/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"category_id": "commercial-uuid", "sub_category_name": "Interior"}'
# Response: interior-uuid

# Step 3: Create projects
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer jwt-token" \
  -F "category_id=residential-uuid" \
  -F "title=Project A" \
  -F "location_date=Location A, 2024"
# Response: project-a-uuid

curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer jwt-token" \
  -F "category_id=commercial-uuid" \
  -F "title=Project B" \
  -F "location_date=Location B, 2024"
# Response: project-b-uuid

curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer jwt-token" \
  -F "category_id=commercial-uuid" \
  -F "title=Project C" \
  -F "location_date=Location C, 2024"
# Response: project-c-uuid

# Step 4: Assign sub-categories to projects
# Project A: Residential + Architect
curl -X POST http://localhost:3000/api/projects/project-a-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"sub_category_ids": ["architect-uuid"]}'

# Project B: Commercial + Interior
curl -X POST http://localhost:3000/api/projects/project-b-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"sub_category_ids": ["interior-uuid"]}'

# Project C: Commercial + Architect + Interior (multiple sub-categories)
curl -X POST http://localhost:3000/api/projects/project-c-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"sub_category_ids": ["architect-uuid", "interior-uuid"]}'
```

### Workflow 2: Update Sub-Categories on a Project
```bash
# Remove Architect from Project C
curl -X DELETE http://localhost:3000/api/projects/project-c-uuid/sub-categories/architect-uuid \
  -H "Authorization: Bearer jwt-token"

# Add new sub-category to Project C
curl -X POST http://localhost:3000/api/projects/project-c-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"sub_category_ids": ["new-subcategory-uuid"]}'
```

### Workflow 3: Query and Filter
```bash
# Get all categories
curl http://localhost:3000/api/categories \
  -H "Authorization: Bearer static-token"

# Get sub-categories for a specific category
curl http://localhost:3000/api/sub-categories/category/residential-uuid \
  -H "Authorization: Bearer static-token"

# Get all projects in a sub-category
curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=architect-uuid" \
  -H "Authorization: Bearer static-token"

# Get projects with both category and sub-category filters
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid&subCategoryId=interior-uuid" \
  -H "Authorization: Bearer static-token"
```

## Database Schema

The sub-category system uses a many-to-many relationship:

```
Categories
├── Sub-Categories (linked via category_id)
└── Projects (has many sub-categories through junction table)

project_sub_categories (junction table)
├── project_id (FK → projects)
└── sub_category_id (FK → sub_category)
```

This allows:
- One category to have many sub-categories
- One project to belong to one category but have multiple sub-categories
- Flexible filtering and querying across the hierarchy
