const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news");

// 📰 Routes for news CRUD operations
router.post("/create", newsController.createNews);      // Create news
router.get("/getAll", newsController.getAllNews);       // Get all news
router.get("/get/:id", newsController.getNewsById);     // Get a single news article
router.put("/update/:id", newsController.updateNews);   // Update news
router.delete("/delete/:id", newsController.deleteNews);// Delete news

module.exports = router;
