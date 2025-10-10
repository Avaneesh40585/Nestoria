// Calculate tax (18% GST)
exports.calculateTax = (baseAmount) => {
  return baseAmount * 0.18;
};

// Calculate final amount
exports.calculateFinalAmount = (baseAmount) => {
  const tax = exports.calculateTax(baseAmount);
  return baseAmount + tax;
};

// Calculate number of nights
exports.calculateNights = (checkin, checkout) => {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  const diffTime = Math.abs(checkoutDate - checkinDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format date
exports.formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};
