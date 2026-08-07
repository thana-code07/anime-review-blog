const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// validate that name is not empty
export function validateName(name) {
  if (!name?.trim()) return "Name is required";
  return null;
}

// validate that username is not empty
export function validateUsername(username) {
  if (!username?.trim()) return "Username is required";
  return null;
}

// validate email presence and format
export function validateEmail(email) {
  if (!email?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email.trim())) return "Email must be a valid email";
  return null;
}

// validate password meets minimum length
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

// validate all sign-up form fields
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

// validate login email and password fields
export function validateLoginForm({ email, password }) {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return errors;
}

// validate that confirm password matches
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your new password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

// validate profile name and username fields
export function validateProfileForm({ name, username }) {
  const errors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  return errors;
}

// validate reset password form fields
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

export const ARTICLE_INTRO_MAX_LENGTH = 120;

// validate admin article create/edit form fields
export function validateArticleForm(form, { requirePublishFields }) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  }

  if (requirePublishFields) {
    if (!form.category) {
      errors.category = "Category is required";
    }
    if (!form.content.trim()) {
      errors.content = "Content is required";
    }
    if (!form.image && !form.imageFile) {
      errors.image = "Thumbnail image is required";
    }
  }

  if (form.description.length > ARTICLE_INTRO_MAX_LENGTH) {
    errors.description = `Introduction must be ${ARTICLE_INTRO_MAX_LENGTH} characters or fewer`;
  }

  return errors;
}
