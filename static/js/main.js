// JavaScript - In your project: static/js/main.js
// Navigation functionality
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
                // Scroll to section
                section.scrollIntoView({ behavior: 'smooth' });
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
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

        // Observe all bento items
        document.querySelectorAll('.bento-item').forEach(item => {
            item.classList.add('lazy-load');
            observer.observe(item);
        });
    }

    setupSkillBars() {
        const animateSkillBars = () => {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            });
        };

        // Animate skill bars when experience section is shown
        const experienceNavLink = document.querySelector('a[href="#experience"]');
        experienceNavLink.addEventListener('click', () => {
            setTimeout(animateSkillBars, 500);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
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
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CVWebsite();
});

// Performance optimization - Preload critical resources
const preloadCriticalResources = () => {
    // Add any critical resources to preload
    const criticalImages = ['public/profile-photo.jpg'];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

// Call preload function
preloadCriticalResources();