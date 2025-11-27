const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "A comprehensive Task Management API with user authentication and task CRUD operations",
      contact: {
        name: "API Support",
        email: "support@taskmanager.com"
      }
    },
    servers: [
      {
        url: "http://localhost:5050/api/v1",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login endpoint"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User unique identifier"
            },
            firstName: {
              type: "string",
              description: "User first name"
            },
            lastName: {
              type: "string",
              description: "User last name"
            },
            fullName: {
              type: "string",
              description: "User full name (computed)"
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address"
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "User gender"
            },
            age: {
              type: "number",
              description: "User age (computed from dateOfBirth)"
            }
          }
        },
        UserRegister: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "password",
            "phone",
            "gender",
            "dateOfBirth"
          ],
          properties: {
            firstName: {
              type: "string",
              description: "User first name"
            },
            lastName: {
              type: "string",
              description: "User last name"
            },
            email: {
              type: "string",
              format: "email",
              minLength: 3,
              maxLength: 32,
              description: "User email address"
            },
            password: {
              type: "string",
              minLength: 3,
              maxLength: 255,
              description: "User password"
            },
            phone: {
              type: "string",
              pattern: "^01[0-2]\\d{8}$",
              description:
                "Phone number must start with 01 and contain 11 digits"
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "User gender"
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description:
                "User date of birth (ISO format, cannot be in the future)"
            }
          }
        },
        UserUpdate: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "User first name"
            },
            lastName: {
              type: "string",
              description: "User last name"
            },
            email: {
              type: "string",
              format: "email",
              minLength: 3,
              maxLength: 32,
              description: "User email address"
            },
            password: {
              type: "string",
              minLength: 3,
              maxLength: 255,
              description: "User password"
            },
            phone: {
              type: "string",
              pattern: "^01[0-2]\\d{8}$",
              description:
                "Phone number must start with 01 and contain 11 digits"
            },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "User gender"
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description:
                "User date of birth (ISO format, cannot be in the future)"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              minLength: 3,
              maxLength: 32,
              description: "User email address"
            },
            password: {
              type: "string",
              minLength: 3,
              maxLength: 255,
              description: "User password"
            }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            message: {
              type: "string",
              example: "User logged in successfully"
            },
            data: {
              type: "object",
              properties: {
                _id: {
                  type: "string"
                },
                firstName: {
                  type: "string"
                },
                lastName: {
                  type: "string"
                },
                fullName: {
                  type: "string"
                },
                email: {
                  type: "string"
                },
                gender: {
                  type: "string"
                },
                age: {
                  type: "number"
                },
                token: {
                  type: "string",
                  description: "JWT token for authentication"
                }
              }
            }
          }
        },
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Task unique identifier"
            },
            title: {
              type: "string",
              description: "Task title"
            },
            description: {
              type: "string",
              description: "Task description"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level"
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              description: "Task status"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation date"
            }
          }
        },
        TaskCreate: {
          type: "object",
          required: ["title", "dueDate", "priority"],
          properties: {
            title: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              description: "Task title"
            },
            description: {
              type: "string",
              maxLength: 500,
              description: "Task description (optional)"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date (must be in the future)"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level"
            }
          }
        },
        TaskUpdate: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              description: "Task title"
            },
            description: {
              type: "string",
              maxLength: 500,
              description: "Task description"
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date (must be in the future)"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "Task priority level"
            },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              description: "Task status"
            }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            message: {
              type: "string"
            },
            data: {
              type: "object"
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              description: "Error message"
            },
            error: {
              type: "object",
              description: "Error details"
            }
          }
        },
        PaginationResponse: {
          type: "object",
          properties: {
            message: {
              type: "string"
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "number",
                  description: "Current page number"
                },
                limit: {
                  type: "number",
                  description: "Items per page"
                },
                totalDocs: {
                  type: "number",
                  description: "Total number of documents"
                },
                totalPages: {
                  type: "number",
                  description: "Total number of pages"
                }
              }
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task"
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints"
      },
      {
        name: "Users",
        description: "User management endpoints"
      },
      {
        name: "Tasks",
        description: "Task management endpoints"
      }
    ]
  },
  apis: [
    "./auth/auth.routes.js",
    "./users/user.routes.js",
    "./tasks/task.routes.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
