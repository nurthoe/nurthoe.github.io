let audioEnabled = false;
let typingSound;
let glowInterval;

// Initialize glitch typing sound
function initAudio() {
  typingSound = new Audio("glitch-sound.mp3");
  typingSound.volume = 0.3;
  typingSound.onerror = () => console.error("Audio load error");
}

// Enable audio on first interaction
function enableAudio() {
  if (!typingSound) initAudio();
  typingSound.play().then(() => {
    typingSound.pause();
    audioEnabled = true;
  }).catch(e => console.log("Audio enable failed:", e));
}

// Mute logic
function setupMuteButton() {
  const muteBtn = document.getElementById("muteBtn");
  if (!muteBtn) return;

  muteBtn.addEventListener("click", () => {
    if (!audioEnabled) {
      enableAudio();
      return;
    }
    typingSound.muted = !typingSound.muted;
    muteBtn.textContent = typingSound.muted ? "🔇" : "🔈";
  });
}

// Typewriter effect for title
function typeWriterText(id, text, speed = 80) {
  const element = document.getElementById(id);
  if (!element) return;

  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      if (audioEnabled && typingSound) {
        typingSound.currentTime = 0;
        typingSound.play().catch(() => {});
      }
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Start game
function handlePageTransition() {
  if (audioEnabled) {
    const transitionSound = new Audio("transition.mp3");
    transitionSound.volume = 0.3;
    transitionSound.play().catch(e => console.log("Transition sound error:", e));
  }

  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "chat.html";
  }, 500);
}

// 🔊 Play notification sound
function playNotifSound() {
  const notifSound = document.getElementById("notifSound");
  if (notifSound && audioEnabled) {
    notifSound.currentTime = 0;
    notifSound.play().catch(() => {});
  }
}

// Animate incoming messages
function animateMessages() {
  const containers = document.querySelectorAll(".message-container");
  if (!containers.length) return;

  containers.forEach((container, index) => {
    setTimeout(() => {
      container.classList.add("animate-in");
      const photo = container.querySelector(".profile-photo");
      const bubble = container.querySelector(".message-bubble");
      if (photo) photo.classList.add("animate-in");
      if (bubble) bubble.classList.add("animate-in");

      playNotifSound();
    }, index * 1000);
  });

  const total = containers.length * 1000 + 500;
  setTimeout(showReplyOptions, total);
}

// Show reply options
function showReplyOptions() {
  const replySection = document.getElementById("replySection");
  if (replySection) {
    replySection.classList.add("show");
  }

  const choices = document.querySelectorAll(".choice");
  choices.forEach(choice => {
    choice.addEventListener("click", () => {
      handleReply(choice);
    });
  });
}

// Handle reply
function handleReply(choice) {
  const path = choice.dataset.path;

  if (path === "verysupersafe" || path === "supersafe") {
    window.location.href = "you-win.html";
    return;
  } else if (path === "notsafe") {
    window.location.href = "you-lose-hacked.html";
    return;
  } else if (path === "picsent") {
    window.location.href = "you-lose-pic.html";
    return;
  }

  const feedback = document.getElementById("feedback");
  const bubble = document.getElementById("feedbackBubble");

  document.querySelectorAll(".choice").forEach(c => c.disabled = true);
  choice.classList.add("glitch-flash");

  const replySection = document.getElementById("replySection");
  if (replySection) replySection.classList.remove("show");

  if (path === "safe") {
    bubble.textContent = "✅ Well done! Ignoring uncomfortable chats helps keep you safe.";
  } else if (path === "risky") {
    bubble.textContent = "❗️ That flirty reply might encourage unsafe behavior. Be cautious.";
  } else if (path === "neutral") {
    bubble.textContent = "❗️ Caution, some people use friendliness to trick others.";
  } else if (path === "supernotsafe") {
    bubble.textContent = "❗️ You shouldn’t entertain unknown entities online because they may be scammers, predators, or bots trying to manipulate, deceive, or harm you.";
  } else if (path === "notsafe") {
    bubble.textContent = "❗️ Opening unknown links can infect your device, steal your data, or expose you to scams.";
  } else if (path === "nopic") {
    bubble.textContent = "✅ Smart choice—by keeping your photos private, you’re safeguarding both your dignity and digital security.";
  } else if (path === "nopic2") {
    bubble.textContent = "✅ Good choice—by keeping your information private, you’re safeguarding both your privacy and digital security.";
  }

  feedback.classList.add("show");
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.classList.add("show");

  nextBtn.onclick = () => {
    if (path === "safe") {
      window.location.href = "scene2-safe.html";
    } else if (path === "supernotsafe") {
      window.location.href = "scene2b.html";
    } else if (path === "notsafe") {
      window.location.href = "you-lose-hacked.html";
    } else if (path === "neutral") {
      window.location.href = "scene3-neutral.html";
    } else if (path === "nopic") {
      window.location.href = "scene3-neutral-safe.html";
    } else if (path === "risky") {
      window.location.href = "scene4-risky.html";
    } else if (path === "nopic2") {
      window.location.href = "scene4-risky-safe.html";
    }
  };
}

// Chat page setup
function setupChatPage() {
  if (document.querySelector(".message-container")) {
    animateMessages();
  }
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  setupMuteButton();

  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", handlePageTransition);
    typeWriterText("gameTitle", "TRUST OR TRAP", 80);
  }

  setupChatPage();
  document.body.addEventListener("click", enableAudio, { once: true });
});

// Cleanup
window.addEventListener("beforeunload", () => {
  clearInterval(glowInterval);
  if (typingSound) {
    typingSound.pause();
    typingSound.currentTime = 0;
  }
});
