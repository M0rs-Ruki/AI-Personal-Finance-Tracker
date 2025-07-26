// Initialize progress bars
document.querySelectorAll('.progress-fill').forEach(bar => {
    const percentage = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
        bar.style.width = percentage;
    }, 300);
});

// Add focus animation to form elements
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 0 0 2px rgba(255, 215, 0, 0.5)';
    });
    
    el.addEventListener('blur', function() {
        this.parentElement.style.transform = 'none';
        this.style.boxShadow = 'none';
    });
});

// Add hover effect to goal cards
document.querySelectorAll('.goal-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'none';
        this.style.boxShadow = 'none';
    });
});

let goalCounter = 1; // Start from 1 since we have goals 0 and 1 already

// Function to calculate and update progress
function updateProgress(goalIndex) {
    const targetAmount = parseFloat(document.querySelector(`input[name="financialGoal[${goalIndex}][targetAmount]"]`).value) || 0;
    const currentAmount = parseFloat(document.querySelector(`input[name="financialGoal[${goalIndex}][currentAmount]"]`).value) || 0;
    
    const percentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
    
    // Update progress bar
    const progressFill = document.querySelector(`#goal-${goalIndex} .progress-fill`);
    const progressText = document.querySelector(`#goal-${goalIndex} .progress-text`);
    
    if (progressFill && progressText) {
        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '%';
    }
}

// Function to create a new goal form
function addNewGoal() {
    goalCounter++;
    
    const newGoalHTML = `
        <div class="goal-card" id="goal-${goalCounter}">
            <div class="goal-header">
                <div class="goal-title">Goal No.${goalCounter + 1}</div>
                <span class="priority-tag priority-medium">Medium Priority</span>
                <button type="button" class="remove-goal-btn" onclick="removeGoal(${goalCounter})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Remove</button>
            </div>
            
            <div class="grid-2">
                <div class="form-group">
                    <label>Goal Name</label>
                    <input type="text" name="financialGoal[${goalCounter}][name]" value="" required>
                </div>
                
                <div class="form-group">
                    <label>Priority</label>
                    <select name="financialGoal[${goalCounter}][priority]" onchange="updatePriorityTag(${goalCounter})">
                        <option value="high">High</option>
                        <option value="medium" selected>Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>
            
            <div class="grid-2">
                <div class="form-group">
                    <label>Target Amount (₹)</label>
                    <input type="number" name="financialGoal[${goalCounter}][targetAmount]" value="0" required onchange="updateProgress(${goalCounter})" oninput="updateProgress(${goalCounter})">
                </div>
                
                <div class="form-group">
                    <label>Current Amount (₹)</label>
                    <input type="number" name="financialGoal[${goalCounter}][currentAmount]" value="0" required onchange="updateProgress(${goalCounter})" oninput="updateProgress(${goalCounter})">
                </div>
            </div>
            
            <div class="form-group">
                <label>Progress</label>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text" style="text-align: right; margin-top: 4px; color: var(--gold-primary);">0%</div>
            </div>
        </div>
    `;
    
    // Insert the new goal before the add button
    const addButton = document.getElementById('add-goal-btn');
    addButton.insertAdjacentHTML('beforebegin', newGoalHTML);
    
    // Add hover effects to the new goal card
    const newGoalCard = document.getElementById(`goal-${goalCounter}`);
    newGoalCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.2)';
    });
    
    newGoalCard.addEventListener('mouseleave', function() {
        this.style.transform = 'none';
        this.style.boxShadow = 'none';
    });
}

// Function to remove a goal
function removeGoal(goalIndex) {
    const goalCard = document.getElementById(`goal-${goalIndex}`);
    if (goalCard) {
        goalCard.remove();
    }
}

// Function to update priority tag visual
function updatePriorityTag(goalIndex) {
    const select = document.querySelector(`select[name="financialGoal[${goalIndex}][priority]"]`);
    const priorityTag = document.querySelector(`#goal-${goalIndex} .priority-tag`);
    
    if (select && priorityTag) {
        const priority = select.value;
        priorityTag.className = `priority-tag priority-${priority}`;
        priorityTag.textContent = priority.charAt(0).toUpperCase() + priority.slice(1) + ' Priority';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-goal-btn');
    
    // Add hover effects to the add button
    addButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--gold-secondary, #b8941f)';
        this.style.transform = 'translateY(-2px)';
    });
    
    addButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--gold-primary, #d4af37)';
        this.style.transform = 'translateY(0)';
    });

    // Calculate initial progress for existing goals
    updateProgress(0); // For Goal No.1 (Vacation)
    updateProgress(1); // For Goal No.2 (Emergency Fund)
});