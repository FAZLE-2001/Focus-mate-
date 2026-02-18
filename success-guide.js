// ===============================
// GLOBAL SELECTORS
// ===============================

const goalDaysInput = document.getElementById("goalDays");
const remainingDaysSpan = document.getElementById("remainingDays");
const goalInput = document.getElementById("goalInput");
const planA = document.getElementById("planA");
const planB = document.getElementById("planB");
const evaluationBox = document.getElementById("evaluationBox");
const adaptBox = document.getElementById("adaptBox");
const successMessage = document.getElementById("successMessage");

// ===============================
// STEP 1 – GOAL + DYNAMIC DAYS
// ===============================

goalDaysInput.addEventListener("input", () => {
  const days = parseInt(goalDaysInput.value);
  if (!days) return;

  const startDate = new Date();
  const targetDate = new Date();
  targetDate.setDate(startDate.getDate() + days);

  localStorage.setItem("goalStartDate", startDate);
  localStorage.setItem("goalTargetDate", targetDate);
  localStorage.setItem("goalDays", days);

  updateRemainingDays();
});

goalInput.addEventListener("input", () => {
  localStorage.setItem("goalText", goalInput.value);
});

function updateRemainingDays() {
  const targetDate = new Date(localStorage.getItem("goalTargetDate"));
  const today = new Date();

  const diff = targetDate - today;
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysLeft >= 0) {
    remainingDaysSpan.textContent = daysLeft;
  } else {
    remainingDaysSpan.textContent = "Goal time passed";
  }
}

// ===============================
// STEP 2 – PLAN A & B (SAVE + RESTORE)
// ===============================

function generatePlans(container, label) {
  for (let i = 1; i <= 6; i++) {

    const savedText = localStorage.getItem(`plan${label}_text_${i}`) || "";
    const savedChecked = localStorage.getItem(`plan${label}_check_${i}`) === "true";

    const div = document.createElement("div");
    div.classList.add("action-item");
    div.innerHTML = `
      <input type="text" 
             value="${savedText}" 
             placeholder="Action ${i}" 
             data-plan="${label}" 
             data-index="${i}">
      <input type="checkbox" 
             ${savedChecked ? "checked" : ""} 
             data-plan="${label}" 
             data-index="${i}">
    `;

    container.appendChild(div);
  }

  // Save text inputs
  container.querySelectorAll("input[type='text']").forEach(input => {
    input.addEventListener("input", () => {
      localStorage.setItem(
        `plan${input.dataset.plan}_text_${input.dataset.index}`,
        input.value
      );
    });
  });

  // Save checkboxes
  container.querySelectorAll("input[type='checkbox']").forEach(box => {
    box.addEventListener("change", () => {
      localStorage.setItem(
        `plan${box.dataset.plan}_check_${box.dataset.index}`,
        box.checked
      );
    });
  });
}

// ===============================
// STEP 3 – EVALUATE
// ===============================

function evaluatePlans() {
  evaluationBox.innerHTML = "";

  const checkedBoxes = document.querySelectorAll(
    "#planA input[type='checkbox']:checked, #planB input[type='checkbox']:checked"
  );

  const evaluated = [];

  checkedBoxes.forEach(box => {
    const text = box.previousElementSibling.value.trim();
    if (text !== "") {
      evaluated.push(text);

      const div = document.createElement("div");
      div.classList.add("evaluation-item");
      div.textContent = text;
      evaluationBox.appendChild(div);
    }
  });

  localStorage.setItem("evaluatedActions", JSON.stringify(evaluated));
  generateAdaptSection(evaluated);
}

// ===============================
// STEP 4 – ADAPT (SAVE + RESTORE)
// ===============================

function generateAdaptSection(actions) {
  adaptBox.innerHTML = "";

  actions.forEach((text, index) => {

    const savedDays = localStorage.getItem(`adapt_days_${index}`) || "";
    const savedCheck = localStorage.getItem(`adapt_check_${index}`) === "true";

    const div = document.createElement("div");
    div.classList.add("adapt-item");
    div.innerHTML = `
      <p>${text}</p>
      <input type="number" 
             value="${savedDays}" 
             placeholder="Set days" 
             data-index="${index}">
      <label>
        Completed 
        <input type="checkbox" 
               class="finalCheck" 
               data-index="${index}" 
               ${savedCheck ? "checked" : ""}>
      </label>
    `;

    adaptBox.appendChild(div);
  });

  saveAdaptListeners();
  checkFinalCompletion();
}

function saveAdaptListeners() {

  document.querySelectorAll("#adaptBox input[type='number']").forEach(input => {
    input.addEventListener("input", () => {
      localStorage.setItem(
        `adapt_days_${input.dataset.index}`,
        input.value
      );
    });
  });

  document.querySelectorAll(".finalCheck").forEach(box => {
    box.addEventListener("change", () => {
      localStorage.setItem(
        `adapt_check_${box.dataset.index}`,
        box.checked
      );
      checkFinalCompletion();
    });
  });
}

function checkFinalCompletion() {
  const checks = document.querySelectorAll(".finalCheck");
  const allChecked =
    checks.length > 0 &&
    [...checks].every(cb => cb.checked);

  successMessage.style.display = allChecked ? "block" : "none";
}

// ===============================
// RESET FUNCTION
// ===============================

function resetSuccessGuide() {
  if (!confirm("Are you sure you want to reset everything?")) return;

  Object.keys(localStorage).forEach(key => {
    if (
      key.startsWith("planA_") ||
      key.startsWith("planB_") ||
      key.startsWith("adapt_") ||
      key === "goalText" ||
      key === "goalStartDate" ||
      key === "goalTargetDate" ||
      key === "goalDays" ||
      key === "evaluatedActions"
    ) {
      localStorage.removeItem(key);
    }
  });

  location.reload();
}

// ===============================
// RESTORE EVERYTHING ON LOAD
// ===============================

window.addEventListener("load", () => {

  // Restore goal
  const savedGoal = localStorage.getItem("goalText");
  const savedGoalDays = localStorage.getItem("goalDays");

  if (savedGoal) goalInput.value = savedGoal;
  if (savedGoalDays) goalDaysInput.value = savedGoalDays;

  if (localStorage.getItem("goalTargetDate")) {
    updateRemainingDays();
  }

  // Generate plans
  generatePlans(planA, "A");
  generatePlans(planB, "B");

  // Restore evaluated
  const savedEval = JSON.parse(localStorage.getItem("evaluatedActions")) || [];
  if (savedEval.length > 0) {
    generateAdaptSection(savedEval);
  }
});
