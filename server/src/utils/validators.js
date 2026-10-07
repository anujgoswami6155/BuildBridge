import mongoose from "mongoose";

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 * @param {string} id 
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
    return Boolean(id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id));
};

/**
 * Escapes special regex characters in a string for safe usage in RegExp / MongoDB $regex.
 * @param {string} string 
 * @returns {string}
 */
export const escapeRegex = (string) => {
    if (typeof string !== "string") return "";
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
