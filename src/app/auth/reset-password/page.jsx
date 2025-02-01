"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function ResetPassword() {
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt(
          "What would you like your new password to be?"
        );
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (data) alert("Password updated successfully!");
        if (error) alert("There was an error updating your password.");
      }
    });
  }, []);
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-2xl font-bold">Check Your Email</h1>
    <p className="mt-4 text-gray-500">
      If you don't see the email, check your spam folder or try again.
    </p>
  </div>;
}
