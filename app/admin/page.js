"use client";
import { useEffect, useState } from "react";

const CATEGORY_DATA = {
  Men: ["Shirt", "T-Shirt", "Jeans", "Pants", "Shoes", "Perfume", "Jacket", "Watch"],
  Women: ["Kurti", "Top", "Dress", "Jeans", "Saree", "Shoes", "Perfume", "Handbag"],
  Electronics: ["Mobile Accessories", "Earbuds", "Watch", "Charger", "Speaker"],
  "Home & Kitchen": ["Kitchen Tools", "Decor", "Storage", "Bedsheets"],
};

const COLOR_OPTIONS = ["Red", "Blue", "Black", "White", "Grey", "Olive Green", "Beige", "Maroon", "Pink", "Yellow", "Navy Blue", "Brown"];

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    sizes: "",
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const loadProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      setImages(base64Images);
    });
  };

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const addReview = () => {
    if (!reviewerName || !comment) {
      alert("Reviewer name aur comment daalo");
      return;
    }
    setReviews([...reviews, { reviewerName, rating: Number(rating), comment }]);
    setReviewerName("");
    setRating("5");
    setComment("");
  };

  const removeReview = (index) => {
    setReviews(reviews.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", originalPrice: "", price: "", category: "", subcategory: "", stock: "", sizes: "" });
    setSelectedColors([]);
    setImages([]);
    setReviews([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setMessage("Kam se kam ek image select karo");
      return;
    }
    if (!form.category || !form.subcategory) {
      setMessage("Category aur Subcategory dono select karo");
      return;
    }

    setMessage(editingId ? "Updating product..." : "Adding product...");

    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        originalPrice: Number(form.originalPrice),
        price: Number(form.price),
        stock: Number(form.stock) || 100,
        sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : [],
        colors: selectedColors,
        images,
        reviews,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage(editingId ? "Product updated!" : "Product added successfully!");
      resetForm();
      loadProducts();
    } else {
      setMessage("Error: " + data.error);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      originalPrice: p.originalPrice,
      price: p.price,
      category: p.category,
      subcategory: p.subcategory,
      stock: p.stock,
      sizes: (p.sizes || []).join(", "),
    });
    setSelectedColors(p.colors || []);
    setImages(p.images || []);
    setReviews(p.reviews || []);
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      setMessage("Product deleted successfully!");
      loadProducts();
    } else {
      setMessage("Error: " + data.error);
    }
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
    color: "#000",
    background: "#fff",
  };

  const discountPercent =
    form.originalPrice && form.price
      ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)
      : 0;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "6px", color: "#3d2b1f" }}>Admin Panel</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
        Manage your MK Legacy products
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #eee" }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#3d2b1f" }}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: "70px" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <input name="originalPrice" type="number" placeholder="MRP / Original Price (₹)" value={form.originalPrice} onChange={handleChange} required style={inputStyle} />
          <input name="price" type="number" placeholder="Selling Price (₹)" value={form.price} onChange={handleChange} required style={inputStyle} />
        </div>

        {discountPercent > 0 && (
          <p style={{ fontSize: "13px", color: "#0a0", fontWeight: "600", margin: 0 }}>
            {discountPercent}% discount automatically dikhega
          </p>
        )}

        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#3d2b1f", display: "block", marginBottom: "6px" }}>
            Upload Images (multiple select kar sakte ho)
          </label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} style={inputStyle} />
        </div>

        {images.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ccc" }} />
            ))}
          </div>
        )}

        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#3d2b1f", display: "block", marginBottom: "6px" }}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
            required
            style={inputStyle}
          >
            <option value="">-- Select Category --</option>
            {Object.keys(CATEGORY_DATA).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {form.category && (
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#3d2b1f", display: "block", marginBottom: "6px" }}>Subcategory (Product Type)</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">-- Select Type --</option>
              {CATEGORY_DATA[form.category].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <input name="sizes" placeholder="Sizes (comma separated, e.g. S, M, L, XL) - optional" value={form.sizes} onChange={handleChange} style={inputStyle} />

        <div>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#3d2b1f", display: "block", marginBottom: "6px" }}>Colors (multiple select kar sakte ho)</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "16px",
                  border: selectedColors.includes(color) ? "2px solid #3d2b1f" : "1px solid #ccc",
                  background: selectedColors.includes(color) ? "#3d2b1f" : "#fff",
                  color: selectedColors.includes(color) ? "#fff" : "#333",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <input name="stock" type="number" placeholder="Stock (optional, default 100)" value={form.stock} onChange={handleChange} style={inputStyle} />

        <div style={{ borderTop: "1px solid #eee", paddingTop: "14px", marginTop: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#3d2b1f", display: "block", marginBottom: "8px" }}>
            Add Reviews (optional)
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input placeholder="Reviewer Name" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} style={inputStyle} />
            <select value={rating} onChange={(e) => setRating(e.target.value)} style={inputStyle}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <textarea placeholder="Review comment" value={comment} onChange={(e) => setComment(e.target.value)} style={{ ...inputStyle, minHeight: "50px" }} />
            <button type="button" onClick={addReview} style={{ padding: "8px", background: "#eee", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
              + Add This Review
            </button>
          </div>

          {reviews.length > 0 && (
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ background: "#f7f7f7", padding: "8px", borderRadius: "6px", fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span>{r.reviewerName} ({r.rating}★): {r.comment}</span>
                  <button type="button" onClick={() => removeReview(i)} style={{ color: "#d33", background: "none", border: "none", fontSize: "12px" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={{ flex: 1, padding: "12px", background: "#3d2b1f", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: "12px 20px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p style={{ marginTop: "12px", fontSize: "13px", color: "#3d2b1f" }}>{message}</p>}

      <h2 style={{ marginTop: "30px", fontSize: "18px", color: "#3d2b1f" }}>
        Existing Products ({products.length})
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "10px",
              background: "#fff",
            }}
          >
            <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}>
              <img src={p.images && p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#3d2b1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{p.category} / {p.subcategory} • ₹{p.price}</p>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => handleEdit(p)} style={{ background: "#eee", color: "#333", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)} style={{ background: "#d33", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
