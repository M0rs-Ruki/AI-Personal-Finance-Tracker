

class EmployedSetup {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 8;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        this.initializeToggleFields();
        this.initializeRiskSlider();
        this.initializeExperienceBadges();
        this.initializeSummaryFrequency();
        this.initializeInvestmentCards();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = parseInt(e.target.dataset.next);
                if (this.validateCurrentStep()) {
                    this.goToStep(nextStep);
                }
            });
        });

        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prevStep = parseInt(e.target.dataset.prev);
                this.goToStep(prevStep);
            });
        });

        // Dynamic field additions
        this.setupDynamicFields();

        // Form submission
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Input animations and validations
        this.setupInputAnimations();

        // Goal progress calculations
        this.setupGoalCalculations();

        // Priority color updates
        this.setupPriorityUpdates();
    }

    initializeSummaryFrequency() {
        const frequencyCards = document.querySelectorAll('.frequency-container .investment-card');
        frequencyCards.forEach(card => {
            card.addEventListener('click', () => {
                // Uncheck all radios
                document.querySelectorAll('input[name="summaryFrequency"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Check the radio inside this card
                const radio = card.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Update visual selection
                frequencyCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });
        
        // Initialize first selection
        document.querySelector('#weekly').closest('.investment-card').classList.add('selected');
    }


    initializeToggleFields() {
        const bonusToggle = document.getElementById('bonus-toggle');
        const bonusFields = document.getElementById('bonus-fields');
        const bonusInputs = bonusFields.querySelectorAll('input, select');

        bonusToggle.addEventListener('change', () => {
            if (bonusToggle.checked) {
                bonusFields.classList.add('show');
                bonusFields.style.maxHeight = '500px';

                // Add required to bonus fields
                bonusInputs.forEach(input => input.required = true);
            } else {
                bonusFields.classList.remove('show');
                bonusFields.style.maxHeight = '0';

                // Remove required from bonus fields
                bonusInputs.forEach(input => input.required = false);
            }
        });

        // Initial state
        if (!bonusToggle.checked) {
            bonusInputs.forEach(input => input.required = false);
        }
    }


    setupDynamicFields() {
        // Add income source
        document.getElementById('add-income').addEventListener('click', () => {
            this.addIncomeSource();
        });

        // Add expense
        document.getElementById('add-expense').addEventListener('click', () => {
            this.addExpense();
        });

        // Add budget
        document.getElementById('add-budget').addEventListener('click', () => {
            this.addBudget();
        });

        // Add goal
        document.getElementById('add-goal').addEventListener('click', () => {
            this.addGoal();
        });
    }

    setupInputAnimations() {
        // Currency input animations
        document.querySelectorAll('.currency-input input').forEach(input => {
            input.addEventListener('focus', () => {
                const coinsAnimation = input.parentElement.querySelector('.coins-animation');
                if (coinsAnimation) {
                    coinsAnimation.style.opacity = '1';
                }
            });

            input.addEventListener('blur', () => {
                const coinsAnimation = input.parentElement.querySelector('.coins-animation');
                if (coinsAnimation) {
                    coinsAnimation.style.opacity = '0';
                }
            });
        });

        // Input field focus effects
        document.querySelectorAll('.input-field').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.animation = 'pulse-border 0.6s ease';
            });

            input.addEventListener('blur', () => {
                input.style.animation = '';
            });
        });
    }

    setupGoalCalculations() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('target-amount') || e.target.classList.contains('progress-input')) {
                this.updateGoalProgress(e.target);
            }
        });
    }

    setupPriorityUpdates() {
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('priority-select')) {
                this.updatePriorityIndicator(e.target);
            }
        });
    }

    initializeToggleFields() {
        const bonusToggle = document.getElementById('bonus-toggle');
        const bonusFields = document.getElementById('bonus-fields');

        bonusToggle.addEventListener('change', () => {
            if (bonusToggle.checked) {
                bonusFields.classList.add('show');
                bonusFields.style.maxHeight = '500px';
            } else {
                bonusFields.classList.remove('show');
                bonusFields.style.maxHeight = '0';
            }
        });
    }

    initializeRiskSlider() {
        const riskSlider = document.getElementById('risk-slider');
        const riskLabels = document.querySelectorAll('.risk-labels span');
        const riskInput = document.getElementById('risk-tolerance');

        const riskMap = ['low', 'medium', 'high', 'very-high'];

        riskSlider.addEventListener('input', () => {
            const index = parseInt(riskSlider.value) - 1;
            riskInput.value = riskMap[index];

            // Update active label
            riskLabels.forEach((label, i) => {
                label.classList.toggle('active', i === index);
            });
        });

        // Initialize
        riskSlider.dispatchEvent(new Event('input'));

        // Add click handlers for labels
        riskLabels.forEach((label, index) => {
            label.addEventListener('click', () => {
                riskSlider.value = index + 1;
                riskInput.value = riskMap[index];
                riskSlider.dispatchEvent(new Event('input'));
            });
        });
    }


    initializeExperienceBadges() {
        const badges = document.querySelectorAll('.badge');
        const experienceLevelInput = document.getElementById('experience-level');

        badges.forEach(badge => {
            badge.addEventListener('click', () => {
                badges.forEach(b => b.classList.remove('active'));
                badge.classList.add('active');
                experienceLevelInput.value = badge.dataset.level;
                
                // Add animation feedback
                badge.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    badge.style.transform = '';
                }, 200);
            });
        });
    }

    goToStep(step) {
        // Hide current step
        document.getElementById(`step-${this.currentStep}`).classList.remove('active');
        
        // Show new step
        document.getElementById(`step-${step}`).classList.add('active');
        
        // Update step indicators
        this.updateStepIndicators(step);
        
        // Update progress
        this.currentStep = step;
        this.updateProgress();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add entrance animation
        const currentSection = document.getElementById(`step-${step}`);
        currentSection.style.animation = 'none';
        setTimeout(() => {
            currentSection.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }

    updateStepIndicators(currentStep) {
        const indicators = document.querySelectorAll('.step-indicator');
        
        indicators.forEach((indicator, index) => {
            const stepNumber = index + 1;
            
            indicator.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < currentStep) {
                indicator.classList.add('completed');
            }
        });
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const currentStepElement = document.getElementById('current-step');
        
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        currentStepElement.textContent = this.currentStep;
    }

    validateCurrentStep() {
        const currentSection = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentSection.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field);
            } else {
                this.clearFieldError(field);
            }
        });

        // Special validation for radio groups
        const radioGroups = currentSection.querySelectorAll('input[type="radio"][required]');
        const groupNames = [...new Set([...radioGroups].map(r => r.name))];
        
        groupNames.forEach(name => {
            const checkedRadio = currentSection.querySelector(`input[name="${name}"]:checked`);
            if (!checkedRadio) {
                isValid = false;
                const firstRadio = currentSection.querySelector(`input[name="${name}"]`);
                this.showFieldError(firstRadio);
            }
        });

        if (!isValid) {
            this.showValidationMessage();
        }

        return isValid;
    }

    showFieldError(field) {
        field.style.borderColor = '#ff4757';
        field.style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
    }

    showValidationMessage() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = 'Please fill in all required fields';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    addIncomeSource() {
        const container = document.getElementById('income-sources');
        const existingItems = container.querySelectorAll('.repeating-item');
        const newIndex = existingItems.length;
        
        const newItem = document.createElement('div');
        newItem.className = 'repeating-item';
        newItem.innerHTML = `
            <div class="grid-3">
                <div>
                    <label>Source Name</label>
                    <input type="text" name="additionalIncomeSources[${newIndex}][name]" class="input-field" placeholder="Freelance work">
                </div>
                <div>
                    <label>Amount (₹)</label>
                    <div class="currency-input">
                        <span class="currency-symbol">₹</span>
                        <input type="number" name="additionalIncomeSources[${newIndex}][amount]" class="input-field" placeholder="0.00" step="0.01" min="0">
                    </div>
                </div>
                <div>
                    <label>Frequency</label>
                    <select name="additionalIncomeSources[${newIndex}][frequency]" class="input-field">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                        <option value="irregular">Irregular</option>
                    </select>
                </div>
            </div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(newItem);
        newItem.style.animation = 'slideInUp 0.3s ease';
    }

    addExpense() {
        const container = document.getElementById('expenses-group');
        const existingItems = container.querySelectorAll('.repeating-item');
        const newIndex = existingItems.length;
        
        const newItem = document.createElement('div');
        newItem.className = 'repeating-item';
        newItem.innerHTML = `
            <div class="grid-3">
                <div>
                    <label>Category</label>
                    <select name="fixedExpenses[${newIndex}][category]" class="input-field">
                        <option value="rent">Rent/Mortgage</option>
                        <option value="utilities">Utilities</option>
                        <option value="loan">Loan Payment</option>
                        <option value="insurance">Insurance</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label>Amount (₹)</label>
                    <input type="number" name="fixedExpenses[${newIndex}][amount]" placeholder="0.00" step="0.01" min="0" class="input-field">
                </div>
                <div>
                    <label>Due Date (1-31)</label>
                    <input type="number" name="fixedExpenses[${newIndex}][dueDate]" placeholder="1" min="1" max="31" class="input-field">
                </div>
            </div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(newItem);
        newItem.style.animation = 'slideInUp 0.3s ease';
    }

    addBudget() {
        const container = document.getElementById('budgets-group');
        const existingItems = container.querySelectorAll('.repeating-item');
        const newIndex = existingItems.length;
        
        const newItem = document.createElement('div');
        newItem.className = 'repeating-item';
        newItem.innerHTML = `
            <div class="grid-3">
                <div>
                    <label>Category</label>
                    <input type="text" name="budgetLimits[${newIndex}][category]" class="input-field" placeholder="e.g., Dining Out">
                </div>
                <div>
                    <label>Limit (₹)</label>
                    <input type="number" name="budgetLimits[${newIndex}][limit]" placeholder="0.00" step="0.01" min="0" class="input-field">
                </div>
                <div></div>
            </div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(newItem);
        newItem.style.animation = 'slideInUp 0.3s ease';
    }

    addGoal() {
        const container = document.getElementById('goals-group');
        const existingGoals = container.querySelectorAll('.goal-card');
        const newIndex = existingGoals.length;
        
        const newGoal = document.createElement('div');
        newGoal.className = 'goal-card';
        newGoal.innerHTML = `
            <div style="display: flex; gap: 1.5rem;">
                <div class="progress-ring">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" />
                        <circle class="progress" cx="50" cy="50" r="40" 
                                stroke-dasharray="251.2" 
                                stroke-dashoffset="251.2" />
                    </svg>
                    <div class="progress-text">
                        <div class="percent">0%</div>
                        <div class="label">Complete</div>
                    </div>
                </div>
                <div style="flex: 1;">
                    <div class="form-group">
                        <label>Goal Name <span class="required">*</span></label>
                        <input type="text" name="financialGoals[${newIndex}][name]" class="input-field" placeholder="Emergency fund" required>
                    </div>
                    <div class="grid-3">
                        <div>
                            <label>Priority</label>
                            <select name="financialGoals[${newIndex}][priority]" class="input-field priority-select">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label>Target Amount (₹) <span class="required">*</span></label>
                            <div class="currency-input">
                                <span class="currency-symbol">₹</span>
                                <input type="number" name="financialGoals[${newIndex}][targetAmount]" class="input-field target-amount" placeholder="0.00" step="0.01" min="0" required>
                            </div>
                        </div>
                        <div>
                            <label>Target Date <span class="required">*</span></label>
                            <input type="date" name="financialGoals[${newIndex}][targetDate]" class="input-field" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Current Progress (₹)</label>
                        <div class="currency-input">
                            <span class="currency-symbol">₹</span>
                            <input type="number" name="financialGoals[${newIndex}][currentProgress]" class="input-field progress-input" placeholder="0.00" step="0.01" min="0">
                        </div>
                    </div>
                </div>
            </div>
            <div class="priority-indicator"></div>
            <button type="button" class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(newGoal);
        newGoal.style.animation = 'slideInUp 0.3s ease';
    }

    updateGoalProgress(input) {
        const goalCard = input.closest('.goal-card');
        const progressRing = goalCard.querySelector('.progress-ring circle.progress');
        const percentElement = goalCard.querySelector('.percent');
        const priorityIndicator = goalCard.querySelector('.priority-indicator');
        
        const targetAmount = parseFloat(goalCard.querySelector('.target-amount').value) || 0;
        const currentProgress = parseFloat(goalCard.querySelector('.progress-input').value) || 0;
        
        const percentage = targetAmount > 0 ? Math.min((currentProgress / targetAmount) * 100, 100) : 0;
        const circumference = 251.2;
        const offset = circumference - (percentage / 100) * circumference;
        
        progressRing.style.strokeDashoffset = offset;
        percentElement.textContent = `${Math.round(percentage)}%`;
    }

    updatePriorityIndicator(select) {
        const goalCard = select.closest('.goal-card');
        const indicator = goalCard.querySelector('.priority-indicator');
        const priority = select.value;
        
        indicator.classList.remove('high', 'critical');
        
        if (priority === 'high') {
            indicator.classList.add('high');
        } else if (priority === 'critical') {
            indicator.classList.add('critical');
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Submit the form normally - removed all hidden field creation
        document.getElementById('employeeForm').submit();
    }

    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--secondary-bg);
            border: 2px solid var(--accent-gold);
            color: var(--text-primary);
            padding: 32px;
            border-radius: 16px;
            box-shadow: var(--shadow-gold);
            z-index: 10000;
            text-align: center;
            min-width: 300px;
            animation: fadeIn 0.5s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 16px;"></i>
            <h3 style="color: var(--accent-gold); margin-bottom: 8px;">Setup Complete!</h3>
            <p style="color: var(--text-secondary);">Your financial profile has been created successfully.</p>
        `;
        
        document.body.appendChild(notification);
        
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
        `;
        document.body.appendChild(backdrop);
        
        setTimeout(() => {
            notification.remove();
            backdrop.remove();
        }, 4000);
    }
}

// Additional CSS animations for JavaScript interactions
const additionalStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.delete-btn {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: 50%;
    transition: all var(--transition-normal);
    z-index: 10;
}

.delete-btn:hover {
    color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
    transform: scale(1.1);
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmployedSetup();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployedSetup;
}