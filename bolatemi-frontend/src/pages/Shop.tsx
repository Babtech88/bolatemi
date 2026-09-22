import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { ApiListResponse, Category, Product } from "../lib/types";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    api
      .get<{ success: boolean; data: Category[] }>("/categories")
      .then((res) => {
        setCategories(res.data ?? []);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setFetchError("");

      try {
        const params = new URLSearchParams();

        if (category.trim()) {
          params.set("category", category.trim());
        }

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const query = params.toString();
        const endpoint = query ? `/products?${query}` : "/products";

        console.log("Loading products from:", endpoint);

        const res = await api.get<ApiListResponse<Product>>(endpoint);

        if (!cancelled) {
          setProducts(res.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);

        if (!cancelled) {
          setFetchError(
            err instanceof Error ? err.message : "Could not reach the server"
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [category, search]);

  function selectCategory(slug: string) {
    const next = new URLSearchParams(searchParams);

    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }

    setSearchParams(next);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();

    const next = new URLSearchParams(searchParams);

    if (searchInput.trim()) {
      next.set("search", searchInput.trim());
    } else {
      next.delete("search");
    }

    setSearchParams(next);
  }

  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Shop Products</h1>
          <p>
            Browse our full catalog of plumbing, welding and industrial
            supplies.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <form
            onSubmit={submitSearch}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 24,
              maxWidth: 420,
            }}
          >
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 14px",
                border: "1px solid #C9C2AF",
                background: "var(--white)",
              }}
            />

            <button type="submit" className="btn btn-dark btn-sm">
              Search
            </button>
          </form>

          <div className="filter-bar">
            <button
              className={`chip ${!category ? "active" : ""}`}
              onClick={() => selectCategory("")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`chip ${category === cat.slug ? "active" : ""}`}
                onClick={() => selectCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              {fetchError ? (
                <>
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--danger)"
                    strokeWidth="1.3"
                    style={{ margin: "0 auto 16px" }}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle
                      cx="12"
                      cy="16.5"
                      r="0.8"
                      fill="var(--danger)"
                    />
                  </svg>

                  <p
                    style={{
                      color: "var(--danger)",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Couldn't load products
                  </p>

                  <p className="mono" style={{ fontSize: 12.5 }}>
                    {fetchError}
                  </p>

                  <p style={{ marginTop: 10, fontSize: 13 }}>
                    Check that the backend is running and reachable, then
                    refresh.
                  </p>
                </>
              ) : (
                <>
                  <svg
                    width="46"
                    height="46"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    style={{
                      color: "var(--steel-mid)",
                      margin: "0 auto 16px",
                    }}
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>

                  <p>
                    No products found. Try a different category or search term.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
