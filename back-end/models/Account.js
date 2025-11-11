const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
    {
         _id: { type: String },
        token: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now, required: true },
    },
);

const accountSchema = new mongoose.Schema(
    {
        _id: { type: String },
        email: { type: String, required: true},
        password: { type: String, required: true },
        role: { type: String, enum: ["STUDENT", "TEACHER", "ADMIN"], default: "STUDENT" },
        status: { type: Boolean, default: true },
        refreshTokens: [refreshTokenSchema],
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("accounts", accountSchema);