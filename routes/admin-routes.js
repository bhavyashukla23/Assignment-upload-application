import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin-model.js';
import Assignment from '../models/assignment-model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register admin
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();
        res.status(201).send('Admin registered successfully');
    } catch (error) {
        res.status(400).send('Admin registration failed');
    }
});

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).send('Admin not found');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Assign assignment to an admin
router.post('/assignments/:id/assign', auth, async (req, res) => {
    const { id } = req.params;
    
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id, 
            { adminId: req.user.id, status: 'assigned' }, 
            { new: true }
        );
        
        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        res.json({
            message: 'Assignment successfully assigned to admin',
            assignment: updatedAssignment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// View assignments tagged to admin
router.get('/assignments', auth, async (req, res) => {
    const assignments = await Assignment.find({ adminId: req.user.id });
    res.json(assignments);
});

// Accept assignment
router.post('/assignments/:id/accept', auth, async (req, res) => {
    const { id } = req.params;
    await Assignment.findByIdAndUpdate(id, { status: 'accepted', adminId: req.user.id });
    res.send('Assignment accepted');
});

// Reject assignment
router.post('/assignments/:id/reject', auth, async (req, res) => {
    const { id } = req.params;
    await Assignment.findByIdAndUpdate(id, { status: 'rejected', adminId: req.user.id });
    res.send('Assignment rejected');
});


export default router;
