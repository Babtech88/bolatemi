import { useParams } from "react-router-dom";

const content: Record<string, { title: string; body: string[] }> = {
  "privacy-policy": {
    title: "Privacy Policy",
    body: [
      "Bolatemi Global and Sons Enterprises collects the information you provide when placing an order, requesting a quote, or contacting us — such as your name, phone number, email and delivery address.",
      "This information is used only to process orders, respond to enquiries and improve our service. We do not sell customer information to third parties.",
      "Payment card details are handled entirely by our payment processor (Paystack) and are never stored on our servers.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "By placing an order on this website, you agree to provide accurate delivery and contact information.",
      "Prices are shown in Nigerian Naira and are subject to change without prior notice, except for orders already confirmed and paid for.",
      "Products marked \"Request Current Price\" require a quote before purchase due to size/specification-dependent pricing.",
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    body: [
      "Refund requests are reviewed on a case-by-case basis and must be raised within 7 days of delivery.",
      "Items must be unused and in original packaging to qualify for a refund, except in cases of defect or incorrect delivery.",
      "Contact our sales team via the Contact page or WhatsApp to initiate a refund request.",
    ],
  },
  "delivery-policy": {
    title: "Delivery Policy",
    body: [
      "We deliver across Nigeria from our warehouse in Agbara, Ogun State. Delivery timelines vary by location and order size.",
      "Delivery fees are calculated at checkout based on destination and order weight.",
      "For bulk or industrial orders, contact our sales team directly to arrange logistics.",
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = content[slug ?? ""] ?? { title: "Not Found", body: ["This page could not be found."] };

  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}><h1>{page.title}</h1></div>
      </div>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          {page.body.map((p, i) => (
            <p key={i} style={{ color: "var(--ink-soft)", fontSize: 14.5, marginBottom: 16, lineHeight: 1.8 }}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
