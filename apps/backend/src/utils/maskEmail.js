/** Mask email for public display, e.g. rahul@gmail.com → rah*****@gmail.com */
export function maskEmail(email) {
  const trimmed = String(email || "").trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0) return "";

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (!domain) return "";

  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 3);
  return `${visible}*****@${domain}`;
}
