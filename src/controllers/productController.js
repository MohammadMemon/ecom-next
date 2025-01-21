import Product from "../models/productModel";
import ApiFeatures from "../utils/apifeatures.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const catchAsyncErrors = (theFunc) => async (request, context) => {
  try {
    return await theFunc(request, context);
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal Server Error",
      }),
      { status: error.statusCode || 500 }
    );
  }
};

// Create Product -- Admin
export const createProduct = async (req) => {
  try {
    // Parse the request body
    const body = await req.json();

    // Initialize images array
    let images = [];

    // Handle different formats of images input
    if (typeof body.images === "string") {
      images.push(body.images);
    } else if (Array.isArray(body.images)) {
      images = body.images;
    } else {
      // Log the issue if `images` is neither string nor array
      console.error("Invalid images format:", body.images);
      throw new Error("Invalid images format. Must be a string or an array.");
    }

    const imagesLinks = [];

    // Upload images to Cloudinary
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Add processed images and other data to the request body
    body.images = imagesLinks;

    // Create the product in the database
    const product = await Product.create(body);

    // Return success response
    return {
      success: true,
      product,
    };
  } catch (error) {
    // Log the error for debugging
    console.error("Error in Create Product Details controller:", error);

    // Return error response
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
    // Set the number of products to display per page
    const resultPerPage = 8;

    // Get the total count of all products in the database
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
    // Fetch the product by its ID
    const product = await Product.findById(id);

    // Check if the product exists
    if (!product) {
      return {
        success: false,
        message: "Product not found",
        statusCode: 404,
      };
    }

    // Return the product details
    return {
      success: true,
      product,
    };
  } catch (error) {
    // Log the error
    console.error("Error in Get Product Details controller:", error);

    // Return error response
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
    // Find the product by ID
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
      images.push(body.images); // Wrap single image in an array
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

    await  Product.findByIdAndDelete(id);
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
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
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

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
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
    req.query.productId,
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

  res.status(200).json({
    success: true,
  });
});
