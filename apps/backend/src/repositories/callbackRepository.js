import { getPool } from "../db/pool.js";

export async function createCallbackRequest({
  userId,
  propertyType,
  primaryConcerns,
  concernDetail,
  propertyLocation,
  hasFloorPlan,
  preferredTimeSlot,
  consultationMethod,
  referralSource
}) {
  const { rows } = await getPool().query(
    `INSERT INTO callback_requests (
       user_id, property_type, primary_concerns, concern_detail, property_location,
       has_floor_plan, preferred_time_slot, consultation_method, referral_source
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, user_id, status, created_at`,
    [
      userId,
      propertyType,
      primaryConcerns,
      concernDetail,
      propertyLocation,
      hasFloorPlan,
      preferredTimeSlot,
      consultationMethod,
      referralSource || null
    ]
  );

  return rows[0];
}

export async function markCallbackEmailSent(id) {
  await getPool().query(
    `UPDATE callback_requests
     SET email_sent_at = NOW(), email_error = NULL, updated_at = NOW()
     WHERE id = $1`,
    [id]
  );
}

export async function markCallbackEmailFailed(id, errorMessage) {
  await getPool().query(
    `UPDATE callback_requests
     SET email_error = $2, updated_at = NOW()
     WHERE id = $1`,
    [id, errorMessage]
  );
}

export async function createCallbackWithUser(client, userData, callbackData) {
  const userResult = await client.query(
    `INSERT INTO users (full_name, mobile, email)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [userData.fullName, userData.mobile, userData.email || null]
  );

  const userId = userResult.rows[0].id;

  const callbackResult = await client.query(
    `INSERT INTO callback_requests (
       user_id, property_type, primary_concerns, concern_detail, property_location,
       has_floor_plan, preferred_time_slot, consultation_method, referral_source
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, status, created_at`,
    [
      userId,
      callbackData.propertyType,
      callbackData.primaryConcerns,
      callbackData.concernDetail,
      callbackData.propertyLocation,
      callbackData.hasFloorPlan,
      callbackData.preferredTimeSlot,
      callbackData.consultationMethod,
      callbackData.referralSource || null
    ]
  );

  return {
    userId,
    callbackRequest: callbackResult.rows[0]
  };
}
