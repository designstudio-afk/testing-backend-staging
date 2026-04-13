#### Get Category by ID
- **Path**: `GET /api/categories/:id`
- **Auth**: Static Token or JWT Token
- **URL Params**: `id` (uuid)
- **Query Params**: 
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
  - `update`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "category_name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "projects": [
        {
          "id": "uuid",
          "title": "string",
          "slug": "string",
          "cover": "string (url)",
          "location_date": "string",
          "architect": "string",
          "type": "string",
          "size": "string",
          "status": "string",
          "layout": "string",
          "desc": "string",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ]
    },
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number",
      "hasNextPage": "boolean",
      "hasPrevPage": "boolean"
    }
  }

## Postman Step-by-Step Tutorial

This section provides a complete walkthrough using Postman to add a category, subcategories, and assign them to projects.

### Prerequisites
- Postman installed
- API running locally on `http://localhost:3000`
- JWT Token from login (for admin operations)
- Static Token for GET requests

### Step 1: Create a Category

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "category_name": "Commercial"
}
```

**In Postman:**
1. Create new request
2. Set method to POST
3. Enter URL: `http://localhost:3000/api/categories`
4. Go to **Headers** tab:
   - Add `Authorization` with value `Bearer YOUR_JWT_TOKEN`
   - Add `Content-Type` with value `application/json`
5. Go to **Body** tab, select **raw**, paste JSON above
6. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "category_name": "Commercial",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Save this ID for next steps!** Copy: `550e8400-e29b-41d4-a716-446655440000`

---

### Step 2: Create Sub-Categories

Create first sub-category (Architect)

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "category_id": "550e8400-e29b-41d4-a716-446655440000",
  "sub_category_name": "Architect"
}
```

**In Postman:**
1. Create new request
2. Set method to POST
3. Enter URL: `http://localhost:3000/api/sub-categories`
4. Add same headers as Step 1
5. Go to **Body** tab, paste JSON (replace category_id with your ID from Step 1)
6. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "category_id": "550e8400-e29b-41d4-a716-446655440000",
    "sub_category_name": "Architect",
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  }
}
```

**Save this ID!** Copy: `660e8400-e29b-41d4-a716-446655440001`

---

Create second sub-category (Interior)

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/sub-categories`
- **Headers**: Same as above
- **Body** (raw JSON):
```json
{
  "category_id": "550e8400-e29b-41d4-a716-446655440000",
  "sub_category_name": "Interior"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "category_id": "550e8400-e29b-41d4-a716-446655440000",
    "sub_category_name": "Interior",
    "created_at": "2024-01-15T10:40:00.000Z",
    "updated_at": "2024-01-15T10:40:00.000Z"
  }
}
```

**Save this ID!** Copy: `770e8400-e29b-41d4-a716-446655440002`

---

### Step 3: Create a Project (Optional - if you don't have one)

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body**: Form-data (NOT JSON)

**In Postman:**
1. Create new request
2. Set method to POST
3. Enter URL: `http://localhost:3000/api/projects`
4. Go to **Headers** tab, add `Authorization: Bearer YOUR_JWT_TOKEN`
5. Go to **Body** tab, select **form-data**
6. Add fields:
   - Key: `category_id`, Value: `550e8400-e29b-41d4-a716-446655440000` (Commercial category)
   - Key: `title`, Value: `Modern Office Building`
   - Key: `location_date`, Value: `New York, 2024`
7. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "category_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Modern Office Building",
    "slug": "modern-office-building-new-york-2024",
    "location_date": "New York, 2024",
    "created_at": "2024-01-15T10:45:00.000Z",
    "updated_at": "2024-01-15T10:45:00.000Z"
  }
}
```

**Save this ID!** Copy: `880e8400-e29b-41d4-a716-446655440003`

---

### Step 4: Add Multiple Sub-Categories to Project

Now assign both Architect and Interior sub-categories to the project

**Request Details:**
- **Method**: POST
- **URL**: `http://localhost:3000/api/projects/880e8400-e29b-41d4-a716-446655440003/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_JWT_TOKEN`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "sub_category_ids": [
    "660e8400-e29b-41d4-a716-446655440001",
    "770e8400-e29b-41d4-a716-446655440002"
  ]
}
```

**In Postman:**
1. Create new request
2. Set method to POST
3. Enter URL: `http://localhost:3000/api/projects/880e8400-e29b-41d4-a716-446655440003/sub-categories` (replace project ID)
4. Go to **Headers** tab:
   - Add `Authorization: Bearer YOUR_JWT_TOKEN`
   - Add `Content-Type: application/json`
5. Go to **Body** tab, select **raw**, paste JSON above (replace sub_category_ids with your IDs)
6. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "message": "Sub-categories added to project successfully",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "sub_category_name": "Architect",
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "sub_category_name": "Interior",
      "created_at": "2024-01-15T10:40:00.000Z",
      "updated_at": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

✓ Success! Your project now has both Architect and Interior sub-categories.

---

### Step 5: Verify - Get Project Sub-Categories

Confirm the sub-categories were added to the project

**Request Details:**
- **Method**: GET
- **URL**: `http://localhost:3000/api/projects/880e8400-e29b-41d4-a716-446655440003/sub-categories`
- **Headers**:
  - `Authorization: Bearer YOUR_STATIC_TOKEN` (or JWT)

**In Postman:**
1. Create new request
2. Set method to GET
3. Enter URL: `http://localhost:3000/api/projects/880e8400-e29b-41d4-a716-446655440003/sub-categories`
4. Go to **Headers** tab, add `Authorization: Bearer YOUR_STATIC_TOKEN`
5. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "sub_category_name": "Architect",
      "created_at": "2024-01-15T10:35:00.000Z",
      "updated_at": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "sub_category_name": "Interior",
      "created_at": "2024-01-15T10:40:00.000Z",
      "updated_at": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

---

### Bonus: Filter Projects by Category > Sub-Category

Now test filtering to get only projects with Commercial + Architect

**Request Details:**
- **Method**: GET
- **URL**: `http://localhost:3000/api/projects/filter/by-category?categoryId=550e8400-e29b-41d4-a716-446655440000&subCategoryId=660e8400-e29b-41d4-a716-446655440001`
- **Headers**:
  - `Authorization: Bearer YOUR_STATIC_TOKEN` (or JWT)

**In Postman:**
1. Create new request
2. Set method to GET
3. Enter URL with both query parameters
4. Go to **Headers** tab, add `Authorization: Bearer YOUR_STATIC_TOKEN`
5. Click **Send**

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "category_name": "Commercial",
      "title": "Modern Office Building",
      "slug": "modern-office-building-new-york-2024",
      "location_date": "New York, 2024"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

✓ Project found! The filtering is working correctly.

## Sub-Category API

### Get All Sub-Categories
- **Path**: `GET /api/sub-categories`
- **Auth**: Static Token or JWT Token
- **Response**: Array of all sub-categories

### Get Sub-Categories by Parent Category
- **Path**: `GET /api/sub-categories/category/:categoryId`
- **Auth**: Static Token or JWT Token
- **URL Params**: `categoryId` (uuid)
- **Response**: Array of sub-categories for the specified parent category

### Get Sub-Category by ID
- **Path**: `GET /api/sub-categories/:id`
- **Auth**: Static Token or JWT Token
- **URL Params**: `id` (uuid)
- **Response**: Single sub-category object

### Create Sub-Category
- **Path**: `POST /api/sub-categories`
- **Auth**: JWT Token (Bearer)
- **Request Body**:
  - `category_id` (uuid, required) - Parent category ID
  - `sub_category_name` (string, required) - Sub-category name
- **Response**: Created sub-category object
- **Example**:
  ```json
  {
    "category_id": "550e8400-e29b-41d4-a716-446655440000",
    "sub_category_name": "Modern Architecture"
  }
  ```

### Update Sub-Category
- **Path**: `PUT /api/sub-categories/:id`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `id` (uuid)
- **Request Body**:
  - `sub_category_name` (string, required) - New name
- **Response**: Updated sub-category object
- **Example**:
  ```json
  {
    "sub_category_name": "Contemporary Design"
  }
  ```

### Delete Sub-Category
- **Path**: `DELETE /api/sub-categories/:id`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `id` (uuid)
- **Response**: Success message
- **Note**: Deleting a sub-category does NOT delete projects; it only removes the relationship from the junction table

## Project Sub-Categories Management

### Add Multiple Sub-Categories to Project
- **Path**: `POST /api/projects/:projectId/sub-categories`
- **Auth**: JWT Token (Bearer)
- **URL Params**: `projectId` (uuid)
- **Request Body**:
  ```json
  {
    "sub_category_ids": ["uuid1", "uuid2", "uuid3"]
  }
  ```
- **Response**: Array of added sub-categories
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440000/sub-categories \
    -H "Authorization: Bearer your-jwt-token" \
    -H "Content-Type: application/json" \
    -d '{
      "sub_category_ids": ["uuid1", "uuid2"]
    }'
  ```

### Get Project Sub-Categories
- **Path**: `GET /api/projects/:projectId/sub-categories`
- **Auth**: Static Token or JWT Token
- **URL Params**: `projectId` (uuid)
- **Response**: Array of all sub-categories assigned to the project
- **Example**:
  ```bash
  curl http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440000/sub-categories \
    -H "Authorization: Bearer your-static-token"
  ```

### Remove Sub-Category from Project
- **Path**: `DELETE /api/projects/:projectId/sub-categories/:subCategoryId`
- **Auth**: JWT Token (Bearer)
- **URL Params**: 
  - `projectId` (uuid)
  - `subCategoryId` (uuid)
- **Response**: Success message
- **Example**:
  ```bash
  curl -X DELETE http://localhost:3000/api/projects/550e8400-e29b-41d4-a716-446655440000/sub-categories/uuid1 \
    -H "Authorization: Bearer your-jwt-token"
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
- **Response**: All projects with that category
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
- **Response**: All projects with that sub-category
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
- **Response**: Projects matching both criteria
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
- **Example - Get Residential projects with Architect sub-category**:
  ```bash
  # Returns: Project A (Residential + Architect)
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=residential-uuid&subCategoryId=architect-uuid" \
    -H "Authorization: Bearer your-static-token"
  ```

## Complete Workflow Examples

### Workflow 1: Create Sub-Categories and Assign to Project
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

# Step 5: Filter projects
# Get all Residential projects
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=residential-uuid" \
  -H "Authorization: Bearer static-token"
# Returns: Project A

# Get all Commercial projects
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid" \
  -H "Authorization: Bearer static-token"
# Returns: Project B, Project C

# Get all Architect projects
curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=architect-uuid" \
  -H "Authorization: Bearer static-token"
# Returns: Project A, Project C

# Get Commercial + Interior projects
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid&subCategoryId=interior-uuid" \
  -H "Authorization: Bearer static-token"
# Returns: Project B, Project C
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

### Workflow 3: Navigate Category Hierarchy
```bash
# Step 1: Get all categories
curl http://localhost:3000/api/categories \
  -H "Authorization: Bearer static-token"

# Step 2: Get sub-categories for a specific category
curl http://localhost:3000/api/sub-categories/category/residential-uuid \
  -H "Authorization: Bearer static-token"

# Step 3: Get all projects in a sub-category
curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=architect-uuid" \
  -H "Authorization: Bearer static-token"

# Step 4: Get projects filtered by category > subcategory
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=commercial-uuid&subCategoryId=interior-uuid" \
  -H "Authorization: Bearer static-token"
```

### Filter Projects by Sub-Category Only
- **Path**: `GET /api/projects/filter/by-category?subCategoryId=uuid`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `subCategoryId` (uuid) - Sub-category ID
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Response**: Paginated list of projects with the sub-category
- **Example**:
  ```bash
  curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=uuid-subcategory&page=1" \
    -H "Authorization: Bearer your-static-token"
  ```

### Filter Projects by Category AND Sub-Category (Hierarchical)
- **Path**: `GET /api/projects/filter/by-category?categoryId=uuid&subCategoryId=uuid`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `categoryId` (uuid) - Parent category ID (required when using subCategoryId)
  - `subCategoryId` (uuid) - Sub-category ID (must belong to the category)
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Response**: Paginated list of projects matching both filters
- **Example**:
  ```bash
  curl "http://localhost:3000/api/projects/filter/by-category?categoryId=550e8400-e29b-41d4-a716-446655440000&subCategoryId=uuid-subcategory&page=1&limit=10" \
    -H "Authorization: Bearer your-static-token"
  ```

## Complete Workflow Examples

### Workflow 1: Create Sub-Categories and Assign to Project
```bash
# Step 1: Create parent category
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Commercial Buildings"
  }'
# Response includes category_id

# Step 2: Create sub-categories under that category
curl -X POST http://localhost:3000/api/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": "category-uuid",
    "sub_category_name": "Office Complex"
  }'
# Response includes sub_category_id

# Step 3: Create a project with the parent category
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer jwt-token" \
  -F "category_id=category-uuid" \
  -F "title=Modern Office" \
  -F "location_date=New York, 2024"

# Step 4: Assign sub-categories to the project
curl -X POST http://localhost:3000/api/projects/project-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "sub_category_ids": ["subcategory-uuid-1", "subcategory-uuid-2"]
  }'

# Step 5: Get projects filtered by category > subcategory
curl "http://localhost:3000/api/projects/filter/by-category?categoryId=category-uuid&subCategoryId=subcategory-uuid-1" \
  -H "Authorization: Bearer static-token"
```

### Workflow 2: Update Sub-Categories on a Project
```bash
# Remove old sub-category
curl -X DELETE http://localhost:3000/api/projects/project-uuid/sub-categories/old-subcategory-uuid \
  -H "Authorization: Bearer jwt-token"

# Add new sub-categories
curl -X POST http://localhost:3000/api/projects/project-uuid/sub-categories \
  -H "Authorization: Bearer jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "sub_category_ids": ["new-subcategory-uuid-1", "new-subcategory-uuid-2"]
  }'
```

### Workflow 3: Navigate Category Hierarchy
```bash
# Step 1: Get all categories
curl http://localhost:3000/api/categories \
  -H "Authorization: Bearer static-token"

# Step 2: Get sub-categories for a specific category
curl http://localhost:3000/api/sub-categories/category/category-uuid \
  -H "Authorization: Bearer static-token"

# Step 3: Get all projects in a sub-category
curl "http://localhost:3000/api/projects/filter/by-category?subCategoryId=subcategory-uuid" \
  -H "Authorization: Bearer static-token"
```

## Form Submission API

### Submit Form
- **Path**: `POST /api/submissions/submit`
- **Auth**: Bearer Token (FORM_SUBMISSION_TOKEN from env, defaults to JWT_SECRET)
- **Content-Type**: `multipart/form-data`
- **Request Body** (all fields optional):
  - `type` (string) - Submission type
  - `name` (string) - Submitter name
  - `phone_number` (number) - Phone number
  - `email` (string) - Email address
  - `role` (string) - User role
  - `project` (string) - Project name
  - `location` (string) - Location
  - `size` (string) - Size
  - `message` (string) - Message content
  - `link` (string) - Additional link
  - `file` (file) - Uploaded file to ImageKit (max 2MB, optional)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Form submitted successfully. Emails have been sent."
  }
  ```
- **Behavior**:
  - Uploads file to ImageKit if provided
  - Sends confirmation email to user
  - Sends notification email to admin
  - No data stored to database

### Example Request
```bash
curl -X POST http://localhost:5000/api/submissions/submit \
  -H "Authorization: Bearer your-form-submission-token" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone_number=1234567890" \
  -F "message=Test message" \
  -F "file=@/path/to/file.pdf"
```
- **Response**: Array of added sub-categories

### Get Project Sub-Categories
- **Path**: `GET /api/projects/:projectId/sub-categories`
- **Auth**: Static Token or JWT Token
- **URL Params**: `projectId` (uuid)
- **Response**: Array of all sub-categories for the project

### Remove Sub-Category from Project
- **Path**: `DELETE /api/projects/:projectId/sub-categories/:subCategoryId`
- **Auth**: JWT Token (Bearer)
- **URL Params**: 
  - `projectId` (uuid)
  - `subCategoryId` (uuid)
- **Response**: Success message

### Filter Projects by Category and Sub-Category
- **Path**: `GET /api/projects/filter/by-category`
- **Auth**: Static Token or JWT Token
- **Query Params**:
  - `categoryId` (uuid, optional) - Parent category ID
  - `subCategoryId` (uuid, optional) - Sub-category ID
  - `page` (number, optional) - Page number (default: 1)
  - `limit` (number, optional) - Items per page (default: 6)
- **Examples**:
  - `/api/projects/filter/by-category?categoryId=uuid` - Get all projects in a category
  - `/api/projects/filter/by-category?subCategoryId=uuid` - Get all projects in a sub-category
  - `/api/projects/filter/by-category?categoryId=uuid&subCategoryId=uuid` - Get projects with both filters
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "string",
        "category_name": "string",
        "slug": "string",
        ...
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number",
      "hasNextPage": "boolean",
      "hasPrevPage": "boolean"
    }
  }
  ```

## Form Submission API

### Submit Form
- **Path**: `POST /api/submissions/submit`
- **Auth**: Bearer Token (FORM_SUBMISSION_TOKEN from env, defaults to JWT_SECRET)
- **Content-Type**: `multipart/form-data`
- **Request Body** (all fields optional):
  - `type` (string) - Submission type
  - `name` (string) - Submitter name
  - `phone_number` (number) - Phone number
  - `email` (string) - Email address
  - `role` (string) - User role
  - `project` (string) - Project name
  - `location` (string) - Location
  - `size` (string) - Size
  - `message` (string) - Message content
  - `link` (string) - Additional link
  - `file` (file) - Uploaded file to ImageKit (max 2MB, optional)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Form submitted successfully. Emails have been sent."
  }
  ```
- **Behavior**:
  - Uploads file to ImageKit if provided
  - Sends confirmation email to user
  - Sends notification email to admin
  - No data stored to database

### Example Request
```bash
curl -X POST http://localhost:5000/api/submissions/submit \
  -H "Authorization: Bearer your-form-submission-token" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone_number=1234567890" \
  -F "message=Test message" \
  -F "file=@/path/to/file.pdf"
