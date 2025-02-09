require('dotenv').config();
console.log(process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const taskRoutes = require('./routes/taskRoutes');
const Task = require('./models/taskModel');

const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions)); 

app.use(express.json());
app.use('/tasks', taskRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Cannot connect to the database!', err);
    process.exit(1); 
  }
};

connectDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
