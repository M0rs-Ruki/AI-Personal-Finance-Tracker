document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    const stepElements = document.querySelectorAll('.step');
    let currentStep = 1;

    // Update progress bar
    function updateProgress() {
    const percentage = ((currentStep - 1) / (steps.length - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    stepElements.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
        step.classList.add('active');
        } else if (stepNum < currentStep) {
        step.classList.add('completed');
        }
    });
    }

    // Next step buttons
    document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function () {
        const nextStep = this.dataset.next;
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`step-${nextStep}`).classList.add('active');
        currentStep = parseInt(nextStep);
        updateProgress();
        window.scrollTo(0, 0);

        // Add microinteraction
        button.classList.add('gold-pulse');
        setTimeout(() => button.classList.remove('gold-pulse'), 500);
    });
    });

    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function () {
        const prevStep = this.dataset.prev;
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`step-${prevStep}`).classList.add('active');
        currentStep = parseInt(prevStep);
        updateProgress();
        window.scrollTo(0, 0);
    });
    });

    // Option cards functionality
    document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function () {
        const parent = this.closest('.card');
        const siblings = parent.querySelectorAll('.option-card');

        // Remove selected class from all siblings
        siblings.forEach(sib => sib.classList.remove('selected'));

        // Add selected class to clicked card
        this.classList.add('selected');

        // Update hidden input values
        const value = this.dataset.value;

        // Pension
        if (parent.querySelector('#pension-details')) {
        document.getElementById('receivesPension').value = value;
        const conditionalSection = document.getElementById('pension-details');
        if (value === 'yes') {
            conditionalSection.style.display = 'block';
        } else {
            conditionalSection.style.display = 'none';
        }
        }

        // Retirement accounts
        if (parent.querySelector('#retirement-accounts')) {
        document.getElementById('hasRetirementAccounts').value = value;
        const conditionalSection = document.getElementById('retirement-accounts');
        if (value === 'yes') {
            conditionalSection.style.display = 'block';
        } else {
            conditionalSection.style.display = 'none';
        }
        }

        // Beneficiaries
        if (parent.querySelector('#beneficiaries')) {
        document.getElementById('hasBeneficiaries').value = value;
        const conditionalSection = document.getElementById('beneficiaries');
        if (value === 'yes') {
            conditionalSection.style.display = 'block';
        } else {
            conditionalSection.style.display = 'none';
        }
        }

        // Estate documents
        if (this.dataset.value === 'will') {
        const input = this.querySelector('input[name="legacyPlanning[hasWill]"]');
        if (this.classList.contains('selected')) {
            input.value = 'true';
        } else {
            input.value = 'false';
        }
        }

        if (this.dataset.value === 'estate') {
        const input = this.querySelector('input[name="legacyPlanning[hasEstatePlan]"]');
        if (this.classList.contains('selected')) {
            input.value = 'true';
        } else {
            input.value = 'false';
        }
        }
    });
    });

    // Add item buttons functionality
    function setupAddItem(buttonId, containerSelector, fields) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    let itemCount = 1; // Start from 1 as we have one by default

    button.addEventListener('click', function () {
        const container = this.closest(containerSelector);
        if (!container) return;

        const newItem = document.createElement('div');
        newItem.className = 'input-grid';
        newItem.style.marginTop = '15px';
        newItem.style.paddingTop = '15px';
        newItem.style.borderTop = '1px dashed rgba(255,255,255,0.1)';

        let html = '';
        fields.forEach(field => {
        html += `
                        <div class="input-group">
                            <label>${field.label}</label>
                            ${field.html.replace(/\{index\}/g, itemCount)}
                        </div>
                    `;
        });

        // Add remove button
        html += `
                    <div class="input-group">
                        <button class="cyber-input remove-item" style="background: #333; cursor: pointer; display: flex; justify-content: center; align-items: center; color: #ff6b6b; font-weight: 600;">
                            <i class="fas fa-trash" style="margin-right: 8px;"></i> Remove
                        </button>
                    </div>
                `;

        newItem.innerHTML = html;
        container.insertBefore(newItem, this);

        // Add event to remove button
        newItem.querySelector('.remove-item').addEventListener('click', function () {
        this.closest('.input-grid').remove();
        });

        itemCount++;

        // Add microinteraction
        button.classList.add('gold-pulse');
        setTimeout(() => button.classList.remove('gold-pulse'), 500);
    });
    }




    // Configure add item buttons
    setupAddItem('add-income', '.card', [
    { label: 'Source', html: '<input type="text" class="cyber-input" placeholder="Income source" name="otherIncomeSources[{index}][source]">' },
    { label: 'Amount', html: '<input type="number" class="cyber-input" min="0" placeholder="Enter amount" name="otherIncomeSources[{index}][amount]">' },
    {
        label: 'Frequency', html: `
                <select class="cyber-input" name="otherIncomeSources[{index}][frequency]">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annual">Semi-Annual</option>
                    <option value="annual">Annual</option>
                    <option value="occasional">Occasional</option>
                </select>
            `}
    ]);

    setupAddItem('add-expense', '.card', [
    { label: 'Expense Name', html: '<input type="text" class="cyber-input" placeholder="e.g., Utilities, Groceries" name="otherExpenses[{index}][name]">' },
    { label: 'Amount', html: '<input type="number" class="cyber-input" min="0" placeholder="Enter amount" name="otherExpenses[{index}][amount]">' },
    {
        label: 'Frequency', html: `
                <select class="cyber-input" name="otherExpenses[{index}][frequency]">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                </select>
            `}
    ]);

    setupAddItem('add-retirement-account', '#retirement-accounts', [
    {
        label: 'Account Type', html: `
                <select class="cyber-input" name="retirementAccounts[{index}][type]">
                    <option value="EPF">EPF (Employee Provident Fund)</option>
                    <option value="NPS">NPS (National Pension System)</option>
                    <option value="PPF">PPF (Public Provident Fund)</option>
                    <option value="Annuity">Annuity</option>
                    <option value="Other">Other</option>
                </select>
            `},
    { label: 'Current Value', html: '<input type="number" class="cyber-input" min="0" placeholder="Enter amount" name="retirementAccounts[{index}][currentValue]">' }
    ]);

    setupAddItem('add-asset', '.card', [
    {
        label: 'Asset Type', html: `
                <select class="cyber-input" name="otherAssets[{index}][type]">
                    <option value="property">Property</option>
                    <option value="investments">Investments</option>
                    <option value="savings">Savings</option>
                    <option value="other">Other</option>
                </select>
            `},
    { label: 'Estimated Value', html: '<input type="number" class="cyber-input" min="0" placeholder="Enter amount" name="otherAssets[{index}][estimatedValue]">' }
    ]);


    setupAddItem('add-beneficiary', '#beneficiaries', [
    { label: 'Full Name', html: '<input type="text" class="cyber-input" placeholder="Beneficiary name" name="legacyPlanning[beneficiaries][{index}][name]">' },
    { label: 'Relationship', html: '<input type="text" class="cyber-input" placeholder="e.g., Spouse, Child" name="legacyPlanning[beneficiaries][{index}][relationship]">' },
    { label: 'Percentage', html: '<input type="number" class="cyber-input" min="0" max="100" placeholder="0-100" name="legacyPlanning[beneficiaries][{index}][percentage]">' }
    ]);

    // Form submission
    document.getElementById('retirement-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Create confetti effect
    const confettiCount = 100;
    const container = document.querySelector('.container');

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 100 + '%';
        confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        container.appendChild(confetti);

        setTimeout(() => {
        confetti.remove();
        }, 3000);
    }

    // Show success message
    setTimeout(() => {
        alert('Profile submitted successfully! Your retirement plan is being generated.');
        this.submit();
    }, 1500);
    });

    // Initial progress update
    updateProgress();
});


let goalIndex = 2; // Start from 2 because 0 and 1 already exist

document.getElementById('add-goal').addEventListener('click', () => {
const container = document.getElementById('goal-cards-container');

const card = document.createElement('div');
card.classList.add('card');

card.innerHTML = `
    <h3 class="card-title"><i class="fas fa-bullseye"></i> Goal ${goalIndex + 1}</h3>
    <div class="input-grid">
    <div class="input-group">
        <label>Goal Name</label>
        <input type="text" class="cyber-input" name="savingsGoals[${goalIndex}][name]" placeholder="Enter goal name">
    </div>
    <div class="input-group">
        <label>Target Amount</label>
        <input type="number" class="cyber-input" name="savingsGoals[${goalIndex}][targetAmount]" min="0" placeholder="Enter amount">
    </div>
    <div class="input-group">
        <label>Current Amount</label>
        <input type="number" class="cyber-input" name="savingsGoals[${goalIndex}][currentAmount]" min="0" placeholder="Enter amount">
    </div>
    <div class="input-group">
        <label>Category</label>
        <select class="cyber-input" name="savingsGoals[${goalIndex}][category]">
        <option value="travel">Travel</option>
        <option value="medical">Medical</option>
        <option value="gifts">Gifts</option>
        <option value="other">Other</option>
        </select>
    </div>
    </div>
`;

container.appendChild(card);
goalIndex++;
});