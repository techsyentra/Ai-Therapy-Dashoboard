/* PREMIUM SESSION CONTROLLER
   - Smooth Transitions
   - State-Driven UI
*/

// 1. Optimized Timer (Tabular Numbers Support)
let seconds = 0;
const timerEl = document.getElementById("sessionTimer");

const updateTimer = () => {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  timerEl.textContent = `${mins}:${secs}`;
};

let timerInterval = setInterval(updateTimer, 1000);

// 2. Premium Button Toggle Logic
document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Add a small scale effect on click
    btn.style.transform = "scale(0.95)";
    setTimeout(() => btn.style.transform = "scale(1)", 100);
    
    btn.classList.toggle("active");
  });
});

// 3. Radio Group Emulation for Select Buttons
document.querySelectorAll(".option-row").forEach(group => {
  const buttons = group.querySelectorAll(".select-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

// 4. Modal Logic with Smooth Fade
const modal = document.getElementById("modal");
const stopBtn = document.getElementById("stopSessionBtn");
const cancelModal = document.getElementById("cancelModal");

const toggleModal = (show) => {
  modal.style.opacity = show ? "1" : "0";
  modal.style.visibility = show ? "visible" : "hidden";
  modal.style.transition = "all 0.3s ease";
};

stopBtn.addEventListener("click", () => toggleModal(true));
cancelModal.addEventListener("click", () => toggleModal(false));

// Close modal on background click
modal.addEventListener("click", (e) => {
  if (e.target === modal) toggleModal(false);
});