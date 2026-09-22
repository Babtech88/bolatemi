import { useEffect, useState, type DragEvent } from "react";
import { api, formatNaira, uploadImage } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import type { ApiListResponse, Category, Product } from "../../lib/types";

const emptyForm = {
  name: "", categoryId: "", sku: "", description: "",
  material: "", brand: "", size: "",
  priceMode: "FIXED" as "FIXED" | "REQUEST_QUOTE",
  price: "", discountPrice: "", stockQuantity: "0", imageUrl: "",
};

function ImageDropzone({ imageUrl, onUploaded }: { imageUrl: string; onUploaded: (url: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please drop an image file (JPEG, PNG, WEBP or AVIF).");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onUploaded(res.url);
      showToast("Image uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="field">
      <label>Product Image</label>
      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {imageUrl ? (
          <div className="dropzone-preview">
            <img src={imageUrl} alt="Product preview" />
            <button type="button" className="dropzone-remove" onClick={() => onUploaded("")}>Remove</button>
          </div>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4M12 4l-4 4M12 4l4 4" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
            <span>{uploading ? "Uploading…" : "Drag & drop an image, or click to browse"}</span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={uploading}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get<ApiListResponse<Product>>("/products/admin/list?limit=100", true).then((res) => setProducts(res.data ?? [])).catch(() => {});
  }

  useEffect(() => {
    load();
    api.get<{ success: boolean; data: Category[] }>("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post(
        "/products",
        {
          name: form.name,
          categoryId: form.categoryId,
          sku: form.sku,
          description: form.description,
          material: form.material || undefined,
          brand: form.brand || undefined,
          size: form.size || undefined,
          priceMode: form.priceMode,
          price: form.priceMode === "FIXED" ? Number(form.price) : undefined,
          discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
          stockQuantity: Number(form.stockQuantity),
          images: form.imageUrl ? [{ url: form.imageUrl }] : undefined,
        },
        true
      );
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await api.del(`/products/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: 22 }}>Products</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Add Product"}</button>
      </div>

      {showForm && (
        <form onSubmit={submit} style={{ background: "var(--white)", border: "1px solid #D7D1C2", padding: 24, marginBottom: 28 }}>
          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
          <div className="field-row">
            <div className="field"><label>Product Name *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div className="field"><label>SKU *</label><input required value={form.sku} onChange={(e) => update("sku", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Category *</label>
              <select required value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Pricing Mode</label>
              <select value={form.priceMode} onChange={(e) => update("priceMode", e.target.value)}>
                <option value="FIXED">Fixed Price</option>
                <option value="REQUEST_QUOTE">Request Quote</option>
              </select>
            </div>
          </div>
          <div className="field"><label>Description *</label><textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
          <div className="field-row">
            <div className="field"><label>Material</label><input value={form.material} onChange={(e) => update("material", e.target.value)} /></div>
            <div className="field"><label>Brand</label><input value={form.brand} onChange={(e) => update("brand", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Size</label><input value={form.size} onChange={(e) => update("size", e.target.value)} /></div>
            <div className="field"><label>Stock Quantity</label><input type="number" value={form.stockQuantity} onChange={(e) => update("stockQuantity", e.target.value)} /></div>
          </div>
          {form.priceMode === "FIXED" && (
            <div className="field-row">
              <div className="field"><label>Price (₦) *</label><input required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} /></div>
              <div className="field"><label>Discount Price (₦)</label><input type="number" value={form.discountPrice} onChange={(e) => update("discountPrice", e.target.value)} /></div>
            </div>
          )}
          <ImageDropzone imageUrl={form.imageUrl} onUploaded={(url) => update("imageUrl", url)} />
          <button type="submit" className="btn btn-dark" disabled={submitting}>{submitting ? "Saving…" : "Save Product"}</button>
        </form>
      )}

      <div className="admin-products-note">
        <span>Inventory</span> — every product is listed here, including items currently hidden from the public shop.
      </div>
      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Visibility</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className="mono">{p.sku}</td>
              <td>{p.category?.name}</td>
              <td className="mono">{p.priceMode === "REQUEST_QUOTE" ? "Request Quote" : formatNaira(p.discountPrice ?? p.price)}</td>
              <td>{p.stockQuantity}</td>
              <td><span className={`status-pill ${p.isAvailable ? "status-delivered" : "status-cancelled"}`}>{p.isAvailable ? "Visible" : "Hidden"}</span></td>
              <td><button className="cart-remove" onClick={() => remove(p.id)}>Delete</button></td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan={7}>No products yet.</td></tr>}
        </tbody>
      </table>
      </div>
    </div>
  );
}
