import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../lib/apiRequest.js";

const ADMIN_KEY_STORAGE = "vastu_admin_key";
const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" }
];

function formatStars(rating) {
  const n = Math.min(5, Math.max(1, Number(rating) || 5));
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return "";
  }
}

export function AdminReviewsPage({ onExit }) {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [keyInput, setKeyInput] = useState("");
  const [tab, setTab] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!adminKey) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/api/admin/reviews?status=${tab}`, { adminKey });
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      setError(err.message || "Could not load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey, tab]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function saveAdminKey(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) return;
    sessionStorage.setItem(ADMIN_KEY_STORAGE, trimmed);
    setAdminKey(trimmed);
    setKeyInput("");
  }

  function clearAdminKey() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setReviews([]);
  }

  async function updateStatus(id, status) {
    setActionId(id);
    setError("");

    try {
      await apiRequest(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        body: { status },
        adminKey
      });
      await loadReviews();
    } catch (err) {
      setError(err.message || "Could not update review.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <p className="admin-kicker">Vastu Website</p>
            <h1>Review Approvals</h1>
            <p className="admin-intro">
              Approve a review to show it in Client Success Stories on the homepage.
            </p>
          </div>
          <button type="button" className="btn btn-outline" onClick={onExit}>
            Back to website
          </button>
        </div>
      </header>

      <main className="admin-main container">
        {!adminKey ? (
          <section className="admin-card">
            <h2>Admin login</h2>
            <p>
              Enter the <code>ADMIN_API_KEY</code> from <code>apps/backend/.env</code>.
            </p>
            <form className="admin-key-form" onSubmit={saveAdminKey}>
              <label htmlFor="admin-key">Admin API key</label>
              <input
                id="admin-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                autoComplete="off"
                required
              />
              <button className="btn btn-primary" type="submit">
                Continue
              </button>
            </form>
          </section>
        ) : (
          <>
            <div className="admin-toolbar">
              <div className="admin-tabs" role="tablist">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === item.id}
                    className={`admin-tab${tab === item.id ? " is-active" : ""}`}
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-outline admin-logout" onClick={clearAdminKey}>
                Change key
              </button>
            </div>

            {error ? <p className="form-error admin-error">{error}</p> : null}

            {loading ? (
              <p className="admin-loading">Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p className="admin-empty">No {tab} reviews.</p>
            ) : (
              <ul className="admin-review-list">
                {reviews.map((review) => (
                  <li key={review.id} className="admin-review-card">
                    <div className="admin-review-meta">
                      <strong>{review.full_name}</strong>
                      {review.city ? <span> — {review.city}</span> : null}
                      <span className="admin-review-date">{formatDate(review.created_at)}</span>
                    </div>
                    <p className="admin-review-stars" aria-label={`${review.rating} out of 5`}>
                      {formatStars(review.rating)}
                    </p>
                    <p className="admin-review-text">{review.review_text}</p>
                    <div className="admin-review-actions">
                      {tab === "pending" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={actionId === review.id}
                            onClick={() => updateStatus(review.id, "approved")}
                          >
                            {actionId === review.id ? "Saving…" : "Approve & publish"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            disabled={actionId === review.id}
                            onClick={() => updateStatus(review.id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      {tab === "approved" ? (
                        <button
                          type="button"
                          className="btn btn-outline"
                          disabled={actionId === review.id}
                          onClick={() => updateStatus(review.id, "pending")}
                        >
                          Unpublish (pending)
                        </button>
                      ) : null}
                      {tab === "rejected" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={actionId === review.id}
                            onClick={() => updateStatus(review.id, "approved")}
                          >
                            Approve & publish
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            disabled={actionId === review.id}
                            onClick={() => updateStatus(review.id, "pending")}
                          >
                            Move to pending
                          </button>
                        </>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
