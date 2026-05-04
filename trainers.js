/**
 * trainers.js — Trainers Search & Modal Detail
 * Part 3 of the Gym Management System
 */
"use strict";

/* ── TRAINER DATA ── */
const trainersData = [
  {
    id: 1,
    name: "Sarah Benmansour",
    specialty: "Yoga & Mindfulness",
    experience: "6 Years",
    bio: "Sarah is a certified yoga instructor who combines traditional techniques with modern wellness approaches. She helps members improve flexibility, posture, and mental clarity.",
    email: "sarah@mygymfitness.com",
    photo: "images/sarah.jpg",
    schedule: [
      { day: "Sunday", time: "08:00–09:15", className: "Morning Yoga" },
      { day: "Tuesday", time: "18:00–19:15", className: "Power Yoga" },
      { day: "Thursday", time: "08:00–09:15", className: "Gentle Yoga" },
    ],
  },
  {
    id: 2,
    name: "Mohamed Cherif",
    specialty: "CrossFit & Functional Training",
    experience: "8 Years",
    bio: "Mohamed is an elite CrossFit coach and former national-level athlete. His high-intensity sessions are designed to push limits and build real-world strength and endurance.",
    email: "mohamed@mygymfitness.com",
    photo: "images/cc.jpg",
    schedule: [
      { day: "Sunday", time: "17:00–17:45", className: "CrossFit WOD" },
      { day: "Monday", time: "17:00–17:45", className: "CrossFit Basics" },
      { day: "Wednesday", time: "17:00–17:45", className: "CrossFit WOD" },
    ],
  },
  {
    id: 3,
    name: "Dayaa Rahmani",
    specialty: "HIIT & Cardio Conditioning",
    experience: "4 Years",
    bio: "Dayaa specializes in high-intensity interval training, designing short but effective workouts that maximize calorie burn and cardiovascular health for all fitness levels.",
    email: "adam@mygymfitness.com",
    photo: "images/aa.jpg",
    schedule: [
      { day: "Monday", time: "18:00–18:45", className: "HIIT Blast" },
      { day: "Wednesday", time: "18:00–18:45", className: "Cardio Burn" },
      { day: "Sunday", time: "10:00–10:45", className: "HIIT Starter" },
    ],
  },
  {
    id: 4,
    name: "Sami Boukhalfa",
    specialty: "Strength Training & Powerlifting",
    experience: "7 Years",
    bio: "Sami is a powerlifting champion who focuses on compound movements and progressive overload. His training programs are tailored to build serious muscle and raw strength.",
    email: "sami@mygymfitness.com",
    photo: "images/bb.jpg",
    schedule: [
      { day: "Sunday", time: "18:00–18:45", className: "Powerlifting 101" },
      {
        day: "Tuesday",
        time: "18:00–18:45",
        className: "Strength Foundations",
      },
      { day: "Thursday", time: "18:00–18:45", className: "Heavy Day" },
    ],
  },
  {
    id: 5,
    name: "Mina Oussama",
    specialty: "Stretching & Mobility Recovery",
    experience: "3 Years",
    bio: "Mina focuses on post-workout recovery, injury prevention, and mobility enhancement. Her stretching sessions are essential for members who train hard and need proper recovery.",
    email: "mina@mygymfitness.com",
    photo: "images/ee.jpg",
    schedule: [
      { day: "Monday", time: "19:00–19:45", className: "Recovery Flow" },
      { day: "Wednesday", time: "19:00–19:45", className: "Mobility Lab" },
      { day: "Sunday", time: "11:00–11:45", className: "Stretch & Relax" },
    ],
  },
  {
    id: 6,
    name: "Rami Messaoud",
    specialty: "Boxing Fitness & Self-Defense",
    experience: "9 Years",
    bio: "Rami is a former professional boxer who now channels his expertise into high-energy boxing fitness classes. His sessions improve coordination, agility, and full-body conditioning.",
    email: "rami@mygymfitness.com",
    photo: "images/dd.jpg",
    schedule: [
      { day: "Tuesday", time: "17:00–18:00", className: "Boxing Fitness" },
      { day: "Thursday", time: "17:00–18:00", className: "Self-Defense" },
      { day: "Sunday", time: "16:00–17:00", className: "Boxing Cardio" },
    ],
  },
];

let trainersGrid, searchInput, noResultsMsg, modal;

/** createTrainerCard — build a single card DOM element */
function createTrainerCard(trainer) {
  const article = document.createElement("article");
  article.className = "trainer-card";
  article.dataset.trainerId = trainer.id;
  article.innerHTML = `
    <figure>
      <img src="${trainer.photo}" alt="Photo of ${trainer.name}">
      <figcaption>${trainer.name} — ${trainer.specialty.split("&")[0].trim()} Specialist</figcaption>
    </figure>
    <h3><a href="#" class="ad">${trainer.name}</a></h3>
    <p><strong>Specialty:</strong> ${trainer.specialty}</p>
    <p><strong>Experience:</strong> ${trainer.experience}</p>
    <p>${trainer.bio}</p>
    <address><a href="mailto:${trainer.email}">${trainer.email}</a></address>`;
  article.addEventListener("click", (e) => {
    e.preventDefault();
    openTrainerModal(trainer);
  });
  article.style.cursor = "pointer";
  return article;
}

/** renderTrainers — (re-)draw trainer cards filtered by query */
function renderTrainers(filter = "") {
  trainersGrid.innerHTML = "";
  const filtered = trainersData.filter((t) => {
    return (t.name + " " + t.specialty).toLowerCase().includes(filter);
  });
  if (filtered.length === 0) {
    noResultsMsg.style.display = "block";
  } else {
    noResultsMsg.style.display = "none";
    filtered.forEach((t) => trainersGrid.appendChild(createTrainerCard(t)));
  }
}

/** openTrainerModal — populate and show modal */
function openTrainerModal(trainer) {
  const rows = trainer.schedule
    .map(
      (s) =>
        `<tr><td>${s.day}</td><td>${s.time}</td><td>${s.className}</td></tr>`,
    )
    .join("");
  modal.innerHTML = `
    <div class="trainer-modal-box">
      <button type="button" class="modal-close" id="trainer-modal-close">&times;</button>
      <img src="${trainer.photo}" alt="${trainer.name}" class="modal-photo">
      <h3>${trainer.name}</h3>
      <p class="modal-specialty">${trainer.specialty}</p>
      <p class="modal-experience"><strong>Experience:</strong> ${trainer.experience}</p>
      <p class="modal-bio">${trainer.bio}</p>
      <h4>Class Schedule</h4>
      <table class="modal-schedule">
        <thead><tr><th>Day</th><th>Time</th><th>Class</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <address><a href="mailto:${trainer.email}">${trainer.email}</a></address>
    </div>`;
  modal.classList.add("visible");
  document.body.style.overflow = "hidden";
  document
    .getElementById("trainer-modal-close")
    .addEventListener("click", closeTrainerModal);
}

/** closeTrainerModal */
function closeTrainerModal() {
  modal.classList.remove("visible");
  document.body.style.overflow = "";
}

/** injectDynamicHTML — add search bar, no-results msg, modal overlay */
function injectDynamicHTML() {
  const wrapper = document.createElement("div");
  wrapper.id = "trainer-search-wrapper";
  wrapper.innerHTML = `<input type="text" id="trainer-search" placeholder="🔍  Search trainers by name or specialty…" autocomplete="off">`;
  document.querySelector(".kkk").after(wrapper);

  const noRes = document.createElement("p");
  noRes.id = "no-results-msg";
  noRes.className = "no-results";
  noRes.textContent = "No trainers found matching your search.";
  noRes.style.display = "none";
  trainersGrid.after(noRes);

  const overlay = document.createElement("div");
  overlay.id = "trainer-modal";
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  trainersGrid = document.getElementById("trainers-grid");
  injectDynamicHTML();
  trainersGrid = document.getElementById("trainers-grid");
  searchInput = document.getElementById("trainer-search");
  noResultsMsg = document.getElementById("no-results-msg");
  modal = document.getElementById("trainer-modal");
  trainersGrid.innerHTML = "";
  renderTrainers();
  searchInput.addEventListener("input", () =>
    renderTrainers(searchInput.value.trim().toLowerCase()),
  );
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTrainerModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("visible"))
      closeTrainerModal();
  });
});
