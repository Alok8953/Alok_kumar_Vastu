import {
  findReviewByApproveToken,
  setReviewStatusByToken
} from "../repositories/reviewRepository.js";
import {
  reviewAlreadyHandledPage,
  reviewApprovedPage,
  reviewRejectedPage,
  reviewTokenInvalidPage
} from "../utils/reviewActionPage.js";

const TOKEN_RE = /^[a-f0-9]{48}$/;

function readToken(req) {
  const raw = typeof req.query.token === "string" ? req.query.token.trim() : "";
  return TOKEN_RE.test(raw) ? raw : null;
}

export async function approveReviewEmailController(req, res) {
  const token = readToken(req);
  if (!token) {
    return res.status(400).send(reviewTokenInvalidPage());
  }

  try {
    const existing = await findReviewByApproveToken(token);
    if (!existing) {
      return res.status(404).send(reviewTokenInvalidPage());
    }

    if (existing.status === "approved") {
      return res.status(200).send(reviewAlreadyHandledPage("approved"));
    }

    if (existing.status === "rejected") {
      const updated = await setReviewStatusByToken(token, "approved");
      return res.status(200).send(reviewApprovedPage(updated));
    }

    const updated = await setReviewStatusByToken(token, "approved");
    if (!updated) {
      return res.status(404).send(reviewTokenInvalidPage());
    }

    return res.status(200).send(reviewApprovedPage(updated));
  } catch (err) {
    console.error("Email approve error:", err.message);
    return res.status(503).send(reviewTokenInvalidPage());
  }
}

export async function rejectReviewEmailController(req, res) {
  const token = readToken(req);
  if (!token) {
    return res.status(400).send(reviewTokenInvalidPage());
  }

  try {
    const existing = await findReviewByApproveToken(token);
    if (!existing) {
      return res.status(404).send(reviewTokenInvalidPage());
    }

    if (existing.status === "rejected") {
      return res.status(200).send(reviewAlreadyHandledPage("rejected"));
    }

    const updated = await setReviewStatusByToken(token, "rejected");
    if (!updated) {
      return res.status(404).send(reviewTokenInvalidPage());
    }

    return res.status(200).send(reviewRejectedPage(updated));
  } catch (err) {
    console.error("Email reject error:", err.message);
    return res.status(503).send(reviewTokenInvalidPage());
  }
}
