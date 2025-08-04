<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RukiAI - Smart Personal Finance Tracker</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #4361ee;
            --secondary: #3f37c9;
            --accent: #4cc9f0;
            --success: #4ade80;
            --warning: #facc15;
            --danger: #f87171;
            --dark: #1e293b;
            --light: #f8fafc;
            --card-bg: #ffffff;
            --card-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
            color: var(--dark);
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(120deg, var(--primary), var(--secondary));
            color: white;
            border-radius: 16px;
            margin-bottom: 30px;
            box-shadow: 0 10px 20px rgba(67, 97, 238, 0.2);
            position: relative;
            overflow: hidden;
        }

        header::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            transform: rotate(30deg);
        }

        .logo {
            font-size: 4rem;
            margin-bottom: 15px;
            text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .tagline {
            font-size: 1.4rem;
            max-width: 700px;
            margin: 0 auto 20px;
            opacity: 0.9;
            font-weight: 300;
        }

        .cards-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 30px;
            box-shadow: var(--card-shadow);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(99, 99, 99, 0.15);
        }

        .card::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: var(--primary);
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .card-icon {
            font-size: 1.8rem;
            background: linear-gradient(120deg, var(--primary), var(--secondary));
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        }

        .card-title {
            font-size: 1.6rem;
            font-weight: 600;
        }

        .card-content {
            padding-left: 10px;
        }

        ul {
            padding-left: 20px;
            margin-bottom: 20px;
        }

        li {
            margin-bottom: 10px;
            position: relative;
            padding-left: 25px;
        }

        li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: var(--primary);
            font-size: 1.2rem;
        }

        .highlight {
            background: linear-gradient(120deg, rgba(67, 97, 238, 0.1), rgba(67, 97, 238, 0.05));
            padding: 15px;
            border-radius: 12px;
            border-left: 3px solid var(--primary);
            margin: 15px 0;
        }

        .stack-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }

        .stack-item {
            background: rgba(67, 97, 238, 0.1);
            color: var(--primary);
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .ai-phase {
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
        }

        .phase-1 {
            background: rgba(76, 201, 240, 0.1);
            border: 1px solid rgba(76, 201, 240, 0.3);
        }

        .phase-2 {
            background: rgba(159, 122, 234, 0.1);
            border: 1px solid rgba(159, 122, 234, 0.3);
        }

        .phase-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .phase-icon {
            font-size: 1.5rem;
            margin-right: 10px;
        }

        .phase-title {
            font-size: 1.3rem;
            font-weight: 600;
        }

        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 10px;
        }

        .status-live {
            background: rgba(74, 222, 128, 0.2);
            color: #15803d;
        }

        .status-showcase {
            background: rgba(250, 204, 21, 0.2);
            color: #854d0e;
        }

        .users-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .user-card {
            text-align: center;
            padding: 20px 15px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .user-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }

        .user-title {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .roadmap {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .roadmap-item {
            display: flex;
            align-items: flex-start;
            padding: 15px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .roadmap-icon {
            font-size: 1.5rem;
            margin-right: 15px;
            color: var(--primary);
        }

        .chart-container {
            height: 200px;
            margin-top: 30px;
        }

        footer {
            text-align: center;
            padding: 30px;
            margin-top: 40px;
            color: #64748b;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .cards-container {
                grid-template-columns: 1fr;
            }
            
            h1 {
                font-size: 2.2rem;
            }
            
            .tagline {
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <i class="fas fa-brain"></i>
            </div>
            <h1>RukiAI – Smart Personal Finance Tracker</h1>
            <p class="tagline">AI-enhanced personal finance tracker for smarter financial decisions through real-time insights, budget monitoring, and goal tracking</p>
        </header>

        <div class="cards-container">
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h2 class="card-title">Project Overview</h2>
                </div>
                <div class="card-content">
                    <p>Managing money shouldn't be confusing — that's where RukiAI steps in.</p>
                    <p>This platform allows users to:</p>
                    <ul>
                        <li>Log daily or weekly expenses</li>
                        <li>Set custom budgets and financial goals</li>
                        <li>Get AI-powered suggestions like:
                            <div class="highlight">
                                <em>"You've already used 70% of your food budget this week."</em><br>
                                <em>"You're on track to hit your emergency savings goal ahead of schedule."</em>
                            </div>
                        </li>
                        <li>Customize categories based on lifestyle (e.g., food, rent, entertainment, education)</li>
                        <li>Receive weekly reports via email or SMS</li>
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <h2 class="card-title">Tech Stack</h2>
                </div>
                <div class="card-content">
                    <div class="stack-container">
                        <div class="stack-item">Node.js (Express)</div>
                        <div class="stack-item">MongoDB</div>
                        <div class="stack-item">EJS</div>
                        <div class="stack-item">HTML/CSS</div>
                        <div class="stack-item">EJS Templates</div>
                        <div class="stack-item">AI Integration</div>
                    </div>
                    
                    <h3 style="margin: 25px 0 15px;">AI System: Two-Part Architecture</h3>
                    
                    <div class="ai-phase phase-1">
                        <div class="phase-header">
                            <div class="phase-icon">
                                <i class="fas fa-link"></i>
                            </div>
                            <h3 class="phase-title">Phase 1: Live & Deployable (AI API)</h3>
                        </div>
                        <p>Lightweight version leveraging external AI APIs (OpenAI/Cohere) for insights generation.</p>
                        <p><strong>Why AI API?</strong></p>
                        <ul>
                            <li>Minimal hosting cost</li>
                            <li>Faster deployment</li>
                            <li>High-quality NLP insights</li>
                        </ul>
                        <div class="status status-live">✅ Production-ready and live</div>
                    </div>
                    
                    <div class="ai-phase phase-2">
                        <div class="phase-header">
                            <div class="phase-icon">
                                <i class="fas fa-microchip"></i>
                            </div>
                            <h3 class="phase-title">Phase 2: Local AI Model (Showcase)</h3>
                        </div>
                        <p>Custom-built financial coaching model for technical demonstration.</p>
                        <p><strong>Why Include a Local AI Model?</strong></p>
                        <ul>
                            <li>Showcase AI design capabilities</li>
                            <li>Demonstrate model integration skills</li>
                            <li>Simulate self-hosted system behavior</li>
                        </ul>
                        <div class="status status-showcase">🚫 Not for production deployment</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h2 class="card-title">Target Users</h2>
                </div>
                <div class="card-content">
                    <div class="users-grid">
                        <div class="user-card">
                            <div class="user-icon">🧑‍🎓</div>
                            <h3 class="user-title">Students</h3>
                            <p>Track allowances & education expenses</p>
                        </div>
                        <div class="user-card">
                            <div class="user-icon">👨‍💼</div>
                            <h3 class="user-title">Professionals</h3>
                            <p>Monitor salary, investments & savings</p>
                        </div>
                        <div class="user-card">
                            <div class="user-icon">👵</div>
                            <h3 class="user-title">Retirees</h3>
                            <p>Plan pensions & medical budgets</p>
                        </div>
                        <div class="user-card">
                            <div class="user-icon">👤</div>
                            <h3 class="user-title">Guests</h3>
                            <p>Demo mode available</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">
                        <i class="fas fa-road"></i>
                    </div>
                    <h2 class="card-title">Future Roadmap</h2>
                </div>
                <div class="card-content">
                    <div class="roadmap">
                        <div class="roadmap-item">
                            <div class="roadmap-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div>
                                <h3>Visual Dashboards</h3>
                                <p>Graphs & trend insights</p>
                            </div>
                        </div>
                        <div class="roadmap-item">
                            <div class="roadmap-icon">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3>Voice-based Logging</h3>
                                <p>Chatbot expense logging</p>
                            </div>
                        </div>
                        <div class="roadmap-item">
                            <div class="roadmap-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div>
                                <h3>PWA Version</h3>
                                <p>Progressive Web App for mobile</p>
                            </div>
                        </div>
                        <div class="roadmap-item">
                            <div class="roadmap-icon">
                                <i class="fas fa-cloud"></i>
                            </div>
                            <div>
                                <h3>GCP Deployment</h3>
                                <p>For local AI model showcase</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <canvas id="roadmapChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        
        <footer>
            <p>RukiAI - Making personal finance management smarter with AI</p>
            <p>© 2023 RukiAI Project | Open Source on GitHub</p>
        </footer>
    </div>

    <script>
        // Roadmap progress chart
        const ctx = document.getElementById('roadmapChart').getContext('2d');
        const roadmapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dashboards', 'Voice Logging', 'PWA Mobile', 'GCP Deployment'],
                datasets: [{
                    label: 'Development Progress',
                    data: [65, 40, 30, 20],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.7)',
                        'rgba(76, 201, 240, 0.7)',
                        'rgba(159, 122, 234, 0.7)',
                        'rgba(250, 204, 21, 0.7)'
                    ],
                    borderColor: [
                        'rgba(67, 97, 238, 1)',
                        'rgba(76, 201, 240, 1)',
                        'rgba(159, 122, 234, 1)',
                        'rgba(250, 204, 21, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Simple animation for cards on load
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 150);
            });
        });
    </script>
</body>
</html>
