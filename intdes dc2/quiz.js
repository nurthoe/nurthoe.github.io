// ✅ Audio Unlock for all browsers
function unlockAudio() {
  ["ding", "error"].forEach(id => {
    const audio = document.getElementById(id);
    if (audio) {
      audio.muted = false;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    }
  });
}
window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("touchstart", unlockAudio, { once: true });

// ✅ Safe audio playback
function playSound(id) {
  const audio = document.getElementById(id);
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    audio.play().catch(e => console.warn("Audio failed:", e));
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

const questions = [
  {
    question: "Why shouldn't you share your passwords with anyone, even friends?",
    answers: [
      { text: "They might forget it", correct: false, explanation: "Forgetting a password is not the main issue." },
      { text: "It shows trust", correct: false, explanation: "Trust doesn’t justify compromising your privacy." },
      { text: "They might misuse it or leak it", correct: true, explanation: "Even trusted friends can accidentally or intentionally misuse your account." },
      { text: "You can always change it later", correct: false, explanation: "Changing it later doesn't prevent immediate damage." }
    ]
  },
  {
    question: "What’s the risk of clicking unknown links in messages?",
    answers: [
      { text: "It may slow your device", correct: false, explanation: "That’s not the primary danger." },
      { text: "It could download malware or steal info", correct: true, explanation: "These links may install malicious software or lead to phishing pages." },
      { text: "It logs you out", correct: false, explanation: "Logging out isn't a common outcome." },
      { text: "Nothing happens", correct: false, explanation: "Something often does happen—usually bad." }
    ]
  },
  {
    question: "Why is using the same password for multiple accounts a bad idea?",
    answers: [
      { text: "It’s hard to remember", correct: false, explanation: "It’s easy to remember, but risky." },
      { text: "You’ll forget which site uses what", correct: false, explanation: "That’s minor compared to security risks." },
      { text: "Hackers can access all accounts if one is leaked", correct: true, explanation: "This is called credential stuffing—it spreads risk across platforms." },
      { text: "Sites may block you", correct: false, explanation: "Sites don’t block for that reason." }
    ]
  },
  {
    question: "What should you do if someone online pressures you for private photos?",
    answers: [
      { text: "Send low-quality versions", correct: false, explanation: "Never send compromising content." },
      { text: "Ignore them and block/report", correct: true, explanation: "That’s the safest and most responsible action." },
      { text: "Negotiate for fewer photos", correct: false, explanation: "Negotiation is still unsafe and exploitable." },
      { text: "Tell them you’re underage", correct: false, explanation: "That doesn’t stop bad actors and may escalate danger." }
    ]
  },
  {
    question: "What is two-factor authentication (2FA)?",
    answers: [
      { text: "A backup password", correct: false, explanation: "It’s more than just a second password." },
      { text: "A way to log in from two devices", correct: false, explanation: "It’s not about devices." },
      { text: "A second step to verify your identity", correct: true, explanation: "2FA adds a layer of protection beyond just your password." },
      { text: "Logging in from your phone", correct: false, explanation: "That’s a method, not a definition." }
    ]
  },
  {
    question: "Which is the strongest password?",
    answers: [
      { text: "12345678", correct: false, explanation: "This is a very common and weak password." },
      { text: "Password1", correct: false, explanation: "Still predictable." },
      { text: "P@55w0rD!", correct: false, explanation: "Better, but still a known pattern." },
      { text: "t8F#9z!LmQx%", correct: true, explanation: "This is complex and hard to guess or brute-force." }
    ]
  },
  {
    question: "What is phishing?",
    answers: [
      { text: "A method to secure networks", correct: false, explanation: "Phishing is not a protective tool." },
      { text: "Tricking someone to give up personal data", correct: true, explanation: "It mimics trusted sources to steal your info." },
      { text: "Installing updates to protect data", correct: false, explanation: "That’s a good habit, not phishing." },
      { text: "A way to back up data", correct: false, explanation: "Totally unrelated." }
    ]
  },
  {
    question: "What should you check before sharing a photo online?",
    answers: [
      { text: "How many likes you’ll get", correct: false, explanation: "That’s not a privacy concern." },
      { text: "If it has personal info in the background", correct: true, explanation: "Photos can unintentionally expose your location, address, or ID." },
      { text: "The photo resolution", correct: false, explanation: "That’s not a security issue." },
      { text: "Your outfit", correct: false, explanation: "That’s personal taste, not safety." }
    ]
  },
  {
    question: "Why shouldn’t you meet online strangers in real life alone?",
    answers: [
      { text: "They might cancel last minute", correct: false, explanation: "That's not the real risk." },
      { text: "They might not like you", correct: false, explanation: "The concern is safety, not rejection." },
      { text: "They could be dangerous or lying", correct: true, explanation: "People online may pretend to be someone else to exploit or harm others." },
      { text: "It’s embarrassing", correct: false, explanation: "It’s much more serious than that." }
    ]
  },
  {
    question: "Why is it risky to use public Wi-Fi without a VPN?",
    answers: [
      { text: "It’s slow", correct: false, explanation: "Speed isn’t the main problem." },
      { text: "You might get logged out", correct: false, explanation: "That’s minor." },
      { text: "Hackers can intercept your data", correct: true, explanation: "Public Wi-Fi is often unsecured, allowing eavesdropping or data theft." },
      { text: "Your battery drains faster", correct: false, explanation: "That’s unrelated." }
    ]
  }
];
let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("next-btn");
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
const scoreSummary = document.getElementById("score-summary");
const retryBtn = document.getElementById("retry-btn");
const quizBox = document.getElementById("quiz-box");
const progressBar = document.getElementById("progress-bar");

function showQuestion() {
  resultScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");

  const q = questions[current];
  questionEl.textContent = `Q${current + 1}. ${q.question}`;
  explanationEl.textContent = "";
  answerButtons.innerHTML = "";
  nextBtn.classList.add("hidden");

  const progress = ((current) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  q.answers.forEach((a) => {
    const btn = document.createElement("button");
    btn.textContent = a.text;
    btn.addEventListener("click", () => selectAnswer(a, btn));
    answerButtons.appendChild(btn);
  });
}

function selectAnswer(answer, btn) {
  const q = questions[current];
  const correctAnswer = q.answers.find(a => a.correct);
  Array.from(answerButtons.children).forEach(b => b.disabled = true);

  if (answer.correct) {
    btn.classList.add("correct");
    score++;
    explanationEl.textContent = answer.explanation;
    playSound("ding");
  } else {
    btn.classList.add("wrong");
    playSound("error");

    Array.from(answerButtons.children).forEach(b => {
      if (b.textContent === correctAnswer.text) {
        b.classList.add("correct");
      }
    });

    explanationEl.innerHTML = `
      ❌ ${answer.explanation}<br />
      ✅ Correct answer: <strong>${correctAnswer.text}</strong><br />
      ${correctAnswer.explanation}
    `;
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

function endQuiz() {
  quizBox.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  if (score >= 5) {
    resultText.textContent = "YOU PASSED";
    resultText.classList.remove("glitch");
    document.body.classList.remove("glitch-fail");
    playSound("win");
    document.getElementById("caption").classList.add("hidden");
  } else {
    resultText.textContent = "YOU LOSE";
    resultText.classList.add("glitch");
    document.body.classList.add("glitch-fail");
    playSound("lose");
    document.getElementById("caption").classList.remove("hidden");
  }

  scoreSummary.textContent = `You got ${score} correct and ${questions.length - score} wrong.`;
  progressBar.style.width = `100%`;
}




retryBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  resultScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  showQuestion();
});

showQuestion();
