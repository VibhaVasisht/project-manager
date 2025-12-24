const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.get('/', (req, res) => {
    res.send('Project Manager Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});