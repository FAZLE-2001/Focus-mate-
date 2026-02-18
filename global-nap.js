const napInput = document.getElementById("napTime");
const napCountdown = document.getElementById("napCountdown");
const napModal = document.getElementById("napModal");

let alarmAudio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
let napInterval = null; // 🔥 Important: single global interval

// ==========================
// SAVE NAP TIME
// ==========================
function saveNapTime() {

  const selectedTime = napInput.value;

  if (!selectedTime) {
    alert("Please select a time.");
    return;
  }

  const [hours, minutes] = selectedTime.split(":");

  const now = new Date();
  const napDate = new Date();

  napDate.setHours(parseInt(hours));
  napDate.setMinutes(parseInt(minutes));
  napDate.setSeconds(0);

  // If time already passed today → set for tomorrow
  if (napDate <= now) {
    napDate.setDate(napDate.getDate() + 1);
  }

  localStorage.setItem("napTimestamp", napDate.getTime());

  startCountdown();
}


// ==========================
// CANCEL NAP
// ==========================
function cancelNap() {

  localStorage.removeItem("napTimestamp");

  if (napInterval) {
    clearInterval(napInterval);
    napInterval = null;
  }

  napCountdown.textContent = "";
  napModal.style.display = "none";

  alarmAudio.pause();
  alarmAudio.currentTime = 0;

  alert("💤 Power Nap cancelled.");
}


// ==========================
// SNOOZE 10 MINUTES
// ==========================
function snoozeNap() {

  const newTime = new Date().getTime() + 10 * 60000;

  localStorage.setItem("napTimestamp", newTime);

  closeNapModal();
  startCountdown();
}


// ==========================
// CLOSE MODAL
// ==========================
function closeNapModal() {

  napModal.style.display = "none";

  alarmAudio.pause();
  alarmAudio.currentTime = 0;
}


// ==========================
// SHOW MODAL
// ==========================
function showNapModal() {

  napModal.style.display = "block";

  alarmAudio.play().catch(() => {
    console.log("Autoplay blocked by browser.");
  });
}


// ==========================
// START COUNTDOWN
// ==========================
function startCountdown() {

  const savedTimestamp = parseInt(localStorage.getItem("napTimestamp"));

  if (!savedTimestamp) return;

  // 🔥 Clear old interval before starting new one
  if (napInterval) {
    clearInterval(napInterval);
  }

  napInterval = setInterval(() => {

    const now = new Date().getTime();
    const distance = savedTimestamp - now;

    if (distance <= 0) {

      clearInterval(napInterval);
      napInterval = null;

      localStorage.removeItem("napTimestamp");
      napCountdown.textContent = "";

      showNapModal();
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    napCountdown.textContent =
      `⏳ ${hours}h ${minutes}m ${seconds}s remaining`;

  }, 1000);
}


// ==========================
// RESTORE ON PAGE LOAD
// ==========================
window.addEventListener("load", () => {

  const savedTimestamp = parseInt(localStorage.getItem("napTimestamp"));

  if (!savedTimestamp) return;

  const napDate = new Date(savedTimestamp);

  const hours = napDate.getHours().toString().padStart(2, "0");
  const minutes = napDate.getMinutes().toString().padStart(2, "0");

  napInput.value = `${hours}:${minutes}`;

  startCountdown();
});
