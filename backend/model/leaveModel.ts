import mongoose, { Schema, model } from "mongoose";
import { ref } from "process";

const leaveSchema= new Schema({
    employee:{type:mongoose.Schema.Types.ObjectId, ref:"Employee", required:true},
    leaveType:{type:String, required:true},
    fromDate:{type:Date, required:true},
    toDate:{type:Date, required:true},
    description:{type:String, required:true},
    status:{type:String,enum: ['Pending', 'Approved', 'Rejected'], default:"Pending"},
    appliedAt:{type:Date, default:Date.now}

})

const Leave = model("Leave", leaveSchema);
export default Leave;