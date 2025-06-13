"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(email, password) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  console.log(error);

  if (error) {
    return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  } else {
    revalidatePath("/", "layout");
    redirect("/?loggedIn=true");
  }
}
