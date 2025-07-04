"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StaticPage from "@/components/ui/StaticPage";

export default function FaqPage() {
  return (
    <StaticPage title="Frequently Asked Questions">
      <Accordion
        type="single"
        collapsible
        className="space-y-4 text-lg divide-y divide-primary"
      >
        <AccordionItem value="q1">
          <AccordionTrigger>Do you have a physical store?</AccordionTrigger>
          <AccordionContent>
            No, CycleDaddy is an online-only store. This allows us to offer
            better prices and doorstep delivery across India.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q2">
          <AccordionTrigger>
            Can I return a cycle if I don’t like it?
          </AccordionTrigger>
          <AccordionContent>
            Returns are accepted only in case of a manufacturing defect. We do
            not accept returns for size, color, or preference-related reasons.
            <br />
            <strong>Note:</strong> An unboxing video is mandatory to process any
            return.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q3">
          <AccordionTrigger>Is assembly for cycles required?</AccordionTrigger>
          <AccordionContent>
            Most cycles are shipped 85–90% assembled. You may need to attach
            pedals, handlebars, or the front wheel. Setup instructions or video
            guides may be provided upon request, based on availability.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q4">
          <AccordionTrigger>
            Do you offer Cash on Delivery (COD)?
          </AccordionTrigger>
          <AccordionContent>
            No, we currently do not offer COD. All orders must be prepaid using
            secure payment methods like UPI, Debit/Credit Cards, or Net Banking.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q5">
          <AccordionTrigger>How long does delivery take?</AccordionTrigger>
          <AccordionContent>
            Standard delivery takes 7–10 working days depending on your
            location. Shipping charges are calculated at checkout.
            <br />
            For bulky items, our team may contact you for confirmation or
            additional shipping charges before dispatch.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q6">
          <AccordionTrigger>Do you provide a warranty?</AccordionTrigger>
          <AccordionContent>
            Yes. Most products come with a manufacturer’s warranty, typically
            ranging from 6 to 12 months. Terms vary by brand and category.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q7">
          <AccordionTrigger>Can I track my order?</AccordionTrigger>
          <AccordionContent>
            Yes. Once your order is shipped, you’ll receive tracking details via
            email and WhatsApp.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="q8">
          <AccordionTrigger>
            Do you offer servicing or repairs?
          </AccordionTrigger>
          <AccordionContent>
            We don’t provide direct servicing. However, we can guide you to
            reliable service centers or help you troubleshoot basic issues
            remotely.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StaticPage>
  );
}
