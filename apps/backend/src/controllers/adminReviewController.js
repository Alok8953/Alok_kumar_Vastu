import {
  listReviewsByStatus,
  updateReviewStatus
} from "../repositories/reviewRepository.js";

const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

export async function listAdminReviewsController(req, res) {
  const status = typeof req.query.status === "string" ? req.query.status : "pending";

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status filter." });
  }

  try {
    const reviews = await listReviewsByStatus(status);
    return res.status(200).json({ reviews });
  } catch (err) {
    console.error("Admin list reviews error:", err.message);
    return res.status(503).json({ error: "Could not load reviews." });
  }
}

export async function patchAdminReviewController(req, res) {
  const id = Number(req.params.id);
  const status = typeof req.body?.status === "string" ? req.body.status : "";

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid review id." });
  }

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Status must be approved, rejected, or pending." });
  }

  try {
    const updated = await updateReviewStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Review not found." });
    }

    return res.status(200).json({
      message:
        status === "approved"
          ? "Review approved. It will now appear on the website."
          : status === "rejected"
            ? "Review rejected."
            : "Review moved back to pending.",
      review: updated
    });
  } catch (err) {
    console.error("Admin patch review error:", err.message);
    return res.status(503).json({ error: "Could not update review." });
  }
}
