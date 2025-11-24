// Envelope Interaction
const envelope = document.getElementById('envelope');
const openSiteBtn = document.getElementById('openSiteBtn');
const envelopeOverlay = document.getElementById('envelope-overlay');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bgMusic');

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
});

openSiteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent bubbling to envelope click

    // Fade out overlay
    envelopeOverlay.style.opacity = '0';

    // Show main content
    mainContent.classList.remove('hidden-content');
    mainContent.classList.add('visible-content');

    // Remove overlay after transition
    setTimeout(() => {
        envelopeOverlay.style.display = 'none';

        // Start music
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            document.querySelector('.music-control i').classList.remove('fa-music');
            document.querySelector('.music-control i').classList.add('fa-pause');
        }

        // Start confetti
        startConfetti();
    }, 1000);
});

// Countdown Logic
const birthday = new Date('December 9, 2025 00:00:00').getTime();
// Adjust year if date has passed
const now = new Date().getTime();
const currentYear = new Date().getFullYear();
let targetDate = new Date(`December 9, ${currentYear} 00:00:00`).getTime();

if (now > targetDate) {
    targetDate = new Date(`December 9, ${currentYear + 1} 00:00:00`).getTime();
}

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById('countdown').innerHTML = "<h2>Happy Birthday Zaskia! 🎉</h2>";
        startConfetti();
    }
}, 1000);

// Confetti Effect
function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInOut(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

document.getElementById('celebrateBtn').addEventListener('click', () => {
    startConfetti();
});

// Music Control
const musicBtn = document.getElementById('musicToggle');

musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.querySelector('i').classList.remove('fa-music');
        musicBtn.querySelector('i').classList.add('fa-pause');
    } else {
        bgMusic.pause();
        musicBtn.querySelector('i').classList.remove('fa-pause');
        musicBtn.querySelector('i').classList.add('fa-music');
    }
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.gallery-item, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});
