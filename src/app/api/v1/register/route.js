import dbConnect from '@/lib/dbConnect';
import { registerUser } from '@/controllers/userController';
import { NextResponse } from 'next/server';
import sendToken from "@/utils/jwtToken.js";

// route.js
export async function POST(req) {
    try {
      await dbConnect();
      const data = await req.json();
      const user = await registerUser(data);
      
      const { token, options } = sendToken(user);
      
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      }, { 
        status: 201,
        headers: {
          'Set-Cookie': `token=${token}; Path=${options.path}; Max-Age=${options.maxAge}; HttpOnly; SameSite=${options.sameSite}${options.secure ? '; Secure' : ''}`
        }
      });
    } catch (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }