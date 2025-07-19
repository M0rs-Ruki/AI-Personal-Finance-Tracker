


// Current step tracking
let currentStep = 1;
const totalSteps = 6;

// Update progress bar and indicators
function updateProgress() {
    // Update progress fill width
    const progressPercent = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    
    // Update current step indicator
    document.getElementById('current-step').textContent = currentStep;
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const step = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (step === currentStep) {
            indicator.classList.add('active');
        } else if (step < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

// Navigate to step
function goToStep(step) {
    // Hide current step
    document.querySelector(`#step-${currentStep}`).classList.remove('active');
    
    // Show new step
    document.querySelector(`#step-${step}`).classList.add('active');
    
    // Update current step
    currentStep = step;
    
    // Update progress display
    updateProgress();
    
    // Scroll to top of form
    document.querySelector('.form-container').scrollTop = 0;
}

// Next step buttons
document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function() {
        const nextStep = parseInt(this.getAttribute('data-next'));
        goToStep(nextStep);
    });
});

// Previous step buttons
document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function() {
        const prevStep = parseInt(this.getAttribute('data-prev'));
        goToStep(prevStep);
    });
});

// Step indicator click
document.querySelectorAll('.step-indicator').forEach(indicator => {
    indicator.addEventListener('click', function() {
        const step = parseInt(this.getAttribute('data-step'));
        if (step <= currentStep) {
            goToStep(step);
        }
    });
});

// Handle form submission
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    alert('Profile setup completed successfully! Your financial dashboard is now ready.');
});

// Animation for coins on allowance field focus
const allowanceField = document.getElementById('allowance');
const coinsAnimation = document.querySelector('.coins-animation');

allowanceField.addEventListener('focus', () => {
    coinsAnimation.style.display = 'flex';
});

allowanceField.addEventListener('blur', () => {
    coinsAnimation.style.display = 'none';
});

// Add new category functionality
document.getElementById('add-category').addEventListener('click', function() {
    const budgetSection = document.getElementById('step-4');
    const newCard = document.querySelector('.budget-card').cloneNode(true);
    
    // Clear input values in the new card
    const inputs = newCard.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    // Add animation class
    newCard.style.animation = 'slideIn 0.5s ease-out';
    
    // Insert before the "Add Category" button
    budgetSection.insertBefore(newCard, this);
});

// Initialize progress
updateProgress();