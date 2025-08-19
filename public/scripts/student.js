
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

  // Clear input values
  const nameInput = newCard.querySelector('input[type="text"]');
  const numberInputs = newCard.querySelectorAll('input[type="number"]');

  if (numberInputs.length < 2) {
    console.error("Expected two number inputs: budgetLimit and actualSpent");
    return;
  }

  const amountInput = numberInputs[0];       // budgetLimit
  const actualSpentInput = numberInputs[1];  // actualSpent

  nameInput.value = '';
  amountInput.value = '';
  actualSpentInput.value = '';

  // Assign proper names
  nameInput.name = `customCategories[${categoryIndex}][name]`;
  amountInput.name = `customCategories[${categoryIndex}][budgetLimit]`;
  actualSpentInput.name = `customCategories[${categoryIndex}][actualSpent]`;

  // Optional but helpful: unique IDs
  nameInput.id = `category${categoryIndex + 1}`;
  amountInput.id = `limit${categoryIndex + 1}`;
  actualSpentInput.id = `spent${categoryIndex + 1}`;

  // Optional: add animation class
  newCard.classList.add('slide-in');

  // Insert before the "Add Category" button
  budgetSection.insertBefore(newCard, this);

  categoryIndex++;
});



let goalIndex = 1;

document.getElementById('add-goal').addEventListener('click', function () {
  const goalSection = document.getElementById('step-5');
  const firstCard = document.querySelector('.goal-card');
  const newCard = firstCard.cloneNode(true);

  // Clear values
  newCard.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  // Select inputs in the correct order
  const textInput = newCard.querySelector('input[type="text"]');
  const numberInputs = newCard.querySelectorAll('input[type="number"]');
  const dateInput = newCard.querySelector('input[type="date"]');

  // Assign unique names
  if (textInput) {
    textInput.name = `financialGoals[${goalIndex}][name]`;
    textInput.id = `goal${goalIndex + 1}`;
  }

  if (numberInputs.length >= 2) {
    numberInputs[0].name = `financialGoals[${goalIndex}][goalAmount]`;
    numberInputs[0].id = `target${goalIndex + 1}-amount`;

    numberInputs[1].name = `financialGoals[${goalIndex}][savedAmount]`;
    numberInputs[1].id = `target${goalIndex + 1}-saved`;
  }

  if (dateInput) {
    dateInput.name = `financialGoals[${goalIndex}][targetDate]`;
    dateInput.id = `date${goalIndex + 1}`;
  }

  // Add animation class and insert
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


