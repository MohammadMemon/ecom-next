import mongoose,  { Schema } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  oldPrice: {
    type: Number,
    required: [true, "Please Enter Real Product Price"],
    maxLength: [6, " Price cannot exceed 6 characters "],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Discounted Product Price"],
    maxLength: [6, " Price cannot exceed 6 characters "],
  },  
  ratings: {
    type: Number,
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
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  tags: {
    type: String,
    required: [true, "Please Enter Product Meta Tags, Max 8."],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock"],
    maxLength: [3, "Stock cannot exceed 4 characters"],
    default: 1,
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Product;

if (mongoose.models.Product) {
  Product = mongoose.models.Product; // Use the existing model if it's already registered
} else {
  Product = mongoose.model("Product", productSchema, "products"); // Otherwise, create a new model
}

export default Product;



// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   stock: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   images: {
//     type: [String],  // Array of image URLs
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   subCategory: {
//     type: String,
//     trim: true,  // Optional, can be empty
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   specifications: {
//     type: Map,
//     of: String,  // Key-value pairs for specs like weight, dimensions, etc.
//     default: {},
//   },
//  variants: [
//   {
//     options: [
//       {
//         size: { type: String, required: true }, // e.g., Small, Medium
//         color: { type: String, required: true }, // e.g., Blue, Red
//         stock: { type: Number, default: 0 }, // Stock for this combination
//         price: { type: Number, required: true }, // Price for this combination
//         images: [
//           {
//             public_id: { type: String },
//             url: { type: String },
//           },
//         ], // Specific images for this variant (optional)
//       },
//     ],
//   },
// ],
//   averageRating: {
//     type: Number,
//     default: 0,
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User',
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   ratings: {
//     type: Number,
//     default: 0,
//   },
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
//     default: 'active',
//   },
//   tags: {
//     type: [String],
//     default: [],
//   },
//   brand: {
//     type: String,
//     trim: true,
//   },
//   scrapeInfo: {
//     type: String,  // URL or identifier for scraping
//     required: true,
//   },
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
