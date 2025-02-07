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

// export async function signup(formData) {
//   const supabase = await createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     redirect("/error");
//   }

//   revalidatePath("/", "layout");
//   redirect("/");
// }

// Check if user already exists

// export async function signup(formData) {
//   const supabase = await createClient();

//   const email = formData.get("email");
//   const password = formData.get("password");

//   // Validate email format
//   const validateEmail = (email) =>
//     String(email)
//       .toLowerCase()
//       .match(
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//       );

//   // Validate password strength
//   const validatePassword = (password) =>
//     String(password).match(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
//     );

//   if (!validateEmail(email)) {
//     console.log("Invalid email. Please try again.");
//     return;
//   }

//   if (!validatePassword(password)) {
//     console.log("Invalid password. Please try again.");
//     return;
//   }

//   // Attempt sign-up
//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   //  Handle existing users without revealing status
//   if (!error) {
//     // This will send a password reset email ONLY if the user exists
//     await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: "http://localhost:3000/reset-password",
//     });
//   }

//   // Always show the same success message
//   revalidatePath("/", "layout");
//   redirect("/auth/check-email");
// }
