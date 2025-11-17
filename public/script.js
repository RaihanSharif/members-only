const signupForm = document.getElementById("signup-form");

if (signupForm) {
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
}

const showMemberFormBtn = document.getElementById("show-member-form-btn");

if (showMemberFormBtn) {
  const form = document.getElementById("membership-form");
  showMemberFormBtn.addEventListener("click", () => {
    form.classList.toggle("hide");
    showMemberFormBtn.classList.toggle("hide");
  });
}
