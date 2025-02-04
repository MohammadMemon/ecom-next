import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Get parameters from the URL
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      return redirect("/error"); // Redirect to error page if verification fails
    }

    // 🔹 Handle different authentication flows after OTP verification:
    if (type === "signup") {
      redirect("/"); // Redirect new users after signup confirmation
    } else if (type === "recovery") {
      redirect("/auth/reset-password"); // Redirect to reset password page
    } else {
      redirect(redirectUrl); // Default: Redirect user to home or provided URL
    }
  }

  // If token_hash or type is missing, redirect to error
  redirect("/error");
}
