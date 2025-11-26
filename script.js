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
    e.preventDefault();
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

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reveal wish cards with delay
        revealWishCards();
    }, 800);
});

// Music Control Logic
let isPlaying = false;

function toggleMusic() {
    bgMusic.play()
        .then(() => {
            console.log("✅ Music playing: White Ferrari - Frank Ocean");
            isPlaying = true;
            document.querySelector('#music-toggle i').classList.remove('fa-play');
            document.querySelector('#music-toggle i').classList.add('fa-pause');
        })
        .catch(e => {
            console.log("⚠️ Auto-play blocked. User interaction needed.", e);
            isPlaying = false;
        });
}

// Music toggle button
document.getElementById('music-toggle').addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        document.querySelector('#music-toggle i').classList.remove('fa-pause');
        document.querySelector('#music-toggle i').classList.add('fa-play');
    } else {
        toggleMusic();
    }
});

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

// Scroll Animation (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, observerOptions);

document.querySelectorAll('.memory-card, .message-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px) scale(0.95)';
    el.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
    observer.observe(el);
});

// Typewriter Effect
function initTypewriter() {
    const typeWriterElements = Array.from(document.querySelectorAll('.typewriter-text'));
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeSequence(typeWriterElements);
                observer.disconnect();
            }
        });
    }, observerOptions);

    if (typeWriterElements.length > 0) {
        typeWriterElements.forEach(el => {
            el.dataset.text = el.textContent;
            el.textContent = '';
            el.style.opacity = '1';
        });
        observer.observe(typeWriterElements[0]);
    }
}

function typeSequence(elements, index = 0) {
    if (index >= elements.length) return;

    const element = elements[index];
    const text = element.dataset.text;
    element.innerHTML = '<span class="cursor"></span>';
    const cursor = element.querySelector('.cursor');
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);
            const textNode = document.createTextNode(char);
            element.insertBefore(textNode, cursor);
            charIndex++;
            setTimeout(type, 50);
        } else {
            if (cursor) cursor.remove();
            typeSequence(elements, index + 1);
        }
    }

    type();
}

// Wish Tree Sequential Reveal
function revealWishCards() {
    const wishCards = document.querySelectorAll('.wish-card');

    wishCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('revealed');
        }, 500 + (index * 300)); // Stagger animation by 300ms each
    });
}

// Timeline Scroll Reveal
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Polaroid Caption Auto-save (using localStorage)
document.querySelectorAll('.polaroid-caption').forEach((caption, index) => {
    // Load saved caption
    const savedCaption = localStorage.getItem(`polaroid-caption-${index}`);
    if (savedCaption) {
        caption.textContent = savedCaption;
    }

    // Save on edit
    caption.addEventListener('blur', () => {
        localStorage.setItem(`polaroid-caption-${index}`, caption.textContent);
    });

    caption.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            caption.blur();
        }
    });
});

// Easter Egg - Click Footer Heart 3 Times
let heartClickCount = 0;
let heartClickTimer = null;
const footerHeart = document.getElementById('footer-heart');
const easterEggModal = document.getElementById('easter-egg-modal');
const modalClose = document.querySelector('.modal-close');

footerHeart.addEventListener('click', () => {
    heartClickCount++;

    // Visual feedback
    footerHeart.style.transform = 'scale(1.5)';
    setTimeout(() => {
        footerHeart.style.transform = 'scale(1)';
    }, 200);

    // Reset counter after 2 seconds of inactivity
    clearTimeout(heartClickTimer);
    heartClickTimer = setTimeout(() => {
        heartClickCount = 0;
    }, 2000);

    // Show easter egg on 3 clicks
    if (heartClickCount === 3) {
        showEasterEgg();
        heartClickCount = 0;
    }
});

function showEasterEgg() {
    easterEggModal.classList.remove('hidden');

    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Close modal
modalClose.addEventListener('click', () => {
    easterEggModal.classList.add('hidden');
});

easterEggModal.addEventListener('click', (e) => {
    if (e.target === easterEggModal) {
        easterEggModal.classList.add('hidden');
    }
});

// Smooth Scroll for Sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
});

// Signature Drawing Animation - triggers when message card is in view
const signatureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const signaturePath = document.getElementById('signature-path');
            if (signaturePath) {
                signaturePath.style.animation = 'drawSignature 2s ease-in-out forwards';
            }
            signatureObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

const messageCard = document.querySelector('.message-card');
if (messageCard) {
    signatureObserver.observe(messageCard);
}

// Add parallax effect to blobs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    if (blob1) blob1.style.transform = `translateY(${scrolled * 0.3}px)`;
    if (blob2) blob2.style.transform = `translateY(${scrolled * -0.2}px)`;
});

console.log("✨ Birthday website loaded! All features ready.");
