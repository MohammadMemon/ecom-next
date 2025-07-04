import StaticPage from "@/components/ui/StaticPage";

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <h2 className="mb-4 text-xl font-semibold">Privacy Policy</h2>
      <p>
        We respect your privacy. We collect personal (name, email, phone,
        billing/shipping address) and device data (IP, browser info). This helps
        us process orders, enhance your experience, and send you promotions. We
        use cookies, analytics, and may share data only with essential third
        parties (couriers, payment gateways). You can request data deletion
        anytime. We do not share data with unrelated entities. Full policy
        outlines your rights under applicable laws.
      </p>
    </StaticPage>
  );
}
