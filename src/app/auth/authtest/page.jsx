import { redirect } from "next/navigation";

//auth needed

export default async function PrivatePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-xl font-bold bg-muted">
      <p className="mx-4">
        Hello {data.user.user_metadata.full_name}, Email: {data.user.email}
      </p>
    </div>
  );
}
