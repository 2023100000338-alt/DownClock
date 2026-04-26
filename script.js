let countdownTime = 0;
let timerInterval = null;
let isRunning = false;

function updateClock() {
  if (countdownTime <= 0) {
    document.getElementById("clock").innerText = "00:00:00";
    document.getElementById("clock").className = "clock danger";
    document.getElementById("status").innerText = "⏰ TIME'S UP! Exam Finished!";
    document.getElementById("status").className = "status finished";
    stopTimer();
    document.querySelector('.start-btn').disabled = true;
    playAlarm();
    return;
  }

  let hours = Math.floor(countdownTime / 3600000);
  let minutes = Math.floor((countdownTime % 3600000) / 60000);
  let seconds = Math.floor((countdownTime % 60000) / 1000);

  let display = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.getElementById("clock").innerText = display;

  // Visual warnings
  let clockEl = document.getElementById("clock");
  clockEl.className = "clock";
  
  if (countdownTime < 60000) { // Last minute - danger
    clockEl.classList.add("danger");
  } else if (countdownTime < 300000) { // Last 5 minutes - warning
    clockEl.classList.add("warning");
  }
}

function startCountdown() {
  if (isRunning) return;

  let h = parseInt(document.getElementById("hours").value) || 0;
  let m = parseInt(document.getElementById("minutes").value) || 0;
  let s = parseInt(document.getElementById("seconds").value) || 0;

  if (h === 0 && m === 0 && s === 0) {
    alert("⚠️ Please set a valid exam duration!");
    return;
  }

  countdownTime = (h * 3600000) + (m * 60000) + (s * 1000);
  isRunning = true;
  
  document.getElementById("status").innerText = "⏳ Exam in Progress... Don't refresh!";
  document.getElementById("status").className = "status running";
  document.querySelector('.start-btn').disabled = true;

  timerInterval = setInterval(() => {
    countdownTime -= 1000;
    updateClock();
  }, 1000);

  updateClock();
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  countdownTime = 0;
  document.getElementById("clock").innerText = "00:00:00";
  document.getElementById("clock").className = "clock";
  document.getElementById("status").innerText = "Set your exam duration";
  document.getElementById("status").className = "status";
  document.querySelector('.start-btn').disabled = false;
  
  // Clear inputs
  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
  document.getElementById("seconds").value = "";
}

// Alarm sound when time's up
function playAlarm() {
  // Simple beep using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (e) {
    console.log('Audio not supported');
  }
}

// Keyboard shortcuts
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !isRunning) {
    startCountdown();
  } else if (e.key === 'r' || e.key === 'R') {
    resetTimer();
  }
});

// Prevent accidental page refresh during exam
window.addEventListener('beforeunload', function(e) {
  if (isRunning) {
    e.preventDefault();
    e.returnValue = 'Exam is running! Are you sure you want to leave?';
    return 'Exam is running! Are you sure you want to leave?';
  }
});