// Current step tracking
let currentStep = 1;
const totalSteps = 8;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress
    updateProgress();
    
    // Set up all event listeners
    setupEventListeners();
});

// Update progress bar and indicators
function updateProgress() {
    // Update progress fill width
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }
    
    // Update current step indicator
    const currentStepElement = document.getElementById('current-step');
    if (currentStepElement) {
        currentStepElement.textContent = currentStep;
    }
    
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

// Navigate to step with validation
function goToStep(step) {
    // Validate step number
    if (step < 1 || step > totalSteps) {
        console.error(`Invalid step: ${step}. Must be between 1 and ${totalSteps}`);
        return false;
    }
    
    // Hide current step
    const currentStepElement = document.querySelector(`#step-${currentStep}`);
    const nextStepElement = document.querySelector(`#step-${step}`);
    
    if (!nextStepElement) {
        console.error(`Step element #step-${step} not found`);
        return false;
    }
    
    // Remove active class from current step
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
    }
    
    // Show new step
    nextStepElement.classList.add('active');
    
    // Update current step
    currentStep = step;
    
    // Update progress display
    updateProgress();
    
    // Scroll to top of form
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.scrollTop = 0;
    }
    
    return true;
}

// Validate current step (you can customize this)
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`#step-${currentStep}`);
    if (!currentStepElement) return true;
    
    // Check for required fields in current step
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            // You can add visual feedback here
            field.classList.add('error');
            setTimeout(() => field.classList.remove('error'), 3000);
            return false;
        }
    }
    
    return true;
}

// Setup all event listeners
function setupEventListeners() {
    // Next step buttons
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding (optional)
            if (validateCurrentStep()) {
                if (goToStep(nextStep)) {
                    console.log(`Navigated to step ${nextStep}`);
                }
            } else {
                console.log('Validation failed for current step');
            }
        });
    });

    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const prevStep = parseInt(this.getAttribute('data-prev'));
            if (goToStep(prevStep)) {
                console.log(`Navigated to step ${prevStep}`);
            }
        });
    });

    // Step indicator click
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            
            const step = parseInt(this.getAttribute('data-step'));
            // Only allow navigation to completed or current steps
            if (step <= currentStep) {
                if (goToStep(step)) {
                    console.log(`Navigated to step ${step} via indicator`);
                }
            }
        });
    });

    // Handle form submission
    const employeeForm = document.getElementById('employeeForm');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            alert('Profile setup completed successfully! Your financial dashboard is now ready.');
        });
    }

    // Animation for coins on salary field focus
    const salaryField = document.getElementById('salary');
    const coinsAnimation = document.querySelector('.coins-animation');

    if (salaryField && coinsAnimation) {
        salaryField.addEventListener('focus', () => {
            coinsAnimation.style.display = 'flex';
        });

        salaryField.addEventListener('blur', () => {
            coinsAnimation.style.display = 'none';
        });
    }

    // Bonus toggle functionality
    const bonusToggle = document.getElementById('bonus-toggle');
    const bonusFields = document.getElementById('bonus-fields');

    if (bonusToggle && bonusFields) {
        bonusToggle.addEventListener('change', function() {
            if (this.checked) {
                bonusFields.classList.add('active');
            } else {
                bonusFields.classList.remove('active');
            }
        });
    }

    // Add new income source
    const addIncomeBtn = document.getElementById('add-income');
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', function() {
            const incomeSection = document.querySelector('.repeating-group');
            const templateItem = document.querySelector('.repeating-item');
            
            if (incomeSection && templateItem) {
                const newItem = templateItem.cloneNode(true);
                
                // Clear input values in the new item
                const inputs = newItem.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.tagName === 'INPUT') {
                        input.value = '';
                    } else if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    }
                });
                
                // Add animation class
                newItem.style.animation = 'slideIn 0.5s ease-out';
                
                // Insert before the "Add Income Source" button
                incomeSection.appendChild(newItem);
            }
        });
    }

    // Add new expense
    const addExpenseBtn = document.getElementById('add-expense');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            const expenseSection = document.querySelector('#step-6 .repeating-group');
            const templateItem = document.querySelector('.repeating-item');
            
            if (expenseSection && templateItem) {
                const newItem = templateItem.cloneNode(true);
                
                // Clear input values in the new item
                const inputs = newItem.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.tagName === 'INPUT') {
                        input.value = '';
                    } else if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    }
                });
                
                // Add animation class
                newItem.style.animation = 'slideIn 0.5s ease-out';
                
                // Insert before the "Add Expense" button
                expenseSection.appendChild(newItem);
            }
        });
    }

    // Experience level badges
    document.querySelectorAll('.badge').forEach(badge => {
        badge.addEventListener('click', function() {
            document.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Priority indicator for goals
    const prioritySelect = document.getElementById('priority');
    const goalCard = document.querySelector('.goal-card');
    const priorityIndicator = document.querySelector('.priority-indicator');

    if (prioritySelect && goalCard && priorityIndicator) {
        prioritySelect.addEventListener('change', function() {
            goalCard.classList.remove('critical');
            
            if (this.value === 'critical') {
                goalCard.classList.add('critical');
            }
            
            // Update indicator color
            switch(this.value) {
                case 'low':
                    priorityIndicator.style.backgroundColor = 'var(--low-priority)';
                    break;
                case 'medium':
                    priorityIndicator.style.backgroundColor = 'var(--medium-priority)';
                    break;
                case 'high':
                    priorityIndicator.style.backgroundColor = 'var(--high-priority)';
                    break;
                case 'critical':
                    priorityIndicator.style.backgroundColor = 'var(--critical-priority)';
                    break;
            }
        });
    }

    // Risk slider labels
    const riskSlider = document.getElementById('risk-slider');
    const riskLabels = document.querySelectorAll('.risk-labels span');

    if (riskSlider && riskLabels.length > 0) {
        riskSlider.addEventListener('input', function() {
            riskLabels.forEach((label, index) => {
                if (index === parseInt(this.value) - 1) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        });
    }
}

// Debug function to check current state
function debugFormState() {
    console.log('Current step:', currentStep);
    console.log('Total steps:', totalSteps);
    console.log('Next buttons:', document.querySelectorAll('.next-step').length);
    console.log('Previous buttons:', document.querySelectorAll('.prev-step').length);
    console.log('Step elements:', document.querySelectorAll('[id^="step-"]').length);
}