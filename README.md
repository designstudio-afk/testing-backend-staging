# Express.js CRUD API with PostgreSQL and ImageKit

A robust backend API built with Express.js, PostgreSQL, and ImageKit for managing categories, projects, news, and authentication.

## Features

- 🔐 JWT-based authentication
- 📁 Category and project management
- 📰 News management with categories
- 🖼️ Image upload to ImageKit (max 2MB per image)
- 🔒 Static token for GET requests
- 🔑 Auth token for CREATE, UPDATE, DELETE operations
- 🆔 UUID for all IDs
- 🔗 Slug-based project retrieval

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Image Storage**: ImageKit
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key
STATIC_TOKEN=your-static-token
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

4. Create the database tables:
```bash
# Connect to your PostgreSQL database and run the SQL file
psql -U username -d database_name -f scripts/001-create-tables.sql
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
- **Path**: `POST /api/auth/register`
- **Auth**: None
- **Fields**:
  - `email` (string, required) - User email
  - `password` (string, required) - User password (min 6 characters)
- **Response**:
  ```json
  {
    "id": "uuid",
    "email": "string",
    "created_at": "timestamp"
  }
  ```

#### Login User
- **Path**: `POST /api/auth/login`
- **Auth**: None
- **Fields**:
  - `email` (string, required)
  - `password` (string, required)
- **Response**:
  ```json
  {
    "token": "jwt-token-string",
    "user": {
      "id": "uuid",
      "email": "string"
    }
  }
  ```

### Categories

#### Get All Categories
- **Path**: `GET /api/categories`
- **Auth**: Static Token (Header: `Authorization: Bearer your-static-token`)
- **Query Params**: None
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
  ```

#### Get Category by ID
- **Path**: `GET /api/categories/:id`
- **Auth**: Static Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "projects": [
      {
        "id": "uuid",
        "title": "string",
        "slug": "string",
        "cover_image": "string (url)",
        "location_date": "string"
      }
    ]
  }
  ```

#### Create Category
- **Path**: `POST /api/categories`
- **Auth**: JWT Token (Header: `Authorization: Bearer jwt-token`)
- **Fields**:
  - `name` (string, required) - Category name
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```

#### Update Category
- **Path**: `PUT /api/categories/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Fields**:
  - `name` (string, required) - New category name
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```

#### Delete Category
- **Path**: `DELETE /api/categories/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "message": "Category deleted successfully"
  }
  ```

### Projects

#### Get All Projects
- **Path**: `GET /api/projects`
- **Auth**: Static Token
- **Query Params**: None
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "title": "string",
      "slug": "string",
      "description": "string",
      "cover_image": "string (url, nullable)",
      "additional_images": ["string (url)", "..."],
      "category_id": "uuid",
      "category_name": "string",
      "location_date": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
  ```

#### Get Project by ID
- **Path**: `GET /api/projects/id/:id`
- **Auth**: Static Token
- **URL Params**: `id` (uuid)
- **Response**: Same as single project object above

#### Get Project by Slug
- **Path**: `GET /api/projects/slug/:slug`
- **Auth**: Static Token
- **URL Params**: `slug` (string)
- **Response**: Same as single project object above

#### Create Project
- **Path**: `POST /api/projects`
- **Auth**: JWT Token
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title` (string, required) - Project title
  - `description` (string, required) - Project description
  - `category_id` (uuid, required) - Category UUID
  - `location_date` (string, required) - Location and date info
  - `cover_image` (file, optional) - Cover image (max 2MB)
  - `additional_images` (files, optional) - Up to 10 additional images (max 2MB each)
- **Response**: Same as single project object

#### Update Project
- **Path**: `PUT /api/projects/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title` (string, optional)
  - `description` (string, optional)
  - `category_id` (uuid, optional)
  - `location_date` (string, optional)
  - `cover_image` (file, optional) - New cover image (replaces old)
  - `additional_images` (files, optional) - New additional images (replaces old)
- **Response**: Same as single project object

#### Delete Project
- **Path**: `DELETE /api/projects/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "message": "Project deleted successfully"
  }
  ```

### News Categories

#### Get All News Categories
- **Path**: `GET /api/news-categories`
- **Auth**: Static Token
- **Query Params**: None
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
  ```

#### Get News Category by ID
- **Path**: `GET /api/news-categories/:id`
- **Auth**: Static Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "news": [
      {
        "id": "uuid",
        "title": "string",
        "image": "string (url, nullable)",
        "created_at": "timestamp"
      }
    ]
  }
  ```

#### Create News Category
- **Path**: `POST /api/news-categories`
- **Auth**: JWT Token
- **Fields**:
  - `name` (string, required) - News category name
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```

#### Update News Category
- **Path**: `PUT /api/news-categories/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Fields**:
  - `name` (string, required) - New news category name
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```

#### Delete News Category
- **Path**: `DELETE /api/news-categories/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "message": "News category deleted successfully"
  }
  ```

### News

#### Get All News
- **Path**: `GET /api/news`
- **Auth**: Static Token
- **Query Params**: None
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "title": "string",
      "content": "string",
      "image": "string (url, nullable)",
      "news_category_id": "uuid",
      "category_name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
  ```

#### Get News by ID
- **Path**: `GET /api/news/:id`
- **Auth**: Static Token
- **URL Params**: `id` (uuid)
- **Response**: Same as single news object above

#### Create News
- **Path**: `POST /api/news`
- **Auth**: JWT Token
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title` (string, required) - News title
  - `content` (string, required) - News content
  - `news_category_id` (uuid, required) - News category UUID
  - `image` (file, optional) - News image (max 2MB)
- **Response**: Same as single news object

#### Update News
- **Path**: `PUT /api/news/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title` (string, optional)
  - `content` (string, optional)
  - `news_category_id` (uuid, optional)
  - `image` (file, optional) - New image (replaces old)
- **Response**: Same as single news object

#### Delete News
- **Path**: `DELETE /api/news/:id`
- **Auth**: JWT Token
- **URL Params**: `id` (uuid)
- **Response**:
  ```json
  {
    "message": "News deleted successfully"
  }
  ```

## Authentication

### Static Token (for GET requests)
Add to headers:
```
Authorization: Bearer your-static-token
```

### Auth Token (for CREATE, UPDATE, DELETE)
1. Register or login to get JWT token
2. Add to headers:
```
Authorization: Bearer your-jwt-token
```

## Image Upload

- Maximum file size: 2MB per image
- Supported formats: All image formats (jpg, png, gif, etc.)
- Images are uploaded sequentially to ImageKit
- Projects support: 1 cover image + 10 additional images
- News support: 1 image
- Images are optional for all endpoints

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js       # PostgreSQL configuration
│   │   └── imagekit.js       # ImageKit configuration
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth and upload middleware
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   └── server.js             # Main application file
├── scripts/
│   └── 001-create-tables.sql # Database schema
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## Database Schema

- **auth**: User authentication (email, password)
- **category**: Project categories
- **projects**: Projects with images and details
- **news_category**: News categories
- **news**: News articles with images

All tables use UUID as primary keys and include timestamps.

## Error Handling

The API includes comprehensive error handling:
- 400: Bad Request (missing required fields)
- 401: Unauthorized (invalid or missing token)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

## Development

The project uses ES modules (type: "module" in package.json). Node.js watch mode is enabled for development with `npm run dev`.
