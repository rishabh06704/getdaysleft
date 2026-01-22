// getdaysleft.com — countdown logic (vanilla JS)

let timerId = null;

// Elements
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const results = document.getElementById("results");

const bigDaysEl = document.getElementById("bigDays");
const bigLabel = document.getElementById("bigLabel");
const statusLine = document.getElementById("statusLine");

const daysVal = document.getElementById("daysVal");
const hoursVal = document.getElementById("hoursVal");
const minsVal = document.getElementById("minsVal");
const secsVal = document.getElementById("secsVal");
const targetText = document.getElementById("targetText");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const copyToast = document.getElementById("copyToast");


// Helpers
function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

function parseTargetLocalDateTime() {
  const d = dateInput.value; // "YYYY-MM-DD"
  const t = timeInput.value || "00:00"; // "HH:MM"

  if (!d) return null;

  const [yyyy, mm, dd] = d.split("-").map(Number);
  const [hh, min] = t.split(":").map(Number);

  return new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
}

function showToast(message) {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.remove("hidden");
  setTimeout(() => copyToast.classList.add("hidden"), 1500);
}

function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateCountdownOnce(target) {
  const now = new Date();
  const diffMsRaw = target.getTime() - now.getTime();

  const isPast = diffMsRaw < 0;
  const diffMs = Math.abs(diffMsRaw);

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Big line number + label
  setText(bigDaysEl, formatNumber(totalDays));
  if (bigLabel) setText(bigLabel, isPast ? "days ago" : "days left");

  // Cards (total values)
  setText(daysVal, formatNumber(totalDays));
  setText(hoursVal, formatNumber(totalHours));
  setText(minsVal, formatNumber(totalMinutes));
  setText(secsVal, formatNumber(totalSeconds));

  // Status message
  if (statusLine) {
    if (isPast) {
      statusLine.classList.add("past");
      setText(statusLine, "This date has already passed.");
      show(statusLine);
    } else {
      statusLine.classList.remove("past");
      hide(statusLine);
      setText(statusLine, "");
    }
  }

  // Target line
  if (targetText) {
    const opts = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    setText(targetText, `${target.toLocaleString(undefined, opts)} (Local time)`);
  }

  // Stop only when a FUTURE countdown reaches zero (or crosses it)
  if (!isPast && diffMsRaw <= 0) {
    stopTimer();
    // Optional: keep the UI at 0 (it will already be near 0)
  }
}

function startCountdown() {
  const target = parseTargetLocalDateTime();

  if (!target) {
    alert("Please select a date first.");
    return;
  }

  // Show results & ensure only one timer runs
  results.classList.remove("hidden");
  stopTimer();

  // Update immediately, then tick every second
  updateCountdownOnce(target);
  const shareUrl = buildShareUrl();
  timerId = setInterval(() => updateCountdownOnce(target), 1000);
}

function resetAll() {
  stopTimer();
  results.classList.add("hidden");

  // Reset display
  setText(bigDaysEl, "0");
  if (bigLabel) setText(bigLabel, "days left");
  setText(daysVal, "0");
  setText(hoursVal, "0");
  setText(minsVal, "0");
  setText(secsVal, "0");
  if (targetText) setText(targetText, "");

  if (statusLine) {
    statusLine.classList.remove("past");
    hide(statusLine);
    setText(statusLine, "");
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("Copied to clipboard");
  }
}




function buildShareUrl() {
  const d = dateInput.value;
  const t = timeInput.value || "00:00";
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("date", d);
  url.searchParams.set("time", t);
  return url.toString();
}



// Events
startBtn.addEventListener("click", startCountdown);
resetBtn.addEventListener("click", resetAll);

if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", () => {
    if (!dateInput.value) return showToast("Select a date first");
    copyToClipboard(buildShareUrl());
  });
}






