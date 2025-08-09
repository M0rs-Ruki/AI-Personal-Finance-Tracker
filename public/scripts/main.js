

// Animated bar chart
document.addEventListener('DOMContentLoaded', function() {
    // Generate random heights for bars on each load
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 200) + 100;
        bar.style.setProperty('--bar-height', randomHeight);
    });
    
    // Simple testimonial rotation
    const testimonials = [
        {
            content: "This app completely changed how I manage money. The AI insights helped me pay off $5,000 in debt in just 6 months!",
            author: "Michael Torres",
            title: "Software Engineer, Austin"
        },
        {
            content: "As a small business owner, RukiAI gives me clarity on both personal and business expenses. The categorization is incredibly accurate.",
            author: "Jessica Lin",
            title: "Business Owner, Seattle"
        },
        {
            content: "I've tried every budgeting app out there. RukiAI is the first that actually understands my spending habits and provides useful advice.",
            author: "David Wilson",
            title: "Teacher, Chicago"
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialElement = document.querySelector('.testimonial-content');
    const authorElement = document.querySelector('.author-name');
    const titleElement = document.querySelector('.author-title');
    
    function rotateTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        const testimonial = testimonials[currentTestimonial];
        
        testimonialElement.textContent = testimonial.content;
        authorElement.textContent = testimonial.author;
        titleElement.textContent = testimonial.title;
    }
    
    // Rotate every 7 seconds
    setInterval(rotateTestimonial, 5000);
});


// Simple animation for cards on scroll
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .tech-card, .key-feature-card, .case-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });
});


// Circuit pattern background animation
document.addEventListener('DOMContentLoaded', function() {
    const circuitCanvas = document.getElementById('circuitCanvas');
    
    // Create circuit pattern
    for (let i = 0; i < 30; i++) {
        const line = document.createElement('div');
        line.className = 'circuit-line';
        
        // Random position and dimensions
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const width = Math.random() * 100 + 50;
        const height = 2;
        const rotation = Math.random() * 360;
        
        line.style.top = `${top}%`;
        line.style.left = `${left}%`;
        line.style.width = `${width}px`;
        line.style.height = `${height}px`;
        line.style.transform = `rotate(${rotation}deg)`;
        
        circuitCanvas.appendChild(line);
    }
    
    // Pie chart animation
    const pie = document.querySelector('.pie-container');
    let rotation = 0;
    
    pie.addEventListener('mouseenter', function() {
        rotation = 0;
        animatePie();
    });
    
    function animatePie() {
        rotation += 1;
        pie.style.transform = `rotate(${rotation}deg) scale(1.05)`;
        
        if (rotation < 360) {
            requestAnimationFrame(animatePie);
        } else {
            rotation = 0;
            pie.style.transform = 'rotate(0deg) scale(1)';
        }
    }
    
    // Tech carousel scroll effect
    const techCarousel = document.querySelector('.tech-carousel');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        techCarousel.scrollLeft = scrollPosition / 5;
    });
    
    // Skill node hover effect
    const skillNodes = document.querySelectorAll('.skill-node');
    
    skillNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            const pulse = this.querySelector('.pulse');
            pulse.style.animation = 'pulse 1.5s infinite';
        });
        
        node.addEventListener('mouseleave', function() {
            const pulse = this.querySelector('.pulse');
            pulse.style.animation = 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to feature cards
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.2)';
            this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            this.style.borderColor = 'transparent';
        });
    });
    
    // Add animation to progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    
    setTimeout(() => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }, 500);
});


// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu);
overlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on links
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});



