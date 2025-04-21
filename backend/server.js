const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const Student = require('./models/studentSchema'); // updated model

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://vivekgaddam2005:saritharam02@cluster0.6hmdh4n.mongodb.net/student_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

// Cloudinary Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'student_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Add new student with image upload
app.post('/students', upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      dob,
      department,
      enrollmentYear,
      isActive,
    } = req.body;

    const profilePhoto = req.file ? req.file.path : null;

    const student = new Student({
      studentId,
      firstName,
      lastName,
      email,
      dob,
      department,
      enrollmentYear,
      isActive,
      profilePhoto,
    });

    await student.save();
    res.json({ message: 'Student added successfully', student });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Update student info
app.put('/students/:id', upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      dob,
      department,
      enrollmentYear,
      isActive,
    } = req.body;

    const profilePhoto = req.file ? req.file.path : undefined;

    const updatedData = {
      studentId,
      firstName,
      lastName,
      email,
      dob,
      department,
      enrollmentYear,
      isActive,
    };
    if (profilePhoto) updatedData.profilePhoto = profilePhoto;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });

    res.json({ message: 'Student updated successfully', updatedStudent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
