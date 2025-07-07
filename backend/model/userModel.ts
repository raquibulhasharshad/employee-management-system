import { Schema, model } from "mongoose";

const userSchema= new Schema({
    adminName: {type: String, required: true},
    companyName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    address: {type: String},
    password: {type: String, required: true},

});

const User= model('User', userSchema);

export default User;