const summaryContainer = document.getElementById("summary");
const summaryLabel = document.getElementById("summary-label");
const prevBtn = document.getElementById("prev-summary");
const nextBtn = document.getElementById("next-summary");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Load saved tasks
const dailyLog = JSON.parse(localStorage.getItem("dailyLog")) || {};

function renderSummary(month, year) {
  summaryContainer.innerHTML = "";
  let totalTasks = 0;

  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
  summaryLabel.textContent = `${monthName} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = dateObj.toLocaleDateString();
    const log = dailyLog[dateStr];
    const count = log?.count || 0;
    const tasks = log?.tasks || [];

    totalTasks += count;

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("summary-day");

    const barWidth = Math.min(count * 16, 100);

    dayDiv.innerHTML = `
      <strong>${dateStr}</strong> - ${count} task${count === 1 ? "" : "s"}
      <div class="bar" style="width: ${barWidth}%"></div>
      ${tasks.length ? `<small>📝 ${tasks.join(", ")}</small>` : ""}
    `;

    summaryContainer.appendChild(dayDiv);
  }

  const avg = (totalTasks / daysInMonth).toFixed(2);
  const summaryText = document.createElement("p");
  summaryText.innerHTML = `<strong>📈 Total tasks this month:</strong> ${totalTasks}<br>
    <strong>📅 Daily average:</strong> ${avg}`;
  summaryContainer.prepend(summaryText);
}

// Navigation handlers
prevBtn.addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderSummary(currentMonth, currentYear);
});

nextBtn.addEventListener("click", () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderSummary(currentMonth, currentYear);
});

// Initial render
renderSummary(currentMonth, currentYear);
