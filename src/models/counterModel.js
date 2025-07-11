import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1 },
});

export default mongoose.models.Counter ||
  mongoose.model("Counter", counterSchema);
