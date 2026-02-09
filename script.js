// ========================================
// SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            
            // Trigger expertise bar animations
            if (entry.target.classList.contains('expertise-card')) {
                const bar = entry.target.querySelector('.expertise-bar');
                if (bar) {
                    bar.style.width = bar.getAttribute('data-level') + '%';
                }
            }
            
            // Trigger counter animations
            if (entry.target.classList.contains('stat-card')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.achievement-card, .expertise-card, .timeline-item, .story-card, .stat-card'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
});

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(card) {
    const numberElement = card.querySelector('.stat-number');
    if (!numberElement || numberElement.classList.contains('counted')) return;
    
    numberElement.classList.add('counted');
    const text = numberElement.textContent;
    const target = parseInt(numberElement.getAttribute('data-target')) || 0;
    
    // Extract prefix/suffix (like ₩, M, +, %, etc.)
    const prefix = text.match(/^[^\d]+/)?.[0] || '';
    const suffix = text.match(/[^\d]+$/)?.[0] || '';
    
    let current = 0;
    const increment = target / 50; // 50 frames
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        numberElement.textContent = prefix + displayValue + suffix;
    }, stepTime);
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = document.querySelector('.navigation').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
let lastScroll = 0;
const nav = document.querySelector('.navigation');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// FORM HANDLING
// ========================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('메시지가 전송되었습니다! 빠른 시일 내에 답변드리겠습니다.');
        this.reset();
    });
}

// ========================================
// DOWNLOAD RESUME BUTTON
// ========================================
const downloadButtons = document.querySelectorAll('.nav-cta, .btn-download');

downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        // In a real implementation, this would download the actual PDF
        alert('이력서를 다운로드합니다.\n\n실제 구현 시 PDF 파일 경로를 연결해주세요.');
        
        // Example of actual download:
        // const link = document.createElement('a');
        // link.href = '/path/to/resume.pdf';
        // link.download = '전현일_관세사_이력서.pdf';
        // link.click();
    });
});

// ========================================
// EXPERTISE BARS ANIMATION ON LOAD
// ========================================
window.addEventListener('load', () => {
    // Initial animation for hero stats if they're in viewport
    const heroStats = document.querySelectorAll('#hero-section .stat-card');
    heroStats.forEach(card => {
        if (isInViewport(card)) {
            animateCounter(card);
        }
    });
});

// Helper function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// MOBILE MENU TOGGLE (if implementing mobile menu)
// ========================================
// This is a placeholder for mobile menu functionality
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-container');
    const menu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '☰';
        toggleButton.style.cssText = `
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-text);
        `;
        
        toggleButton.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
        });
        
        nav.appendChild(toggleButton);
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// ========================================
// COPY EMAIL TO CLIPBOARD
// ========================================
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const email = this.textContent.trim();
        
        // Also copy to clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Show temporary tooltip
            const tooltip = document.createElement('span');
            tooltip.textContent = '이메일이 복사되었습니다!';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-success);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                font-weight: 600;
                transform: translateY(-100%);
                margin-top: -0.5rem;
                z-index: 1000;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
            
            this.parentElement.style.position = 'relative';
            this.parentElement.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        });
    });
});

// ========================================
// TYPING EFFECT FOR HERO SUBTITLE (Optional)
// ========================================
const createTypingEffect = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Uncomment to enable typing effect on hero subtitle
// window.addEventListener('load', () => {
//     const subtitle = document.querySelector('.hero-subtitle');
//     const originalText = subtitle.textContent;
//     createTypingEffect(subtitle, originalText);
// });

// ========================================
// PARALLAX EFFECT (Subtle)
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image-placeholder');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================================
// ADD ACTIVE STATE TO NAV LINKS
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

console.log('🎨 Portfolio initialized successfully!');
