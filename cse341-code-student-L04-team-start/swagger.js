const swaggerAutogen = require('swagger-autogen')();

// Define the Swagger output file
const outputFile = './swagger-output.json'; // Path to where the generated Swagger file will be saved

// Define the input files (your route files)
const inputFiles = ['./index.js']; // Path to the files where your routes are defined

// Swagger documentation setup
const doc = {
  info: {
    title: 'Temple API', // Title of the API
    description: 'API documentation for the Temple management application', // Short description
  },
  host: 'localhost:8080', // The API server URL
  basePath: '/', // Base URL for the API
  schemes: ['http'], // Scheme (http or https)
};

// Generate the Swagger documentation
swaggerAutogen(outputFile, inputFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
