/**
 * admin-dashboard.js — Dashboard Stats & Charts
 * Part 3 of the Gym Management System
 */
"use strict";

/* ── SEED DATA — ensures localStorage has sample data on first load ── */
function seedDataIfEmpty() {
  if (!localStorage.getItem("gymMembers")) {
    const seed = [
      { id: 1, fullName: "Yacine Bouzid", email: "yacine.b@email.com", plan: "gold", status: "Active", registeredAt: "2025-03-14" },
      { id: 2, fullName: "Amira Khelil", email: "amira.k@email.com", plan: "silver", status: "Active", registeredAt: "2025-03-13" },
      { id: 3, fullName: "Karim Mansouri", email: "karim.m@email.com", plan: "bronze", status: "Active", registeredAt: "2025-03-12" },
      { id: 4, fullName: "Nadia Ferhat", email: "nadia.f@email.com", plan: "gold", status: "Active", registeredAt: "2025-03-11" },
      { id: 5, fullName: "Omar Tlemcani", email: "omar.t@email.com", plan: "silver", status: "Pending", registeredAt: "2025-03-10" },
      { id: 6, fullName: "Lina Touati", email: "lina.t@email.com", plan: "bronze", status: "Active", registeredAt: "2025-03-09" },
      { id: 7, fullName: "Raouf Djebbar", email: "raouf.d@email.com", plan: "gold", status: "Active", registeredAt: "2025-03-08" },
      { id: 8, fullName: "Hana Merabet", email: "hana.m@email.com", plan: "silver", status: "Active", registeredAt: "2025-03-07" },
    ];
    localStorage.setItem("gymMembers", JSON.stringify(seed));
  }
  if (!localStorage.getItem("gymClasses")) {
    const classes = [
      { name: "Yoga", trainer: "Sarah", day: "Sunday", time: "08:00", enrolled: 12, capacity: 20 },
      { name: "CrossFit", trainer: "Mohamed", day: "Sunday", time: "17:00", enrolled: 18, capacity: 20 },
      { name: "HIIT", trainer: "Adam", day: "Monday", time: "18:00", enrolled: 10, capacity: 15 },
      { name: "Stretching", trainer: "Mina", day: "Monday", time: "19:00", enrolled: 8, capacity: 15 },
      { name: "Strength", trainer: "Sami", day: "Tuesday", time: "18:00", enrolled: 8, capacity: 12 },
      { name: "Boxing", trainer: "Rami", day: "Tuesday", time: "17:00", enrolled: 14, capacity: 20 },
      { name: "Power Yoga", trainer: "Sarah", day: "Wednesday", time: "18:00", enrolled: 15, capacity: 20 },
      { name: "CrossFit WOD", trainer: "Mohamed", day: "Wednesday", time: "17:00", enrolled: 17, capacity: 20 },
      { name: "Cardio Burn", trainer: "Adam", day: "Thursday", time: "18:00", enrolled: 11, capacity: 15 },
      { name: "Self-Defense", trainer: "Rami", day: "Thursday", time: "17:00", enrolled: 16, capacity: 20 },
    ];
    localStorage.setItem("gymClasses", JSON.stringify(classes));
  }
}

/** getMembers — read members array from localStorage */
function getMembers() {
  return JSON.parse(localStorage.getItem("gymMembers") || "[]");
}

/** getClasses — read classes array from localStorage */
function getClasses() {
  return JSON.parse(localStorage.getItem("gymClasses") || "[]");
}

/** computeStats — calculate dashboard numbers from stored data */
function computeStats() {
  const members = getMembers();
  const classes = getClasses();

  const totalMembers = members.length;
  const activeSubscriptions = members.filter((m) => m.status === "Active").length;

  // Classes per week = unique day-time combos in the classes array
  const uniqueDays = new Set(classes.map((c) => c.day));
  const classesPerWeek = classes.length;

  // Most popular plan
  const planCounts = { bronze: 0, silver: 0, gold: 0 };
  members.forEach((m) => { if (planCounts[m.plan] !== undefined) planCounts[m.plan]++; });
  const mostPopular = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];
  const mostPopularPlan = mostPopular ? mostPopular[0].charAt(0).toUpperCase() + mostPopular[0].slice(1) : "N/A";

  return { totalMembers, activeSubscriptions, classesPerWeek, mostPopularPlan, planCounts };
}

/** updateStatCards — inject computed values into the stat card elements */
function updateStatCards(stats) {
  const cards = document.querySelectorAll(".stat-card");
  if (cards[0]) {
    cards[0].querySelector(".stat-number").textContent = stats.totalMembers;
    cards[0].querySelector(".stat-label").textContent = "Registered members";
  }
  if (cards[1]) {
    cards[1].querySelector(".stat-number").textContent = stats.activeSubscriptions;
    cards[1].querySelector(".stat-label").textContent = "Currently active plans";
  }
  if (cards[2]) {
    cards[2].querySelector(".stat-number").textContent = stats.classesPerWeek;
    cards[2].querySelector(".stat-label").textContent = "Scheduled per week";
    cards[2].querySelector("h3").textContent = "Classes / Week";
  }
  if (cards[3]) {
    cards[3].querySelector(".stat-number").textContent = stats.mostPopularPlan;
    cards[3].querySelector(".stat-label").textContent = "Most chosen plan";
    cards[3].querySelector("h3").textContent = "Most Popular Plan";
  }
}

/** updateRecentTable — rebuild the recent registrations table from data */
function updateRecentTable() {
  const members = getMembers();
  const tbody = document.querySelector("#recent-activity tbody");
  if (!tbody) return;
  // Show last 5 members (newest first)
  const recent = members.slice(-5).reverse();
  tbody.innerHTML = "";
  recent.forEach((m, i) => {
    const tr = document.createElement("tr");
    const planLabel = m.plan.charAt(0).toUpperCase() + m.plan.slice(1);
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${m.fullName}</td>
      <td>${m.email}</td>
      <td>${planLabel}</td>
      <td>${m.registeredAt}</td>
      <td>${m.status}</td>`;
    tbody.appendChild(tr);
  });
}

/* ── BAR CHART (pure CSS / HTML) ── */

/** renderPlanChart — draw a simple bar chart for plan distribution */
function renderPlanChart(planCounts) {
  // Remove existing chart if any
  const existing = document.getElementById("plan-chart-section");
  if (existing) existing.remove();

  const total = Object.values(planCounts).reduce((a, b) => a + b, 0) || 1;
  const maxCount = Math.max(...Object.values(planCounts), 1);

  const section = document.createElement("section");
  section.id = "plan-chart-section";
  section.innerHTML = `
    <h2>Member Distribution by Plan</h2>
    <p>Visual breakdown of members across plan types.</p>
    <div class="chart-container" id="plan-chart"></div>`;

  // Insert before quick-actions
  const quickActions = document.getElementById("quick-actions");
  quickActions.parentNode.insertBefore(section, quickActions);

  const chart = section.querySelector("#plan-chart");
  const colors = { bronze: "#cd7f32", silver: "#c0c0c0", gold: "#ffd700" };

  Object.entries(planCounts).forEach(([plan, count]) => {
    const pct = Math.round((count / maxCount) * 100);
    const bar = document.createElement("div");
    bar.className = "chart-bar-wrapper";
    bar.innerHTML = `
      <span class="chart-label">${plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
      <div class="chart-bar-track">
        <div class="chart-bar" style="width:${pct}%;background:${colors[plan]}"></div>
      </div>
      <span class="chart-value">${count}</span>`;
    chart.appendChild(bar);
  });
}

/** refreshDashboard — recalculate everything */
function refreshDashboard() {
  const stats = computeStats();
  updateStatCards(stats);
  updateRecentTable();
  renderPlanChart(stats.planCounts);
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  seedDataIfEmpty();
  refreshDashboard();

  // Listen for storage changes (e.g. member registered in another tab)
  window.addEventListener("storage", (e) => {
    if (e.key === "gymMembers" || e.key === "gymClasses") {
      refreshDashboard();
    }
  });
});
