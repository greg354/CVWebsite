class CVWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupPrintOptimization();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // Show home section by default
        this.showSection('home');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show target section
                this.showSection(targetId);

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
            });
        });
    }

    showSection(targetId) {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = 'flex';
                if (section.classList.contains('page-content')) {
                    section.classList.add('active');
                }
                // Scroll to section smoothly
                section.scrollIntoView({ behavior: 'smooth' });
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });

        // Trigger skill bar animations for experience section
        if (targetId === 'experience' || targetId === 'projects') {
            setTimeout(() => this.animateSkillBars(), 500);
        }
    }

    setupSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on any nav link
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
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, observerOptions);

        // Observe all bento items for lazy loading animation
        document.querySelectorAll('.bento-item').forEach(item => {
            item.classList.add('lazy-load');
            observer.observe(item);
        });

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('lazy-load');
            observer.observe(item);
        });
    }

    setupSkillBars() {
        // Initial setup - hide all skill bars
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.dataset.targetWidth = targetWidth;
            bar.style.width = '0%';
        });
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.dataset.targetWidth;
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = targetWidth;
            }, index * 200); // Stagger animations
        });
    }

    setupPrintOptimization() {
        // Optimize for printing/PDF generation
        window.addEventListener('beforeprint', () => {
            // Show all sections for printing
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = 'block';
                section.style.pageBreakInside = 'avoid';
            });
        });

        window.addEventListener('afterprint', () => {
            // Restore normal display after printing
            this.showSection(document.querySelector('.nav-link.active').getAttribute('href').substring(1));
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#059669',
            error: '#dc2626',
            info: '#2563eb'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Utility method for downloading CV
    downloadCV() {
        const link = document.createElement('a');
        link.href = 'public/markus-du-plessis-cv.pdf';
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

    // Performance optimization
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(() => console.log('Service Worker registration failed'));
    }
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

// Call preload function
preloadCriticalResources();

// Analytics and performance monitoring (placeholder for future implementation)
const trackPageView = (page) => {
    // Placeholder for analytics
    console.log(`Page view: ${page}`);
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CVWebsite;
}