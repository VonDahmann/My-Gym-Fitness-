"use strict";
/*PLAN DATA*/
const PLANS = {
  bronze: { name: "Bronze Plan", period: "Monthly", price: "3,500 DZD/mo" },
  silver: { name: "Silver Plan", period: "Quarterly", price: "9,000 DZD/qtr" },
  gold: { name: "Gold Plan", period: "Annual", price: "30,000 DZD/yr" },
};
/*DOM REFERENCES*/
let form,
  fullNameInput,
  emailInput,
  phoneInput,
  dobInput,
  planRadios,
  termsCheckbox,
  miniCart,
  cartPlanName,
  cartPlanPrice,
  cartProceedBtn,
  cartClearBtn,
  successModal,
  modalCloseBtn;
/**
 * showError — display an inline error message next to a field
 * @param {HTMLElement} field - the input element
 * @param {string} message - error text
 */
function showError(field, message) {
  clearFeedback(field);
  field.style.borderColor = "#e74c3c";
  const span = document.createElement("span");
  span.className = "field-error";
  span.textContent = message;
  field.parentNode.insertBefore(span, field.nextSibling);
}

/**
 * showSuccess — mark a field as valid (green border)
 * @param {HTMLElement} field
 */
function showSuccess(field) {
  clearFeedback(field);
  field.style.borderColor = "#2ecc71"; 
}

/**
 * clearFeedback — remove any previous error span and reset border
 * @param {HTMLElement} field
 */
function clearFeedback(field) {
  const existing = field.parentNode.querySelector(".field-error");
  if (existing) existing.remove();
  field.style.borderColor = "";
}

/* Individual field validators */
function validateFullName() {
  const val = fullNameInput.value.trim();
  if (!val) {
    showError(fullNameInput, "Full name is required.");
    return false;
  }
  if (val.length < 3) {
    showError(fullNameInput, "Name must be at least 3 characters.");
    return false;
  }
  if (!/^[A-Za-zÀ-ÿ\s]+$/.test(val)) {
    showError(fullNameInput, "Name must contain letters only.");
    return false;
  }
  showSuccess(fullNameInput);
  return true;
}

/** validateEmail — required, regex check */
function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) {
    showError(emailInput, "Email is required.");
    return false;
  }
  // Standard email regex
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(val)) {
    showError(emailInput, "Please enter a valid email address.");
    return false;
  }
  showSuccess(emailInput);
  return true;
}
function validatePhone() {
  const val = phoneInput.value.trim();
  if (!val) {
    showError(phoneInput, "Phone number is required.");
    return false;
  }
  const digits = val.replace(/[\s\-\+]/g, "");
  if (!/^\d+$/.test(digits)) {
    showError(phoneInput, "Phone must be numeric.");
    return false;
  }
  if (digits.length < 8 || digits.length > 15) {
    showError(phoneInput, "Phone must be 8–15 digits.");
    return false;
  }
  showSuccess(phoneInput);
  return true;
}

/** validateDob — required, member must be ≥ 16 years old */
function validateDob() {
  const val = dobInput.value;
  if (!val) {
    showError(dobInput, "Date of birth is required.");
    return false;
  }
  const dob = new Date(val);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 16) {
    showError(dobInput, "You must be at least 16 years old.");
    return false;
  }
  showSuccess(dobInput);
  return true;
}
function validatePlan() {
  const chosen = document.querySelector('input[name="plan"]:checked');
  // We attach error to the fieldset's legend area
  const fieldset = planRadios[0].closest("fieldset");
  const legend = fieldset.querySelector("legend");
  // Remove previous plan-error if any
  const prev = fieldset.querySelector(".plan-error");
  if (prev) prev.remove();

  if (!chosen) {
    const span = document.createElement("span");
    span.className = "field-error plan-error";
    span.textContent = "Please select a plan.";
    legend.after(span);
    return false;
  }
  return true;
}
function validateTerms() {
  const fieldset = termsCheckbox.closest("fieldset");
  const legend = fieldset.querySelector("legend");
  const prev = fieldset.querySelector(".terms-error");
  if (prev) prev.remove();

  if (!termsCheckbox.checked) {
    const span = document.createElement("span");
    span.className = "field-error terms-error";
    span.textContent = "You must agree to the terms.";
    legend.after(span);
    return false;
  }
  return true;
}
function validateForm() {
  const results = [
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validatePlan(),
    validateTerms(),
  ];
  return results.every(Boolean);
}

/*PLAN SELECTION  */
/**
 * selectPlan — save plan key to sessionStorage and update UI
 * @param {string} planKey - "bronze" | "silver" | "gold"
 */
function selectPlan(planKey) {
  sessionStorage.setItem("selectedPlan", planKey);
  renderMiniCart();
}

function clearSelection() {
  sessionStorage.removeItem("selectedPlan");
  renderMiniCart();
}

function renderMiniCart() {
  const planKey = sessionStorage.getItem("selectedPlan");
  if (planKey && PLANS[planKey]) {
    const plan = PLANS[planKey];
    cartPlanName.textContent = plan.name + " — " + plan.period;
    cartPlanPrice.textContent = plan.price;
    miniCart.classList.add("visible");
  } else {
    miniCart.classList.remove("visible");
  }
}
function prefillAndScroll() {
  const planKey = sessionStorage.getItem("selectedPlan");
  if (planKey) {
    const radio = document.querySelector(
      `input[name="plan"][value="${planKey}"]`,
    );
    if (radio) radio.checked = true;
  }
  document.getElementById("register").scrollIntoView({ behavior: "smooth" });
}

/*SUCCESS MODAL*/
function openModal() {
  successModal.classList.add("visible");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  successModal.classList.remove("visible");
  document.body.style.overflow = "";
}

/*SAVE MEMBER TO localStorage*/
function saveMember() {
  const members = JSON.parse(localStorage.getItem("gymMembers") || "[]");
  const planKey = document.querySelector('input[name="plan"]:checked').value;

  members.push({
    id: Date.now(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    plan: planKey,
    status: "Active",
    registeredAt: new Date().toISOString().slice(0, 10),
  });

  localStorage.setItem("gymMembers", JSON.stringify(members));
}
/*INJECT HTML */
function injectDynamicHTML() {
  /* ── 1. Select Plan buttons on each article ── */
  const articles = document.querySelectorAll("#plans article");
  const planKeys = ["bronze", "silver", "gold"];
  articles.forEach((article, i) => {
    const key = planKeys[i];
    if (!key) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "select-plan-btn";
    btn.dataset.plan = key;
    btn.textContent = "Select Plan";
    btn.addEventListener("click", () => selectPlan(key));
    article.appendChild(btn);
  });

  /* ── 2. Sticky mini-cart bar ── */
  const cartHTML = `
    <div id="mini-cart" class="mini-cart">
      <span class="cart-icon">🛒</span>
      <span id="cart-plan-name" class="cart-plan-name"></span>
      <span id="cart-plan-price" class="cart-plan-price"></span>
      <button type="button" id="cart-proceed-btn" class="cart-btn cart-proceed">Proceed to Register</button>
      <button type="button" id="cart-clear-btn" class="cart-btn cart-clear">✕ Clear</button>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", cartHTML);

  /* ── 3. Success modal ── */
  const modalHTML = `
    <div id="success-modal" class="modal-overlay">
      <div class="modal-box">
        <button type="button" id="modal-close-btn" class="modal-close">&times;</button>
        <div class="modal-icon">✅</div>
        <h3>Registration Successful!</h3>
        <p>Welcome to <strong>My Gym Fitness</strong>. Your membership has been created.</p>
        <button type="button" class="modal-ok-btn" id="modal-ok-btn">OK</button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
/*INIT*/
document.addEventListener("DOMContentLoaded", () => {
  /* Inject dynamic elements first */
  injectDynamicHTML();

  /* Cache DOM references */
  form = document.querySelector("#register form");
  fullNameInput = document.getElementById("full-name");
  emailInput = document.getElementById("email");
  phoneInput = document.getElementById("phone");
  dobInput = document.getElementById("dob");
  planRadios = document.querySelectorAll('input[name="plan"]');
  termsCheckbox = document.querySelector('input[name="terms"]');
  miniCart = document.getElementById("mini-cart");
  cartPlanName = document.getElementById("cart-plan-name");
  cartPlanPrice = document.getElementById("cart-plan-price");
  cartProceedBtn = document.getElementById("cart-proceed-btn");
  cartClearBtn = document.getElementById("cart-clear-btn");
  successModal = document.getElementById("success-modal");
  modalCloseBtn = document.getElementById("modal-close-btn");

  /* ── Blur listeners for inline validation ── */
  fullNameInput.addEventListener("blur", validateFullName);
  emailInput.addEventListener("blur", validateEmail);
  phoneInput.addEventListener("blur", validatePhone);
  dobInput.addEventListener("blur", validateDob);
  // Terms validated on change instead of blur
  termsCheckbox.addEventListener("change", validateTerms);

  /* ── Form submit ── */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveMember(); // persist to localStorage
      clearSelection(); // clear sessionStorage cart
      form.reset(); // reset form fields
      // Clear all green/red borders
      [fullNameInput, emailInput, phoneInput, dobInput].forEach(clearFeedback);
      openModal(); // show success modal
    }
  });

  /* ── Mini-cart buttons ── */
  cartProceedBtn.addEventListener("click", prefillAndScroll);
  cartClearBtn.addEventListener("click", clearSelection);

  /* ── Modal close events ── */
  modalCloseBtn.addEventListener("click", closeModal);
  document.getElementById("modal-ok-btn").addEventListener("click", closeModal);
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeModal(); // outside click
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && successModal.classList.contains("visible")) {
      closeModal();
    }
  });

  /* ── Restore mini-cart from sessionStorage on load ── */
  renderMiniCart();
});
