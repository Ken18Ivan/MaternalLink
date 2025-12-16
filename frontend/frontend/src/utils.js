// src/utils.js

// Format a date string into a readable format (e.g., "Dec 16, 08:00 AM")
export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
// Helper to check if a value is within normal BP range (Optional helper for your graph later)
export const isBpNormal = (systolic, diastolic) => {
  return systolic < 120 && diastolic < 80;
};