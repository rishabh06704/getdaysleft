const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const results = document.getElementById("results");

startBtn.addEventListener("click", () => {
  results.classList.remove("hidden");
});

resetBtn.addEventListener("click", () => {
  results.classList.add("hidden");
});
