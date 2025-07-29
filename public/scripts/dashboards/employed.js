// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Income Chart
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Income',
                data: [85000, 92000, 105000, 98000, 110000, 95000],
                backgroundColor: '#FFD700',
                borderRadius: 5,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#999', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#999', font: { size: 10 } }
                }
            }
        }
    });

    // Expense Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment'],
            datasets: [{
                data: [25, 22, 18, 15, 20],
                backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#9C27B0', '#FF9800'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Asset Distribution Chart
    const assetCtx = document.getElementById('assetChart').getContext('2d');
    new Chart(assetCtx, {
        type: 'pie',
        data: {
            labels: ['Real Estate', 'Crypto', 'Stocks', 'Bonds', 'Cash'],
            datasets: [{
                data: [60, 25, 8, 5, 2],
                backgroundColor: [
                    '#4CAF50',
                    '#FFC107',
                    '#2196F3',
                    '#9C27B0',
                    '#FF9800'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: {
                        color: '#E0E0E0',
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });

    // Interactive elements
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelector('.simulator-btn').addEventListener('click', function() {
        this.innerHTML = 'Running Simulation...';
        setTimeout(() => {
            this.innerHTML = 'Projection Complete!';
            this.style.background = 'linear-gradient(90deg, #00C853, #4CAF50)';
            setTimeout(() => {
                this.innerHTML = 'Run Projection';
                this.style.background = 'linear-gradient(90deg, var(--gold-accent), #FFAA00)';
            }, 2000);
        }, 1500);
    });

    document.querySelectorAll('.ai-action').forEach(action => {
        action.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<span>✓ Applied</span>';
            this.style.background = 'rgba(0, 200, 83, 0.2)';
            this.style.color = '#00C853';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = 'var(--gold-accent-10)';
                this.style.color = 'var(--gold-accent)';
            }, 2000);
        });
    });
});