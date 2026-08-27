import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface Testimonial {
  id: string;
  name: string;
  company?: string | null;
  review: string;
  rating: number;
  photoUrl?: string | null;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.get<{ success: boolean; data: Testimonial[] }>("/testimonials").then((res) => setTestimonials(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Customer Testimonials</h1>
          <p>What contractors, engineers and businesses say about working with us.</p>
        </div>
      </div>
      <section className="section">
        <div className="wrap">
          {testimonials.length === 0 ? (
            <p style={{ color: "var(--ink-soft)" }}>No testimonials published yet.</p>
          ) : (
            <div className="testi-grid">
              {testimonials.map((t) => (
                <div key={t.id} className="testi-card">
                  <div className="testi-stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  <p>"{t.review}"</p>
                  <div className="testi-name">{t.name}</div>
                  {t.company && <div className="testi-company">{t.company}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
