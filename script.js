let customTime = null;

// live clock
function updateClock() {
  let now = customTime ? new Date(customTime) : new Date();

  if (customTime) {
    customTime += 1000; // simulate ticking
  }

  let h = String(now.getHours()).padStart(2, "0");
  let m = String(now.getMinutes()).padStart(2, "0");
  let s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("clock").innerText = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);

// set custom time
function setTime() {
  let h = document.getElementById("hour").value || 0;
  let m = document.getElementById("minute").value || 0;
  let s = document.getElementById("second").value || 0;

  let now = new Date();
  now.setHours(h);
  now.setMinutes(m);
  now.setSeconds(s);

  customTime = now.getTime();
}

// reset to real time
function resetTime() {
  customTime = null;
}