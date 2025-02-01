export default function Confirm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Check Your Email</h1>
      <p className="mt-2 text-gray-600">
        We've sent you an email with further instructions. Please check your
        inbox and follow the link.
      </p>
      <p className="mt-4 text-gray-500">
        If you don't see the email, check your spam folder or try again.
      </p>
    </div>
  );
}
