import { env } from "../config/env.js";

/**
 * Send OTP SMS via Fast2SMS when FAST2SMS_API_KEY is set.
 * Without a key, OTP is only available in debug/dev responses.
 */
export async function sendOtpSms(phone, otp) {
  const key = env.fast2smsApiKey;
  if (!key) {
    return { sent: false, reason: "sms_not_configured" };
  }

  const message = `Your Vastu feedback verification OTP is ${otp}. Valid for 10 minutes. Do not share.`;
  const url = new URL("https://www.fast2sms.com/dev/bulkV2");
  url.searchParams.set("authorization", key);
  url.searchParams.set("route", "q");
  url.searchParams.set("message", message);
  url.searchParams.set("language", "english");
  url.searchParams.set("flash", "0");
  url.searchParams.set("numbers", phone);

  try {
    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.return === false) {
      console.error("Fast2SMS error:", data?.message || res.status);
      return { sent: false, reason: "sms_failed" };
    }
    return { sent: true };
  } catch (err) {
    console.error("Fast2SMS request failed:", err.message);
    return { sent: false, reason: "sms_failed" };
  }
}

export function shouldExposeDebugOtp() {
  return env.nodeEnv !== "production" || env.otpDebug;
}
