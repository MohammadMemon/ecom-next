class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // Case insensitive search
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "matchType"];
    removeFields.forEach((key) => delete queryCopy[key]);

    if (queryCopy.tags) {
      const tags = Array.isArray(queryCopy.tags)
        ? queryCopy.tags
        : queryCopy.tags.split(",").map((tag) => tag.trim());

      const matchType = this.queryStr.matchType || "any";

      if (matchType === "all") {
        queryCopy.tags = { $all: tags };
      } else {
        queryCopy.tags = { $in: tags };
      }
    }

    try {
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(JSON.parse(queryStr));
    } catch (error) {
      throw new Error(`Invalid filter parameters: ${error.message}`);
    }

    return this;
  }

  pagination(resultPerPage) {
    // Ensure page number is at least 1
    const currentPage = Math.max(Number(this.queryStr.page) || 1, 1);
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
