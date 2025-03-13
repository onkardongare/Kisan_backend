const News = require("../models/newsModel");

// 📰 Create a news article
exports.createNews = async (req, res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).json({ message: "News created successfully", news });
    } catch (error) {
        res.status(500).json({ message: "Error creating news", error: error.message });
    }
};

// 📃 Get all news articles
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        res.status(200).json(newsList);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news", error: error.message });
    }
};

// 🔍 Get a single news article by ID
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        if (!news) return res.status(404).json({ message: "News not found" });

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news", error: error.message });
    }
};

// ✏️ Update a news article
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNews = await News.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedNews) return res.status(404).json({ message: "News not found" });

        res.status(200).json({ message: "News updated successfully", updatedNews });
    } catch (error) {
        res.status(500).json({ message: "Error updating news", error: error.message });
    }
};

// 🗑️ Delete a news article
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) return res.status(404).json({ message: "News not found" });

        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting news", error: error.message });
    }
};
