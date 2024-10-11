import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
});


const Admin = mongoose.model('Admin', adminSchema);

export default Admin;