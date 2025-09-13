// =============================
// Data Setup
// =============================

// Accounts
const accounts = ["Vythedir", "Gamegeekfreak", "Eussurin"];
let currentAccount = accounts[0];

// Local storage data
let data = JSON.parse(localStorage.getItem("swgohPlanner")) || {};

// Initialize accounts in storage
accounts.forEach(acc => {
  if (!data[acc]) {
    data[acc] = { goals: [] };
  }
});

// Save data
function saveData() {
  localStorage.setItem("swgohPlanner", JSON.stringify(data));
}

// =============================
// Requirements Library (from JSON)
// =============================
let requirementsData = {};

fetch("requirements.json")
  .then(response => response.json())
  .then(json => {
    requirementsData = json;
    console.log("Requirements loaded:", requirementsData);
  })
  .catch(err => console.error("Error loading requirements:", err));

// =============================
// Render Functions
// =============================

// Render account tabs
function renderTabs() {
  const tabContainer = document.getElementById("accountTabs");
  tabContainer.innerHTML = "";

  accounts.forEach(acc => {
    const btn = document.createElement("button");
    btn.textContent = acc;
    btn.classList.toggle("active", acc === currentAccount);
    btn.addEventListener("click", () => {
      currentAccount = acc;
      renderTabs();
      renderGoals();
      renderDashboard();
    });
    tabContainer.appendChild(btn);
  });
}

// Render goals
function renderGoals() {
  const goalList = document.getElementById("goalList");
  goalList.innerHTML = "";

  data[currentAccount].goals.forEach(goal => {
    const div = document.createElement("div");

    if (goal.type === "event" && goal.requirements) {
      // Show structured event requirements
      div.innerHTML = `
        <strong>${goal.name}</strong> (Event Goal)<br>
        Overall Progress: ${calculateGoalProgress(goal)}%<br>
        <ul>
          ${goal.requirements.map(req => `
            <li>
              ${req.toon || req.ship || req.faction} – 
              Target: ⭐${req.stars || "-"} / G${req.gear || "-"} / R${req.relic || "-"}
            </li>`).join("")}
        </ul>
      `;
    } else {
      // Show custom goal
      div.innerHTML = `<strong>${goal.name}</strong> (Custom Goal)`;
    }

    goalList.appendChild(div);
  });
}

// Render dashboard
function renderDashboard() {
  const activeGoal = document.getElementById("activeGoal");
  const goals = data[currentAccount].goals;

  if (goals.length > 0) {
    const goal = goals[0]; // For now, first goal is "active"
    activeGoal.textContent = `Active Goal: ${goal.name} (${goal.type})`;
  } else {
    activeGoal.textContent = "No active goal set.";
  }
}

// =============================
// Goal Logic
// =============================

// Populate event dropdown after JSON loads
function populateEventDropdown() {
  const eventSelect = document.getElementById("eventGoalName");
  eventSelect.innerHTML = "";

  Object.keys(requirementsData).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = requirementsData[key].name;
    eventSelect.appendChild(option);
  });
}

// Show/hide inputs depending on goal type
document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("goalType");
  const customInput = document.getElementById("customGoalInput");
  const eventInput = document.getElementById("eventGoalInput");

  typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "event") {
      customInput.style.display = "none";
      eventInput.style.display = "block";
    } else {
      customInput.style.display = "block";
      eventInput.style.display = "none";
    }
  });
});

// Add a new goal from form
function addGoal() {
  const type = document.getElementById("goalType").value;
  let newGoal = { type };

  if (type === "event") {
    const eventKey = document.getElementById("eventGoalName").value;
    if (requirementsData[eventKey]) {
      newGoal.name = requirementsData[eventKey].name;
      newGoal.requirements = requirementsData[eventKey].requirements;
    }
  } else {
    const name = document.getElementById("customGoalName").value.trim();
    if (!name) {
      alert("Please enter a goal name");
      return;
    }
    newGoal.name = name;
  }

  data[currentAccount].goals.push(newGoal);
  saveData();
  renderGoals();
  renderDashboard();

  // Reset form
  document.getElementById("customGoalName").value = "";
  document.getElementById("goalType").value = "custom";
  document.getElementById("customGoalInput").style.display = "block";
  document.getElementById("eventGoalInput").style.display = "none";
}


// Calculate progress of event goal
function calculateGoalProgress(goal) {
  if (!goal.requirements) return 0;
  // TODO: later we’ll compare user’s actual roster to requirements
  // For now, just return placeholder 0
  return 0;
}

// =============================
// Initial Render
// =============================
renderTabs();
renderGoals();
renderDashboard();
