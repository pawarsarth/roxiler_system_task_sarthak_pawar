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
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
  return regex.test(password);
};

export const getPasswordError = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 16) return 'Password must be at most 16 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
  return '';
};
