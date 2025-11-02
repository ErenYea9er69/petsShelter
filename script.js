// Enhanced Pet Shelter Management System - JavaScript
let currentPetType = 'dog';
let pets = [];
let petIdCounter = 0;
let deletedPets = [];
let selectedPets = new Set();
let ageChart = null;

// PWA & Offline Support
window.addEventListener('load', () => {
    loadFromStorage();
    initializeChart();
    updateTimeline();
    checkOnlineStatus();
    
    // Service Worker Registration (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});

window.addEventListener('online', () => {
    document.getElementById('offlineIndicator').style.display = 'none';
    showToast('Back online! 🌐', 'success');
});

window.addEventListener('offline', () => {
    document.getElementById('offlineIndicator').style.display = 'flex';
    showToast('You\'re offline. Changes saved locally 📡', 'info');
});

function checkOnlineStatus() {
    if (!navigator.onLine) {
        document.getElementById('offlineIndicator').style.display = 'flex';
    }
}

// Local Storage Functions
function saveToStorage() {
    try {
        localStorage.setItem('pets', JSON.stringify(pets));
        localStorage.setItem('petIdCounter', petIdCounter.toString());
        localStorage.setItem('deletedPets', JSON.stringify(deletedPets));
    } catch (e) {
        showToast('Storage error. Please check available space.', 'error');
    }
}

function loadFromStorage() {
    try {
        const savedPets = localStorage.getItem('pets');
        const savedCounter = localStorage.getItem('petIdCounter');
        const savedDeleted = localStorage.getItem('deletedPets');
        
        if (savedPets) pets = JSON.parse(savedPets);
        if (savedCounter) petIdCounter = parseInt(savedCounter);
        if (savedDeleted) deletedPets = JSON.parse(savedDeleted);
        
        displayPets();
        updateStats();
        updateChart();
    } catch (e) {
        showToast('Error loading data', 'error');
    }
}

// Pet Type Selection
function selectPetType(type) {
    currentPetType = type;
    
    document.querySelectorAll('.pet-type-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    const selectedBtn = document.querySelector(`.pet-type-btn[data-type="${type}"]`);
    selectedBtn.classList.add('active');
    selectedBtn.setAttribute('aria-selected', 'true');
    
    document.querySelectorAll('.specific-fields').forEach(field => {
        field.classList.remove('active');
    });
    document.getElementById(type + 'Fields').classList.add('active');
}

// Form Submission
document.getElementById('petForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('petName').value.trim();
    const age = parseInt(document.getElementById('petAge').value);
    const color = document.getElementById('petColor').value.trim();
    
    let pet = {
        id: petIdCounter++,
        type: currentPetType,
        name: name,
        age: age,
        color: color,
        timestamp: Date.now(),
        addedDate: new Date().toLocaleDateString()
    };
    
    if (currentPetType === 'dog') {
        pet.breed = document.getElementById('dogBreed').value.trim() || 'Mixed';
        pet.sound = 'Woof! Woof!';
        pet.ability = 'Can fetch and guard the house';
    } else if (currentPetType === 'cat') {
        pet.isIndoor = document.getElementById('catIndoor').value === 'true';
        pet.sound = 'Meow! Meow!';
        pet.ability = 'Expert climber and mouse hunter';
    } else if (currentPetType === 'bird') {
        pet.wingSpan = parseFloat(document.getElementById('birdWingSpan').value) || 1.0;
        pet.sound = 'Tweet! Tweet!';
        pet.ability = `Can fly up to ${pet.wingSpan} meters high`;
    }
    
    pets.push(pet);
    saveToStorage();
    displayPets();
    updateStats();
    updateChart();
    updateTimeline();
    this.reset();
    
    showToast(`${name} has been added to the shelter! 🎉`, 'success');
    
    // Reset to first pet type
    selectPetType('dog');
    document.querySelector('.pet-type-btn[data-type="dog"]').click();
});

// Display Pets with Advanced Features
function displayPets(filtered = pets) {
    const petsList = document.getElementById('petsList');
    
    if (filtered.length === 0) {
        petsList.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">🏠</div>
                <p>No pets match your filters. Try adjusting them!</p>
            </div>
        `;
        return;
    }
    
    petsList.innerHTML = '';
    filtered.forEach((pet, index) => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.setAttribute('data-pet-id', pet.id);
        petCard.setAttribute('role', 'article');
        petCard.setAttribute('aria-label', `${pet.name}, ${pet.type}`);
        
        let specificInfo = '';
        if (pet.type === 'dog') {
            specificInfo = `<strong>Breed:</strong> ${pet.breed}<br>`;
        } else if (pet.type === 'cat') {
            specificInfo = `<strong>Type:</strong> ${pet.isIndoor ? 'Indoor' : 'Outdoor'} Cat<br>`;
        } else if (pet.type === 'bird') {
            specificInfo = `<strong>Wing Span:</strong> ${pet.wingSpan}m<br>`;
        }
        
        const isSelected = selectedPets.has(pet.id);
        
        petCard.innerHTML = `
            <div class="pet-select">
                <input type="checkbox" id="select-${pet.id}" ${isSelected ? 'checked' : ''} 
                       onchange="togglePetSelection(${pet.id})" aria-label="Select ${pet.name}">
            </div>
            <h3>${emoji} ${pet.name}</h3>
            <div class="pet-actions">
                <button class="action-btn info-btn" onclick="showPetInfo(${pet.id})" aria-label="View ${pet.name} info">ℹ️ Info</button>
                <button class="action-btn delete-btn" onclick="deletePet(${pet.id})" aria-label="Delete ${pet.name}">🗑️ Delete</button>
            </div>
            <div class="pet-info">
                <strong>Age:</strong> ${pet.age} years old<br>
                <strong>Color:</strong> ${pet.color}<br>
                ${specificInfo}
                <strong>Added:</strong> ${pet.addedDate}
            </div>
            <div class="pet-sound">${pet.sound}</div>
        `;
        
        petsList.appendChild(petCard);
    });
    
    updateBulkActionsBar();
}

// Advanced Filtering
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    const ageFilter = document.getElementById('filterAge').value;
    
    let filtered = pets.filter(pet => {
        // Search filter
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm) || 
                             pet.color.toLowerCase().includes(searchTerm);
        
        // Type filter
        const matchesType = typeFilter === 'all' || pet.type === typeFilter;
        
        // Age filter
        let matchesAge = true;
        if (ageFilter === 'young') matchesAge = pet.age <= 2;
        else if (ageFilter === 'adult') matchesAge = pet.age >= 3 && pet.age <= 7;
        else if (ageFilter === 'senior') matchesAge = pet.age >= 8;
        
        return matchesSearch && matchesType && matchesAge;
    });
    
    displayPets(filtered);
}

function filterPets() {
    applyFilters();
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterAge').value = 'all';
    document.getElementById('sortSelect').value = 'newest';
    displayPets();
    showToast('Filters reset', 'info');
}

// Sorting
function sortPets() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'newest':
            pets.sort((a, b) => b.timestamp - a.timestamp);
            break;
        case 'oldest':
            pets.sort((a, b) => a.timestamp - b.timestamp);
            break;
        case 'name':
            pets.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'age':
            pets.sort((a, b) => a.age - b.age);
            break;
        case 'ageDesc':
            pets.sort((a, b) => b.age - a.age);
            break;
    }
    
    saveToStorage();
    applyFilters();
}

// Bulk Selection
function togglePetSelection(petId) {
    if (selectedPets.has(petId)) {
        selectedPets.delete(petId);
    } else {
        selectedPets.add(petId);
    }
    updateBulkActionsBar();
}

function toggleSelectAll() {
    const checkbox = document.getElementById('selectAllPets');
    selectedPets.clear();
    
    if (checkbox.checked) {
        pets.forEach(pet => selectedPets.add(pet.id));
    }
    
    displayPets();
}

function updateBulkActionsBar() {
    const count = selectedPets.size;
    document.getElementById('selectedCount').textContent = count;
    document.getElementById('selectAllPets').checked = count === pets.length && count > 0;
}

function bulkDeletePets() {
    if (selectedPets.size === 0) {
        showToast('No pets selected', 'error');
        return;
    }
    
    if (confirm(`Delete ${selectedPets.size} selected pet(s)?`)) {
        const deletedNames = [];
        selectedPets.forEach(id => {
            const pet = pets.find(p => p.id === id);
            if (pet) {
                deletedNames.push(pet.name);
                deletedPets.push({...pet, deletedAt: Date.now()});
            }
        });
        
        pets = pets.filter(pet => !selectedPets.has(pet.id));
        selectedPets.clear();
        
        saveToStorage();
        displayPets();
        updateStats();
        updateChart();
        updateTimeline();
        
        showToast(`${deletedNames.length} pet(s) deleted`, 'success');
        showUndoBar(`${deletedNames.join(', ')} deleted`);
    }
}

// Stats & Charts
function updateStats() {
    const totalCount = pets.length;
    const dogCount = pets.filter(p => p.type === 'dog').length;
    const catCount = pets.filter(p => p.type === 'cat').length;
    const birdCount = pets.filter(p => p.type === 'bird').length;
    
    animateNumber('petCount', totalCount);
    animateNumber('dogCount', dogCount);
    animateNumber('catCount', catCount);
    animateNumber('birdCount', birdCount);
    
    // Quick stats
    document.getElementById('quickTotal').textContent = totalCount;
    
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekCount = pets.filter(p => p.timestamp > weekAgo).length;
    document.getElementById('quickWeek').textContent = weekCount;
    
    const avgAge = totalCount > 0 ? (pets.reduce((sum, p) => sum + p.age, 0) / totalCount).toFixed(1) : 0;
    document.getElementById('quickAvgAge').textContent = avgAge + 'y';
}

function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue === targetValue) return;
    
    const duration = 500;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = (targetValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepTime);
}

// Chart Visualization
function initializeChart() {
    const ctx = document.getElementById('ageChart').getContext('2d');
    ageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0-2 years', '3-5 years', '6-10 years', '11+ years'],
            datasets: [{
                label: 'Number of Pets',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(245, 87, 108, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(240, 147, 251, 1)',
                    'rgba(245, 87, 108, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!ageChart) return;
    
    const ageGroups = [0, 0, 0, 0];
    pets.forEach(pet => {
        if (pet.age <= 2) ageGroups[0]++;
        else if (pet.age <= 5) ageGroups[1]++;
        else if (pet.age <= 10) ageGroups[2]++;
        else ageGroups[3]++;
    });
    
    ageChart.data.datasets[0].data = ageGroups;
    ageChart.update('none');
}

// Timeline
function updateTimeline() {
    const timeline = document.getElementById('timeline');
    const recentPets = [...pets].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    
    if (recentPets.length === 0) {
        timeline.innerHTML = '<p class="empty-timeline">No activity yet</p>';
        return;
    }
    
    timeline.innerHTML = recentPets.map(pet => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        const timeAgo = getTimeAgo(pet.timestamp);
        return `
            <div class="timeline-item">
                <span class="timeline-icon">${emoji}</span>
                <div class="timeline-content">
                    <strong>${pet.name}</strong> was added
                    <span class="timeline-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

// Pet Info Modal
function showPetInfo(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
    
    document.getElementById('modalTitle').textContent = `${emoji} ${pet.name}'s Details`;
    
    let specificInfo = '';
    if (pet.type === 'dog') {
        specificInfo = `<p><strong>Breed:</strong> ${pet.breed}</p>`;
    } else if (pet.type === 'cat') {
        specificInfo = `<p><strong>Type:</strong> ${pet.isIndoor ? 'Indoor' : 'Outdoor'} Cat</p>`;
    } else if (pet.type === 'bird') {
        specificInfo = `<p><strong>Wing Span:</strong> ${pet.wingSpan} meters</p>`;
    }
    
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Type:</strong> ${pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
        <p><strong>Name:</strong> ${pet.name}</p>
        <p><strong>Age:</strong> ${pet.age} years old</p>
        <p><strong>Color:</strong> ${pet.color}</p>
        ${specificInfo}
        <p><strong>Sound:</strong> ${pet.sound}</p>
        <p><strong>Special Ability:</strong> ${pet.ability}</p>
        <p><strong>Added Date:</strong> ${pet.addedDate}</p>
        <p><strong>ID:</strong> #${pet.id}</p>
    `;
    
    document.getElementById('petModal').style.display = 'block';
    document.getElementById('petModal').focus();
}

function closeModal() {
    document.getElementById('petModal').style.display = 'none';
}

// Delete & Undo
function deletePet(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    if (confirm(`Remove ${pet.name} from the shelter?`)) {
        const petCard = document.querySelector(`[data-pet-id="${petId}"]`);
        
        if (petCard) {
            petCard.style.animation = 'slideOutRight 0.4s ease forwards';
            
            setTimeout(() => {
                deletedPets.push({...pet, deletedAt: Date.now()});
                pets = pets.filter(p => p.id !== petId);
                
                saveToStorage();
                displayPets();
                updateStats();
                updateChart();
                updateTimeline();
                
                showUndoBar(`${pet.name} deleted`);
            }, 400);
        }
    }
}

function showUndoBar(message) {
    const undoBar = document.getElementById('undoBar');
    document.getElementById('undoMessage').textContent = message;
    undoBar.classList.add('show');
    
    setTimeout(() => {
        undoBar.classList.remove('show');
        // Clear old deleted pets after 30 seconds
        const thirtySecondsAgo = Date.now() - 30000;
        deletedPets = deletedPets.filter(p => p.deletedAt > thirtySecondsAgo);
        saveToStorage();
    }, 30000);
}

function undoDelete() {
    if (deletedPets.length === 0) {
        showToast('Nothing to undo', 'error');
        return;
    }
    
    const recentDeleted = deletedPets.filter(p => Date.now() - p.deletedAt < 30000);
    
    if (recentDeleted.length === 0) {
        showToast('Undo period expired', 'error');
        return;
    }
    
    recentDeleted.forEach(pet => {
        delete pet.deletedAt;
        pets.push(pet);
    });
    
    deletedPets = [];
    
    saveToStorage();
    displayPets();
    updateStats();
    updateChart();
    updateTimeline();
    
    document.getElementById('undoBar').classList.remove('show');
    showToast(`Restored ${recentDeleted.length} pet(s)! 🎉`, 'success');
}

// Sound All Pets
function makeAllPetsSound() {
    if (pets.length === 0) {
        showToast('No pets in the shelter yet!', 'error');
        return;
    }
    
    let sounds = '🔊 All pets making sounds:\n\n';
    pets.forEach(pet => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        sounds += `${emoji} ${pet.name}: ${pet.sound}\n`;
    });
    
    alert(sounds);
    
    document.querySelectorAll('.pet-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'bounce 0.6s ease';
            }, 10);
        }, index * 100);
    });
}

// Export & Import
function showExportOptions() {
    document.getElementById('exportModal').style.display = 'block';
}

function closeExportModal() {
    document.getElementById('exportModal').style.display = 'none';
}

function exportData(format) {
    if (pets.length === 0) {
        showToast('No pets to export', 'error');
        return;
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    let content, filename, type;
    
    if (format === 'json') {
        content = JSON.stringify(pets, null, 2);
        filename = `pets-backup-${timestamp}.json`;
        type = 'application/json';
    } else if (format === 'csv') {
        const headers = ['ID', 'Name', 'Type', 'Age', 'Color', 'Added Date'];
        const rows = pets.map(p => [
            p.id, p.name, p.type, p.age, p.color, p.addedDate
        ]);
        
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename = `pets-backup-${timestamp}.csv`;
        type = 'text/csv';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(`Data exported as ${format.toUpperCase()}! 📥`, 'success');
    closeExportModal();
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let importedPets = [];
            
            if (file.name.endsWith('.json')) {
                importedPets = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                const lines = content.split('\n').slice(1); // Skip header
                importedPets = lines.filter(line => line.trim()).map(line => {
                    const [id, name, type, age, color, addedDate] = line.split(',');
                    return {
                        id: parseInt(id),
                        name, type,
                        age: parseInt(age),
                        color, addedDate,
                        timestamp: Date.now(),
                        sound: type === 'dog' ? 'Woof! Woof!' : type === 'cat' ? 'Meow! Meow!' : 'Tweet! Tweet!',
                        ability: 'Imported pet'
                    };
                });
            }
            
            if (importedPets.length > 0) {
                // Merge with existing pets
                importedPets.forEach(pet => {
                    if (!pets.find(p => p.id === pet.id)) {
                        pets.push(pet);
                        petIdCounter = Math.max(petIdCounter, pet.id + 1);
                    }
                });
                
                saveToStorage();
                displayPets();
                updateStats();
                updateChart();
                updateTimeline();
                
                showToast(`Imported ${importedPets.length} pet(s)! 📤`, 'success');
                closeExportModal();
            }
        } catch (error) {
            showToast('Import failed. Check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+N - Focus on name input
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        document.getElementById('petName').focus();
    }
    
    // Ctrl+F - Focus on search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl+E - Export
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        showExportOptions();
    }
    
    // Ctrl+Z - Undo
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undoDelete();
    }
    
    // ? - Show shortcuts
    if (e.key === '?' && !e.ctrlKey && !e.altKey) {
        toggleKeyboardShortcuts();
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
        closeModal();
        closeExportModal();
        closeShortcutsModal();
    }
});

function toggleKeyboardShortcuts() {
    document.getElementById('shortcutsModal').style.display = 'block';
}

function closeShortcutsModal() {
    document.getElementById('shortcutsModal').style.display = 'none';
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `<span style="font-size: 1.5em;">${icons[type]}</span><span>${message}</span>`;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modals on overlay click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Initialize
updateStats();
window.addEventListener('load', function() {
    setTimeout(() => {
        showToast('Welcome to Pet Shelter Pro! 🐾 Press ? for shortcuts', 'info');
    }, 500);
});