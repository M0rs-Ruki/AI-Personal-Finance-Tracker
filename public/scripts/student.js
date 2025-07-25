
// Constants
const totalSteps = 6;
let currentStep = 1;

// Cached DOM elements
const formContainer = document.querySelector('.form-container');
const progressFill = document.getElementById('progress-fill');
const currentStepDisplay = document.getElementById('current-step');
const stepIndicators = document.querySelectorAll('.step-indicator');
const budgetCardTemplate = document.querySelector('.budget-card');
const coinsAnimation = document.querySelector('.coins-animation');
const allowanceField = document.getElementById('allowance');

// Initialize progress
updateProgress();

// Update progress bar and indicators
function updateProgress() {
    const progressPercent = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercent}%`;
    currentStepDisplay.textContent = currentStep;

    stepIndicators.forEach((indicator, index) => {
        const step = index + 1;
        indicator.classList.remove('active', 'completed');
        if (step === currentStep) {
            indicator.classList.add('active');
        } else if (step < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

// Navigate to a specific step
function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    document.querySelector(`#step-${currentStep}`).classList.remove('active');
    document.querySelector(`#step-${step}`).classList.add('active');

    currentStep = step;
    updateProgress();
    formContainer.scrollTop = 0;
}

// Handle next step buttons with optional validation
document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function () {
        const currentInputs = document.querySelector(`#step-${currentStep}`).querySelectorAll('input[required]');
        for (let input of currentInputs) {
            if (!input.value.trim()) {
                alert('Please fill all required fields before continuing.');
                return;
            }
        }
        const nextStep = parseInt(this.getAttribute('data-next'));
        goToStep(nextStep);
    });
});

// Handle previous step buttons
document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function () {
        const prevStep = parseInt(this.getAttribute('data-prev'));
        goToStep(prevStep);
    });
});

// Step indicator click navigation
stepIndicators.forEach(indicator => {
    indicator.addEventListener('click', function () {
        const step = parseInt(this.getAttribute('data-step'));
        if (step <= currentStep) {
            goToStep(step);
        }
    });
});



// Show coins animation on allowance input focus
allowanceField.addEventListener('focus', () => {
    coinsAnimation.style.display = 'flex';
});

allowanceField.addEventListener('blur', () => {
    coinsAnimation.style.display = 'none';
});

// Add new budget category dynamically
let categoryIndex = 1;

document.getElementById('add-category').addEventListener('click', function () {
  const budgetSection = document.getElementById('step-4');
  const newCard = document.querySelector('.budget-card').cloneNode(true);

  // Update input values
  const nameInput = newCard.querySelector('input[type="text"]');
  const amountInput = newCard.querySelector('input[type="number"]');

  nameInput.value = '';
  amountInput.value = '';

  // Update name attributes for form serialization
  nameInput.name = `customCategories[${categoryIndex}][name]`;
  amountInput.name = `customCategories[${categoryIndex}][budgetLimit]`;

  // Optional: update IDs (not required)
  nameInput.id = `category${categoryIndex + 1}`;
  amountInput.id = `amount${categoryIndex + 1}`;

  // Add animation if you want
  newCard.classList.add('slide-in');

  // Insert before the "Add Category" button
  budgetSection.insertBefore(newCard, this);

  categoryIndex++;
});

document.addEventListener('click', function (e) {
  if (e.target.closest('.remove-category')) {
    const allCards = document.querySelectorAll('.budget-card');
    if (allCards.length > 1) {
      e.target.closest('.budget-card').remove();
    } else {
      alert("At least one category is required.");
    }
  }
});



let goalIndex = 1;

document.getElementById('add-goal').addEventListener('click', function () {
  const goalSection = document.getElementById('step-5');
  const firstCard = document.querySelector('.goal-card');
  const newCard = firstCard.cloneNode(true);

  newCard.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  newCard.querySelector('input[type="text"]').name = `financialGoals[${goalIndex}][name]`;
  newCard.querySelector('input[type="number"]').name = `financialGoals[${goalIndex}][goalAmount]`;
  newCard.querySelector('input[type="date"]').name = `financialGoals[${goalIndex}][targetDate]`;

  newCard.querySelector('input[type="text"]').id = `goal${goalIndex + 1}`;
  newCard.querySelector('input[type="number"]').id = `target${goalIndex + 1}`;
  newCard.querySelector('input[type="date"]').id = `date${goalIndex + 1}`;

  newCard.classList.add('slide-in');
  goalSection.insertBefore(newCard, this);

  goalIndex++;
});

document.addEventListener('click', function (e) {
  if (e.target.closest('.remove-goal')) {
    const allGoals = document.querySelectorAll('.goal-card');
    if (allGoals.length > 1) {
      e.target.closest('.goal-card').remove();
    } else {
      alert("At least one goal is required.");
    }
  }
});


