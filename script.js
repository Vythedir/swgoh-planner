// Accounts
const accounts = ["Vythedir", "Gamegeekfreak", "Eussurin"];
let currentAccount = accounts[0];
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

// Add a new goal
function addGoal() {
  const goalName = prompt("Enter your new general goal:");
  if (goalName) {
    data[currentAccount].goals.push({ name: goalName, progress: 0 });
    saveData();
    renderGoals();
    renderDashboard();
  }
}

// Render goals
function renderGoals() {
  const goalList = document.getElementById("goalList");
  goalList.innerHTML = "";

  data[currentAccount].goals.forEach(goal => {
    const div = document.createElement("div");
    div.textContent = `${goal.name} – Progress: ${goal.progress}%`;
    goalList.appendChild(div);
  });
}

// Render dashboard
function renderDashboard() {
  const activeGoal = document.getElementById("activeGoal");
  const goals = data[currentAccount].goals;

  if (goals.length > 0) {
    activeGoal.textContent = `Active Goal: ${goals[0].name} (${goals[0].progress}%)`;
  } else {
    activeGoal.textContent = "No active goal set.";
  }
}

// Initial render
renderTabs();
renderGoals();
renderDashboard();
