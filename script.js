/* ═══════════════════════════════════════════════════════
   CafeAura – JavaScript
═══════════════════════════════════════════════════════ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
const scrollThreshold = 80;

window.addEventListener('scroll', () => {
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Mobile menu toggle ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ── Smooth scroll for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Add reveal classes to sections
function addRevealClasses() {
  const selectors = [
    { sel: '.about-images', cls: 'reveal-left' },
    { sel: '.about-text', cls: 'reveal-right' },
    { sel: '.feat-card', cls: 'reveal' },
    { sel: '.testi-card', cls: 'reveal' },
    { sel: '.menu-card', cls: 'reveal' },
    { sel: '.contact-info-block', cls: 'reveal-left' },
    { sel: '.map-placeholder', cls: 'reveal-right' },
    { sel: '.pillar', cls: 'reveal' },
    { sel: '.contact-item', cls: 'reveal' },
    { sel: '.section-header', cls: 'reveal' },
    { sel: '.mid-cta-content', cls: 'reveal' },
    { sel: '.bcta-text', cls: 'reveal-left' },
    { sel: '.bcta-image', cls: 'reveal-right' },
    { sel: '.booking-info', cls: 'reveal-left' },
    { sel: '.booking-form-wrap', cls: 'reveal-right' },
  ];

  selectors.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add(cls);
      }
    });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
}

// ── Menu Tabs ──
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const activeContent = document.getElementById(`tab-${target}`);
    activeContent.classList.add('active');

    // Re-trigger card animations
    activeContent.querySelectorAll('.menu-card').forEach((card, i) => {
      card.style.animationName = 'none';
      card.offsetHeight; // reflow
      card.style.animationName = 'fadeSlideUp';
      card.style.animationDelay = `${i * 0.08}s`;
    });
  });
});

// ── Guest counter ──
let guests = 2;
const guestDisplay = document.getElementById('guestDisplay');
const guestInput = document.getElementById('guestCount');

function changeGuests(delta) {
  guests = Math.max(1, Math.min(12, guests + delta));
  guestDisplay.textContent = guests;
  guestInput.value = guests;

  // Animate the number
  guestDisplay.style.transform = 'scale(1.3)';
  setTimeout(() => { guestDisplay.style.transform = 'scale(1)'; }, 200);
}

// Add transition to guest display
if (guestDisplay) {
  guestDisplay.style.transition = 'transform 0.2s ease';
}

// ── Set min date for booking ──
const dateInput = document.getElementById('bookDate');
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ── Booking form ──
function submitBooking(e) {
  e.preventDefault();

  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const count = document.getElementById('guestCount').value;

  if (!name || !phone || !date || !time) {
    showToast('Please fill all required fields!', 'error');
    return;
  }

  // Simulate form submission
  const submitBtn = document.querySelector('#bookingForm .btn-primary');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-txt').textContent = 'Booking...';
  submitBtn.style.opacity = '0.75';

  setTimeout(() => {
    document.getElementById('bookingForm').style.display = 'none';
    const success = document.getElementById('bookingSuccess');
    success.classList.add('show');
    success.style.display = 'block';

    showToast(`🎉 Table booked for ${name}!`, 'success');

    // Scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
}

// ── Toast notifications ──
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: ${type === 'success' ? 'linear-gradient(135deg, #8B4513, #E8834A)' : '#E05252'};
    color: white;
    max-width: 320px;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Active nav link highlighting ──
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active-nav');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// Add active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-links a.active-nav { color: var(--orange-glow) !important; }
  #navbar.scrolled .nav-links a.active-nav { color: var(--brown-warm) !important; }
`;
document.head.appendChild(navStyle);

// ── Parallax hero images ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero && scrolled < hero.offsetHeight) {
    const imgs = document.querySelectorAll('.himg');
    imgs.forEach(img => {
      img.style.transform = `translateY(${scrolled * 0.2}px)`;
    });
  }
});

// ── Gallery hover effect ──
document.querySelectorAll('.gimg').forEach(img => {
  img.addEventListener('mouseenter', () => {
    document.querySelectorAll('.gimg').forEach(other => {
      if (other !== img) other.style.filter = 'saturate(0.3) brightness(0.8)';
    });
  });
  img.addEventListener('mouseleave', () => {
    document.querySelectorAll('.gimg').forEach(other => {
      other.style.filter = 'saturate(0.85)';
    });
  });
});

// ── Number counter animation ──
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  addRevealClasses();

  // Stagger hero img animation
  document.querySelectorAll('.himg').forEach((img, i) => {
    img.style.animation = `fadeSlideUp 1s ease ${0.1 + i * 0.15}s both`;
  });

  // Input placeholder animation
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function () {
      this.parentElement.classList.remove('focused');
    });
  });

  // Add CSS for focused labels
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    .form-group.focused label { color: var(--brown-warm); }
  `;
  document.head.appendChild(focusStyle);

  console.log('☕ CafeAura loaded. Welcome!');
});
