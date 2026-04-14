// servre.js
const express =  require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');


const app = express();

// Middleware
app.use(cors()); // Allow Angular to connect
app.use(express.json()); // middle to parse JSON

app.use(express.json());



module.exports = app;

app.get('/', (req, res) => {
  res.send('🚀 Task Manager API is running...');
});

mongoose.connect("mongodb+srv://admin:saveit!@cluster0.ksh7ugu.mongodb.net/taskdb")
.then(() => console.log("MongoDB Connected Successfully!"))
.catch(err => console.log("Error:", err));


// --- CRUD Routes ---

// GET all tasks
app.get('/tasks',  async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// GET single task
app.get('/tasks', async (req, res, next) => {
   const tasks = await Task.find();
   res.json(tasks);
});


// POST create task
app.post('/tasks', async(req, res, next) => {
    console.log("BODY:", req.body);
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const newTask = await Task.create({ title, description });
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

// PUT update task
app.put('/tasks/:id', async (req, res, next) => {
    try {
        const { title, description} = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true } // return updated document
        );

        if (!updatedTask) return res.status(404).json({ error:'Task not found' });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: 'Invalid Task ID' });
    }
});

// DELETE task
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Task ID' });
    }
});

// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong on the server'
    });
});

app.post('/register', async(req, res, next) => {
    try {
       const { username, password } = req.body;

       // Check if user exists
       let user = await User.findOne({ username });
       if (user) {
        return res.status(400).json({ message: 'User already exists' });
       }

       // Hash password
       const hashedPassword = await bcrypt.hash(password, 10);

       // Save userr
       user = new User({
        username,
        password: hashedPassword
       });

       await user.save();

       res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            'SECRET_KEY',
            { expiresIn: '1h'}
        );

        res.json({
            token,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Starting the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>  {
    console.log(`Server running on port ${PORT}`);
});


if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => console.log("Server running"))
}

