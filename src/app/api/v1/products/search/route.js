import dbConnect from "@/lib/dbConnect";
import Product from "@/models/productModel";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const searchLower = q.toLowerCase();

    if (!q) {
      return new Response(
        JSON.stringify({ success: false, message: "Search query is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the text index with only relevant fields
    await createTextIndex();

    const products = await Product.aggregate([
      {
        $match: {
          $text: { $search: q },
        },
      },
      {
        $addFields: {
          // Base relevance score from MongoDB
          baseScore: { $meta: "textScore" },

          // Custom boosts based on field importance
          nameBoost: {
            $cond: [
              {
                $ne: [{ $indexOfCP: [{ $toLower: "$name" }, searchLower] }, -1],
              },
              10, // Highest boost for name matches
              0,
            ],
          },
          tagsBoost: {
            $cond: [
              {
                $in: [
                  searchLower,
                  { $map: { input: "$tags", in: { $toLower: "$$this" } } },
                ],
              },
              8, // High boost for exact tag match
              {
                $size: {
                  $filter: {
                    input: "$tags",
                    cond: {
                      $ne: [
                        { $indexOfCP: [{ $toLower: "$$this" }, searchLower] },
                        -1,
                      ],
                    },
                  },
                },
              },
            ],
          },
          subSubCategoryBoost: {
            $cond: [
              {
                $ne: [
                  {
                    $indexOfCP: [{ $toLower: "$subSubCategory" }, searchLower],
                  },
                  -1,
                ],
              },
              3,
              0,
            ],
          },
          subCategoryBoost: {
            $cond: [
              {
                $ne: [
                  { $indexOfCP: [{ $toLower: "$subCategory" }, searchLower] },
                  -1,
                ],
              },
              2, // Low boost for subCategory matches
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              "$baseScore",
              "$nameBoost",
              "$tagsBoost",
              "$subSubCategoryBoost",
              "$subCategoryBoost",
            ],
          },
        },
      },
      {
        $sort: { relevanceScore: -1, _id: 1 },
      },
      {
        $project: {
          baseScore: 0,
          nameBoost: 0,
          tagsBoost: 0,
          subSubCategoryBoost: 0,
          subCategoryBoost: 0,
        },
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        products,
        total: products.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "x-next-cache-tags": "search",
        },
      }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Helper function to create optimized text index
async function createTextIndex() {
  try {
    const indexes = await Product.collection.indexes();
    const hasCorrectIndex = indexes.some(
      (index) =>
        index.name === "product_search_index" &&
        index.weights?.name === 10 &&
        index.weights?.tags === 8 &&
        !index.weights?.category && // Ensure category isn't indexed
        !index.weights?.description // Ensure description isn't indexed
    );

    if (hasCorrectIndex) return;

    // Drop any existing text indexes
    const textIndexes = indexes.filter((index) => index.textIndexVersion);
    for (const index of textIndexes) {
      await Product.collection.dropIndex(index.name);
    }

    // Create new index with only relevant fields
    await Product.collection.createIndex(
      {
        name: "text",
        tags: "text",
        subSubCategory: "text",
        subCategory: "text",
      },
      {
        weights: {
          name: 10,
          tags: 8,
          subSubCategory: 3,
          subCategory: 2,
        },
        name: "product_search_index",
      }
    );
  } catch (error) {
    if (
      error.codeName !== "IndexOptionsConflict" &&
      error.codeName !== "IndexKeySpecsConflict" &&
      error.codeName !== "NamespaceNotFound"
    ) {
      console.error("Index creation error:", error);
    }
  }
}
