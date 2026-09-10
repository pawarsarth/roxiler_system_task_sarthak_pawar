export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateName = (name) => {
  return name && name.length >= 2 && name.length <= 60;
};

export const validateAddress = (address) => {
  return address && address.length <= 400;
};

export const validatePassword = (password) => {
  // 8-16 chars, at least one uppercase and one special char
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  return regex.test(password);
};

export const validateRating = (rating) => {
  const num = parseInt(rating);
  return num >= 1 && num <= 5;
};
