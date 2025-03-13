const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    image: { type: String }, // URL of the news image (optional)
    category: { type: String, enum: ["Agriculture", "Market", "Technology", "Government"], default: "Agriculture" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", newsSchema);
