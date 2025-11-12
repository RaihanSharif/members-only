const passwordField = document.getElementById("#password");
const confirmPasswordField = document.getElementById("#confirm-password");

function validatePassword() {
  if (passwordField.value != confirmPasswordField.value) {
    confirmPasswordField.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPasswordField.setCustomValidity("");
  }
}

// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;

passwordField.addEventListener("change", validatePassword);
confirmPasswordField.addEventListener("keyup", validatePassword);
