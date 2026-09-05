import QuoteForm from "../components/QuoteForm";

export default function BulkOrders() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Need Materials in Bulk?</h1>
          <p>Get competitive pricing for wholesale, construction and industrial orders.</p>
        </div>
      </div>
      <section className="section">
        <div className="wrap"><QuoteForm isBulkOrder /></div>
      </section>
    </>
  );
}
