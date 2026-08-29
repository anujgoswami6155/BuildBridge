import mongoose from "mongoose";

// Create a Schema for the Project model
const projectSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 100,
    },
    description : {
        type : String,
        required : true,
        trim : true,
        maxlength : 500,
    },
    category : {
        type : String,
        required : true,
    },
    requiredSkills : {
        type : [String],
        required : true,
    },
    techStack : {
        type : [String],
        required : false,
    },
    teamSize : {
        type : Number,
        required : true,
        min : 1,
    },
    recruitmentStatus : {
        type : String,
        required : true,
        enum : ['open', 'closed'],
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    teamMembers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false,
    }]
}, {
    // To keep track of the createdAt and UpdatedAt
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;