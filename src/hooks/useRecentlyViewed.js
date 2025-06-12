"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "recentlyViewedProducts";
const MAX_RECENT = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setRecentlyViewed(data);
    } catch (error) {
      console.error("Failed to load recently viewed:", error);
    }
  }, []);

  const addRecentlyViewed = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      // Remove if already exists to re-add it on top
      const filtered = existing.filter((item) => item._id !== product._id);

      // Add new item to the end (most recent)
      const updated = [...filtered, product].slice(-MAX_RECENT);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentlyViewed(updated);
    } catch (error) {
      console.error("Failed to add recently viewed:", error);
    }
  };

  return { recentlyViewed, addRecentlyViewed };
}
