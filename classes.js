// DATA
const classes = [
  {
    name: "Yoga",
    trainer: "Sarah",
    day: "Sunday",
    time: "08:00",
    duration: 75,
    difficulty: "Beginner",
  },
  {
    name: "CrossFit",
    trainer: "Mohamed",
    day: "Monday",
    time: "17:00",
    duration: 45,
    difficulty: "Advanced",
  },
  {
    name: "Hiit",
    trainer: "Adam",
    day: "Tuesday",
    time: "18:00",
    duration: 45,
    difficulty: "Intermediate",
  },
  {
    name: "Swimming",
    trainer: "Maria",
    day: "Wednesday",
    time: "17:30",
    duration: 60,
    difficulty: "Beginner",
  },
  {
    name: "Strength Training",
    trainer: "Sami",
    day: "Thursday",
    time: "18:00",
    duration: 45,
    difficulty: "Advanced",
  },
  {
    name: "Stretching",
    trainer: "Mina",
    day: "Friday",
    time: "08:00",
    duration: 60,
    difficulty: "Beginner",
  },
  {
    name: "Boxing Fitness",
    trainer: "Rami",
    day: "Saturday",
    time: "19:00",
    duration: 90,
    difficulty: "Intermediate",
  },
];
//  STATE
let selectedTrainer = "";
let selectedDay = "";
let selectedDifficulty = "All";

let currentSortKey = "";
let currentSortDirection = "asc";
// = RENDER
function renderTable(data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((c) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.trainer}</td>
        <td>${c.day}</td>
        <td>${c.time}</td>
        <td>${c.duration} min</td>
        <td>${c.difficulty}</td>
      </tr>
    `;
  });
}
// FILTER
function filterClasses() {
  let result = [...classes];

  if (selectedTrainer) {
    result = result.filter((c) => c.trainer === selectedTrainer);
  }

  if (selectedDay) {
    result = result.filter((c) => c.day === selectedDay);
  }

  if (selectedDifficulty !== "All") {
    result = result.filter((c) => c.difficulty === selectedDifficulty);
  }

  return result;
}
//  SORT
function sortClasses(data) {
  if (!currentSortKey) return data;

  return data.sort((a, b) => {
    if (a[currentSortKey] < b[currentSortKey])
      return currentSortDirection === "asc" ? -1 : 1;
    if (a[currentSortKey] > b[currentSortKey])
      return currentSortDirection === "asc" ? 1 : -1;
    return 0;
  });
}
//  UPDATE
function updateTable() {
  let data = filterClasses();
  data = sortClasses(data);
  renderTable(data);
  updateIndicators();
}
// TRAINER DROPDOWN
function populateTrainerFilter() {
  const select = document.getElementById("trainerFilter");

  const trainers = [...new Set(classes.map((c) => c.trainer))];

  trainers.forEach((tr) => {
    const option = document.createElement("option");
    option.value = tr;
    option.textContent = tr;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    selectedTrainer = e.target.value;
    updateTable();
  });
}
// DAY FILTER
document.querySelectorAll("#dayFilter button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#dayFilter button")
      .forEach((b) => b.classList.remove("active-filter"));

    btn.classList.add("active-filter");
    selectedDay = btn.dataset.day;
    updateTable();
  });
});
// DIFFICULTY FILTER
document.querySelectorAll("#difficultyFilter button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#difficultyFilter button")
      .forEach((b) => b.classList.remove("active-filter"));

    btn.classList.add("active-filter");
    selectedDifficulty = btn.dataset.difficulty;
    updateTable();
  });
});
// SORT EVENTS
function setupSorting() {
  document
    .getElementById("nameHeader")
    .addEventListener("click", () => sortBy("name"));
  document
    .getElementById("timeHeader")
    .addEventListener("click", () => sortBy("time"));
  document
    .getElementById("durationHeader")
    .addEventListener("click", () => sortBy("duration"));
}

function sortBy(key) {
  if (currentSortKey === key) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortKey = key;
    currentSortDirection = "asc";
  }
  updateTable();
}
// INDICATORS
function updateIndicators() {
  document.getElementById("nameHeader").textContent = "Class Name";
  document.getElementById("timeHeader").textContent = "Time";
  document.getElementById("durationHeader").textContent = "Duration";

  if (currentSortKey) {
    const arrow = currentSortDirection === "asc" ? " ▲" : " ▼";

    if (currentSortKey === "name") {
      document.getElementById("nameHeader").textContent += arrow;
    }
    if (currentSortKey === "time") {
      document.getElementById("timeHeader").textContent += arrow;
    }
    if (currentSortKey === "duration") {
      document.getElementById("durationHeader").textContent += arrow;
    }
  }
}
//  INIT
populateTrainerFilter();
setupSorting();
updateTable();
