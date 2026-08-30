import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  reviewerName: String,
  rating: Number,
  comment: String,
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    stock: { type: Number, default: 100 },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
