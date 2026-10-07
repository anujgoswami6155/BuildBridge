import User from "../models/User.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from "../utils/validators.js";

// Register a new user
const registerUser = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email: normalizedEmail }).exec();

    if (existingUser !== null) {
        throw new Error("E-mail already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: passwordHash
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return {
        message: "User registered successfully",
        user: userObj
    };
};


const loginUser = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the user exists
    const user = await User.findOne({ email: normalizedEmail }).exec();

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
        { expiresIn: "7d" }
    );

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return { token, user: userObj };
};


const getCurrentUser = async (userId) => {
    if (!isValidObjectId(userId)) {
        throw new Error("User not found");
    }

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
    if (!isValidObjectId(userId)) {
        throw new Error("User not found");
    }

    // Find the user
    const user = await User.findById(userId).exec();

    if (user === null) {
        throw new Error("User not found");
    }

    // Update profile fields
    if (profileData.name !== undefined) {
        user.name = profileData.name.trim();
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
    const userObj = user.toObject();
    delete userObj.passwordHash;

    return userObj;
};

const getPublicProfile = async (userId) => {
    if (!isValidObjectId(userId)) {
        throw new Error("User not found");
    }

    // Fetch the user by ID
    const user = await User.findById(userId)
        .select('name bio skills education github linkedIn createdAt')
        .exec();

    if (user === null) {
        throw new Error("User not found");
    }

    return user;
};

const logoutUser = async () => {
    return "Logout successful";
};

export {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    getPublicProfile,
    logoutUser
};