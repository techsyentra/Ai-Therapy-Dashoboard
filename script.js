/* 
  AI THERAPY PLATFORM - ENTERPRISE LOGIC CONTROLLER
  Updated: Role-Play Logic, Whisper Line, Safety Controls
*/

class EnterpriseSession {
  constructor() {
    this.timerSeconds = 0;
    this.isActive = true;
    this.isPaused = false;

    // UI Refs
    this.timerEl = document.getElementById("sessionTimer");
    this.statusText = document.getElementById("aiStatus");

    // Logic Refs
    this.sentimentVal = document.getElementById("sentimentValue");
    this.sentimentFill = document.getElementById("sentimentFill");
    this.engagementVal = document.getElementById("engagementValue");
    this.engagementFill = document.getElementById("engagementFill");

    this.init();
  }

  init() {
    this.startClock();
    this.startDataStream();
    this.bindEvents();
    console.log("Enterprise System Initialized: Secure Enclave Active");
  }

  bindEvents() {
    // --- MODE SWITCHING ---
    const roleplayOptions = document.getElementById("roleplayOptions");
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        // Toggle Active State
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Handle Role-Play Visibility
        const mode = btn.dataset.mode;
        if (mode === "roleplay") {
          roleplayOptions.style.display = "block";
          this.statusText.innerText = "Simulating: 'Difficult Persona' (Therapist Mode)";
        } else {
          roleplayOptions.style.display = "none";
          this.statusText.innerText = mode === "training" ? "Supervision Mode Active" : "Listening to patient...";
        }
      });
    });

    // --- ROLE PLAY SUB-TOGGLES ---
    document.querySelectorAll(".rp-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".rp-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const role = btn.dataset.role;
        if (role === "patient") {
          this.statusText.innerText = "AI Acting as Patient (You are Therapist)";
          console.log("[SYSTEM]: Switching context -> PATIENT PERSONA (Waiting for user input...)");
          this.showToast("System Prompt: Patient Persona Active");
        } else {
          this.statusText.innerText = "AI Acting as Therapist (You are Patient)";
          console.log("[SYSTEM]: Switching context -> THERAPIST PERSONA");
          this.showToast("System Prompt: Therapist Persona Active");
        }
      });
    });

    // --- WHISPER LINE ---
    const whisperInput = document.getElementById("whisperInput");
    if (whisperInput) {
      // Auto-Deactivation (Blur) Logic
      whisperInput.addEventListener("blur", () => {
        console.log("[WHISPER]: Input deactivated (user clicked away)");
      });

      whisperInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const text = whisperInput.value.trim();
          if (text) {
            console.log(`[WHISPER SENT]: ${text} (Audio Stream Uninterrupted)`);
            // Visual Feedback
            whisperInput.value = "";
            whisperInput.blur(); // Auto-blur after sending
            this.showToast("Instruction Sent (Live)");
          }
        }
      });
    }

    // --- SEGMENT CONTROLS (Gender / Pace) ---
    document.querySelectorAll(".segment-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        // Only toggle siblings in same container
        const parent = this.closest(".segment-control");
        parent.querySelectorAll(".segment-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        console.log(`[CONFIG]: Changed setting to ${this.innerText}`);
      });
    });

    // --- SAFETY CONTROLS ---
    // Pause
    const pauseBtn = document.getElementById("pauseSessionBtn");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          pauseBtn.innerText = "RESUME";
          pauseBtn.classList.add("paused");
          this.statusText.innerText = "SESSION PAUSED";
          document.getElementById("audioWave").style.opacity = "0.2";
        } else {
          pauseBtn.innerText = "PAUSE";
          pauseBtn.classList.remove("paused");
          this.statusText.innerText = "Listening to patient...";
          document.getElementById("audioWave").style.opacity = "1";
        }
      });
    }

    // Stop (Modal)
    const modal = document.getElementById("modal");
    document.getElementById("stopSessionBtn").addEventListener("click", () => modal.classList.add("active"));
    document.getElementById("cancelModal").addEventListener("click", () => modal.classList.remove("active"));
    document.getElementById("confirmEnd").addEventListener("click", () => {
      this.endSession();
      modal.classList.remove("active");
    });
  }

  startClock() {
    setInterval(() => {
      if (!this.isActive || this.isPaused) return;
      this.timerSeconds++;
      const m = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
      const s = String(this.timerSeconds % 60).padStart(2, '0');
      this.timerEl.innerText = `${m}:${s}`;
    }, 1000);
  }

  startDataStream() {
    // Mocking live metrics
    setInterval(() => {
      if (!this.isActive || this.isPaused) return;

      const sentiment = 70 + Math.floor(Math.random() * 20 - 10);
      const engagement = 85 + Math.floor(Math.random() * 10 - 5);

      this.updateMetric(this.sentimentFill, document.getElementById("sentimentValue"), sentiment);
      this.updateMetric(this.engagementFill, document.getElementById("engagementValue"), engagement);

      // Update secondary stats randomly
      if (Math.random() > 0.7) {
        document.getElementById("trustScore").innerText = (0.8 + Math.random() * 0.15).toFixed(2);
      }
    }, 2500);
  }

  updateMetric(fillEl, textEl, val) {
    if (!fillEl || !textEl) return;
    fillEl.style.width = `${val}%`;
    textEl.innerText = `${val}%`;

    if (val < 50) fillEl.style.background = "#ef4444";
    else fillEl.style.background = "linear-gradient(90deg, #2C845B, #38bdf8)";
  }

  showToast(msg) {
    // Simple custom toast for feedback
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#2C845B";
    toast.style.color = "white";
    toast.style.padding = "8px 16px";
    toast.style.borderRadius = "50px";
    toast.style.fontSize = "12px";
    toast.style.animation = "fadeUp 0.3s ease";
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  endSession() {
    this.isActive = false;
    this.statusText.innerText = "Session Finalized. Uploading logs...";
    this.statusText.style.color = "#94a3b8";
    document.querySelector(".avatar-core").style.background = "#334155";
    document.querySelector(".ring-ripple").style.display = "none";
    document.getElementById("audioWave").style.opacity = 0;

    alert("Session Ended. Secure logs generated.");
  }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  new EnterpriseSession();
});