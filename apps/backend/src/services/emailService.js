import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../config/env.js";

function isResendConfigured() {
  return Boolean(env.resendApiKey);
}

function isGmailConfigured() {
  return (
    env.gmailUser &&
    env.gmailAppPassword &&
    env.gmailAppPassword !== "your-16-char-app-password-here"
  );
}

function isEmailConfigured() {
  return isResendConfigured() || isGmailConfigured();
}

function apiPublicBaseUrl() {
  return env.backendPublicUrl || env.frontendOrigin;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function buildCallbackQuickActions(data) {
  const contact = escapeHtml(data.consultationContactNumber || data.mobile);
  const digits = digitsOnly(data.consultationContactNumber || data.mobile);

  if (data.consultationMethod === "WhatsApp Call" && digits) {
    return `
      <div style="margin: 0 0 20px; text-align: center;">
        <a href="https://wa.me/${digits}" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 10px;">
          Open WhatsApp — ${contact}
        </a>
      </div>
    `;
  }

  if (data.consultationMethod === "Phone Call" && digits) {
    return `
      <div style="margin: 0 0 20px; text-align: center;">
        <a href="tel:${digits}" style="display: inline-block; background: #b87333; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 10px;">
          Call Client — ${contact}
        </a>
      </div>
    `;
  }

  return "";
}

function emailRow(label, value, shaded = false) {
  const bg = shaded ? ' style="background: #f0f0f0;"' : "";
  return `
    <tr${bg}>
      <td style="padding: 10px 12px; font-weight: bold; width: 210px; vertical-align: top; color: #333;">${label}</td>
      <td style="padding: 10px 12px; color: #222; vertical-align: top;">${value}</td>
    </tr>
  `;
}

function emailSection(title) {
  return `
    <tr>
      <td colspan="2" style="padding: 18px 0 8px; font-size: 13px; font-weight: bold; letter-spacing: 0.08em; text-transform: uppercase; color: #b98c2f;">
        ${title}
      </td>
    </tr>
  `;
}

function buildCallbackMailContent(data) {
  const concerns = data.primaryConcerns.map((c) => escapeHtml(c)).join(", ");
  const propertyTypes = (data.propertyTypes || []).map((t) => escapeHtml(t)).join(", ");
  const contactLabel =
    data.consultationMethod === "WhatsApp Call"
      ? "WhatsApp Number"
      : "Phone Number for Callback";
  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px;">
      <h2 style="color: #b98c2f; margin: 0 0 6px;">New Free Vastu Callback Request</h2>
      <p style="color: #666; margin: 0 0 18px;">Submitted on ${escapeHtml(submittedAt)}</p>
      ${buildCallbackQuickActions(data)}
      <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e8e8e8;">
        ${emailSection("Client Details")}
        ${emailRow("Full Name", escapeHtml(data.fullName), true)}
        ${emailRow("Mobile", escapeHtml(data.mobile))}
        ${emailRow("Email", escapeHtml(data.email || "Not provided"), true)}
        ${emailSection("Property & Concerns")}
        ${emailRow("Property Type(s)", propertyTypes, true)}
        ${emailRow("Primary Concern(s)", concerns)}
        ${emailRow("Concern Detail", `<span style="white-space: pre-wrap;">${escapeHtml(data.concernDetail)}</span>`, true)}
        ${emailRow("Property Location", escapeHtml(data.propertyLocation))}
        ${emailRow("Floor Plan Available", data.hasFloorPlan ? "Yes" : "No", true)}
        ${emailSection("Callback Preference")}
        ${emailRow("Preferred Time", escapeHtml(data.preferredTimeSlot), true)}
        ${emailRow("Consultation Method", escapeHtml(data.consultationMethod))}
        ${emailRow(contactLabel, `<strong style="font-size: 16px;">${escapeHtml(data.consultationContactNumber || "Not provided")}</strong>`, true)}
        ${emailRow("How They Heard About Us", escapeHtml(data.referralSource || "Not specified"))}
      </table>
      <p style="color: #888; font-size: 12px; margin: 16px 0 0; text-align: center;">
        Reply to this email or use the button above to contact the client quickly.
      </p>
    </div>
  `;

  const textLines = [
    "NEW FREE VASTU CALLBACK REQUEST",
    `Submitted: ${submittedAt}`,
    "",
    "CLIENT DETAILS",
    `Full Name: ${data.fullName}`,
    `Mobile: ${data.mobile}`,
    `Email: ${data.email || "Not provided"}`,
    "",
    "PROPERTY & CONCERNS",
    `Property Type(s): ${(data.propertyTypes || []).join(", ")}`,
    `Primary Concern(s): ${data.primaryConcerns.join(", ")}`,
    `Concern Detail: ${data.concernDetail}`,
    `Property Location: ${data.propertyLocation}`,
    `Floor Plan: ${data.hasFloorPlan ? "Yes" : "No"}`,
    "",
    "CALLBACK PREFERENCE",
    `Preferred Time: ${data.preferredTimeSlot}`,
    `Consultation Method: ${data.consultationMethod}`,
    `${contactLabel}: ${data.consultationContactNumber || "Not provided"}`,
    `How They Heard About Us: ${data.referralSource || "Not specified"}`
  ];

  return {
    subject: `New Vastu Callback — ${data.fullName} (${data.consultationMethod})`,
    html,
    text: textLines.join("\n"),
    replyTo: data.email ? data.email : env.gmailUser
  };
}

function starsLabel(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function buildReviewMailContent(data) {
  const apiBase = apiPublicBaseUrl();
  const approveUrl = `${apiBase}/api/reviews/approve-email?token=${encodeURIComponent(data.approveToken)}`;
  const rejectUrl = `${apiBase}/api/reviews/reject-email?token=${encodeURIComponent(data.approveToken)}`;

  return {
    subject: `New Client Review — ${data.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #b98c2f; margin-bottom: 8px;">New Client Review (Pending)</h2>
        <p style="color: #555; margin-top: 0;">A visitor shared their experience on your website. Use the buttons below to publish or reject.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 160px;">Name</td><td>${escapeHtml(data.fullName)}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${escapeHtml(data.phone || "Not provided")}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td>${escapeHtml(data.email || "Not provided")}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">City</td><td style="padding: 8px;">${escapeHtml(data.city || "Not provided")}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Rating</td><td>${starsLabel(data.rating)} (${data.rating}/5)</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold; vertical-align: top;">Experience</td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.reviewText)}</td></tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0 8px;">
          <tr>
            <td style="padding-right: 12px;">
              <a href="${approveUrl}" style="display: inline-block; background: #b87333; color: #ffffff; text-decoration: none; font-weight: bold; padding: 14px 28px; border-radius: 10px;">Approve &amp; publish on website</a>
            </td>
            <td>
              <a href="${rejectUrl}" style="display: inline-block; background: #ffffff; color: #666666; text-decoration: none; font-weight: 600; padding: 13px 22px; border-radius: 10px; border: 1px solid #cccccc;">Reject</a>
            </td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin: 0;">One click opens your browser and updates the website. Only you receive this email.</p>
      </div>
    `
  };
}

function createGmailTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword
    }
  });
}

async function deliverEmail({ subject, html, text, replyTo }) {
  if (isResendConfigured()) {
    const resend = new Resend(env.resendApiKey);
    const payload = {
      from: env.resendFrom,
      to: [env.toEmail],
      subject,
      html
    };

    if (text) payload.text = text;
    if (replyTo) payload.replyTo = replyTo;

    const { error } = await resend.emails.send(payload);
    if (error) {
      throw new Error(error.message || "Resend email failed.");
    }
    return;
  }

  if (isGmailConfigured()) {
    const transporter = createGmailTransporter();
    await transporter.sendMail({
      from: `"Vastu Website" <${env.gmailUser}>`,
      to: env.toEmail,
      subject,
      html,
      text,
      replyTo
    });
    return;
  }

  throw new Error(
    "Email is not configured. Set RESEND_API_KEY (Render) or GMAIL_APP_PASSWORD (local)."
  );
}

export async function sendReviewEmail(data) {
  const mail = buildReviewMailContent(data);
  await deliverEmail(mail);
}

export async function sendCallbackEmail(data) {
  const mail = buildCallbackMailContent(data);
  await deliverEmail(mail);
}

export { isEmailConfigured };
