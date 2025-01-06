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
      // Create a deep copy of query parameters
      const queryCopy = { ...this.queryStr };
      
      // Remove fields that shouldn't be used for filtering
      const removeFields = ["keyword", "page", "limit"];
      removeFields.forEach((key) => delete queryCopy[key]);
  
      try {
        // Convert comparison operators to MongoDB format
        // e.g., price[gt]=1000 becomes price: { $gt: 1000 }
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