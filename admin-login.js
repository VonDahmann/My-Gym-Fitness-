// Admin Login + Member Management
// JavaScript + localStorage

// PART 1: ADMIN LOGIN
const loginForm = document.querySelector("form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error");

if (errorMessage) {
  errorMessage.style.display = "none";
}

// Simple static admin credentials

const adminUsername = "admin";
const adminPassword = "123456";

if (loginForm && usernameInput && passwordInput) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === adminUsername && password === adminPassword) {
      localStorage.setItem("isAdminLoggedIn", "true");

      // Change this page if your dashboard page has another name
      window.location.href = "admin-dashboard.html";
    } else {
      if (errorMessage) {
        errorMessage.style.display = "block";
      }
    }
  });
}
function showSection(sectionId) {
  const sections = [
    "member-management",
    "class-management",
    "plan-management",
    "trainer-management",
  ];

  sections.forEach(function (id) {
    const section = document.getElementById(id);

    if (section) {
      section.style.display = "none";
    }
  });

  const selectedSection = document.getElementById(sectionId);

  if (selectedSection) {
    selectedSection.style.display = "block";

    selectedSection.scrollIntoView({
      behavior: "smooth",
    });
  }
}

// PART 2: MEMBER MANAGEMENT

const memberForm = document.getElementById("memberForm");
const memberTableBody = document.getElementById("memberTableBody");
const searchInput = document.getElementById("searchInput");
const planFilter = document.getElementById("planFilter");
const totalMembers = document.getElementById("totalMembers");

let members = JSON.parse(localStorage.getItem("members")) || [];

// Pre-seeded 5 sample members

function seedMembers() {
  if (!localStorage.getItem("members")) {
    const sampleMembers = [
      {
        name: "Ahmed Benali",
        email: "ahmed@gmail.com",
        phone: "0555551111",
        plan: "Gold",
        joinDate: "2026-04-01",
      },
      {
        name: "Sara Amine",
        email: "sara@gmail.com",
        phone: "0666662222",
        plan: "Silver",
        joinDate: "2026-04-03",
      },
      {
        name: "Yacine Karim",
        email: "yacine@gmail.com",
        phone: "0777773333",
        plan: "Bronze",
        joinDate: "2026-04-05",
      },
      {
        name: "Lina Farah",
        email: "lina@gmail.com",
        phone: "0888884444",
        plan: "Gold",
        joinDate: "2026-04-07",
      },
      {
        name: "Nadia Samir",
        email: "nadia@gmail.com",
        phone: "0999995555",
        plan: "Silver",
        joinDate: "2026-04-10",
      },
    ];

    localStorage.setItem("members", JSON.stringify(sampleMembers));
    members = sampleMembers;
  }
}

// Save to localStorage

function saveMembers() {
  localStorage.setItem("members", JSON.stringify(members));
}

// Display Members

function displayMembers(filteredMembers = members) {
  if (!memberTableBody) return;

  memberTableBody.innerHTML = "";

  filteredMembers.forEach((member, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.plan}</td>
      <td>${member.joinDate}</td>
      <td>
        <button onclick="editMember(${index})">Edit</button>
        <button onclick="deleteMember(${index})">Delete</button>
      </td>
    `;

    memberTableBody.appendChild(row);
  });

  updateTotalCount(filteredMembers.length);
}

// Add + Update Member

if (memberForm) {
  memberForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const plan = document.getElementById("plan").value;
    const joinDate = document.getElementById("joinDate").value;
    const memberIndex = document.getElementById("memberIndex").value;

    const memberData = {
      name,
      email,
      phone,
      plan,
      joinDate,
    };

    // Edit existing member
    if (memberIndex !== "") {
      members[memberIndex] = memberData;
    }
    // Add new member
    else {
      members.push(memberData);
    }

    saveMembers();
    displayMembers();
    memberForm.reset();
    document.getElementById("memberIndex").value = "";
  });
}

// Edit Member

function editMember(index) {
  const member = members[index];

  document.getElementById("name").value = member.name;
  document.getElementById("email").value = member.email;
  document.getElementById("phone").value = member.phone;
  document.getElementById("plan").value = member.plan;
  document.getElementById("joinDate").value = member.joinDate;
  document.getElementById("memberIndex").value = index;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Delete Member

function deleteMember(index) {
  const confirmDelete = confirm("Are you sure you want to delete this member?");

  if (confirmDelete) {
    members.splice(index, 1);
    saveMembers();
    applyFilters();
  }
}

// Live Search + Filter

function applyFilters() {
  let filtered = [...members];

  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const selectedPlan = planFilter ? planFilter.value : "All";

  // Search by name or email
  if (searchValue !== "") {
    filtered = filtered.filter(
      (member) =>
        member.name.toLowerCase().includes(searchValue) ||
        member.email.toLowerCase().includes(searchValue),
    );
  }

  // Filter by plan
  if (selectedPlan !== "All") {
    filtered = filtered.filter((member) => member.plan === selectedPlan);
  }

  displayMembers(filtered);
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (planFilter) {
  planFilter.addEventListener("change", applyFilters);
}

// Total Member Count

function updateTotalCount(count) {
  if (totalMembers) {
    totalMembers.textContent = `Total Members: ${count}`;
  }
}

// Initial Load

seedMembers();
displayMembers();
