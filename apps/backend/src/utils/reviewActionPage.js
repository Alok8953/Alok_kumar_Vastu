import { env } from "../config/env.js";

function layout(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f2ec; margin: 0; padding: 2rem; color: #4a2e1e; }
    .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
    h1 { font-size: 1.5rem; color: #1b1b1b; margin: 0 0 1rem; }
    p { line-height: 1.6; margin: 0 0 1rem; }
    a.btn { display: inline-block; margin-top: 0.5rem; padding: 0.75rem 1.25rem; background: #b87333; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600; }
    .muted { color: #666; font-size: 0.92rem; }
  </style>
</head>
<body>
  <div class="card">${bodyHtml}</div>
</body>
</html>`;
}

export function reviewApprovedPage(review) {
  const siteUrl = `${env.frontendOrigin}/#testimonials`;
  return layout(
    "Review approved",
    `<h1>Review published</h1>
     <p><strong>${review.full_name}</strong>'s review is now live on your website under Client Success Stories.</p>
     <p class="muted">Rating: ${review.rating}/5</p>
     <a class="btn" href="${siteUrl}">View stories on website</a>`
  );
}

export function reviewRejectedPage(review) {
  return layout(
    "Review rejected",
    `<h1>Review rejected</h1>
     <p><strong>${review.full_name}</strong>'s review will not appear on the website.</p>
     <a class="btn" href="${env.frontendOrigin}">Back to website</a>`
  );
}

export function reviewAlreadyHandledPage(status) {
  const label = status === "approved" ? "already published" : "already rejected";
  return layout(
    "Review already processed",
    `<h1>No action needed</h1>
     <p>This review was ${label}.</p>
     <a class="btn" href="${env.frontendOrigin}/#testimonials">Open website</a>`
  );
}

export function reviewTokenInvalidPage() {
  return layout(
    "Invalid link",
    `<h1>Link not valid</h1>
     <p>This approval link is invalid or expired. Check your latest review email or submit a new review from the website.</p>
     <a class="btn" href="${env.frontendOrigin}">Back to website</a>`
  );
}
