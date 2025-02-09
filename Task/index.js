const express = require('express');
const cors = require('cors');
const app = express();

// Add Swagger UI dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

// Routes
const taskRoutes = require('./routes/taskRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

// Swagger UI route for documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = require('./models');
db.mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
