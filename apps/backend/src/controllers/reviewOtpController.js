import {
  assertCanSendOtp,
  createOtpChallenge,
  generateOtp,
  verifyOtpAndIssueAuth
} from "../repositories/reviewOtpRepository.js";
import { sendOtpSms, shouldExposeDebugOtp } from "../services/otpSmsService.js";
import { maskPhone, normalizeIndianPhone } from "../utils/phone.js";

export async function sendReviewOtpController(req, res) {
  const phone = normalizeIndianPhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({
      error: "Enter a valid 10-digit Indian mobile number."
    });
  }

  const canSend = await assertCanSendOtp(phone);
  if (!canSend.ok) {
    return res.status(429).json({ error: canSend.error });
  }

  const otp = generateOtp();

  try {
    await createOtpChallenge(phone, otp);
  } catch (err) {
    console.error("OTP save error:", err.message);
    return res.status(503).json({ error: "Could not send OTP. Please try again." });
  }

  const sms = await sendOtpSms(phone, otp);
  const expose = shouldExposeDebugOtp();

  if (!sms.sent) {
    console.warn(`[review-otp] SMS not sent (${sms.reason}). phone=${phone} otp=${otp}`);
  }

  if (!sms.sent && !expose) {
    return res.status(503).json({
      error:
        "SMS gateway is not configured. Add FAST2SMS_API_KEY on the server, or set OTP_DEBUG=true for testing."
    });
  }

  return res.status(200).json({
    message: sms.sent
      ? `OTP sent to ${maskPhone(phone)}.`
      : `OTP generated for ${maskPhone(phone)}. Use the code shown below (SMS not configured — debug mode).`,
    phoneMasked: maskPhone(phone),
    ...(expose ? { debugOtp: otp } : {})
  });
}

export async function verifyReviewOtpController(req, res) {
  const phone = normalizeIndianPhone(req.body?.phone);
  const otp = String(req.body?.otp || "").trim();

  if (!phone) {
    return res.status(400).json({ error: "Enter a valid mobile number." });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "Enter the 6-digit OTP." });
  }

  try {
    const result = await verifyOtpAndIssueAuth(phone, otp);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Phone verified. You can submit your feedback now.",
      authToken: result.authToken,
      phone
    });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    return res.status(503).json({ error: "Could not verify OTP. Please try again." });
  }
}
