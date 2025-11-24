// Envelope Interaction
const envelope = document.getElementById('envelope');
const openSiteBtn = document.getElementById('openSiteBtn');
const envelopeOverlay = document.getElementById('envelope-overlay');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bgMusic');
const mainPlayBtn = document.getElementById('mainPlayBtn');

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
});

openSiteBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Critical fix for reload bug
    e.stopPropagation();

    // Fade out overlay
    envelopeOverlay.style.opacity = '0';

    // Show main content
    mainContent.classList.remove('hidden-content');
    mainContent.classList.add('visible-content');

    // Remove overlay after transition
    setTimeout(() => {
        envelopeOverlay.style.display = 'none';

        // Start music
        toggleMusic();

        // Start confetti
        startConfetti();
    }, 1000);
});

// Music Control Logic
let isPlaying = false;

function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play()
            .then(() => {
                console.log("✅ Music playing: White Ferrari - Frank Ocean");
                if (mainPlayBtn) {
                    mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
                isPlaying = true;
            })
            .catch(e => {
                console.log("⚠️ Auto-play blocked. Click play button to start music.", e);
                isPlaying = false;
            });
    } else {
        bgMusic.pause();
        if (mainPlayBtn) {
            mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        isPlaying = false;
    }
}

if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
        toggleMusic();
    });
}

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

// Scroll Animation (Liquid Reveal)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, observerOptions);

document.querySelectorAll('.gallery-item, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px) scale(0.95)';
    el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)'; // Liquid ease
    observer.observe(el);
});

// Typewriter Effect
function initTypewriter() {
    const typeWriterElements = document.querySelectorAll('.typewriter-text');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTyping(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    typeWriterElements.forEach(el => {
        el.dataset.text = el.textContent;
        el.textContent = '';
        el.style.opacity = '1'; // Ensure it's visible for typing
        observer.observe(el);
    });
}

function startTyping(element) {
    const text = element.dataset.text;
    let index = 0;
    element.innerHTML = '<span class="cursor"></span>'; // Start with cursor
    const cursor = element.querySelector('.cursor');

    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            const textNode = document.createTextNode(char);
            element.insertBefore(textNode, cursor);
            index++;
            setTimeout(type, 50); // Typing speed
        } else {
            // Keep cursor blinking at the end or remove it?
            // Let's keep it for a bit then remove, or just keep it on the last one.
            // For now, just leave it.
        }
    }

    type();
}

// Initialize Typewriter when content is visible
// We need to wait for the "Open My Heart" button to be clicked and content to be shown.
// The existing observer handles opacity, but we want to trigger typing.
// Actually, since the message section is down below, we can just run initTypewriter immediately
// and the IntersectionObserver will handle the trigger when user scrolls down.
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
});
