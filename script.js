// ===== Pomodoro Timer =====

let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("start-btn");
let pauseBtn = document.getElementById("pause-btn");
let resetBtn = document.getElementById("reset-btn");
let quoteDisplay = document.getElementById("quote");
let pomodoroCount = 0;

let timer;
let timeLeft = 25 * 60;
let isRunning = false;

const quotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success is what comes after you stop making excuses.",
  "Great things never come from comfort zones.",
  "Do something today that your future self will thank you for.",
  "Discipline is the bridge between goals and accomplishment.",
  "Small steps every day lead to big results.",
  "You don’t have to be great to start, but you have to start to be great."
];

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        pomodoroCount++;
        alert("Time's up! Take a short break.");
        showRandomQuote();
        localStorage.setItem("pomodoroCount", pomodoroCount);
        resetTimer();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 25 * 60;
  isRunning = false;
  updateDisplay();
}

function showRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = `"${quotes[index]}"`;
}

updateDisplay();
showRandomQuote();

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ===== Enhanced Daily Task System =====

const taskContainer = document.getElementById("task-container");
const dailyProgress = document.getElementById("daily-progress");
const progressText = document.getElementById("progress-text");

const totalTasks = 6;
let tasksCompleted = 0;
let taskTimers = [];

function generateDailyTasks() {
  for (let i = 0; i < totalTasks; i++) {
    const taskBlock = document.createElement("div");
    taskBlock.className = "task-block";
    taskBlock.innerHTML = `
      <input type="text" placeholder="Task ${i + 1} name" class="task-name" />
      <input type="number" placeholder="Minutes" class="task-time" min="1" />
      <button class="start-task-btn">Start</button>
      <span class="task-timer">⏱ Not started</span>
    `;
    taskContainer.appendChild(taskBlock);
  }

  document.querySelectorAll(".start-task-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => startTaskTimer(index));
  });
}

function startTaskTimer(index) {
  const taskBlock = document.querySelectorAll(".task-block")[index];
  const timeInput = taskBlock.querySelector(".task-time");
  const nameInput = taskBlock.querySelector(".task-name");
  const timerText = taskBlock.querySelector(".task-timer");

  const minutes = parseInt(timeInput.value);
  if (!minutes || minutes <= 0) {
    alert("Enter valid time in minutes");
    return;
  }

  let secondsLeft = minutes * 60;

  const interval = setInterval(() => {
    if (secondsLeft <= 0) {
      clearInterval(interval);
      timerText.textContent = "✅ Completed!";
      completeTask(index);
      return;
    }

    secondsLeft--;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    timerText.textContent = `⏱ ${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, 1000);

  taskTimers[index] = interval;
}

function completeTask(index) {
  tasksCompleted++;
  updateProgress();

  const taskBlock = document.querySelectorAll(".task-block")[index];
  const taskName =
    taskBlock.querySelector(".task-name").value || `Task ${index + 1}`;

  taskBlock.querySelector(".start-task-btn").disabled = true;
  taskBlock.querySelector(".task-time").disabled = true;
  taskBlock.querySelector(".task-name").disabled = true;

  const today = new Date().toLocaleDateString();
  let dailyLog = JSON.parse(localStorage.getItem("dailyLog")) || {};

  if (!dailyLog[today]) {
    dailyLog[today] = {
      count: 0,
      tasks: []
    };
  }

  dailyLog[today].count++;
  dailyLog[today].tasks.push(taskName);

  localStorage.setItem("dailyLog", JSON.stringify(dailyLog));
}

function updateProgress() {
  dailyProgress.value = tasksCompleted;
  progressText.textContent = `${tasksCompleted} / 6 completed`;
}

generateDailyTasks();
