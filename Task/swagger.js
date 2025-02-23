const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/taskRoutes.js'];

const doc = {
  info: {
    title: 'Task Manager API',
    description: 'API documentation for the Task Manager application',
    version: '1.0.0',
  },
  schemes: ['http'], 
  host: 'localhost:8080', 
  basePath: '/',
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth', 
      tokenUrl: 'https://accounts.google.com/o/oauth2/token',
      scopes: {
        'https://www.googleapis.com/auth/userinfo.profile': 'Access your profile',
        'https://www.googleapis.com/auth/userinfo.email': 'Access your email',
        'openid': 'Authenticate the user',
      },
    },
  },
  paths: {
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        description: 'Retrieve a list of all tasks in the system',
        security: [
          {
            OAuth2: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Task',
              },
            },
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        summary: 'Create a new task',
        description: 'Create a new task with the provided details',
        security: [
          {
            OAuth2: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
          },
        ],
        parameters: [
          {
            name: 'task',
            in: 'body',
            description: 'Task details to be created',
            required: true,
            schema: {
              $ref: '#/definitions/Task',
            },
          },
        ],
        responses: {
          201: {
            description: 'Task Created',
            schema: {
              $ref: '#/definitions/Task',
            },
          },
          400: {
            description: 'Bad Request',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a task by ID',
        description: 'Retrieve a specific task by its ID',
        security: [
          {
            OAuth2: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
          },
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'ID of the task to retrieve',
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/Task',
            },
          },
          404: {
            description: 'Not Found',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      put: {
        summary: 'Update a task by ID',
        description: 'Update a specific task with new details',
        security: [
          {
            OAuth2: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
          },
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'ID of the task to update',
          },
          {
            name: 'task',
            in: 'body',
            description: 'Updated task details',
            required: true,
            schema: {
              $ref: '#/definitions/Task',
            },
          },
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/Task',
            },
          },
          404: {
            description: 'Not Found',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete a task by ID',
        description: 'Delete a specific task by its ID',
        security: [
          {
            OAuth2: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
          },
        ],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'ID of the task to delete',
          },
        ],
        responses: {
          200: {
            description: 'OK',
          },
          404: {
            description: 'Not Found',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
  definitions: {
    Task: {
      type: 'object',
      required: ['title', 'description', 'dueDate', 'status'],
      properties: {
        title: {
          type: 'string',
          description: 'Title of the task',
        },
        description: {
          type: 'string',
          description: 'Description of the task',
        },
        dueDate: {
          type: 'string',
          format: 'date',
          description: 'Due date of the task',
        },
        status: {
          type: 'string',
          enum: ['pending', 'completed', 'in-progress'],
          description: 'Status of the task',
        },
        completed: {
          type: 'boolean',
          description: 'Whether the task is completed',
          default: false,
        },
        _id: {
          type: 'string',
          description: 'The unique identifier for the task',
        },
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
