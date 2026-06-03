export function errorHandler(err, req, res, _next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }

  console.error("Unhandled error:", err.message);
  return res.status(500).json({ error: "Internal server error." });
}
