import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/user-routes.js';
import adminRoutes from './routes/admin-routes.js';

const app=express();
dotenv.config();
connectDB();

const port = process.env.PORT;

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});