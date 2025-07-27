module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    GOOGLE_SEARCH_CONSOLE_KEY: process.env.GOOGLE_SEARCH_CONSOLE_KEY,
  },
};
