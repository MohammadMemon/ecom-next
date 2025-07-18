const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  sold: {
    type: Number,
    required: false,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  variants: [
    {
      options: [
        {
          size: { type: String, required: true }, // e.g., Small, Medium
          color: { type: String, required: true }, // e.g., Blue, Red
          stock: { type: Number, default: 0 }, // Stock for this combination
          price: { type: Number, required: true }, // Price for this combination
          images: [
            {
              public_id: { type: String },
              url: { type: String },
            },
          ],
        },
      ],
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "out-of-stock", "discontinued"],
    default: "active",
  },
  tags: {
    type: [String],
    default: [],
  },
  brand: {
    type: String,
    trim: true,
  },
  scrapeInfo: {
    scrapedAt: String,
    scrapedUrl: String,
  },
});

let Product;

if (mongoose.models.Product) {
  Product = mongoose.models.Product;
} else {
  Product = mongoose.model("Product", productSchema, "products");
}

export default Product;
