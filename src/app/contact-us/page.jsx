import StaticPage from "@/components/ui/StaticPage";

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us">
      <p className="mb-6">
        Have questions, need help, or want to get in touch with CycleDaddy?
        We’re here to assist you.
      </p>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Phone</h2>
          <p>
            <a href="tel:+917977509402" className="text-green-600 underline">
              +91 7977509402
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Email</h2>
          <p>
            <a
              href="mailto:info@cycledaddy.in"
              className="text-green-600 underline"
            >
              info@cycledaddy.in
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Address</h2>
          <p className="leading-relaxed">
            A901, Inspira, Punyadham Ashram Road, Tiny Udyogic Wasahat, Kondhwa
            Budruk, Near Dmart, Somji Chowk, Pune - 411048
          </p>
        </div>
      </div>
    </StaticPage>
  );
}
