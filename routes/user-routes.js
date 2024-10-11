import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import Assignment from '../models/assignment-model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('User registration failed');
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
 try{
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
 } catch (error) {
    console.error('Error during login:', error); 
    res.status(500).send('Server Error');
}
});

// Upload assignment
router.post('/upload', auth, async (req, res) => {
   // console.log(req.body);  

    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

    try {
        const assignment = new Assignment({ userId: req.user.id, task });
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        return res.status(500).json({ error: 'Error saving assignment' });
    }
});



export default router;
