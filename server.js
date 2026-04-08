// servre.js
const express =  require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/Task');


const app = express();

// Middleware
app.use(cors()); // Allow Angular to connect
app.use(express.json()); // middle to parse JSON




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
app.get('/tasks/:id', async (req, res, next) => {
   try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
   } catch (err) {
    res.status(400).json({ error: 'Invalid Task ID' });
   }
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
        res.status(400).json({ error: 'Inavlid Task ID' });
    }
});

// GLOBAL ERROR HANDLER

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong on the server'
    });
});

// --- Starting the Server
const PORT = 3000;
app.listen(PORT, () =>  {
    console.log(`Server running on http://localhost:${PORT}`);
});

//mongodb+srv://admin:saveit!@cluster0.ksh7ugu.mongodb.net/
