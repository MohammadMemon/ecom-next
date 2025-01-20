import Product from '../models/productModel';
import ApiFeatures from "../utils/apifeatures.js";
// const cloudinary = require("cloudinary");

export const  catchAsyncErrors = (theFunc) => async (request, context) => {
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
// export const createProduct = catchAsyncErrors(async (req, res, next) => {
// let images = [];

// if (typeof req.body.images === "string") {
// images.push(req.body.images);
// } else {
// images = req.body.images;
// }

// const imagesLinks = [];

// for (let i = 0; i < images.length; i++) {
// const result = await cloudinary.v2.uploader.upload(images[i], {
//   folder: "products",
// });

// imagesLinks.push({
//   public_id: result.public_id,
//   url: result.secure_url,
// });
// }

// req.body.images = imagesLinks;
// req.body.user = req.user.id;

// const product = await Product.create(req.body);

// res.status(201).json({
// success: true,
// product,
// });
// });

// Get All Product



export const getAllProducts = async (queryParams) => {
  try {
    // Set the number of products to display per page
    const resultPerPage = 8;
    
    // Get the total count of all products in the database
    const productsCount = await Product.countDocuments();

    const start = performance.now();
    // Initialize our API features with the product query and search parameters
    const apiFeature = new ApiFeatures(Product.find(), queryParams)
      .search()    // Apply search functionality
      .filter()    // Apply filters (price, category, etc.)
      .pagination(resultPerPage);  // Apply pagination
    
      // Execute the query after all features have been applied
      const products = await apiFeature.query;
      console.log(`DB Query Time: ${performance.now() - start}ms`);
      
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
    console.error('Error in getAllProducts controller:', error);
    
    // Return error response
    return {
      success: false,
      message: error.message || 'Failed to fetch products',
      statusCode: 500
    };
  }
};


// Get Product Details
export const getProductDetails = catchAsyncErrors(async (id) => {
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
});


// Get All Product (Admin)
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  
  res.status(200).json({
  success: true,
  products,
  });
  });

// Update Product -- Admin

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
let product = await Product.findById(req.params.id);

if (!product) {
return next(new ErrorHander("Product not found", 404));
}

// Images Start Here
let images = [];

if (typeof req.body.images === "string") {
images.push(req.body.images);
} else {
images = req.body.images;
}

if (images !== undefined) {
// Deleting Images From Cloudinary
for (let i = 0; i < product.images.length; i++) {
  await cloudinary.v2.uploader.destroy(product.images[i].public_id);
}

const imagesLinks = [];

for (let i = 0; i < images.length; i++) {
  const result = await cloudinary.v2.uploader.upload(images[i], {
    folder: "products",
  });

  imagesLinks.push({
    public_id: result.public_id,
    url: result.secure_url,
  });
}

req.body.images = imagesLinks;
}

product = await Product.findByIdAndUpdate(req.params.id, req.body, {
new: true,
runValidators: true,
useFindAndModify: false,
});

res.status(200).json({
success: true,
product,
});
});

// Delete Product

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
const product = await Product.findById(req.params.id);

if (!product) {
return next(new ErrorHander("Product not found", 404));
}

// Deleting Images From Cloudinary
for (let i = 0; i < product.images.length; i++) {
await cloudinary.v2.uploader.destroy(product.images[i].public_id);
}

await product.remove();

res.status(200).json({
success: true,
message: "Product Delete Successfully",
});
});

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
