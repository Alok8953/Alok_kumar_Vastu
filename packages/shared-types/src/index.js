/**
 * @typedef {Object} HealthResponse
 * @property {boolean} ok
 * @property {string} message
 * @property {string} [database]
 */

/**
 * @typedef {Object} CallbackRequestBody
 * @property {string} fullName
 * @property {string} mobile
 * @property {string|null} email
 * @property {string[]} propertyTypes
 * @property {string[]} primaryConcerns
 * @property {string} concernDetail
 * @property {string} propertyLocation
 * @property {boolean} hasFloorPlan
 * @property {string} preferredTimeSlot
 * @property {string} consultationMethod
 * @property {string} consultationContactNumber
 * @property {string|null} [referralSource]
 */

export const healthResponseExample = {
  ok: true,
  message: "Node API is running"
};
