import mongoose from "mongoose";

// Create a Schema for the User model
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
    },

    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    passwordHash : {
        type: String,
        required: true,
    },

    bio : {
        type: String,
        required: false,
        trim: true,
        maxlength: 500,
    },

    skills : {
        type: [String],
        required: false,
    },

    github : {
        type: String,
        required: false,
        trim: true,
    },

    linkedIn: {
        type: String,
        required: false,
        trim: true,
    }
}, {
    // To keep track of the createdAt and UpdatedAt
    timestamps: true
});


const User = mongoose.model('User', userSchema);
export default User;
