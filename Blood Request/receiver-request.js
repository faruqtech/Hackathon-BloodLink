// receiver-request.js - Fixed for robust matching and error handling

// Handle Request Blood form
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

    // Debug: Log form elements
    console.log('Form:', form);
    console.log('Steps:', steps);
    console.log('Progress Steps:', progressSteps);
    console.log('Next Buttons:', nextButtons);
    console.log('Prev Buttons:', prevButtons);

    // Populate location filter with donor locations
    const allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
    console.log('Fetched allDonors for location filter:', allDonors);
    const locations = [...new Set(allDonors.map(d => d.location))].filter(Boolean);
    if (filterLocation) {
        filterLocation.innerHTML = '<option value="">All Locations</option>' + 
            locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
    } else {
        console.warn('filterLocation element not found');
    }

    // Update form step with error handling
    function updateStep(step) {
        if (!steps.length || !progressSteps.length) {
            console.error('No steps or progress steps found. Check HTML selectors.');
            alert('Error: Form steps not found. Please check console.');
            return;
        }
        if (step < 1 || step > steps.length) {
            console.error(`Invalid step ${step}. Valid range: 1 to ${steps.length}`);
            return;
        }

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

    // Validate form step
    function validateStep(step) {
        if (step === 1) {
            const requiredFields = ['reqBloodType', 'reqQuantity', 'reqUrgency', 'reqCountryCode', 'reqPhoneNumber', 'reqLocation'];
            let isValid = true;
            let firstInvalid = null;

            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field) {
                    console.error(`Field ${fieldId} not found`);
                    isValid = false;
                    if (!firstInvalid) firstInvalid = { id: fieldId };
                    return;
                }
                if (!field.value || field.value.trim() === '') {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            });

            const quantity = document.getElementById('reqQuantity');
            if (quantity && (quantity.value < 1 || quantity.value > 10)) {
                console.error('Invalid quantity:', quantity.value);
                isValid = false;
                if (!firstInvalid) firstInvalid = quantity;
            }

            const phone = document.getElementById('reqPhoneNumber');
            if (phone && !/^\d{8,12}$/.test(phone.value)) {
                console.error('Invalid phone number:', phone.value);
                isValid = false;
                if (!firstInvalid) firstInvalid = phone;
            }

            if (!isValid && firstInvalid) {
                if (firstInvalid.id) {
                    console.error(`Validation failed: ${firstInvalid.id} is missing`);
                } else {
                    firstInvalid.focus();
                    console.error(`Validation failed, focused on: ${firstInvalid.id}`);
                }
                alert('Please fix the errors above before proceeding.');
            }

            console.log('Step 1 validation result:', isValid);
            return isValid;
        }
        return true;
    }

    // Bind events if form exists
    if (form && steps.length && progressSteps.length) {
        console.log('Form elements found, binding events');

        nextButtons.forEach(btn => {
            console.log('Binding next button:', btn.id);
            btn.addEventListener('click', () => {
                console.log('Next button clicked:', btn.id);
                const nextStepNum = parseInt(btn.id.replace('nextStep', '')) + 1;
                if (validateStep(currentStep)) {
                    updateStep(nextStepNum);
                    if (nextStepNum === 2) {
                        requestData = {
                            bloodType: document.getElementById('reqBloodType')?.value || '',
                            quantity: document.getElementById('reqQuantity')?.value || '',
                            urgency: document.getElementById('reqUrgency')?.value || '',
                            countryCode: document.getElementById('reqCountryCode')?.value || '',
                            phoneNumber: document.getElementById('reqPhoneNumber')?.value || '',
                            email: document.getElementById('reqEmail')?.value || '',
                            location: document.getElementById('reqLocation')?.value || ''
                        };
                        console.log('Review data:', requestData);
                        // Populate review step
                        document.getElementById('reviewBlood').textContent = requestData.bloodType || 'N/A';
                        document.getElementById('reviewQuantity').textContent = requestData.quantity || 'N/A';
                        document.getElementById('reviewUrgency').textContent = requestData.urgency || 'N/A';
                        document.getElementById('reviewContact').textContent = `${requestData.countryCode}${requestData.phoneNumber}` || 'N/A';
                        document.getElementById('reviewEmail').textContent = requestData.email || 'Not provided';
                        document.getElementById('reviewLocation').textContent = requestData.location || 'N/A';
                    }
                }
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.id.replace('prevStep', '')) - 1;
                console.log('Prev button clicked, moving to step:', prevStep);
                updateStep(prevStep);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                console.log('Request Submitted:', requestData);
                // Save request to allRequests
                let allRequests = JSON.parse(localStorage.getItem('allRequests')) || [];
                allRequests.push(requestData);
                localStorage.setItem('allRequests', JSON.stringify(allRequests));
                console.log('Saved to allRequests:', allRequests);
                alert('Request submitted! Viewing matches...');
                form.classList.add('hidden');
                updateStep(3);
                if (matchesSection) {
                    matchesSection.classList.remove('hidden');
                    renderDonorMatches(requestData);
                } else {
                    console.error('matchesSection not found');
                    alert('Error: Matches section not found. Check HTML.');
                }
            }
        });
    } else {
        console.error('Form or steps not found! Check HTML IDs and classes.');
        alert('Error: Form setup incomplete. Please check console.');
    }

    // Render donor matches
    function renderDonorMatches(request) {
        const grid = document.getElementById('donorMatches');
        if (!grid) {
            console.error('donorMatches grid not found');
            alert('Error: Matches grid not found. Check HTML.');
            return;
        }

        // Fetch donors fresh
        const allDonors = JSON.parse(localStorage.getItem('allDonors')) || [];
        console.log('Fetched allDonors for matching:', allDonors);

        // Filter donors (relaxed: blood type match, status optional)
        let filteredDonors = allDonors.filter(donor => 
            donor.bloodType === request.bloodType
        );
        console.log('Initial filtered donors:', filteredDonors);

        function applyFilters() {
            let results = filteredDonors;
            const searchQuery = searchInput?.value.toLowerCase() || '';
            const bloodFilter = filterBloodType?.value || '';
            const locationFilter = filterLocation?.value || '';

            if (searchQuery) {
                results = results.filter(d => 
                    (d.name || '').toLowerCase().includes(searchQuery) || 
                    (d.location || '').toLowerCase().includes(searchQuery)
                );
            }
            if (bloodFilter) {
                results = results.filter(d => d.bloodType === bloodFilter);
            }
            if (locationFilter) {
                results = results.filter(d => (d.location || '') === locationFilter);
            }

            console.log('Final results after filters:', results);
            grid.innerHTML = '';
            if (results.length === 0) {
                grid.innerHTML = '<p class="no-matches">No matching donors found. Register more donors or adjust filters.</p>';
                return;
            }

            results.forEach(donor => {
                const card = document.createElement('div');
                card.className = 'donor-match-card';
                const proximity = (donor.location || '').toLowerCase() === (request.location || '').toLowerCase() 
                    ? 'Nearby (~5km)' 
                    : 'Available';
                const matchScore = proximity === 'Nearby (~5km)' ? 95 : 85;
                card.innerHTML = `
                    <h3>${donor.name || 'Unknown'} - ${donor.bloodType}</h3>
                    <p>Location: ${donor.location || 'N/A'} (${proximity})</p>
                    <p>Frequency: ${donor.donationFrequency || 'N/A'}</p>
                    <p>Contact: ${donor.countryCode || ''}${donor.phoneNumber || 'N/A'}</p>
                    <p class="match-score">Match Score: ${matchScore}% (Compatible)</p>
                    <button onclick="alert('Contacting ${donor.name || 'donor'}...')">Contact Donor</button>
                `;
                grid.appendChild(card);
            });
        }

        applyFilters();

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (filterBloodType) filterBloodType.addEventListener('change', applyFilters);
        if (filterLocation) filterLocation.addEventListener('change', applyFilters);
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (filterBloodType) filterBloodType.value = '';
                if (filterLocation) filterLocation.value = '';
                applyFilters();
            });
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing receiver-request.js...');
    handleRequestForm();
});