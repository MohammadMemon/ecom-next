export const authConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  cookieName: "AuthToken",
  cookieSignatureKeys: [process.env.COOKIE_SECRET],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 12, // 12 days in seconds
  },
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
};
