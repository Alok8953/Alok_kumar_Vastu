import { listPublishedReviews } from "../repositories/reviewRepository.js";

export async function publishedReviewsController(_req, res) {
  try {
    const reviews = await listPublishedReviews();
    return res.status(200).json({
      reviews: reviews.map((row) => ({
        id: `review-${row.id}`,
        name: row.full_name,
        city: row.city || "India",
        quote: row.review_text,
        rating: row.rating,
        createdAt: row.created_at
      }))
    });
  } catch (err) {
    console.error("Published reviews error:", err.message);
    return res.status(503).json({ error: "Could not load published reviews." });
  }
}
