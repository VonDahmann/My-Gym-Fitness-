const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

function showToast(message, isSuccess = true) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 18px";
  toast.style.color = "white";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
  toast.style.background = isSuccess ? "#28a745" : "#dc3545";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

const counter = document.createElement("div");
counter.style.fontSize = "12px";
counter.style.marginTop = "5px";
counter.style.color = "#666";

messageInput.parentNode.appendChild(counter);
messageInput.addEventListener("input", () => {
  const length = messageInput.value.length;
  counter.textContent = `${length} / 20 minimum`;

  if (length < 20) {
    counter.style.color = "red";
  } else {
    counter.style.color = "green";
  }
});

function validateForm() {
  const name = nameInput.value.trim(); // إزالة الفراغات الزائدة
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (name.length < 2) {
    showToast("Name must be at least 2 characters", false);
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast("Invalid email format", false);
    return false;
  }

  if (subject.length < 5) {
    showToast("Subject must be at least 5 characters", false);
    return false;
  }

  if (message.length < 20) {
    showToast("Message must be at least 20 characters", false);
    return false;
  }

  return true;
}
// Save message to localStorage
function saveMessage(data) {
  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push(data);
  localStorage.setItem("messages", JSON.stringify(messages));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const newMessage = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim(),
    date: new Date().toLocaleString(),
  };

  saveMessage(newMessage);

  showToast("Message sent successfully!", true);

  form.reset();
  counter.textContent = "";
});