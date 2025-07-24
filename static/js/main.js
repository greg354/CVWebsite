// JavaScript - Fixed for Modern Dark Theme
class CVWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupSmoothScrolling();
        this.initializeVisibility();
    }

    initializeVisibility() {
        // Make all content visible immediately on page load
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            element.classList.add('loaded');
        });
    }

    setupSmoothScrolling() {
        // Only handle smooth scrolling for anchor links on the same page
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on any navigation link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, observerOptions);

        // Observe elements that come into view
        document.querySelectorAll('.content-card, .content-item').forEach(item => {
            observer.observe(item);
        });
    }

    setupSkillBars() {
        // Animate skill bars when they come into view
        const skillBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transition = 'width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            // The width is already set in the HTML, so it will animate
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });

        // Observe skill sections
        document.querySelectorAll('.content-item').forEach(item => {
            if (item.querySelector('.skill-progress')) {
                skillBarObserver.observe(item);
            }
        });
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#00d4ff',
            error: '#ff4757',
            info: '#00d4ff'
        };

        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: rgba(22, 22, 22, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid ${colors[type] || colors.info};
            color: ${colors[type] || colors.info};
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    downloadCV() {
        const link = document.createElement('a');
        link.href = 'public/BaseCV (1).pdf';
        link.download = 'Markus_du_Plessis_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('CV download started!', 'success');
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new CVWebsite();
    
    // Make downloadCV available globally
    window.downloadCV = () => website.downloadCV();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Performance optimization - Preload critical resources
const preloadCriticalResources = () => {
    const criticalResources = [
        'static/css/styles.css'
    ];
    
    criticalResources.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = src;
        document.head.appendChild(link);
    });
};

preloadCriticalResources();