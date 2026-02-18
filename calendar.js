const calendarContainer = document.getElementById("calendar");
const monthLabel = document.getElementById("month-label");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const dailyLog = JSON.parse(localStorage.getItem("dailyLog")) || {};

function renderCalendar(month, year) {
  calendarContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  // Blank days before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("calendar-day", "empty");
    calendarContainer.appendChild(empty);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = dateObj.toLocaleDateString();
    const logForDay = dailyLog[dateStr];
    const tasksDone = logForDay?.count || 0;
    const taskList = logForDay?.tasks || [];

    const dayBox = document.createElement("div");
    dayBox.classList.add("calendar-day");

    const isToday = dateStr === new Date().toLocaleDateString();
    if (isToday) {
      dayBox.classList.add("today");
    }

    if (tasksDone >= 6) {
      dayBox.classList.add("completed");
      dayBox.innerHTML = `<strong>${day}</strong><br/>✅ ${tasksDone}/6`;
    } else if (dateObj < new Date()) {
      dayBox.classList.add("missed");
      dayBox.innerHTML = `<strong>${day}</strong><br/>❌ ${tasksDone}/6`;
    } else {
      dayBox.innerHTML = `<strong>${day}</strong>`;
    }

    // Add tooltip with task names
    if (taskList.length > 0) {
      dayBox.title = taskList.join("\n");
    }

    calendarContainer.appendChild(dayBox);
  }
}

// Navigation buttons
prevMonthBtn.addEventListener("click", () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener("click", () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
});

// Initial render
renderCalendar(currentMonth, currentYear);
