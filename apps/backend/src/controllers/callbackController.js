import { getPool } from "../db/pool.js";
import {
  markCallbackEmailFailed,
  markCallbackEmailSent,
  createCallbackWithUser
} from "../repositories/callbackRepository.js";
import { createEmailLog } from "../repositories/emailLogRepository.js";
import { sendCallbackEmail, isEmailConfigured } from "../services/emailService.js";
import { validateCallbackBody } from "../utils/validateCallback.js";

const SUCCESS_MESSAGE =
  "Thank you for your submission! We have received your request. Our team will review your details and contact you during your preferred callback time.";

async function notifyByEmail(callbackId, data) {
  if (!isEmailConfigured()) {
    console.warn("Callback saved (id=%s) but email is not configured.", callbackId);
    return false;
  }

  try {
    await sendCallbackEmail(data);
    await markCallbackEmailSent(callbackId);
    await createEmailLog({ callbackRequestId: callbackId, status: "sent" });
    return true;
  } catch (err) {
    console.error("Email send error:", err.message);
    try {
      await markCallbackEmailFailed(callbackId, err.message);
      await createEmailLog({
        callbackRequestId: callbackId,
        status: "failed",
        errorMessage: err.message
      });
    } catch (logErr) {
      console.error("Could not log email failure:", logErr.message);
    }
    return false;
  }
}

export async function callbackController(req, res) {
  const validation = validateCallbackBody(req.body);

  if (!validation.ok) {
    return res.status(400).json({ error: validation.errors.join(" ") });
  }

  const data = validation.data;
  const pool = getPool();
  let client;

  let callbackId;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const result = await createCallbackWithUser(
      client,
      {
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email
      },
      {
        propertyTypes: data.propertyTypes,
        primaryConcerns: data.primaryConcerns,
        concernDetail: data.concernDetail,
        propertyLocation: data.propertyLocation,
        hasFloorPlan: data.hasFloorPlan,
        preferredTimeSlot: data.preferredTimeSlot,
        consultationMethod: data.consultationMethod,
        consultationContactNumber: data.consultationContactNumber,
        referralSource: data.referralSource
      }
    );

    callbackId = result.callbackRequest.id;
    await client.query("COMMIT");
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        /* ignore rollback failure */
      }
    }
    console.error("Database save error:", err.message);
    return res.status(503).json({
      error: "Could not save your request. Please check that PostgreSQL is running and try again."
    });
  } finally {
    client?.release();
  }

  const emailSent = await notifyByEmail(callbackId, data);

  return res.status(200).json({
    message: SUCCESS_MESSAGE,
    id: callbackId,
    emailSent
  });
}
