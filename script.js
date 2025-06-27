// script.js – Advanced Quiz System with Timer, Touch, Keyboard, Dark Mode & Dropdown JSON Switch

let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLimit = 20; // seconds per question

function loadQuiz(jsonFile) {
  fetch(jsonFile)
    .then(res => res.json())
    .then(data => {
      questions = shuffleArray(data);
      current = 0;
      score = 0;
      showQuestion();
    });
}

function showQuestion() {
  clearInterval(timer);
  const q = questions[current];
  document.getElementById("question").innerText = `${current + 1}. ${q.question}`;

  const optsHTML = q.options.map((opt, i) => `
    <label class="option">
      <input type="radio" name="opt" value="${i}"> ${opt}
    </label>
  `).join('');

  document.getElementById("options").innerHTML = `<div class="grid-options">${optsHTML}</div>`;

  startTimer(timeLimit);
  updateProgress();
}

function checkAnswer() {
  const selected = document.querySelector("input[name='opt']:checked");
  if (!selected) return;
  questions[current].userAnswer = parseInt(selected.value);
  if (questions[current].userAnswer === questions[current].answer) score++;
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(timer);
  const result = questions.map((q, i) => {
    const correct = q.answer === q.userAnswer;
    return `<p class="result-qa">${i + 1}. ${q.question}<br>
    আপনার উত্তর: <span style="color:${correct ? 'green' : 'red'}">${q.options[q.userAnswer] || '❌ দেননি'}</span><br>
    সঠিক উত্তর: ✅ ${q.options[q.answer]}</p>`;
  }).join('<hr>');
  document.getElementById("quiz-container").innerHTML = `
    <h2>আপনার স্কোর: ${score}/${questions.length}</h2>
    ${result}
    <button onclick=\"restartQuiz()\">🔁 আবার শুরু করুন</button>
  `;
}

function restartQuiz() {
  const selectedSet = document.getElementById("quiz-set").value;
  loadQuiz(selectedSet);
}

function startTimer(duration) {
  let timeLeft = duration;
  const timeDisplay = document.getElementById("timer");
  timeDisplay.innerText = `⏳ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = `⏳ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function updateProgress() {
  const percent = ((current) / questions.length) * 100;
  document.getElementById("progress").style.width = percent + "%";
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  const keys = ['1','2','3','4'];
  if (keys.includes(e.key)) {
    const inputs = document.getElementsByName("opt");
    const index = parseInt(e.key) - 1;
    if (inputs[index]) inputs[index].checked = true;
  }
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Touch support
document.getElementById("options").addEventListener("click", e => {
  if (e.target.tagName === "INPUT") {
    e.target.checked = true;
  }
});

document.getElementById("next").addEventListener("click", checkAnswer);

// 🔄 Dark Mode Toggle
document.getElementById("dark-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
