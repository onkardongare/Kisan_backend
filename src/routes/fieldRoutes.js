const express = require("express");
const router = express.Router();
const {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
} = require("../controllers/field");
const passport = require("passport");

// 🛠 Create a new field
router.post("/createField", createField);

// 📌 Get all fields
router.get("/getAllFields", getAllFields);

// 🔎 Get a field by ID
router.get("/getFieldById/:id", getFieldById);

// ✏ Update a field
router.put("/updateField/:id", updateField);

// ❌ Delete a field
router.delete("/deleteField/:id", deleteField);

module.exports = router;
