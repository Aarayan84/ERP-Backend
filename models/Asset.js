import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    assetCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Laptop",
        "Desktop",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Printer",
        "Mobile",
        "Other",
      ],
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Out of Stock",
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;