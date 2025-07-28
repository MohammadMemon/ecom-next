import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { secret, tags } = body;

    if (secret !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Invalid tags format" },
        { status: 400 }
      );
    }

    tags.forEach((tag) => {
      if (typeof tag === "string") {
        revalidateTag(tag);
      }
    });

    return NextResponse.json({ success: true, revalidated: tags });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
