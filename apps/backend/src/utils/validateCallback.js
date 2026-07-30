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

const CONSULTATION_METHODS = ["Phone Call", "WhatsApp Call"];

const REFERRAL_SOURCES = [
  "Google Search",
  "Instagram",
  "YouTube",
  "Facebook",
  "Friend / Family Referral",
  "Other"
];

const PHONE_DIGIT_LIMIT = 10;

function sanitizePhoneDigits(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, PHONE_DIGIT_LIMIT);
}

function isValidPhoneDigits(value) {
  return sanitizePhoneDigits(value).length === PHONE_DIGIT_LIMIT;
}

function parsePropertyTypes(body) {
  if (Array.isArray(body.propertyTypes)) {
    return body.propertyTypes.filter((t) => typeof t === "string" && t.trim());
  }
  if (typeof body.propertyType === "string" && body.propertyType.trim()) {
    return [body.propertyType.trim()];
  }
  return [];
}

export function validateCallbackBody(body) {
  const errors = [];

  const fullName = body.fullName?.trim();
  const mobile = sanitizePhoneDigits(body.mobile);
  const email = body.email?.trim() || null;
  const propertyTypes = parsePropertyTypes(body);
  const primaryConcerns = Array.isArray(body.primaryConcerns)
    ? body.primaryConcerns.filter((c) => typeof c === "string" && c.trim())
    : [];
  const concernDetail = body.concernDetail?.trim() || null;
  const propertyLocation = body.propertyLocation?.trim() || null;
  const hasFloorPlan =
    typeof body.hasFloorPlan === "boolean" ? body.hasFloorPlan : null;
  const preferredTimeSlot = body.preferredTimeSlot?.trim() || null;
  const consultationMethod = body.consultationMethod?.trim() || null;
  const referralSource = body.referralSource?.trim() || null;

  if (!fullName) errors.push("Full Name is required.");
  if (!mobile) errors.push("Mobile Number is required.");
  else if (!isValidPhoneDigits(mobile)) {
    errors.push(`Mobile number must be exactly ${PHONE_DIGIT_LIMIT} digits.`);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Enter a valid email address.");
  }
  if (!propertyTypes.every((t) => PROPERTY_TYPES.includes(t.trim()))) {
    errors.push("Invalid property type selected.");
  }
  if (!primaryConcerns.every((c) => PRIMARY_CONCERNS.includes(c.trim()))) {
    errors.push("Invalid primary concern selected.");
  }
  if (preferredTimeSlot && !TIME_SLOTS.includes(preferredTimeSlot)) {
    errors.push("Invalid preferred callback time.");
  }
  if (consultationMethod && !CONSULTATION_METHODS.includes(consultationMethod)) {
    errors.push("Invalid consultation method.");
  }

  const consultationContactNumber =
    sanitizePhoneDigits(body.consultationContactNumber) || null;
  if (
    consultationContactNumber &&
    !isValidPhoneDigits(consultationContactNumber)
  ) {
    errors.push(`Callback number must be exactly ${PHONE_DIGIT_LIMIT} digits.`);
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
      propertyTypes: propertyTypes.map((t) => t.trim()),
      primaryConcerns: primaryConcerns.map((c) => c.trim()),
      concernDetail,
      propertyLocation,
      hasFloorPlan,
      preferredTimeSlot,
      consultationMethod,
      consultationContactNumber,
      referralSource
    }
  };
}
