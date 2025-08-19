


// Store feedback data
let feedbackData = [];

// Get elements
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackPopup = document.getElementById('feedbackPopup');
const closePopup = document.getElementById('closePopup');
const feedbackForm = document.getElementById('feedbackForm');
const successMessage = document.getElementById('successMessage');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Tab switching functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab + 'Tab').classList.add('active');

        // Load feedback history when history tab is clicked
        if (targetTab === 'history') {
            loadFeedbackHistory();
        }
    });
});

// Function to format date
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Function to load and display feedback history
async function loadFeedbackHistory() {
    const historyContainer = document.getElementById('feedbackHistory');
    const loadingElement = document.getElementById('historyLoading');

    // Show loading
    loadingElement.style.display = 'block';

    try {
        // Fetch feedback from your backend
        const response = await fetch('/api/feedback');

        if (!response.ok) {
            throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        feedbackData = data.feedback || [];

        loadingElement.style.display = 'none';

        if (feedbackData.length === 0) {
            historyContainer.innerHTML = '<div class="no-feedback">No feedback yet. Be the first to share your thoughts!</div>';
            return;
        }

        // Sort feedback by date (newest first)
        const sortedFeedback = feedbackData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Generate HTML for feedback items
        const feedbackHTML = sortedFeedback.map(item => `
        <div class="feedback-item">
        <div class="feedback-header">
            <span class="feedback-author">${escapeHtml(item.name)}</span>
            <span class="feedback-date">${formatDate(new Date(item.createdAt))}</span>
        </div>
        <div class="feedback-text">${escapeHtml(item.message)}</div>
        </div>
    `).join('');

        historyContainer.innerHTML = feedbackHTML;

    } catch (error) {
        loadingElement.style.display = 'none';
        console.error('Error loading feedback:', error);
        historyContainer.innerHTML = '<div class="no-feedback">Error loading feedback. Please try again later.</div>';
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to show popup
function showPopup() {
    feedbackPopup.style.display = 'block';
    feedbackPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reset to first tab
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="submit"]').classList.add('active');
    document.getElementById('submitTab').classList.add('active');

    // Focus first input for accessibility
    setTimeout(() => {
        document.getElementById('userName').focus();
    }, 100);
}

// Function to hide popup
function hidePopup() {
    feedbackPopup.style.display = 'none';
    feedbackPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    successMessage.style.display = 'none';
    feedbackForm.reset();
}

// Simplified approach - always show button on right side
function handleMobileMenu() {
    const feedbackIcon = document.getElementById('feedbackIcon');

    function ensureButtonVisible() {
        if (feedbackIcon) {
            feedbackIcon.style.display = 'flex';
            feedbackIcon.style.visibility = 'visible';
            feedbackIcon.style.right = '16px';
            feedbackIcon.style.left = 'auto';
            feedbackIcon.style.zIndex = '850';
        }
    }

    ensureButtonVisible();
    setInterval(ensureButtonVisible, 1000);

    window.addEventListener('load', ensureButtonVisible);
    window.addEventListener('resize', ensureButtonVisible);
    document.addEventListener('visibilitychange', ensureButtonVisible);
}

// Initialize immediately
handleMobileMenu();

// Backup initialization
setTimeout(() => {
    const feedbackIcon = document.getElementById('feedbackIcon');
    if (feedbackIcon) {
        feedbackIcon.style.display = 'flex';
        feedbackIcon.style.visibility = 'visible';
        feedbackIcon.style.right = '16px';
        feedbackIcon.style.left = 'auto';
        feedbackIcon.style.zIndex = '850';
    }
}, 500);

// Event listeners for opening popup
feedbackIcon.addEventListener('click', showPopup);
feedbackIcon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPopup();
    }
});

// Event listeners for closing popup
closePopup.addEventListener('click', hidePopup);
closePopup.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        hidePopup();
    }
});

// Close on background click
window.addEventListener('click', (event) => {
    if (event.target === feedbackPopup) {
        hidePopup();
    }
});

// Close on Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && feedbackPopup.style.display === 'block') {
        hidePopup();
    }
});

// Handle form submission
feedbackForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        feedback: document.getElementById('userFeedback').value
    };

    try {
        // Submit to your backend
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit feedback');
        }

        const result = await response.json();

        // Show success message
        successMessage.style.display = 'block';
        successMessage.textContent = result.message || 'Thank you for your feedback! We appreciate it.';

        // Reset form
        feedbackForm.reset();

        console.log('Feedback submitted successfully:', result);

        // Auto-close after 2 seconds
        setTimeout(() => {
            hidePopup();
        }, 2000);

    } catch (error) {
        console.error('Error submitting feedback:', error);
        successMessage.style.display = 'block';
        successMessage.style.backgroundColor = '#f44336'; // Red for error
        successMessage.textContent = 'Error submitting feedback. Please try again.';

        // Reset error message color after 3 seconds
        setTimeout(() => {
            successMessage.style.backgroundColor = '#4CAF50';
        }, 3000);
    }
});

// Prevent iOS zoom on input focus
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
        input.style.fontSize = '16px';
    });
}