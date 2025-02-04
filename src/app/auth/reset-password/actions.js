"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function resetPassword(password) {
  const supabase = await createClient();
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(
      password
    );

  if (!validatePassword(password)) {
    redirect("/auth/reset-password?error=Invalid Password");
  }

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      redirect(
        `/auth/reset-password?error=${encodeURIComponent(error.message)}`
      );
    }

    revalidatePath("/", "layout");
    redirect("/?passwordReset=true");
  } catch (error) {
    throw error;
  }
}
