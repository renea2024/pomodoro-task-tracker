// ====== TIMER MODULE ======
const Timer = (() => {
  let timer = null;
  let timeLeft = 1500; // 25 min focus
  let isRunning = false;
  let isBreak = false;

  const timerDisplay = document.getElementById("timer");
  const body = document.body;
  const breakIndicator = document.getElementById("break-indicator");
  const breakEndSound = new Audio("notification.mp3");

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;

        if (isBreak) {
          endBreak();
        } else {
          alert("Time's up!");
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = isBreak ? 300 : 1500;
    isRunning = false;
    updateDisplay();
  }

  function toggleBreakMode() {
    isBreak = !isBreak;
    body.classList.toggle("break-mode");
    breakIndicator.textContent = isBreak ? "Break time" : "";
    resetTimer();
  }

  function endBreak() {
    isBreak = false;
    body.classList.remove("break-mode");
    breakIndicator.textContent = "";
    timeLeft = 1500;
    updateDisplay();
    breakEndSound.play();
    startTimer();
  }

  // Expose only needed functions
  return {
    startTimer,
    pauseTimer,
    resetTimer,
    toggleBreakMode,
    isBreak: () => isBreak,
  };
})();

// ====== TASK MODULE ======
const TaskManager = (() => {
  const todoList = document.getElementById("todo-list");
  const inProgressList = document.getElementById("in-progress-list");
  const completeList = document.getElementById("complete-list");

  function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;

    const startBtn = document.createElement("button");
    startBtn.textContent = "▶";
    startBtn.setAttribute("aria-label", "Start task");
    startBtn.onclick = () => startTask(li, startBtn, completeBtn);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.setAttribute("aria-label", "Complete task");
    completeBtn.onclick = () => completeTask(li, completeBtn, deleteBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.onclick = () => li.remove();

    li.appendChild(startBtn);
    return li;
  }

  function startTask(taskElement, startBtn, completeBtn) {
    inProgressList.appendChild(taskElement);
    taskElement.removeChild(startBtn);
    taskElement.appendChild(completeBtn);
    Timer.startTimer();
  }

  function completeTask(taskElement, completeBtn, deleteBtn) {
    completeList.appendChild(taskElement);
    taskElement.removeChild(completeBtn);
    taskElement.appendChild(deleteBtn);
    Timer.toggleBreakMode();
    Timer.startTimer();
  }

  function addTask(taskText) {
    if (!taskText.trim()) return; // Basic validation
    const taskElement = createTaskElement(taskText);
    todoList.appendChild(taskElement);
  }

  return { addTask };
})();

// ====== MODAL MODULE ======
const Modal = (() => {
  const helpModal = document.getElementById("helpModal");
  const openHelp = document.getElementById("openHelp");
  const closeHelp = document.getElementById("closeHelp");

  function open() {
    helpModal.style.display = "block";
  }

  function close() {
    helpModal.style.display = "none";
  }

  openHelp.addEventListener("click", open);
  closeHelp.addEventListener("click", close);

  window.addEventListener("click", (e) => {
    if (e.target === helpModal) close();
  });

  return { open, close };
})();

// ====== EVENT LISTENERS ======
document.getElementById("pausebtn").addEventListener("click", () => {
  Timer.pauseTimer();
});
document.getElementById("resetbtn").addEventListener("click", () => {
  Timer.resetTimer();
});
document.getElementById("breakbtn").addEventListener("click", () => {
  Timer.toggleBreakMode();
});

document.getElementById("add-task-btn").addEventListener("click", () => {
  const newTaskInput = document.getElementById("new-task");
  TaskManager.addTask(newTaskInput.value);
  newTaskInput.value = "";
});

// ====== INIT ======
(() => {
  // Initial timer display update
  Timer.resetTimer();
})();
