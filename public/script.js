const signupForm = document.getElementById("signup-form");

console.log(signupForm);

const password = signupForm.querySelector("#sign-up-password");
const confirm = document.querySelector("#confirm-password");

console.log(password);
console.log(confirm);

function validatePassword() {
  if (password.value != confirm.value) {
    confirm.setCustomValidity("Passwords Don't Match");
    console.log("passwords don't match");
  } else {
    confirm.setCustomValidity("");
  }
}

password.addEventListener("change", validatePassword);
confirm.addEventListener("change", validatePassword);
