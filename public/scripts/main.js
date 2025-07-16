

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
            content: "As a small business owner, FinAI gives me clarity on both personal and business expenses. The categorization is incredibly accurate.",
            author: "Jessica Lin",
            title: "Business Owner, Seattle"
        },
        {
            content: "I've tried every budgeting app out there. FinAI is the first that actually understands my spending habits and provides useful advice.",
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
    setInterval(rotateTestimonial, 7000);
});