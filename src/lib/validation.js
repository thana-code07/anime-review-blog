const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  if (!name?.trim()) return "Name is required";
  return null;
}

export function validateUsername(username) {
  if (!username?.trim()) return "Username is required";
  return null;
}

export function validateEmail(email) {
  if (!email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email.trim())) return "Email must be a valid email";
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

export function validateSignUpForm({ name, username, email, password }) {
  const errors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateLoginForm({ email, password }) {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return errors;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your new password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

export function validateProfileForm({ name, username }) {
  const errors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  return errors;
}

export function validateResetPasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  const errors = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  const newPasswordError = validatePassword(newPassword);
  if (newPasswordError) errors.newPassword = newPasswordError;

  const confirmError = validateConfirmPassword(newPassword, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
}
