# Task Manager API

A comprehensive RESTful API for managing tasks and users with authentication, built with Node.js and Express.js. This API provides a robust backend solution for task management applications with features like user authentication, task CRUD operations, pagination, filtering, and search capabilities.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Modules Overview](#modules-overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Logging](#logging)

## <a id="project-description"></a>🎯 Project Description

Task Manager API is a production-ready Node.js backend application that provides a complete solution for task management. The API supports user registration and authentication, task creation and management, with advanced features like pagination, filtering, sorting, and full-text search. It follows RESTful principles and implements best practices for security, error handling, and code organization.

### Key Features:

- **User Management**: Registration, authentication, and user profile management
- **Task Management**: Full CRUD operations for tasks with status and priority tracking
- **Security**: JWT-based authentication with session management
- **Advanced Filtering**: Filter tasks by status, priority, and search by text
- **Pagination**: Efficient data retrieval with pagination support
- **Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Logging**: Winston-based logging system with MongoDB integration
- **API Documentation**: Swagger/OpenAPI documentation

## <a id="features"></a>✨ Features

### Authentication & Authorization

- User registration with email validation
- JWT-based authentication
- Session token management
- Password hashing with bcrypt
- Protected routes middleware

### Task Management

- Create, read, update, and delete tasks
- Task status tracking (pending, in-progress, completed)
- Priority levels (low, medium, high)
- Due date management
- Full-text search across title and description
- Filter by status and priority
- Sort by priority or status (ascending/descending)
- Pagination support

### User Management

- User profile management
- Get all users (admin feature)
- Update user information
- Delete users

## <a id="technologies-used"></a>🛠 Technologies Used

### Core Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool

### Security & Authentication

- **jsonwebtoken** - JWT token generation and verification
- **bcrypt** - Password hashing
- **helmet** - Security headers middleware
- **cors** - Cross-Origin Resource Sharing

### Validation & Error Handling

- **Joi** - Schema validation library
- **express-async-handler** - Async error handling wrapper

### Utilities

- **dotenv** - Environment variable management
- **compression** - Response compression middleware
- **body-parser** - Request body parsing
- **morgan** - HTTP request logger
- **winston** - Logging library
- **winston-mongodb** - MongoDB transport for Winston
- **colors** - Terminal string styling
- **uuid** - Unique identifier generation

### API Documentation

- **swagger-ui-express** - Swagger UI integration
- **swagger-jsdoc** - Swagger documentation generator

### Development Tools

- **nodemon** - Development server with auto-reload

## <a id="project-structure"></a>📁 Project Structure

```
task-manager/
│
├── auth/                      # Authentication module
│   ├── auth.controller.js     # Authentication controllers
│   ├── auth.routes.js         # Authentication routes
│   ├── auth.service.js        # Authentication business logic
│   └── auth.validator.js      # Authentication validation schemas
│
├── users/                     # User management module
│   ├── user.controller.js     # User controllers
│   ├── user.dto.js           # User Data Transfer Objects
│   ├── user.model.js         # User Mongoose model
│   ├── user.routes.js        # User routes
│   ├── user.service.js       # User business logic
│   └── user.validator.js     # User validation schemas
│
├── tasks/                     # Task management module
│   ├── task.controller.js    # Task controllers
│   ├── task.dto.js          # Task Data Transfer Objects
│   ├── task.enum.js         # Task enums (status, priority)
│   ├── task.model.js        # Task Mongoose model
│   ├── task.routes.js       # Task routes
│   ├── task.service.js       # Task business logic
│   └── task.validator.js     # Task validation schemas
│
├── config/                   # Configuration files
│   ├── index.js             # Application configuration
│   └── swagger.js           # Swagger configuration
│
├── middlewares/              # Express middlewares
│   ├── auth.middleware.js   # Authentication middleware
│   └── error.middleware.js  # Global error handler
│
├── startup/                  # Application startup files
│   ├── app.js               # Express app configuration
│   ├── db.js                # Database connection
│   ├── logging.js           # Logging configuration
│   └── routes.js            # Route aggregation
│
├── utils/                    # Utility functions
│   ├── ApiError.js          # Custom error class
│   ├── constants.js         # Application constants
│   ├── hash.js              # Password hashing utilities
│   ├── joiErrorHandler.js   # Joi validation error handler
│   └── logger.js            # Winston logger configuration
│
├── api-docs.json            # Swagger API documentation (JSON)
├── server.js                # Application entry point
├── package.json             # Project dependencies
└── README.md               # Project documentation
```

## <a id="modules-overview"></a>📦 Modules Overview

### 1. Authentication Module (`/auth`)

Handles user registration and login functionality.

**Files:**

- `auth.controller.js` - Handles HTTP requests for registration and login
- `auth.service.js` - Contains business logic for authentication
- `auth.routes.js` - Defines authentication endpoints
- `auth.validator.js` - Validates login request data

**Endpoints:**

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login

### 2. User Module (`/users`)

Manages user-related operations and user profiles.

**Files:**

- `user.controller.js` - Handles user-related HTTP requests
- `user.service.js` - Contains user business logic
- `user.model.js` - Mongoose schema for User model
- `user.routes.js` - Defines user endpoints
- `user.validator.js` - Validates user request data
- `user.dto.js` - Data Transfer Object for user responses

**Endpoints:**

- `GET /api/v1/users` - Get all users (protected)
- `GET /api/v1/users/:id` - Get user by ID (protected)
- `PATCH /api/v1/users/:id` - Update user (protected)
- `DELETE /api/v1/users/:id` - Delete user (protected)

### 3. Task Module (`/tasks`)

Manages task creation, retrieval, updating, and deletion.

**Files:**

- `task.controller.js` - Handles task-related HTTP requests
- `task.service.js` - Contains task business logic
- `task.model.js` - Mongoose schema for Task model
- `task.routes.js` - Defines task endpoints
- `task.validator.js` - Validates task request data
- `task.dto.js` - Data Transfer Object for task responses
- `task.enum.js` - Enums for task status and priority

**Endpoints:**

- `GET /api/v1/tasks` - Get all tasks with pagination and filters (protected)
- `POST /api/v1/tasks` - Create a new task (protected)
- `GET /api/v1/tasks/:id` - Get task by ID (protected)
- `PATCH /api/v1/tasks/:id` - Update task (protected)
- `DELETE /api/v1/tasks/:id` - Delete task (protected)

### 4. Configuration Module (`/config`)

Contains application configuration and Swagger setup.

**Files:**

- `index.js` - Centralized configuration from environment variables
- `swagger.js` - Swagger/OpenAPI specification loader

### 5. Middleware Module (`/middlewares`)

Custom Express middlewares for authentication and error handling.

**Files:**

- `auth.middleware.js` - JWT authentication and authorization middleware
- `error.middleware.js` - Global error handling middleware

### 6. Startup Module (`/startup`)

Application initialization and setup files.

**Files:**

- `app.js` - Express app configuration and middleware setup
- `db.js` - MongoDB connection setup
- `logging.js` - Logging configuration
- `routes.js` - Route aggregation and 404 handler

### 7. Utilities Module (`/utils`)

Reusable utility functions and classes.

**Files:**

- `ApiError.js` - Custom error class with static factory methods
- `constants.js` - Application-wide constants
- `hash.js` - Password hashing and comparison utilities
- `joiErrorHandler.js` - Joi validation error formatter
- `logger.js` - Winston logger configuration

## <a id="installation"></a>🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/Eslam-Amin/Task-Manager-API.git
cd task-manager-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5050
APP_NAME=Task Manager

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/task-manager-dev
DB_PASSWORD=
DB_USERNAME=

# Logging Database
LOG_URI=mongodb://127.0.0.1:27017/task-manager-logs-dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=30d

# Password Hashing
SALT_ROUNDS=10
```

**Important:** Replace `your-super-secret-jwt-key-change-this-in-production` with a strong, random secret key in production.

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 5: Seed the Database (Optional)

Populate the database with sample users and tasks using the seed script:

```bash
npm run seed
```

This will create:

- **20 users** with realistic fake data (firstName, lastName, email, phone, gender, dateOfBirth)
- **2-8 tasks per user** (randomly distributed) with various statuses and priorities
- All seeded users have the password: `Password123` (hashed)
- All seeded users are set as `verified: true` and `active: true`

**Note:** The seed script will connect to your MongoDB database and populate it with test data. If you want to clear existing data before seeding, uncomment the clearing code in `seed.js`.

## <a id="configuration"></a>⚙️ Configuration

The application configuration is managed through environment variables and the `config/index.js` file. Key configuration areas:

- **Database**: MongoDB connection string
- **JWT**: Secret key and expiration time
- **Logging**: Log database connection
- **Server**: Port and environment settings

## <a id="running-the-application"></a>🏃 Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with `nodemon` for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

This starts the server using Node.js directly.

### Server Information

Once started, the server will:

- Connect to MongoDB
- Start listening on the configured port (default: 5050)
- Display connection status in the console

You should see:

```
Mode: development
Database Connected: 127.0.0.1:27017
Running on port 5050
```

## <a id="api-documentation"></a>📚 API Documentation

### Swagger UI

The API documentation is available through Swagger UI. Once the server is running:

1. Open your browser and navigate to:

   ```
   http://localhost:5050/api-docs
   ```

2. You'll see an interactive API documentation interface where you can:

   - Browse all available endpoints
   - View request/response schemas
   - Test endpoints directly from the browser
   - View authentication requirements

3. To test protected endpoints:
   - Click the "Authorize" button at the top
   - Enter your JWT token (obtained from login endpoint)
   - Click "Authorize" to authenticate

### API Documentation Features

- Complete endpoint documentation
- Request/response examples
- Schema definitions
- Authentication requirements
- Query parameter descriptions
- Error response documentation

## <a id="api-endpoints"></a>🔌 API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "01012345678",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Task Endpoints (Protected)

#### Get All Tasks

```http
GET /api/v1/tasks?page=1&limit=10&status=pending&priority=high&search=project&sort=priority&order=desc
Authorization: <JWT_TOKEN>
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status: `pending`, `in-progress`, `completed`
- `priority` - Filter by priority: `low`, `medium`, `high`
- `search` - Search in title and description
- `sort` - Sort by: `priority`, `status`
- `order` - Sort order: `asc`, `desc` (default: `desc`)

#### Create Task

```http
POST /api/v1/tasks
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2025-12-31T23:59:59Z",
  "priority": "high"
}
```

#### Get Task by ID

```http
GET /api/v1/tasks/:id
Authorization: <JWT_TOKEN>
```

#### Update Task

```http
PATCH /api/v1/tasks/:id
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Updated task title",
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete Task

```http
DELETE /api/v1/tasks/:id
Authorization: <JWT_TOKEN>
```

### User Endpoints (Protected)

#### Get All Users

```http
GET /api/v1/users
Authorization: <JWT_TOKEN>
```

#### Get User by ID

```http
GET /api/v1/users/:id
Authorization: <JWT_TOKEN>
```

#### Update User

```http
PATCH /api/v1/users/:id
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com"
}
```

#### Delete User

```http
DELETE /api/v1/users/:id
Authorization: <JWT_TOKEN>
```

## <a id="postman-collection"></a>📮 Postman Collection

You can import the API endpoints into Postman for easier testing.

**Postman Collection Link:** [Insert your Postman collection link here]

To use the Postman collection:

1. Import the collection into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:5050/api/v1`
   - `token`: Your JWT token (obtained from login)
3. Start testing the endpoints

## <a id="authentication"></a>🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Here's how it works:

### 1. Register/Login

- Register a new user or login with existing credentials
- Receive a JWT token in the response

### 2. Using the Token

Include the token in the `Authorization` header for protected routes:

```http
Authorization: <JWT_TOKEN>
```

### 3. Token Features

- **Session Management**: Each login generates a unique session token
- **Password Change Detection**: Token becomes invalid if password is changed
- **Expiration**: Tokens expire based on `JWT_EXPIRATION` setting
- **Security**: Tokens are verified on every protected request

### Protected Routes

All routes except `/auth/register` and `/auth/login` require authentication.

## <a id="error-handling"></a>⚠️ Error Handling

The API uses a centralized error handling system:

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `500` - Internal Server Error

### Error Types Handled

- Validation errors (Joi)
- Authentication errors
- Database errors (MongoDB)
- Cast errors (invalid IDs)
- Duplicate field errors
- JWT errors

## <a id="logging"></a>📝 Logging

The application uses Winston for logging:

### Log Levels

- **Info**: General application flow
- **Error**: Error occurrences

### Log Destinations

- **Development**: File logging (`logfile.log`)
- **Production**: File logging + MongoDB logging

### Logged Information

- Server startup
- Database connections
- API requests (via Morgan)
- Errors and exceptions

## 🧪 Testing

### Manual Testing

Use the Swagger UI or Postman collection to test endpoints.

### Example Test Flow

1. Register a new user
2. Login to get JWT token
3. Create a task using the token
4. Retrieve tasks with filters
5. Update a task
6. Delete a task

## 📄 License

ISC

## 👤 Author

Eslam Amin

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email support@taskmanager.com or open an issue in the repository.

---

**Note:** This is a development version. Make sure to configure proper security settings and environment variables before deploying to production.
