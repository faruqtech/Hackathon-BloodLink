// script.js - Updated for landing page stats & animations

// Mock data for dashboard 
const mockMatches = [
    { id: 1, type: 'Donor', blood: 'O+', location: 'New York', status: 'Available' },
    { id: 2, type: 'Request', blood: 'A+', location: 'Boston', status: 'Urgent' },
    { id: 3, type: 'Donor', blood: 'AB-', location: 'Los Angeles', status: 'Available' },
    { id: 4, type: 'Request', blood: 'B+', location: 'Chicago', status: 'Medium' }
];

// Handle landing page animations and stats
function initializeLandingPage() {
    // Scroll-triggered animations
    const sections = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // Dynamic stats (mock counts based on localStorage)
    const donorCount = document.getElementById('donorCount');
    const requestCount = document.getElementById('requestCount');
    const livesSaved = document.getElementById('livesSaved');
    
    if (donorCount && requestCount && livesSaved) {
        const allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
        const allRequests = JSON.parse(localStorage.getItem('allRequests')) || [];
        
        // Animate number count
        function animateCount(element, target, duration) {
            let start = 0;
            const increment = target / (duration / 50);
            const timer = setInterval(() => {
                start += increment;
                element.textContent = Math.round(start);
                if (start >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, 50);
        }
        
        animateCount(donorCount, allDonors.length, 2000);
        animateCount(requestCount, allRequests.length, 2000);
        animateCount(livesSaved, Math.round(allDonors.length * 1.5), 2000); // Mock: 1.5 lives per donor
    }
}

// Handle simple form submissions (updated to store requests)
function handleFormSubmission(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => { data[key] = value });
            console.log('Form Submitted:', data);
            alert('Submission successful! (Logged to console)');
            form.reset();
        });
    }
}

// Load dashboard matches (unchanged)
function loadDashboard() {
    const grid = document.getElementById('matchesGrid');
    const searchInput = document.getElementById('searchInput');
    
    if (grid && searchInput) {
        function renderMatches(matches) {
            grid.innerHTML = '';
            matches.forEach(match => {
                const card = document.createElement('div');
                card.className = 'match-card';
                card.innerHTML = `
                    <h3>${match.type}: ${match.blood}</h3>
                    <p>Location: ${match.location}</p>
                    <p>Status: <span class="status ${match.status === 'Urgent' ? 'text-red' : 'text-green'}">${match.status}</span></p>
                    <button onclick="alert('Contacting ${match.type}...')">Contact</button>
                `;
                grid.appendChild(card);
            });
        }
        
        renderMatches(mockMatches);
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = mockMatches.filter(m => 
                m.blood.toLowerCase().includes(query) || m.location.toLowerCase().includes(query)
            );
            renderMatches(filtered);
        });
    }
}

// Load profile data 
function loadProfile() {
    console.log('Loading profile...');
    const profileCard = document.getElementById('profileCard');
    const noProfile = document.getElementById('noProfile');
    const nameSpan = document.getElementById('profileName');
    const bloodSpan = document.getElementById('profileBlood');
    const contactSpan = document.getElementById('profileContact');
    const emailSpan = document.getElementById('profileEmail');
    const locationSpan = document.getElementById('profileLocation');
    const frequencySpan = document.getElementById('profileFrequency');
    const statusSpan = document.getElementById('profileStatus');
    const historyList = document.getElementById('historyList');
    const updateMessage = document.getElementById('updateMessage');
    
    const donorData = JSON.parse(localStorage.getItem('donorData'));
    
    if (donorData && nameSpan && bloodSpan && contactSpan && emailSpan && locationSpan && frequencySpan && statusSpan && historyList) {
        console.log('Donor data found:', donorData);
        profileCard.classList.remove('hidden');
        noProfile.classList.add('hidden');
        
        nameSpan.textContent = donorData.name || 'N/A';
        bloodSpan.textContent = donorData.bloodType || 'N/A';
        contactSpan.textContent = `${donorData.countryCode || ''}${donorData.phoneNumber || 'N/A'}`;
        emailSpan.textContent = donorData.email || 'Not provided';
        locationSpan.textContent = donorData.location || 'N/A';
        frequencySpan.textContent = donorData.donationFrequency || 'N/A';
        statusSpan.textContent = donorData.status || 'Active Donor';
        historyList.innerHTML = donorData.history && donorData.history.length 
            ? donorData.history.map(item => `<li>${item}</li>`).join('')
            : '<li>No donations yet</li>';
        
        const editName = document.getElementById('editName');
        const editBloodType = document.getElementById('editBloodType');
        const editCountryCode = document.getElementById('editCountryCode');
        const editPhoneNumber = document.getElementById('editPhoneNumber');
        const editEmail = document.getElementById('editEmail');
        const editLocation = document.getElementById('editLocation');
        const editFrequency = document.getElementById('editFrequency');
        const editStatus = document.getElementById('editStatus');
        if (editName && editBloodType && editCountryCode && editPhoneNumber && editEmail && editLocation && editFrequency && editStatus) {
            editName.value = donorData.name || '';
            editBloodType.value = donorData.bloodType || '';
            editCountryCode.value = donorData.countryCode || '';
            editPhoneNumber.value = donorData.phoneNumber || '';
            editEmail.value = donorData.email || '';
            editLocation.value = donorData.location || '';
            editFrequency.value = donorData.donationFrequency || '';
            editStatus.value = donorData.status || 'Active Donor';
        }
        
        if (updateMessage && profileCard.classList.contains('updated')) {
            updateMessage.textContent = 'Profile updated successfully!';
            updateMessage.classList.remove('hidden');
            setTimeout(() => updateMessage.classList.add('hidden'), 3000);
            profileCard.classList.remove('updated');
        }
    } else {
        console.log('No donor data, showing no-profile message');
        profileCard.classList.add('hidden');
        noProfile.classList.remove('hidden');
        document.getElementById('editProfileForm')?.classList.add('hidden');
        document.getElementById('addDonationForm')?.classList.add('hidden');
    }
}

// Handle profile editing 
function handleProfileEdit() {
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveEditBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileCard = document.getElementById('profileCard');
    const editForm = document.getElementById('editProfileForm');
    
    if (editBtn && saveBtn && cancelBtn && profileCard && editForm) {
        editBtn.addEventListener('click', () => {
            console.log('Edit Profile clicked');
            profileCard.classList.add('toggling');
            setTimeout(() => {
                profileCard.classList.add('hidden');
                editForm.classList.remove('hidden');
                document.getElementById('editName').focus();
            }, 150);
        });
        
        cancelBtn.addEventListener('click', () => {
            console.log('Cancel Edit clicked');
            editForm.classList.add('hidden');
            setTimeout(() => {
                profileCard.classList.remove('toggling', 'hidden');
                loadProfile();
            }, 150);
        });
        
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Saving profile edits...');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            
            const formData = new FormData(editForm);
            const updatedProfile = {
                name: formData.get('editName'),
                bloodType: formData.get('editBloodType'),
                countryCode: formData.get('editCountryCode'),
                phoneNumber: formData.get('editPhoneNumber'),
                email: formData.get('editEmail'),
                location: formData.get('editLocation'),
                donationFrequency: formData.get('editFrequency'),
                status: formData.get('editStatus'),
                history: JSON.parse(localStorage.getItem('donorData'))?.history || []
            };
            
            try {
                localStorage.setItem('donorData', JSON.stringify(updatedProfile));
                let allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
                const donorIndex = allDonors.findIndex(d => d.phoneNumber === updatedProfile.phoneNumber && d.countryCode === updatedProfile.countryCode);
                if (donorIndex !== -1) {
                    allDonors[donorIndex] = updatedProfile;
                } else {
                    allDonors.push(updatedProfile);
                }
                localStorage.setItem('allDonors', JSON.stringify(allDonors));
                console.log('Profile Updated:', updatedProfile);
                editForm.classList.add('hidden');
                profileCard.classList.add('updated');
                setTimeout(() => {
                    profileCard.classList.remove('toggling', 'hidden');
                    loadProfile();
                }, 150);
            } catch (error) {
                console.error('Save failed:', error);
                alert('Save failed—check console.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        });
    }
}

// Handle donation history addition 
function handleDonationAdd() {
    const addBtn = document.getElementById('addDonationBtn');
    const saveBtn = document.getElementById('saveDonationBtn');
    const cancelBtn = document.getElementById('cancelDonationBtn');
    const profileCard = document.getElementById('profileCard');
    const donationForm = document.getElementById('addDonationForm');
    
    if (addBtn && saveBtn && cancelBtn && profileCard && donationForm) {
        addBtn.addEventListener('click', () => {
            console.log('Add Donation clicked');
            profileCard.classList.add('toggling');
            setTimeout(() => {
                profileCard.classList.add('hidden');
                donationForm.classList.remove('hidden');
                document.getElementById('donationDate').focus();
            }, 150);
        });
        
        cancelBtn.addEventListener('click', () => {
            console.log('Cancel Donation clicked');
            donationForm.classList.add('hidden');
            setTimeout(() => {
                profileCard.classList.remove('toggling', 'hidden');
                loadProfile();
            }, 150);
        });
        
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Saving donation...');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Adding...';
            
            const donationDate = document.getElementById('donationDate').value;
            const donationUnits = document.getElementById('donationUnits').value;
            const donorData = JSON.parse(localStorage.getItem('donorData')) || {};
            const newEntry = `Donated ${donationUnits} unit${donationUnits > 1 ? 's' : ''} on ${donationDate}`;
            donorData.history = donorData.history || [];
            donorData.history.push(newEntry);
            
            try {
                localStorage.setItem('donorData', JSON.stringify(donorData));
                let allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
                const donorIndex = allDonors.findIndex(d => d.phoneNumber === donorData.phoneNumber && d.countryCode === donorData.countryCode);
                if (donorIndex !== -1) {
                    allDonors[donorIndex].history = donorData.history;
                }
                localStorage.setItem('allDonors', JSON.stringify(allDonors));
                console.log('Donation Added:', newEntry);
                donationForm.classList.add('hidden');
                profileCard.classList.add('updated');
                setTimeout(() => {
                    profileCard.classList.remove('toggling', 'hidden');
                    loadProfile();
                }, 150);
            } catch (error) {
                console.error('Add donation failed:', error);
                alert('Add failed—check console.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Add Donation';
                donationForm.reset();
            }
        });
    }
}

// Handle multi-step donor form 
function handleDonorForm() {
    console.log('handleDonorForm initialized');
    const form = document.getElementById('donorForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('[id^="nextStep"]');
    const prevButtons = document.querySelectorAll('[id^="prevStep"]');
    let currentStep = 1;
    
    function validateField(fieldId, errorId, validatorFn, errorMsg) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(errorId);
        if (field && errorEl) {
            field.addEventListener('input', () => {
                const isValid = validatorFn(field.value);
                errorEl.style.display = isValid ? 'none' : 'block';
                errorEl.textContent = isValid ? '' : errorMsg;
            });
            field.addEventListener('change', () => {
                const isValid = validatorFn(field.value);
                errorEl.style.display = isValid ? 'none' : 'block';
                errorEl.textContent = isValid ? '' : errorMsg;
            });
        }
    }
    
    validateField('name', 'nameError', (val) => val.trim().length > 0, 'Please enter your full name');
    validateField('bloodType', 'nameError', (val) => val !== '', 'Please select a blood type');
    validateField('age', 'ageError', (val) => val >= 18 && val <= 65, 'Age must be between 18 and 65');
    validateField('countryCode', 'contactError', (val) => val !== '', 'Please select a country code');
    validateField('phoneNumber', 'contactError', (val) => /^\d{8,12}$/.test(val), 'Please enter a valid phone number (8-12 digits)');
    validateField('location', 'locationError', (val) => val.trim().length > 0 && /^[a-zA-Z\s-]+$/.test(val.trim()), 'Please enter a valid city name');
    validateField('donationFrequency', 'frequencyError', (val) => val !== '', 'Please select donation frequency');
    
    function updateStep(step) {
        console.log(`Updating to step ${step}`);
        steps.forEach(s => s.classList.add('hidden'));
        steps[step - 1].classList.remove('hidden');
        progressSteps.forEach(p => {
            p.classList.remove('active', 'completed');
            if (parseInt(p.dataset.step) === step) {
                p.classList.add('active');
            } else if (parseInt(p.dataset.step) < step) {
                p.classList.add('completed');
            }
        });
        currentStep = step;
    }
    
    function validateStep(step) {
        console.log(`Validating step ${step}`);
        if (step === 1) {
            const requiredFields = ['name', 'bloodType', 'age', 'countryCode', 'phoneNumber', 'location', 'donationFrequency'];
            let isValid = true;
            let firstInvalid = null;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field || !field.value || field.value.trim() === '') {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            });
            
            const age = document.getElementById('age');
            if (age && (age.value < 18 || age.value > 65)) isValid = false;
            
            const phone = document.getElementById('phoneNumber');
            if (phone && !/^\d{8,12}$/.test(phone.value)) isValid = false;
            
            const location = document.getElementById('location');
            if (location && (!location.value.trim() || !/^[a-zA-Z\s-]+$/.test(location.value.trim()))) isValid = false;
            
            if (!isValid && firstInvalid) {
                firstInvalid.focus();
                console.log('Validation failed, focused on:', firstInvalid.id);
                alert('Please fix the errors above before proceeding.');
            }
            
            console.log('Step 1 validation result:', isValid);
            return isValid;
        }
        if (step === 2) {
            const checkboxes = document.querySelectorAll('.form-step[data-step="2"] input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            console.log('Step 2 validation (checkboxes):', allChecked);
            return allChecked;
        }
        return true;
    }
    
    if (form && steps.length && progressSteps.length) {
        console.log('Form elements found, binding events');
        
        nextButtons.forEach(btn => {
            console.log('Binding next button:', btn.id);
            btn.addEventListener('click', (e) => {
                console.log('Next button clicked:', btn.id);
                e.preventDefault();
                const nextStepNum = parseInt(btn.id.replace('nextStep', '')) + 1;
                if (validateStep(currentStep)) {
                    updateStep(nextStepNum);
                    if (nextStepNum === 3) {
                        const confirmName = document.getElementById('confirmName');
                        const confirmBlood = document.getElementById('confirmBlood');
                        const confirmAge = document.getElementById('confirmAge');
                        const confirmContact = document.getElementById('confirmContact');
                        const confirmEmail = document.getElementById('confirmEmail');
                        const confirmLocation = document.getElementById('confirmLocation');
                        const confirmFrequency = document.getElementById('confirmFrequency');
                        const confirmEligibility = document.getElementById('confirmEligibility');
                        
                        confirmName.textContent = document.getElementById('name').value;
                        confirmBlood.textContent = document.getElementById('bloodType').value;
                        confirmAge.textContent = document.getElementById('age').value;
                        confirmContact.textContent = `${document.getElementById('countryCode').value}${document.getElementById('phoneNumber').value}`;
                        confirmEmail.textContent = document.getElementById('email').value || 'Not provided';
                        confirmLocation.textContent = document.getElementById('location').value;
                        confirmFrequency.textContent = document.getElementById('donationFrequency').value;
                        confirmEligibility.textContent = 'Eligible';
                    }
                } else {
                    console.log('Validation failed for step', currentStep);
                }
            });
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.id.replace('prevStep', '')) - 1;
                updateStep(prevStep);
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                const formData = {
                    name: document.getElementById('name').value,
                    bloodType: document.getElementById('bloodType').value,
                    age: document.getElementById('age').value,
                    countryCode: document.getElementById('countryCode').value,
                    phoneNumber: document.getElementById('phoneNumber').value,
                    email: document.getElementById('email').value,
                    location: document.getElementById('location').value,
                    donationFrequency: document.getElementById('donationFrequency').value,
                    status: 'Active Donor',
                    history: []
                };
                console.log('Donor Registered:', formData);
                localStorage.setItem('donorData', JSON.stringify(formData));
                let allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
                allDonors.push(formData);
                localStorage.setItem('allDonors', JSON.stringify(allDonors));
                alert('Donor registration successful! (Logged to console)');
                form.reset();
                updateStep(1);
            }
        });
    } else {
        console.error('Form, steps, or progress not found!');
    }
}

// Handle Request Blood form (updated to store requests)
function handleRequestForm() {
    const form = document.getElementById('requestForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('[id^="nextStep"]');
    const prevButtons = document.querySelectorAll('[id^="prevStep"]');
    const matchesSection = document.getElementById('matchesSection');
    const searchInput = document.getElementById('searchInput');
    const filterBloodType = document.getElementById('filterBloodType');
    const filterLocation = document.getElementById('filterLocation');
    const clearFilters = document.getElementById('clearFilters');
    let currentStep = 1;
    let requestData = {};
    
    const allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
    const locations = [...new Set(allDonors.map(d => d.location))].filter(Boolean);
    if (filterLocation) {
        filterLocation.innerHTML = '<option value="">All Locations</option>' + 
            locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
    }
    
    function updateStep(step) {
        steps.forEach(s => s.classList.add('hidden'));
        steps[step - 1].classList.remove('hidden');
        progressSteps.forEach(p => {
            p.classList.remove('active', 'completed');
            if (parseInt(p.dataset.step) === step) {
                p.classList.add('active');
            } else if (parseInt(p.dataset.step) < step) {
                p.classList.add('completed');
            }
        });
        currentStep = step;
    }
    
    function validateStep(step) {
        if (step === 1) {
            const requiredFields = ['reqBloodType', 'reqQuantity', 'reqUrgency', 'reqCountryCode', 'reqPhoneNumber', 'reqLocation'];
            let isValid = true;
            let firstInvalid = null;
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field || !field.value || field.value.trim() === '') {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            });
            
            const quantity = document.getElementById('reqQuantity');
            if (quantity && (quantity.value < 1 || quantity.value > 10)) isValid = false;
            
            const phone = document.getElementById('reqPhoneNumber');
            if (phone && !/^\d{8,12}$/.test(phone.value)) isValid = false;
            
            if (!isValid && firstInvalid) {
                firstInvalid.focus();
                alert('Please fix the errors above before proceeding.');
            }
            return isValid;
        }
        return true;
    }
    
    if (form && steps.length && progressSteps.length) {
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStepNum = parseInt(btn.id.replace('nextStep', '')) + 1;
                if (validateStep(currentStep)) {
                    updateStep(nextStepNum);
                    if (nextStepNum === 2) {
                        requestData = {
                            bloodType: document.getElementById('reqBloodType').value,
                            quantity: document.getElementById('reqQuantity').value,
                            urgency: document.getElementById('reqUrgency').value,
                            countryCode: document.getElementById('reqCountryCode').value,
                            phoneNumber: document.getElementById('reqPhoneNumber').value,
                            email: document.getElementById('reqEmail').value,
                            location: document.getElementById('reqLocation').value
                        };
                        document.getElementById('reviewBlood').textContent = requestData.bloodType;
                        document.getElementById('reviewQuantity').textContent = requestData.quantity;
                        document.getElementById('reviewUrgency').textContent = requestData.urgency;
                        document.getElementById('reviewContact').textContent = `${requestData.countryCode}${requestData.phoneNumber}`;
                        document.getElementById('reviewEmail').textContent = requestData.email || 'Not provided';
                        document.getElementById('reviewLocation').textContent = requestData.location;
                    }
                }
            });
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.id.replace('prevStep', '')) - 1;
                updateStep(prevStep);
            });
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                console.log('Request Submitted:', requestData);
                // Store request in allRequests
                let allRequests = JSON.parse(localStorage.getItem('allRequests')) || [];
                allRequests.push(requestData);
                localStorage.setItem('allRequests', JSON.stringify(allRequests));
                alert('Request submitted! Viewing matches...');
                form.classList.add('hidden');
                updateStep(3);
                matchesSection.classList.remove('hidden');
                renderDonorMatches(requestData);
            }
        });
    }
    
    function renderDonorMatches(request) {
        const grid = document.getElementById('donorMatches');
        const allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
        let filteredDonors = allDonors.filter(donor => 
            donor.bloodType === request.bloodType && donor.status === 'Active Donor'
        );
        
        function applyFilters() {
            let results = filteredDonors;
            const searchQuery = searchInput.value.toLowerCase();
            const bloodFilter = filterBloodType.value;
            const locationFilter = filterLocation.value;
            
            if (searchQuery) {
                results = results.filter(d => 
                    d.name.toLowerCase().includes(searchQuery) || 
                    d.location.toLowerCase().includes(searchQuery)
                );
            }
            if (bloodFilter) {
                results = results.filter(d => d.bloodType === bloodFilter);
            }
            if (locationFilter) {
                results = results.filter(d => d.location === locationFilter);
            }
            
            grid.innerHTML = '';
            if (results.length === 0) {
                grid.innerHTML = '<p class="no-matches">No matching donors found. Try registering more donors or adjusting filters.</p>';
                return;
            }
            
            results.forEach(donor => {
                const card = document.createElement('div');
                card.className = 'donor-match-card';
                const proximity = donor.location.toLowerCase() === request.location.toLowerCase() ? 'Nearby (~5km)' : 'Available';
                card.innerHTML = `
                    <h3>${donor.name} - ${donor.bloodType}</h3>
                    <p>Location: ${donor.location} (${proximity})</p>
                    <p>Frequency: ${donor.donationFrequency}</p>
                    <p>Contact: ${donor.countryCode}${donor.phoneNumber}</p>
                    <p class="match-score">Match Score: ${proximity === 'Nearby (~5km)' ? '95' : '85'}% (Compatible)</p>
                    <button onclick="alert('Contacting ${donor.name}...')">Contact Donor</button>
                `;
                grid.appendChild(card);
            });
        }
        
        applyFilters();
        
        searchInput.addEventListener('input', applyFilters);
        filterBloodType.addEventListener('change', applyFilters);
        filterLocation.addEventListener('change', applyFilters);
        
        clearFilters.addEventListener('click', () => {
            searchInput.value = '';
            filterBloodType.value = '';
            filterLocation.value = '';
            applyFilters();
        });
    }
}

// Final initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    if (document.getElementById('donorForm')) {
        handleDonorForm();
    }
    if (document.getElementById('requestForm')) {
        handleRequestForm();
    }
    if (document.getElementById('matchesGrid')) {
        loadDashboard();
    }
    if (document.getElementById('profileCard')) {
        loadProfile();
        handleProfileEdit();
        handleDonationAdd();
    }
    if (document.querySelector('.landing-container')) {
        initializeLandingPage();
    }
});