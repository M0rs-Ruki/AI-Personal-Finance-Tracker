// Function to create confetti effect
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.zIndex = '50';
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add event listeners for gold buttons
document.querySelectorAll('.gold-btn').forEach(button => {
    button.addEventListener('click', function() {
        createConfetti();
        
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-dark-card text-gold px-6 py-4 rounded-lg gold-border flex items-center shadow-lg z-50';
        notification.innerHTML = `
            <i class="fas fa-check-circle text-gold mr-3"></i>
            <span>Action completed successfully!</span>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    });
});

// Create holographic data sphere with enhanced interactivity and ambient animations
function createDataSphere() {
    const container = document.getElementById('dataSphere');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    const pointCount = 50;
    const points = [];
    let rotationX = 0;
    let rotationY = 0;
    let isMouseOver = false;
    let animationFrame;
    
    // Create sphere points with ambient animations
    for (let i = 0; i < pointCount; i++) {
        const point = document.createElement('div');
        point.classList.add('data-point');
        
        // Position points in 3D space using spherical coordinates
        const phi = Math.acos(-1 + (2 * i) / pointCount);
        const theta = Math.sqrt(pointCount * Math.PI) * phi;
        
        const radius = 70 + Math.random() * 20; // Variable radius for more organic look
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Random size and glow intensity
        const size = Math.random() * 6 + 3;
        const baseGlowIntensity = Math.random() * 0.8 + 0.2;
        const pulseSpeed = Math.random() * 0.02 + 0.01; // Different pulse speeds
        const floatSpeed = Math.random() * 0.005 + 0.002; // Floating animation speed
        
        point.style.width = `${size}px`;
        point.style.height = `${size}px`;
        point.style.position = 'absolute';
        point.style.background = '#FFD700';
        point.style.borderRadius = '50%';
        point.style.transition = 'all 0.3s ease';
        
        // Add hover effect to individual points
        point.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(2)';
            this.style.boxShadow = `0 0 20px rgba(255, 215, 0, 1)`;
            this.style.zIndex = '10';
        });
        
        point.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.style.zIndex = '1';
        });
        
        container.appendChild(point);
        points.push({
            x, y, z, 
            originalX: x, 
            originalY: y, 
            originalZ: z,
            element: point, 
            size: size, 
            baseGlowIntensity: baseGlowIntensity,
            pulseSpeed: pulseSpeed,
            floatSpeed: floatSpeed,
            pulseOffset: Math.random() * Math.PI * 2, // Random starting phase
            floatOffset: Math.random() * Math.PI * 2,
            time: 0
        });
    }
    
    // Add connection lines with enhanced visuals
    const connections = [];
    for (let i = 0; i < pointCount; i++) {
        const connectionsPerPoint = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < connectionsPerPoint; j++) {
            const targetIndex = Math.floor(Math.random() * pointCount);
            if (targetIndex !== i) {
                const connection = createConnection(points[i], points[targetIndex], container);
                if (connection) connections.push(connection);
            }
        }
    }
    
    // Ambient animation loop
    function animatePoints() {
        points.forEach((point, index) => {
            point.time += 0.016; // ~60fps
            
            // Pulsing glow effect
            const pulseValue = Math.sin(point.time * point.pulseSpeed + point.pulseOffset);
            const glowIntensity = point.baseGlowIntensity + (pulseValue * 0.3);
            const glowSize = point.size * (2 + pulseValue * 0.5);
            
            // Floating effect
            const floatValue = Math.sin(point.time * point.floatSpeed + point.floatOffset) * 5;
            
            // Color shifting effect
            const hueShift = Math.sin(point.time * 0.008 + index * 0.1) * 30;
            const color = `hsl(${51 + hueShift}, 100%, 50%)`; // Gold with slight hue variation
            
            // Apply all effects
            point.element.style.background = color;
            point.element.style.boxShadow = `
                0 0 ${glowSize}px rgba(255, 215, 0, ${glowIntensity}),
                0 0 ${glowSize * 1.5}px rgba(255, 215, 0, ${glowIntensity * 0.5})
            `;
            
            // Update position with floating effect
            if (!isMouseOver) {
                point.element.style.left = `calc(50% + ${point.originalX}px)`;
                point.element.style.top = `calc(50% + ${point.originalY + floatValue}px)`;
            }
            
            // Random intensity spikes
            if (Math.random() < 0.001) { // Very rare random flashes
                point.element.style.boxShadow = `0 0 ${glowSize * 3}px rgba(255, 215, 0, 1)`;
                setTimeout(() => {
                    // Reset after flash
                }, 200);
            }
        });
        
        // Animate connection lines
        connections.forEach((conn, index) => {
            if (conn) {
                const time = Date.now() * 0.001;
                const opacity = 0.3 + Math.sin(time * 0.5 + index * 0.5) * 0.2;
                conn.style.opacity = opacity;
                
                // Flowing effect along the line
                const flowPosition = (time * 20 + index * 10) % 100;
                conn.style.background = `linear-gradient(90deg, 
                    rgba(255, 215, 0, 0.1), 
                    rgba(255, 215, 0, 0.1), 
                    rgba(255, 215, 0, ${opacity * 2}) ${flowPosition}%, 
                    rgba(255, 215, 0, 0.1), 
                    rgba(255, 215, 0, 0.1))`;
            }
        });
        
        animationFrame = requestAnimationFrame(animatePoints);
    }
    
    // Start ambient animation
    animatePoints();
    
    // Add mouse interaction for rotation
    container.addEventListener('mouseenter', function() {
        isMouseOver = true;
        container.style.animationPlayState = 'paused';
    });
    
    container.addEventListener('mouseleave', function() {
        isMouseOver = false;
        container.style.animationPlayState = 'running';
    });
    
    container.addEventListener('mousemove', function(e) {
        if (!isMouseOver) return;
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = (e.clientX - centerX) / rect.width;
        const mouseY = (e.clientY - centerY) / rect.height;
        
        rotationY = mouseX * 45;
        rotationX = -mouseY * 45;
        
        updateSphereRotation();
    });
    
    // Update sphere rotation based on mouse position
    function updateSphereRotation() {
        points.forEach((point, index) => {
            const rad = Math.PI / 180;
            
            // Apply rotation matrices
            const cosX = Math.cos(rotationX * rad);
            const sinX = Math.sin(rotationX * rad);
            const cosY = Math.cos(rotationY * rad);
            const sinY = Math.sin(rotationY * rad);
            
            // Rotate around X axis
            let y = point.originalY * cosX - point.originalZ * sinX;
            let z = point.originalY * sinX + point.originalZ * cosX;
            
            // Rotate around Y axis
            let x = point.originalX * cosY + z * sinY;
            z = -point.originalX * sinY + z * cosY;
            
            point.element.style.left = `calc(50% + ${x}px)`;
            point.element.style.top = `calc(50% + ${y}px)`;
            
            // Adjust opacity based on z-depth
            const opacity = (z + 100) / 200;
            point.element.style.opacity = Math.max(0.3, Math.min(1, opacity));
        });
    }
    
    // Enhanced hover effects for container
    container.addEventListener('mouseenter', function() {
        points.forEach(point => {
            point.pulseSpeed *= 2; // Faster pulsing on hover
        });
        connections.forEach(conn => {
            if (conn) conn.style.opacity = '0.8';
        });
    });
    
    container.addEventListener('mouseleave', function() {
        points.forEach(point => {
            point.pulseSpeed /= 2; // Return to normal speed
        });
        connections.forEach(conn => {
            if (conn) conn.style.opacity = '0.3';
        });
    });
    
    // Cleanup function
    container.cleanup = function() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    };
}

function createConnection(point1, point2, container) {
    const dx = point2.originalX - point1.originalX;
    const dy = point2.originalY - point1.originalY;
    const dz = point2.originalZ - point1.originalZ;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // Only connect nearby points
    if (distance > 100) return null;
    
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    const line = document.createElement('div');
    line.classList.add('connection-line');
    line.style.width = `${distance}px`;
    line.style.height = '1px';
    line.style.position = 'absolute';
    line.style.left = `calc(50% + ${point1.originalX}px)`;
    line.style.top = `calc(50% + ${point1.originalY}px)`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = 'left center';
    line.style.background = `linear-gradient(90deg, 
        rgba(255, 215, 0, 0.1), 
        rgba(255, 215, 0, 0.6), 
        rgba(255, 215, 0, 0.1))`;
    line.style.opacity = '0.3';
    line.style.transition = 'opacity 0.3s ease';
    line.style.pointerEvents = 'none';
    
    // Add glow effect
    line.style.boxShadow = '0 0 3px rgba(255, 215, 0, 0.5)';
    
    container.appendChild(line);
    return line;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Animation for cards on page load
    const cards = document.querySelectorAll('.slide-in');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1 + 0.1}s`;
    });
    
    // Initialize financial health chart
    const ctx = document.getElementById("financialHealthChart");
    if (ctx) {
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Score", "Remaining"],
                datasets: [{
                    data: [70, 30], // 70% score
                    backgroundColor: ["#FFD700", "#333"],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: "70%",
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            }
        });
    }
    
    // Initialize holographic data sphere
    createDataSphere();
    
    // Add periodic sphere updates for dynamic effect
    setInterval(() => {
        const container = document.getElementById('dataSphere');
        if (container && !container.matches(':hover')) {
            // Clean up previous animation
            if (container.cleanup) {
                container.cleanup();
            }
            // Only recreate if not being hovered
            createDataSphere();
        }
    }, 20000); // Recreate every 20 seconds
});
