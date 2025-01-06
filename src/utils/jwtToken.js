import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const sendToken = (user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 } // Convert to seconds
  );

  const options = {
    maxAge: Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  };

  return { token, options };
};

export default sendToken;