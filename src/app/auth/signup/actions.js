"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(email, password, name) {
  const supabase = await createClient();

  const data = {
    email: email,
    password: password,
    options: {
      data: { full_name: name },
    },
  };

  // Validation functions
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const validatePassword = (password) =>
    String(password).match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    );

  // Input validation
  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new Error("Password does not meet requirements");
  }

  try {
    // Try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      data
    );

    // Check if user is an existing user by looking at specific fields
    const isExistingUser =
      signUpData?.user &&
      (signUpData.user.identities?.length === 0 || // Empty identities array indicates existing user
        signUpData.user.role === "" || // Empty role also indicates existing user
        signUpData.user.recovery_sent_at); // Presence of recovery_sent_at indicates existing user

    if (isExistingUser) {
      // This is an existing user, send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
        }
      );

      if (resetError) {
        throw new Error("Failed to process request");
      }
    } else if (signUpError) {
      throw new Error("Failed to create account");
    }

    // Success path
    revalidatePath("/", "layout");
    return redirect("/auth/check-email");
  } catch (error) {
    throw error;
  }
}
