"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function forgotPassword(email) {
  const supabase = await createClient();
  console.log(email);

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    console.log(data, error);
    if (error) {
      return redirect(
        `/auth/forgot-password?error=${encodeURIComponent(error.message)}`
      );
    } else {
      revalidatePath("/", "layout");
      redirect("/auth/check-email");
    }
  } catch (error) {
    throw error;
  }
}
