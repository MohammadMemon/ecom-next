import StaticPage from "@/components/ui/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage title="Terms & Conditions">
      <p className="mb-4">
        Welcome to <strong>CycleDaddy.in</strong>. By using our website, you
        agree to the following terms and conditions. Please read them carefully
        before making a purchase or browsing our services.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">1. General</h2>
      <p className="mb-4">
        These Terms & Conditions govern your access to and use of cycledaddy.in
        and all associated services. CycleDaddy reserves the right to change or
        update these terms at any time without prior notice. Continued use of
        the site constitutes acceptance of those changes.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">2. Online Store Use</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          All information provided by you must be accurate, complete, and up to
          date.
        </li>
        <li>
          CycleDaddy reserves the right to cancel or refuse service at its sole
          discretion.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">
        3. Product Descriptions & Pricing
      </h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          We strive to ensure all product details, descriptions, and prices are
          accurate.
        </li>
        <li>
          In case of a pricing error, we reserve the right to cancel the order
          and notify you.
        </li>
        <li>
          Product colors may slightly vary due to lighting, display settings, or
          manufacturing batches.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">4. Orders & Payments</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>All orders are confirmed only after successful payment.</li>
        <li>
          We accept UPI, Debit/Credit Cards, Net Banking, and select wallets.
        </li>
        <li>Cash on Delivery (COD) is not available.</li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">5. Shipping</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          Orders are usually dispatched within 2–5 business days and delivered
          within 7–10 business days.
        </li>
        <li>
          Delivery timelines may vary due to courier delays, public holidays, or
          unforeseen circumstances.
        </li>
        <li>Shipping charges are calculated at checkout.</li>
        <li>
          For bulky or oversized items, additional charges may apply. We'll
          contact you before dispatch in such cases.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">6. Returns & Refunds</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          Returns are accepted only in case of a verified manufacturing defect.
        </li>
        <li>
          An unboxing video is mandatory — from sealed package to defect
          inspection.
        </li>
        <li>
          Return requests must be raised within 7 days of receiving the product.
        </li>
        <li>
          Approved refunds will be processed within 7–10 working days via the
          original payment method.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">7. Cancellations</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>Orders can be cancelled only before they are shipped.</li>
        <li>Once dispatched, orders cannot be cancelled or modified.</li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">8. Warranty & Repairs</h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          Products may carry brand/manufacturer warranty, which varies by brand.
        </li>
        <li>Warranty claims must be raised with the respective brand.</li>
        <li>
          CycleDaddy is not responsible for decisions made by the brand
          regarding warranty service.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">9. User Conduct</h2>
      <p className="mb-4">You agree not to:</p>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>Misuse or abuse the website for unlawful purposes.</li>
        <li>
          Post misleading or false information in reviews or communications.
        </li>
        <li>
          Attempt to interfere with the website’s functionality or security.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">
        10. Limitation of Liability
      </h2>
      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li>
          CycleDaddy will not be liable for indirect or consequential loss.
        </li>
        <li>
          We are not responsible for courier delays or third-party service
          issues.
        </li>
        <li>
          No liability for damage due to improper use, assembly, or unauthorized
          repairs.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-xl font-semibold">
        11. Intellectual Property
      </h2>
      <p className="mb-4">
        All content on the website — including logos, text, product images, and
        design — is the property of CycleDaddy or its licensors. Unauthorized
        use is strictly prohibited.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">12. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of India. Any disputes shall be
        subject to the jurisdiction of the courts in Mumbai, Maharashtra.
      </p>

      <h2 className="mt-6 mb-2 text-xl font-semibold">Contact Us</h2>
      <p>
        For any questions or concerns regarding these terms, you may contact us
        at:
        <br />
        Email:{" "}
        <a
          href="mailto:info@cycledaddy.in"
          className="text-green-600 underline"
        >
          info@cycledaddy.in
        </a>
        <br />
        Phone:{" "}
        <a href="tel:+917977509402" className="text-green-600 underline">
          +91-7977509402
        </a>
      </p>
    </StaticPage>
  );
}
