import QuoteForm from "../components/QuoteForm";

export default function RequestQuote() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Request a Quote</h1>
          <p>Tell us what you need — our sales team will get back to you with current pricing and availability.</p>
        </div>
      </div>
      <section className="section">
        <div className="wrap"><QuoteForm /></div>
      </section>
    </>
  );
}
