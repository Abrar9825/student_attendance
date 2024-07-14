const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendence', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

// Define student schema and model
const studentSchema = new mongoose.Schema({
    username: String,
    password: String
});
const Student = mongoose.model('Student', studentSchema);

// Define faculty schema and model
const facultySchema = new mongoose.Schema({
    name: String,
    department: String
});
const Faculty = mongoose.model('Faculty', facultySchema);

// Route to render the landing page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to render the student form
app.get('/studentForm', (req, res) => {
    res.render('student/studentForm');
});

// Route to render the faculty form
app.get('/facultyForm', (req, res) => {
    res.render('faculty/facultyForm');
});

// Route to add a student
app.post('/students', async (req, res) => {
    const newStudent = new Student(req.body);
    try {
        const savedStudent = await newStudent.save();
        res.status(201).redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Route to add a faculty
app.post('/faculties', async (req, res) => {
    const newFaculty = new Faculty(req.body);
    try {
        const savedFaculty = await newFaculty.save();
        res.status(201).redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Port is running on http://localhost:${port}`);
});
