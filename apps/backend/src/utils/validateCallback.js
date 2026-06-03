const PROPERTY_TYPES = [
  "House / Home",
  "Apartment / Flat",
  "Office",
  "Shop / Showroom",
  "Factory / Industrial Unit",
  "Plot / Land",
  "Other"
];

const PRIMARY_CONCERNS = [
  "Career Growth",
  "Financial Problems",
  "Business Losses",
  "Marriage Issues",
  "Relationship Problems",
  "Health Concerns",
  "Mental Stress / Anxiety",
  "Child-Related Issues",
  "Property Disputes",
  "General Vastu Consultation",
  "Other"
];

const TIME_SLOTS = [
  "9:00 AM – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "1:00 PM – 3:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:00 PM",
  "7:00 PM – 9:00 PM"
];

const CONSULTATION_METHODS = ["Phone Call", "WhatsApp Call", "Google Meet / Zoom"];

const REFERRAL_SOURCES = [
  "Google Search",
  "Instagram",
  "YouTube",
  "Facebook",
  "Friend / Family Referral",
  "Other"
];

export function validateCallbackBody(body) {
  const errors = [];

  const fullName = body.fullName?.trim();
  const mobile = body.mobile?.trim();
  const email = body.email?.trim() || null;
  const propertyType = body.propertyType?.trim();
  const primaryConcerns = Array.isArray(body.primaryConcerns)
    ? body.primaryConcerns.filter((c) => typeof c === "string" && c.trim())
    : [];
  const concernDetail = body.concernDetail?.trim();
  const propertyLocation = body.propertyLocation?.trim();
  const hasFloorPlan = body.hasFloorPlan;
  const preferredTimeSlot = body.preferredTimeSlot?.trim();
  const consultationMethod = body.consultationMethod?.trim();
  const referralSource = body.referralSource?.trim() || null;

  if (!fullName) errors.push("Full Name is required.");
  if (!mobile) errors.push("Mobile Number is required.");
  if (!propertyType || !PROPERTY_TYPES.includes(propertyType)) {
    errors.push("Property Type is required.");
  }
  if (primaryConcerns.length === 0) {
    errors.push("Select at least one primary concern.");
  } else if (!primaryConcerns.every((c) => PRIMARY_CONCERNS.includes(c.trim()))) {
    errors.push("Invalid primary concern selected.");
  }
  if (!concernDetail) errors.push("Concern detail is required.");
  if (!propertyLocation) errors.push("Property Location is required.");
  if (typeof hasFloorPlan !== "boolean") {
    errors.push("Floor Plan selection is required.");
  }
  if (!preferredTimeSlot || !TIME_SLOTS.includes(preferredTimeSlot)) {
    errors.push("Preferred Time for Callback is required.");
  }
  if (!consultationMethod || !CONSULTATION_METHODS.includes(consultationMethod)) {
    errors.push("Preferred Consultation Method is required.");
  }
  if (referralSource && !REFERRAL_SOURCES.includes(referralSource)) {
    errors.push("Invalid referral source.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      mobile,
      email,
      propertyType,
      primaryConcerns: primaryConcerns.map((c) => c.trim()),
      concernDetail,
      propertyLocation,
      hasFloorPlan,
      preferredTimeSlot,
      consultationMethod,
      referralSource
    }
  };
}
