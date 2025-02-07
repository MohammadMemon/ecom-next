import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-xl font-bold bg-muted">
      <p className="mx-4">
        Hello {data.user.user_metadata.full_name}, Email: {data.user.email}
      </p>
    </div>
  );
}
