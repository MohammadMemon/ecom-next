import StaticPage from "@/components/ui/StaticPage";

export default function ShippingReturnsPage() {
  return (
    <StaticPage title="Shipping & Returns Policy">
      <h2 className="mb-4 text-xl font-semibold">Shipping</h2>
      <ul className="mb-6 space-y-1 list-disc list-inside">
        <li>
          Standard delivery (7–10 days): ₹100–249 depending on destination and
          order value.
        </li>
        <li>Free standard shipping on orders above ₹5,000.</li>
      </ul>

      <h2 className="mb-4 text-xl font-semibold">
        Returns & Replacement Policy
      </h2>
      <p className="mb-4">
        Returns are accepted only in case of a verified manufacturing defect.
        Customers must provide an unboxing video clearly showing the defect —
        from sealed package to product inspection.
      </p>

      <p className="mb-4">
        No return will be processed without this video proof.
      </p>

      <p className="mb-4">
        The product must be unused and returned in original condition with all
        tags, manuals, and packaging intact.
      </p>

      <h3 className="mb-2 text-lg font-semibold">
        Steps to initiate a return:
      </h3>
      <ol className="mb-4 space-y-1 list-decimal list-inside">
        <li>
          Email us at{" "}
          <a
            href="mailto:info@cycledaddy.in"
            className="text-green-600 underline"
          >
            info@cycledaddy.in
          </a>{" "}
          within 7 days of receiving the product.
        </li>
        <li>Attach the unboxing video and describe the issue clearly.</li>
        <li>Our support team will verify and respond within 48 hours.</li>
      </ol>

      <p>
        If the return is approved, we will ask you to self-ship the product.
        Return shipping cost will be reimbursed only in cases of genuine
        manufacturing defects.
      </p>
    </StaticPage>
  );
}
