import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    task:{
        type:String,
        required:true
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    },
    status:{
       type:String,
       enum:['pending', 'accepted', 'rejected'],
       default:'pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;