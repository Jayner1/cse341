const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/taskRoutes.js'];

const doc = {
  info: {
    title: 'Task Manager API',
    description: 'API documentation for the Task Manager application',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  securityDefinitions: {
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'apiKey',
      description: 'API Key needed to access the endpoints',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
