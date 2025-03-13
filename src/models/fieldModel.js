const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming each field belongs to a user
    required: true,
  },
  farmName: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  cropType: {
    type: String,
    required: true,
  },
  areaInAcres: {
    type: Number,
    required: true,
  },
  soilType: {
    type: String,
    enum: ["Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky"],
    required: true,
  },
  irrigationType: {
    type: String,
    enum: ["Drip", "Sprinkler", "Flood", "Manual"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Field = mongoose.model("Field", fieldSchema);
module.exports = Field;
