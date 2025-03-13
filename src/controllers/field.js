const Field = require("../models/fieldModel");

// ✅ Create a new field
exports.createField = async (req, res) => {
  console.log("something in create field")
  console.log(req.body)
  try {
    const field = new Field({
      ...req.body,
      owner: req.user.id, // Assuming user authentication is implemented
    });
    await field.save();
    res.status(201).json({ message: "Field created successfully", field });
  } catch (error) {
    console.log("error in create field")
    res.status(500).json({ message: "Error creating field", error: error.message });
  }
};

// ✅ Get all fields
exports.getAllFields = async (req, res) => {
  try {
    const fields = await Field.find({ owner: req.user.id });
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fields", error: error.message });
  }
};

// ✅ Get a single field by ID
exports.getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: "Error fetching field", error: error.message });
  }
};

// ✅ Update a field
exports.updateField = async (req, res) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedField) return res.status(404).json({ message: "Field not found" });
    res.status(200).json({ message: "Field updated successfully", updatedField });
  } catch (error) {
    res.status(500).json({ message: "Error updating field", error: error.message });
  }
};

// ✅ Delete a field
exports.deleteField = async (req, res) => {
  try {
    const deletedField = await Field.findByIdAndDelete(req.params.id);
    if (!deletedField) return res.status(404).json({ message: "Field not found" });
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting field", error: error.message });
  }
};
