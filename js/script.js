document.addEventListener('DOMContentLoaded', () => {
    console.log("Website initialized.");

    // --- PERSISTENT SUBSCRIBER COUNT LOGIC ---
    const subsDisplay = document.getElementById('total-subs');
    const modalSubsDisplay = document.getElementById('modal-sub-count');
    
    // Initial number
    let currentSubs = parseInt(localStorage.getItem('cbs_subscriber_count')) || 1248;

    const updateDisplay = () => {
        if (subsDisplay) {
            // Display formatted number (e.g., 1.2k+)
            const formatted = currentSubs >= 1000 ? (currentSubs / 1000).toFixed(1) + 'k+' : currentSubs;
            subsDisplay.innerText = formatted;
        }
        if (modalSubsDisplay) {
            modalSubsDisplay.innerText = currentSubs.toLocaleString();
        }
    };

    updateDisplay();

    // --- NAVIGATION LOGIC ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-links a, .hero-cta-group a, .skills-grid a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
            }
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- STICKY HEADER SCROLL EFFECT ---
    const header = document.querySelector('.sticky-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    });

    // --- MODAL LOGIC ---
    const openSubBtn = document.getElementById('open-subscribe');
    const closeSubBtn = document.getElementById('close-subscribe');
    const subModal = document.getElementById('subscribe-modal');

    if (openSubBtn) openSubBtn.addEventListener('click', () => subModal.classList.add('active'));
    if (closeSubBtn) closeSubBtn.addEventListener('click', () => subModal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === subModal) subModal.classList.remove('active'); });

    // --- FORM HANDLING (AJAX) ---
    const handleFormSubmit = async (formId, statusId, successCallback) => {
        const form = document.getElementById(formId);
        const status = document.getElementById(statusId);

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const button = form.querySelector('button');
            const originalBtnText = button.innerText;

            button.disabled = true;
            button.innerText = "Sending...";
            status.innerText = "";

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    status.innerHTML = `<p style="color: #059669; margin-top: 1rem;">Success! Sent to Chandra Bhushan Singh.</p>`;
                    form.reset();
                    if (successCallback) successCallback();
                } else {
                    const errorData = await response.json();
                    status.innerHTML = `<p style="color: #dc2626; margin-top: 1rem;">Oops! There was a problem.</p>`;
                }
            } catch (error) {
                status.innerHTML = `<p style="color: #dc2626; margin-top: 1rem;">Error sending message. Try again later.</p>`;
            } finally {
                button.disabled = false;
                button.innerText = originalBtnText;
            }
        });
    };

    // Initialize forms
    handleFormSubmit('main-contact-form', 'contact-status');
    handleFormSubmit('sub-form', 'sub-status', () => {
        // Increment subscriber count on success
        currentSubs++;
        localStorage.setItem('cbs_subscriber_count', currentSubs);
        updateDisplay();
        setTimeout(() => subModal.classList.remove('active'), 3000);
    });

    // --- REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.skill-card, .social-card, .section-title');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
