import Product from "../models/productModel";
import ApiFeatures from "../utils/apifeatures.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Product -- Admin
export const createProduct = async (req) => {
  try {
    const body = await req.json();

    let images = [];

    if (typeof body.images === "string") {
      images.push(body.images);
    } else if (Array.isArray(body.images)) {
      images = body.images;
    } else {
      console.error("Invalid images format:", body.images);
      throw new Error("Invalid images format. Must be a string or an array.");
    }

    const imagesLinks = [];

    // Uploading images to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Adding processed images in body
    body.images = imagesLinks;

    // Creating the product in db
    const product = await Product.create(body);

    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("Error in Create Product Details controller:", error);

    return {
      success: false,
      message: error.message || "Failed to create product",
      statusCode: 500,
    };
  }
};

// Get All Product
export const getAllProducts = async (queryParams) => {
  try {
    //paginationn
    const resultPerPage = 350;
    //counting total
    const productsCount = await Product.countDocuments();

    // Initialize our API features with the product query and search parameters
    const apiFeature = new ApiFeatures(Product.find(), queryParams)
      .search() // Apply search functionality
      .filter() // Apply filters (price, category, etc.)
      .pagination(resultPerPage); // Apply pagination

    // Execute the query after all features have been applied
    const products = await apiFeature.query;

    // Return successful response with all necessary data
    return {
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount: products.length,
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in getAllProducts controller:", error);

    // Return error response
    return {
      success: false,
      message: error.message || "Failed to fetch products",
      statusCode: 500,
    };
  }
};

// Get Product Details
export const getProductDetails = async (id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("Error in Get Product Details controller:", error);

    return {
      success: false,
      message: error.message || "Failed to fetch product",
      statusCode: 500,
    };
  }
};

// Get All Product (Admin)
export const getAdminProducts = async () => {
  const products = await Product.find();

  return {
    success: true,
    products,
  };
};

// Update Product -- Admin
export const updateProduct = async (id, body) => {
  try {
    let product = await Product.findById(id);
    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    // Handle images (if any)
    let images = [];
    if (typeof body.images === "string") {
      images.push(body.images);
    } else {
      images = body.images;
    }

    if (images && images.length > 0) {
      // Delete old images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }

      // Upload new images to Cloudinary
      const imagesLinks = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.v2.uploader.upload(image, {
            folder: "products",
          });
          return { public_id: result.public_id, url: result.secure_url };
        })
      );

      body.images = imagesLinks;
    }

    // Update the product with the new data
    product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("Error in update Product controller:", error);
    return {
      success: false,
      message: error.message || "Failed to update product",
      statusCode: 500,
    };
  }
};

// Update product stock after order
export const updateProductStock = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
      );
    }

    // Update stock
    product.stock -= quantity;

    // Update availability status if out of stock
    if (product.stock === 0) {
      product.status = "out-of-stock";
    }

    await product.save();

    console.log(
      `Stock updated for product ${product.name}: ${product.stock} remaining`
    );

    return {
      success: true,
      productId,
      newStock: product.stock,
      productName: product.name,
    };
  } catch (error) {
    console.error(`Stock update error for product ${productId}:`, error);
    throw error;
  }
};

// Bulk stock update (for multiple products)
export const bulkUpdateProductStock = async (orderItems) => {
  const results = [];
  const errors = [];

  for (const item of orderItems) {
    try {
      const result = await updateProductStock(item.product, item.quantity);
      results.push(result);
    } catch (error) {
      errors.push({
        productId: item.product,
        error: error.message,
      });
    }
  }

  return {
    success: errors.length === 0,
    results,
    errors,
  };
};

// Delete Product

export const deleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    await Product.findByIdAndDelete(id);
    return {
      success: true,
      message: "Product Deleted Successfully",
    };
  } catch (error) {
    console.error("Error in delete Product controller:", error);
    return {
      success: false,
      message: error.message || "Failed to delete product",
      statusCode: 500,
    };
  }
};

// Create New Review or Update the review
export const createProductReview = async (id, body) => {
  try {
    const { rating, comment, productId } = body;

    const review = {
      user: id,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in Create Product rewiew controller:", error);
    return {
      success: false,
      message: error.message || "Failed to create product review",
      statusCode: 500,
    };
  }
};

// Get All Reviews of a product
export const getProductReviews = async (id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      reviews: product.reviews,
    };
  } catch (error) {
    console.error("Error in get Product rewiew controller:", error);
    return {
      success: false,
      message: error.message || "Failed to get product review",
      statusCode: 500,
    };
  }
};

// Delete Review
export const deleteReview = async (id, productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in delete Product rewiew controller:", error);
    return {
      success: false,
      message: error.message || "Failed to delete product review",
      statusCode: 500,
    };
  }
};
