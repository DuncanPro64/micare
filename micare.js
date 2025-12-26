// Global state
const appState = {
    currentUser: null,
    currentScreen: 'splash',
    selectedRole: null,
    personalData: {},
    selectedServices: new Set(),
    chatHistory: {},
    walletBalance: 1245.75,
    notifications: [
        { id: 1, type: 'health', message: 'New health data recorded', time: '2 hours ago', read: false },
        { id: 2, type: 'appointment', message: 'Appointment reminder: Tomorrow, 10 AM', time: '5 hours ago', read: false },
        { id: 3, type: 'transaction', message: 'You received 25 HTB for data sharing', time: 'Yesterday', read: false }
    ]
};

// DOM Elements
const screens = {
    splash: document.getElementById('splash-screen'),
    login: document.getElementById('login-screen'),
    signup: document.getElementById('signup-screen'),
    personalData: document.getElementById('personal-data-screen'),
    certification: document.getElementById('certification-screen'),
    services: document.getElementById('services-screen'),
    submission: document.getElementById('submission-screen'),
    validation: document.getElementById('validation-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    chat: document.getElementById('chat-window')
};

// Navigation functions
function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // Show target screen
    const targetScreen = screens[screenName];
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.classList.remove('hidden');
        appState.currentScreen = screenName;
        
        // Special screen initialization
        if (screenName === 'dashboard') {
            initDashboard();
        } else if (screenName === 'map') {
            initMap();
        }
    }
}

// Initialize the application
function initApp() {
    // Splash screen timeout
    setTimeout(() => {
        showScreen('login');
    }, 3000);
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Two-step verification options
    const biometricOption = document.getElementById('biometric-option');
    const qrOption = document.getElementById('qr-option');
    const qrScanner = document.getElementById('qr-scanner');
    const cancelQr = document.getElementById('cancel-qr');
    
    if (biometricOption) {
        biometricOption.addEventListener('click', () => {
            simulateBiometricVerification();
        });
    }
    
    if (qrOption) {
        qrOption.addEventListener('click', () => {
            qrScanner.classList.remove('hidden');
        });
    }
    
    if (cancelQr) {
        cancelQr.addEventListener('click', () => {
            qrScanner.classList.add('hidden');
        });
    }
    
    // Navigation links
    const signupLink = document.getElementById('signup-link');
    const backToLogin = document.getElementById('back-to-login');
    
    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('signup');
        });
    }
    
    if (backToLogin) {
        backToLogin.addEventListener('click', () => {
            showScreen('login');
        });
    }
    
    // Role selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appState.selectedRole = card.dataset.role;
            
            // After 1 second, proceed to personal data
            setTimeout(() => {
                showScreen('personalData');
                initMultiStepForm();
            }, 1000);
        });
    });
    
    // Initialize multi-step form
    initMultiStepForm();
    
    // Initialize certification steps
    initCertificationSteps();
    
    // Initialize services selection
    initServicesSelection();
    
    // Initialize submission screen
    initSubmissionScreen();
    
    // Initialize validation simulation
    initValidationSimulation();
    
    // Initialize dashboard
    initDashboardEventListeners();
    
    // Initialize chat functionality
    initChatFunctionality();
    
    // Initialize modals
    initModals();
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const pin = document.getElementById('pin').value;
    
    // Simple validation
    if (!username || !pin || pin.length !== 6) {
        alert('Please enter valid credentials (6-digit PIN required)');
        return;
    }
    
    // Simulate login process
    document.getElementById('login-form').classList.add('loading');
    
    setTimeout(() => {
        // Mock successful login
        appState.currentUser = {
            name: 'John Doe',
            role: 'Normal User',
            blockchainAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438fdfe'
        };
        
        showScreen('dashboard');
        updateUserInfo();
    }, 1500);
}

// Simulate biometric verification
function simulateBiometricVerification() {
    const biometricOption = document.getElementById('biometric-option');
    const originalHTML = biometricOption.innerHTML;
    
    biometricOption.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Scanning...</span>';
    biometricOption.style.pointerEvents = 'none';
    
    setTimeout(() => {
        biometricOption.innerHTML = '<i class="fas fa-check-circle"></i><span>Verified</span>';
        biometricOption.style.color = '#2ecc71';
        
        // Reset after 2 seconds
        setTimeout(() => {
            biometricOption.innerHTML = originalHTML;
            biometricOption.style.pointerEvents = 'auto';
            biometricOption.style.color = '';
        }, 2000);
    }, 2000);
}

// Initialize multi-step form
function initMultiStepForm() {
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Show first step
    if (formSteps.length > 0) {
        formSteps.forEach(step => step.classList.remove('active'));
        formSteps[0].classList.add('active');
    }
    
    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const nextStepId = button.dataset.next;
            const nextStep = document.querySelector(`.form-step[data-step="${nextStepId}"]`);
            
            if (nextStep) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                
                // If this is the last step of personal data, go to certification
                if (nextStepId === '3' && !document.querySelector('.form-step[data-step="4"]')) {
                    setTimeout(() => {
                        showScreen('certification');
                    }, 500);
                }
            }
        });
    });
    
    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const prevStepId = button.dataset.prev;
            const prevStep = document.querySelector(`.form-step[data-step="${prevStepId}"]`);
            
            if (prevStep) {
                currentStep.classList.remove('active');
                prevStep.classList.add('active');
            }
        });
    });
    
    // Form data collection
    const personalDataForm = document.getElementById('personal-data-form');
    if (personalDataForm) {
        personalDataForm.addEventListener('input', () => {
            // Collect form data
            const formData = new FormData(personalDataForm);
            appState.personalData = Object.fromEntries(formData);
        });
    }
    
    // Back to certification button
    const backToCertification = document.getElementById('back-to-certification');
    if (backToCertification) {
        backToCertification.addEventListener('click', () => {
            showScreen('certification');
        });
    }
    
    // Back to personal data button
    const backToPersonal = document.getElementById('back-to-personal');
    if (backToPersonal) {
        backToPersonal.addEventListener('click', () => {
            showScreen('personalData');
        });
    }
}

// Initialize certification steps
function initCertificationSteps() {
    const certSteps = document.querySelectorAll('.cert-step');
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    // Show first certification step
    if (certSteps.length > 0) {
        certSteps.forEach(step => step.classList.remove('active'));
        certSteps[0].classList.add('active');
    }
    
    // File upload functionality
    uploadAreas.forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        const uploadButton = area.querySelector('button');
        
        if (uploadButton && fileInput) {
            uploadButton.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    area.innerHTML = `
                        <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                        <p>${file.name}</p>
                        <small>${(file.size / 1024).toFixed(2)} KB</small>
                    `;
                    
                    // Move to next step after 1 second
                    setTimeout(() => {
                        const currentStep = area.closest('.cert-step');
                        const nextStep = currentStep.nextElementSibling;
                        
                        if (nextStep && nextStep.classList.contains('cert-step')) {
                            currentStep.classList.remove('active');
                            nextStep.classList.add('active');
                        }
                    }, 1000);
                }
            });
        }
    });
    
    // Biometric buttons
    const biometricButtons = document.querySelectorAll('.biometric-option button');
    biometricButtons.forEach(button => {
        button.addEventListener('click', () => {
            const option = button.closest('.biometric-option');
            const originalText = button.textContent;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Captured';
                button.style.backgroundColor = '#2ecc71';
                button.style.color = 'white';
                
                // Move to next step after 1 second
                setTimeout(() => {
                    const currentStep = option.closest('.cert-step');
                    const nextStep = currentStep.nextElementSibling;
                    
                    if (nextStep && nextStep.classList.contains('cert-step')) {
                        currentStep.classList.remove('active');
                        nextStep.classList.add('active');
                    }
                }, 1000);
            }, 2000);
        });
    });
    
    // Continue to services button
    const continueToServices = document.getElementById('continue-to-services');
    if (continueToServices) {
        continueToServices.addEventListener('click', () => {
            showScreen('services');
        });
    }
    
    // Back to services button
    const backToServices = document.getElementById('back-to-services');
    if (backToServices) {
        backToServices.addEventListener('click', () => {
            showScreen('services');
        });
    }
}

// Initialize services selection
function initServicesSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const service = card.dataset.service;
            
            if (appState.selectedServices.has(service)) {
                appState.selectedServices.delete(service);
                card.classList.remove('selected');
            } else {
                appState.selectedServices.add(service);
                card.classList.add('selected');
            }
            
            // Update services count
            const serviceCount = document.getElementById('service-count');
            if (serviceCount) {
                serviceCount.textContent = `${appState.selectedServices.size} services`;
            }
        });
    });
    
    // Continue to submission button
    const continueToSubmission = document.getElementById('continue-to-submission');
    if (continueToSubmission) {
        continueToSubmission.addEventListener('click', () => {
            if (appState.selectedServices.size === 0) {
                alert('Please select at least one service');
                return;
            }
            showScreen('submission');
        });
    }
}

// Initialize submission screen
function initSubmissionScreen() {
    const acceptTerms = document.getElementById('accept-terms');
    const submitButton = document.getElementById('submit-application');
    const signatureCanvas = document.getElementById('signature-canvas');
    const clearSignature = document.getElementById('clear-signature');
    
    // Update data summary
    const dataCount = document.getElementById('data-count');
    const docCount = document.getElementById('doc-count');
    const serviceCount = document.getElementById('service-count');
    
    if (dataCount) dataCount.textContent = '8 fields';
    if (docCount) docCount.textContent = '3 files';
    if (serviceCount) serviceCount.textContent = `${appState.selectedServices.size} services`;
    
    // Terms acceptance
    if (acceptTerms && submitButton) {
        acceptTerms.addEventListener('change', () => {
            submitButton.disabled = !acceptTerms.checked;
        });
    }
    
    // Signature canvas
    if (signatureCanvas) {
        const ctx = signatureCanvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        // Set canvas background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        
        // Drawing functions
        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }
        
        function stopDrawing() {
            isDrawing = false;
        }
        
        // Event listeners
        signatureCanvas.addEventListener('mousedown', startDrawing);
        signatureCanvas.addEventListener('mousemove', draw);
        signatureCanvas.addEventListener('mouseup', stopDrawing);
        signatureCanvas.addEventListener('mouseout', stopDrawing);
        
        // Touch events for mobile
        signatureCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            startDrawing({
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            });
        });
        
        signatureCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = signatureCanvas.getBoundingClientRect();
            draw({
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            });
        });
        
        signatureCanvas.addEventListener('touchend', stopDrawing);
    }
    
    // Clear signature
    if (clearSignature && signatureCanvas) {
        clearSignature.addEventListener('click', () => {
            const ctx = signatureCanvas.getContext('2d');
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        });
    }
    
    // Submit application
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (!acceptTerms.checked) {
                alert('Please accept the terms and conditions');
                return;
            }
            
            showScreen('validation');
            simulateValidation();
        });
    }
}

// Initialize validation simulation
function initValidationSimulation() {
    const goToLogin = document.getElementById('go-to-login');
    const retryValidation = document.getElementById('retry-validation');
    
    if (goToLogin) {
        goToLogin.addEventListener('click', () => {
            showScreen('login');
        });
    }
    
    if (retryValidation) {
        retryValidation.addEventListener('click', () => {
            showScreen('submission');
        });
    }
}

// Simulate validation process
function simulateValidation() {
    const progressFill = document.getElementById('progress-fill');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const validationResult = document.querySelector('.validation-result');
    const retrySection = document.querySelector('.retry-section');
    const statusIcons = {
        success: document.querySelector('.status-icon.success'),
        pending: document.querySelector('.status-icon.pending'),
        error: document.querySelector('.status-icon.error')
    };
    
    // Reset
    progressFill.style.width = '25%';
    statusIcons.success.classList.add('hidden');
    statusIcons.error.classList.add('hidden');
    statusIcons.pending.classList.remove('hidden');
    validationResult.classList.add('hidden');
    retrySection.classList.add('hidden');
    
    // Simulate validation steps
    const steps = [
        { width: '25%', title: 'Checking Data', message: 'Validating personal information...' },
        { width: '50%', title: 'Verifying Documents', message: 'Authenticating uploaded documents...' },
        { width: '75%', title: 'Blockchain Registration', message: 'Registering on MI_CARE blockchain...' },
        { width: '100%', title: 'Validation Complete', message: 'Data successfully validated!' }
    ];
    
    let currentStep = 0;
    
    const processStep = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            progressFill.style.width = step.width;
            statusTitle.textContent = step.title;
            statusMessage.textContent = step.message;
            
            currentStep++;
            
            if (currentStep === steps.length) {
                // Show success
                setTimeout(() => {
                    statusIcons.pending.classList.add('hidden');
                    statusIcons.success.classList.remove('hidden');
                    validationResult.classList.remove('hidden');
                }, 1000);
            } else {
                setTimeout(processStep, 2000);
            }
        }
    };
    
    // Start validation
    setTimeout(processStep, 1000);
}

// Initialize dashboard
function initDashboard() {
    updateUserInfo();
    updateNotificationBadge();
    initMap();
    initCharts();
}

function initDashboardEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    
    if (menuToggle && sideMenu) {
        menuToggle.addEventListener('click', () => {
            sideMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sideMenu && sideMenu.classList.contains('active') && 
            !sideMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sideMenu.classList.remove('active');
        }
    });
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding content view
            contentViews.forEach(viewEl => viewEl.classList.remove('active'));
            const targetView = document.getElementById(`${view}-view`);
            if (targetView) {
                targetView.classList.add('active');
                
                // Initialize map if needed
                if (view === 'map') {
                    initMap();
                }
            }
        });
    });
    
    // Bottom navigation
    const bottomNavButtons = document.querySelectorAll('.nav-btn');
    bottomNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            bottomNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const target = button.id.replace('-btn', '');
            if (target === 'wallet-bottom') {
                // Switch to wallet view
                navItems.forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav-item[data-view="wallet"]').classList.add('active');
                
                contentViews.forEach(view => view.classList.remove('active'));
                document.getElementById('wallet-view').classList.add('active');
            }
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                appState.currentUser = null;
                showScreen('login');
            }
        });
    }
    
    // Quick section cards
    const quickSectionCards = document.querySelectorAll('.section-card');
    quickSectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const section = card.id;
            alert(`Opening ${section.replace('-', ' ')}...`);
        });
    });
}

// Update user info on dashboard
function updateUserInfo() {
    if (!appState.currentUser) return;
    
    const userName = document.getElementById('user-name');
    const blockchainAddress = document.getElementById('blockchain-address');
    
    if (userName) userName.textContent = appState.currentUser.name;
    if (blockchainAddress) blockchainAddress.textContent = appState.currentUser.blockchainAddress;
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.badge');
    if (badge) {
        const unreadCount = appState.notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Initialize map
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || !window.L) return;
    
    // Check if map already initialized
    if (window.miCareMap) {
        window.miCareMap.invalidateSize();
        return;
    }
    
    // Create map
    window.miCareMap = L.map('map').setView([-1.2921, 36.8219], 13); // Nairobi coordinates
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(window.miCareMap);
    
    // Add sample markers
    const markers = [
        { lat: -1.2921, lng: 36.8219, type: 'facility', title: 'MI_CARE Main Hospital' },
        { lat: -1.2850, lng: 36.8150, type: 'hotspot', title: 'Influenza Hotspot' },
        { lat: -1.3000, lng: 36.8300, type: 'emergency', title: 'Emergency Response' },
        { lat: -1.2800, lng: 36.8100, type: 'facility', title: 'Pharmacy #123' }
    ];
    
    markers.forEach(marker => {
        let iconColor;
        switch(marker.type) {
            case 'hotspot': iconColor = '#e74c3c'; break;
            case 'emergency': iconColor = '#f39c12'; break;
            case 'facility': iconColor = '#3498db'; break;
            default: iconColor = '#2c3e50';
        }
        
        const customIcon = L.divIcon({
            html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
            className: 'custom-marker',
            iconSize: [24, 24]
        });
        
        L.marker([marker.lat, marker.lng], { icon: customIcon })
            .addTo(window.miCareMap)
            .bindPopup(`<b>${marker.title}</b><br>Type: ${marker.type}`);
    });
    
    // Map controls
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const locationBtn = document.getElementById('location-btn');
    const mapTypeSelect = document.getElementById('map-type');
    const analyticsToggle = document.getElementById('analytics-toggle');
    const closeAnalytics = document.getElementById('close-analytics');
    const analyticsPanel = document.getElementById('analytics-panel');
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            window.miCareMap.zoomIn();
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            window.miCareMap.zoomOut();
        });
    }
    
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    window.miCareMap.setView([latitude, longitude], 15);
                    
                    L.marker([latitude, longitude])
                        .addTo(window.miCareMap)
                        .bindPopup('Your Location')
                        .openPopup();
                });
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }
    
    if (mapTypeSelect) {
        mapTypeSelect.addEventListener('change', (e) => {
            // In a real app, this would switch tile layers
            alert(`Map type changed to: ${e.target.value}`);
        });
    }
    
    if (analyticsToggle && analyticsPanel) {
        analyticsToggle.addEventListener('click', () => {
            analyticsPanel.classList.add('active');
        });
    }
    
    if (closeAnalytics && analyticsPanel) {
        closeAnalytics.addEventListener('click', () => {
            analyticsPanel.classList.remove('active');
        });
    }
}

// Initialize charts
function initCharts() {
    const diseaseChartCanvas = document.getElementById('disease-chart');
    if (!diseaseChartCanvas || !window.Chart) return;
    
    const ctx = diseaseChartCanvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.diseaseChart) {
        window.diseaseChart.destroy();
    }
    
    window.diseaseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Influenza Cases',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Malaria Cases',
                data: [28, 48, 40, 19, 86, 27],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'COVID-19 Cases',
                data: [12, 15, 18, 14, 11, 13],
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Disease Trends (Last 6 Months)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Cases'
                    }
                }
            }
        }
    });
    
    // Chart filters
    const dateFilter = document.getElementById('date-filter');
    const diseaseFilter = document.getElementById('disease-filter');
    
    if (dateFilter) {
        dateFilter.addEventListener('change', updateChartData);
    }
    
    if (diseaseFilter) {
        diseaseFilter.addEventListener('change', updateChartData);
    }
}

function updateChartData() {
    if (!window.diseaseChart) return;
    
    // Simulate data update based on filters
    const newData = {
        '7d': [[5, 6, 7, 8, 9, 10, 11], [3, 4, 5, 6, 7, 8, 9], [1, 2, 2, 3, 2, 1, 2]],
        '30d': Array.from({length: 30}, () => Math.floor(Math.random() * 100)),
        '90d': Array.from({length: 90}, () => Math.floor(Math.random() * 100))
    };
    
    // Update chart with new data
    // In a real app, this would fetch data from an API
}

// Initialize chat functionality
function initChatFunctionality() {
    // Chat item clicks
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            showScreen('chat');
            const chatUser = item.dataset.chat;
            loadChat(chatUser);
        });
    });
    
    // Back to engagement
    const backToEngagement = document.getElementById('back-to-engagement');
    if (backToEngagement) {
        backToEngagement.addEventListener('click', () => {
            showScreen('dashboard');
        });
    }
    
    // Send message
    const sendMessageBtn = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    
    if (sendMessageBtn && chatInput) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                const chatMessages = document.getElementById('chat-messages');
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const messageElement = document.createElement('div');
                messageElement.className = 'message sent';
                messageElement.innerHTML = `
                    <p>${message}</p>
                    <span class="message-time">${time}</span>
                `;
                
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate reply after 1 second
                setTimeout(() => {
                    const replyElement = document.createElement('div');
                    replyElement.className = 'message received';
                    replyElement.innerHTML = `
                        <p>Thanks for your message. How can I assist you further?</p>
                        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    `;
                    
                    chatMessages.appendChild(replyElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        };
        
        sendMessageBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function loadChat(chatUser) {
    // In a real app, this would load chat history from server
    const chatHeader = document.querySelector('.chat-user-info h3');
    if (chatHeader) {
        switch(chatUser) {
            case 'dr-smith':
                chatHeader.textContent = 'Dr. Smith';
                break;
            case 'pharmacy':
                chatHeader.textContent = 'Pharmacy #123';
                break;
            case 'ai-assistant':
                chatHeader.textContent = 'MI_CARE AI';
                break;
        }
    }
}

// Initialize modals
function initModals() {
    // Search modal
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.getElementById('close-search');
    
    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
        });
    }
    
    if (closeSearch && searchModal) {
        closeSearch.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    }
    
    // Notifications modal
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsModal = document.getElementById('notifications-modal');
    const closeNotifications = document.getElementById('close-notifications');
    
    if (notificationsBtn && notificationsModal) {
        notificationsBtn.addEventListener('click', () => {
            notificationsModal.classList.add('active');
            // Mark notifications as read
            appState.notifications.forEach(n => n.read = true);
            updateNotificationBadge();
        });
    }
    
    if (closeNotifications && notificationsModal) {
        closeNotifications.addEventListener('click', () => {
            notificationsModal.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (searchModal && searchModal.classList.contains('active') && 
            !searchModal.contains(e.target) && 
            !searchBtn.contains(e.target)) {
            searchModal.classList.remove('active');
        }
        
        if (notificationsModal && notificationsModal.classList.contains('active') && 
            !notificationsModal.contains(e.target) && 
            !notificationsBtn.contains(e.target)) {
            notificationsModal.classList.remove('active');
        }
    });
}

// Wallet functionality
function initWalletFunctionality() {
    const depositBtn = document.getElementById('deposit-btn');
    const sendBtn = document.getElementById('send-btn');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const payBtn = document.getElementById('pay-btn');
    const exchangeBtn = document.getElementById('exchange-btn');
    
    const walletActions = [
        { btn: depositBtn, action: 'Deposit', message: 'Deposit functionality coming soon!' },
        { btn: sendBtn, action: 'Send', message: 'Send funds to another MI_CARE user' },
        { btn: withdrawBtn, action: 'Withdraw', message: 'Withdraw funds to your bank account' },
        { btn: payBtn, action: 'Pay', message: 'Pay for services using HTB' },
        { btn: exchangeBtn, action: 'Exchange', message: 'Exchange HTB for other currencies' }
    ];
    
    walletActions.forEach(item => {
        if (item.btn) {
            item.btn.addEventListener('click', () => {
                alert(`${item.action}: ${item.message}`);
            });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initWalletFunctionality();
});

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}