import { createClient } from "@supabase/supabase-js"; // Ensure this import is correct
import { redirect } from "next/navigation"; // Adjust this based on your setup

export async function signup(formData) {
  const supabase = createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        //validating email
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (password) => {
    return String(password).match(
      //validating password
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
    );
  };

  if (validateEmail(email) && validatePassword(password)) {
    const name = formData.get("name");
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      redirect("/error");
      return;
    }

    // Home page if sign-up was successful
    redirect("/");
  } else {
    console.log("Email or password does not meet the criteria");
  }
}
