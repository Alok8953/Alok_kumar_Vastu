export const PHONE_DIGIT_LIMIT = 10;

export function sanitizePhoneDigits(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, PHONE_DIGIT_LIMIT);
}

export function isValidPhoneDigits(value) {
  return sanitizePhoneDigits(value).length === PHONE_DIGIT_LIMIT;
}

export const PROPERTY_TYPES = [
  "House / Home",
  "Apartment / Flat",
  "Office",
  "Shop / Showroom",
  "Factory / Industrial Unit",
  "Plot / Land",
  "Other"
];

export const PRIMARY_CONCERNS = [
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

export const TIME_SLOTS = [
  "9:00 AM – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "1:00 PM – 3:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:00 PM",
  "7:00 PM – 9:00 PM"
];

export const CONSULTATION_METHODS = ["Phone Call", "WhatsApp Call"];
export const CONSULTATION_METHOD_PHONE = "Phone Call";
export const CONSULTATION_METHOD_WHATSAPP = "WhatsApp Call";

export const REFERRAL_SOURCES = [
  "Google Search",
  "Instagram",
  "YouTube",
  "Facebook",
  "Friend / Family Referral",
  "Other"
];

export const INITIAL_FORM = {
  fullName: "",
  mobile: "",
  email: "",
  propertyTypes: [],
  primaryConcerns: [],
  concernDetail: "",
  propertyLocation: "",
  hasFloorPlan: "",
  preferredTimeSlot: "",
  consultationMethod: "",
  consultationContactNumber: "",
  useSameMobileForContact: false,
  referralSource: ""
};
