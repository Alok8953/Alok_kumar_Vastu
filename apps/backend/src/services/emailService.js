import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function isEmailConfigured() {
  return (
    env.gmailUser &&
    env.gmailAppPassword &&
    env.gmailAppPassword !== "your-16-char-app-password-here"
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildMailOptions(data) {
  const concerns = data.primaryConcerns.map((c) => escapeHtml(c)).join(", ");

  return {
    from: `"Vastu Website" <${env.gmailUser}>`,
    to: env.toEmail,
    replyTo: data.email ? data.email : env.gmailUser,
    subject: `New Vastu Callback — ${data.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #b98c2f; margin-bottom: 8px;">New Free Vastu Callback Request</h2>
        <p style="color: #555; margin-top: 0;">A new consultation request was submitted on your website.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 200px;">Full Name</td><td>${escapeHtml(data.fullName)}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">Mobile</td><td style="padding: 8px;">${escapeHtml(data.mobile)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td>${escapeHtml(data.email || "Not provided")}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">Property Type</td><td style="padding: 8px;">${escapeHtml(data.propertyType)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Primary Concerns</td><td>${concerns}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold; vertical-align: top;">Concern Detail</td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.concernDetail)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Property Location</td><td>${escapeHtml(data.propertyLocation)}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">Floor Plan</td><td style="padding: 8px;">${data.hasFloorPlan ? "Yes" : "No"}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Preferred Time</td><td>${escapeHtml(data.preferredTimeSlot)}</td></tr>
          <tr style="background: #f0f0f0;"><td style="padding: 8px; font-weight: bold;">Consultation Method</td><td style="padding: 8px;">${escapeHtml(data.consultationMethod)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">How They Heard About Us</td><td>${escapeHtml(data.referralSource || "Not specified")}</td></tr>
        </table>
      </div>
    `
  };
}

function starsLabel(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function buildReviewMailOptions(data) {
  const approveUrl = `${env.frontendOrigin}/api/reviews/approve-email?token=${encodeURIComponent(data.approveToken)}`;
  const rejectUrl = `${env.frontendOrigin}/api/reviews/reject-email?token=${encodeURIComponent(data.approveToken)}`;

  return {
    from: `"Vastu Website" <${env.gmailUser}>`,
    to: env.toEmail,
    subject: `New Client Review — ${data.fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #b98c2f; margin-bottom: 8px;">New Client Review (Pending)</h2>
        <p style="color: #555; margin-top: 0;">A visitor shared their experience on your website. Use the buttons below to publish or reject.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 160px;">Name</td><td>${escapeHtml(data.fullName)}</td></tr>
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

export async function sendReviewEmail(data) {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email is not configured on the server. Set GMAIL_APP_PASSWORD in apps/backend/.env"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword
    }
  });

  await transporter.sendMail(buildReviewMailOptions(data));
}

export async function sendCallbackEmail(data) {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email is not configured on the server. Set GMAIL_APP_PASSWORD in apps/backend/.env"
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.gmailUser,
      pass: env.gmailAppPassword
    }
  });

  await transporter.sendMail(buildMailOptions(data));
}

export { isEmailConfigured };
