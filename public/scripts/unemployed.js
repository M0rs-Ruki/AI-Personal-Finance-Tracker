document.addEventListener('DOMContentLoaded', function() {
    // Section navigation
    const sections = document.querySelectorAll('.section-container');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentSection = 1;
    
    // Navigation functions
    function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if(section.id === sectionId) {
        section.classList.add('active');
        currentSection = parseInt(sectionId.replace('section', ''));
        updateProgress();
        }
    });
    }
    
    function updateProgress() {
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if(index + 1 < currentSection) {
        step.classList.add('completed');
        } else if(index + 1 === currentSection) {
        step.classList.add('active');
        }
    });
    }
    
    nextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        showSection(target);
    });
    });
    
    prevBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        showSection(target);
    });
    });
    
    progressSteps.forEach(step => {
    step.addEventListener('click', function() {
        const stepNum = parseInt(this.getAttribute('data-step'));
        if(stepNum <= currentSection) {
        showSection(`section${stepNum}`);
        }
    });
    });
    
    // Toggle for work experience
    const hasWorkedNo = document.getElementById('hasWorkedNo');
    const hasWorkedYes = document.getElementById('hasWorkedYes');
    const lastJobDetailsSection = document.getElementById('lastJobDetailsSection');
    
    function toggleWorkExperience() {
    if(hasWorkedYes.classList.contains('selected')) {
        lastJobDetailsSection.style.display = 'block';
    } else {
        lastJobDetailsSection.style.display = 'none';
    }
    }
    
    hasWorkedNo.addEventListener('click', function() {
    hasWorkedNo.classList.add('selected');
    hasWorkedYes.classList.remove('selected');
    toggleWorkExperience();
    });
    
    hasWorkedYes.addEventListener('click', function() {
    hasWorkedYes.classList.add('selected');
    hasWorkedNo.classList.remove('selected');
    toggleWorkExperience();
    });
    
    // Toggle for debt
    const hasDebtNo = document.getElementById('hasDebtNo');
    const hasDebtYes = document.getElementById('hasDebtYes');
    const debtSection = document.getElementById('debtSection');
    
    function toggleDebt() {
    if(hasDebtYes.classList.contains('selected')) {
        debtSection.style.display = 'block';
    } else {
        debtSection.style.display = 'none';
    }
    }
    
    hasDebtNo.addEventListener('click', function() {
    hasDebtNo.classList.add('selected');
    hasDebtYes.classList.remove('selected');
    toggleDebt();
    });
    
    hasDebtYes.addEventListener('click', function() {
    hasDebtYes.classList.add('selected');
    hasDebtNo.classList.remove('selected');
    toggleDebt();
    });
    
    // Toggle for dependents
    const hasDependentsNo = document.getElementById('hasDependentsNo');
    const hasDependentsYes = document.getElementById('hasDependentsYes');
    const dependentsCountSection = document.getElementById('dependentsCountSection');
    
    function toggleDependents() {
    if(hasDependentsYes.classList.contains('selected')) {
        dependentsCountSection.style.display = 'block';
    } else {
        dependentsCountSection.style.display = 'none';
    }
    }
    
    hasDependentsNo.addEventListener('click', function() {
    hasDependentsNo.classList.add('selected');
    hasDependentsYes.classList.remove('selected');
    toggleDependents();
    });
    
    hasDependentsYes.addEventListener('click', function() {
    hasDependentsYes.classList.add('selected');
    hasDependentsNo.classList.remove('selected');
    toggleDependents();
    });
    
    // Repeating groups functionality
    // Income sources
    const incomeSourcesContainer = document.getElementById('incomeSourcesContainer');
    const addIncomeSourceBtn = document.getElementById('addIncomeSource');
    
    let incomeSourceCount = 1;
    
    addIncomeSourceBtn.addEventListener('click', function() {
    const newEntry = document.createElement('div');
    newEntry.className = 'entry-card';
    newEntry.innerHTML = `
        <button class="delete-entry">×</button>
        <div class="input-group">
        <label>Source Type</label>
        <select name="incomeSources[${incomeSourceCount}][sourceType]">
            <option value="freelance">Freelance</option>
            <option value="government-aid">Government Aid</option>
            <option value="family-support">Family Support</option>
            <option value="savings">Savings</option>
            <option value="part-time">Part-Time</option>
            <option value="other">Other</option>
        </select>
        </div>
        <div class="inline-group">
        <div class="input-group">
            <label>Amount</label>
            <input type="number" step="500" name="incomeSources[${incomeSourceCount}][amount]">
        </div>
        <div class="input-group">
            <label>Frequency</label>
            <select name="incomeSources[${incomeSourceCount}][frequency]">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
            <option value="irregular">Irregular</option>
            </select>
        </div>
        </div>
        <div class="input-group">
        <label>Description</label>
        <input type="text" name="incomeSources[${incomeSourceCount}][description]">
        </div>
    `;
    
    incomeSourcesContainer.appendChild(newEntry);
    incomeSourceCount++;
    
    // Add delete functionality
    newEntry.querySelector('.delete-entry').addEventListener('click', function() {
        newEntry.remove();
    });
    });
    
    // Financial goals
    const financialGoalsContainer = document.getElementById('financialGoalsContainer');
    const addFinancialGoalBtn = document.getElementById('addFinancialGoal');
    
    let financialGoalCount = 1;
    
    addFinancialGoalBtn.addEventListener('click', function() {
    const newEntry = document.createElement('div');
    newEntry.className = 'entry-card';
    newEntry.innerHTML = `
        <button class="delete-entry">×</button>
        <div class="input-group">
        <label>Goal Name</label>
        <input type="text" name="financialGoals[${financialGoalCount}][name]" placeholder="e.g., Emergency fund">
        </div>
        <div class="inline-group">
        <div class="input-group">
            <label>Type</label>
            <select name="financialGoals[${financialGoalCount}][type]">
            <option value="job-search">Job Search</option>
            <option value="emergency-fund">Emergency Fund</option>
            <option value="debt-repayment">Debt Repayment</option>
            <option value="skill-development">Skill Development</option>
            <option value="other">Other</option>
            </select>
        </div>
        <div class="input-group">
            <label>Priority</label>
            <select name="financialGoals[${financialGoalCount}][priority]">
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium" selected>Medium</option>
            <option value="low">Low</option>
            </select>
        </div>
        </div>
        <div class="inline-group">
        <div class="input-group">
            <label>Target Amount ($)</label>
            <input type="number" name="financialGoals[${financialGoalCount}][targetAmount]">
        </div>
        <div class="input-group">
            <label>Target Date</label>
            <input type="date" name="financialGoals[${financialGoalCount}][targetDate]">
        </div>
        </div>
    `;
    
    financialGoalsContainer.appendChild(newEntry);
    financialGoalCount++;
    
    // Add delete functionality
    newEntry.querySelector('.delete-entry').addEventListener('click', function() {
        newEntry.remove();
    });
    });
    
    // Add initial delete functionality to existing entries
    document.querySelectorAll('.delete-entry').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.entry-card').remove();
    });
    });
});