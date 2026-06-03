import { getPool } from "../db/pool.js";
import {
  markCallbackEmailFailed,
  markCallbackEmailSent,
  createCallbackWithUser
} from "../repositories/callbackRepository.js";
import { createEmailLog } from "../repositories/emailLogRepository.js";
import { sendCallbackEmail, isEmailConfigured } from "../services/emailService.js";
import { validateCallbackBody } from "../utils/validateCallback.js";

export async function callbackController(req, res) {
  const validation = validateCallbackBody(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.errors.join(" ") });
  }

  const data = validation.data;

  const pool = getPool();
  const client = await pool.connect();

  let callbackId;

  try {
    await client.query("BEGIN");

    const result = await createCallbackWithUser(
      client,
      {
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email
      },
      {
        propertyType: data.propertyType,
        primaryConcerns: data.primaryConcerns,
        concernDetail: data.concernDetail,
        propertyLocation: data.propertyLocation,
        hasFloorPlan: data.hasFloorPlan,
        preferredTimeSlot: data.preferredTimeSlot,
        consultationMethod: data.consultationMethod,
        referralSource: data.referralSource
      }
    );

    callbackId = result.callbackRequest.id;

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database save error:", err.message);
    return res.status(503).json({
      error: "Could not save your request. Please check that PostgreSQL is running and try again."
    });
  } finally {
    client.release();
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({
      error:
        "Email service is not set up yet. Please add your Gmail App Password in backend/.env and restart the server."
    });
  }

  try {
    await sendCallbackEmail(data);
    await markCallbackEmailSent(callbackId);
    await createEmailLog({ callbackRequestId: callbackId, status: "sent" });

    return res.status(200).json({
      message:
        "Thank you for your submission! We have received your request. Our team will review your details and contact you during your preferred callback time.",
      id: callbackId
    });
  } catch (err) {
    console.error("Email send error:", err.message);
    await markCallbackEmailFailed(callbackId, err.message);
    await createEmailLog({
      callbackRequestId: callbackId,
      status: "failed",
      errorMessage: err.message
    });

    return res.status(500).json({
      error: "Could not send email. Check Gmail App Password in backend/.env and try again."
    });
  }
}
