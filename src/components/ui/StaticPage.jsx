"use client";

import React from "react";

export default function StaticPage({ title, children }) {
  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        <div className="prose prose-lg prose-gray dark:prose-invert">
          {children}
        </div>
      </div>
    </div>
  );
}
