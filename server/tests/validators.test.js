import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { isValidObjectId, escapeRegex } from "../src/utils/validators.js";

test("Validators: isValidObjectId", () => {
    const validId = new mongoose.Types.ObjectId().toString();
    assert.equal(isValidObjectId(validId), true, "Valid 24-character hex ID should return true");

    assert.equal(isValidObjectId("invalid-id"), false, "Non-hex string should return false");
    assert.equal(isValidObjectId("123"), false, "Short string should return false");
    assert.equal(isValidObjectId(""), false, "Empty string should return false");
    assert.equal(isValidObjectId(null), false, "Null should return false");
    assert.equal(isValidObjectId(undefined), false, "Undefined should return false");
    assert.equal(isValidObjectId(12345), false, "Number should return false");
    assert.equal(isValidObjectId({}), false, "Object should return false");
});

test("Validators: escapeRegex", () => {
    assert.equal(escapeRegex("c++"), "c\\+\\+");
    assert.equal(escapeRegex("React (v18)"), "React \\(v18\\)");
    assert.equal(escapeRegex("node.js [fast]"), "node\\.js \\[fast\\]");
    assert.equal(escapeRegex("a*b?c^d$e{f}g|h\\i"), "a\\*b\\?c\\^d\\$e\\{f\\}g\\|h\\\\i");
    assert.equal(escapeRegex(null), "");
    assert.equal(escapeRegex(123), "");
});
