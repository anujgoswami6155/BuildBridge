import User from "../models/User.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
const registerUser = async (name, email, password) => {

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email }).exec();

    if (existingUser !== null) {
        throw new Error("E-mail already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
        name: name,
        email: email,
        passwordHash: passwordHash
    });

    return "User registered";
};


const loginUser = async (email, password) => {
    // Check if the user exists
    const user = await User.findOne({ email: email }).exec();

    if (user === null) {
        throw new Error("Invalid email or password");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate a JWT token
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return token;
};


const getCurrentUser = async (userId) => {
    // Fetch the user by ID
    const user = await User.findById(userId)
        .select('-passwordHash')
        .exec();

    if (user === null) {
        throw new Error("User not found");
    }

    return user;
};


const updateUserProfile = async (userId, profileData) => {
    // Find the user
    const user = await User.findById(userId).exec();

    if (user === null) {
        throw new Error("User not found");
    }

    // Update profile fields
    if (profileData.name !== undefined) {
        user.name = profileData.name;
    }

    if (profileData.bio !== undefined) {
        user.bio = profileData.bio;
    }

    if (profileData.skills !== undefined) {
        user.skills = profileData.skills;
    }

    if (profileData.education !== undefined) {
        user.education = profileData.education;
    }

    if (profileData.github !== undefined) {
        user.github = profileData.github;
    }

    if (profileData.linkedIn !== undefined) {
        user.linkedIn = profileData.linkedIn;
    }

    await user.save();

    // Don't return the password hash
    user.passwordHash = undefined;

    return user;
};


export {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile
};