const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Task Manager API',
    description: 'API documentation for Task Manager App',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/taskRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
