let currentPetType = 'dog';
let pets = [];
let petIdCounter = 0;

function selectPetType(type) {
    currentPetType = type;
    
    document.querySelectorAll('.pet-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.pet-type-btn').classList.add('active');
    
    document.querySelectorAll('.specific-fields').forEach(field => {
        field.classList.remove('active');
    });
    document.getElementById(type + 'Fields').classList.add('active');
}

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
        timestamp: Date.now()
    };
    
    if (currentPetType === 'dog') {
        pet.breed = document.getElementById('dogBreed').value.trim();
        pet.sound = 'Woof! Woof!';
        pet.ability = 'Can fetch and guard the house';
    } else if (currentPetType === 'cat') {
        pet.isIndoor = document.getElementById('catIndoor').value === 'true';
        pet.sound = 'Meow! Meow!';
        pet.ability = 'Expert climber and mouse hunter';
    } else if (currentPetType === 'bird') {
        pet.wingSpan = parseFloat(document.getElementById('birdWingSpan').value);
        pet.sound = 'Tweet! Tweet!';
        pet.ability = `Can fly up to ${pet.wingSpan} meters high`;
    }
    
    pets.push(pet);
    displayPets();
    updateStats();
    this.reset();
    
    showToast(`${name} has been added to the shelter! 🎉`, 'success');
    
    // Reset to first pet type
    selectPetType('dog');
    document.querySelector('.pet-type-btn[data-type="dog"]').click();
});

function displayPets() {
    const petsList = document.getElementById('petsList');
    
    if (pets.length === 0) {
        petsList.innerHTML = `
            <div class="empty-message">
                <div class="empty-icon">🏠</div>
                <p>No pets in shelter yet. Add your first pet!</p>
            </div>
        `;
        return;
    }
    
    petsList.innerHTML = '';
    pets.forEach((pet, index) => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.setAttribute('data-pet-id', pet.id);
        
        let specificInfo = '';
        if (pet.type === 'dog') {
            specificInfo = `<strong>Breed:</strong> ${pet.breed}<br>`;
        } else if (pet.type === 'cat') {
            specificInfo = `<strong>Type:</strong> ${pet.isIndoor ? 'Indoor' : 'Outdoor'} Cat<br>`;
        } else if (pet.type === 'bird') {
            specificInfo = `<strong>Wing Span:</strong> ${pet.wingSpan}m<br>`;
        }
        
        petCard.innerHTML = `
            <h3>${emoji} ${pet.name}</h3>
            <div class="pet-actions">
                <button class="action-btn info-btn" onclick="showPetInfo(${pet.id})">ℹ️ Info</button>
                <button class="action-btn delete-btn" onclick="deletePet(${pet.id})">🗑️ Delete</button>
            </div>
            <div class="pet-info">
                <strong>Age:</strong> ${pet.age} years old<br>
                <strong>Color:</strong> ${pet.color}<br>
                ${specificInfo}
            </div>
            <div class="pet-sound">${pet.sound}</div>
        `;
        
        petsList.appendChild(petCard);
    });
}

function updateStats() {
    const totalCount = pets.length;
    const dogCount = pets.filter(p => p.type === 'dog').length;
    const catCount = pets.filter(p => p.type === 'cat').length;
    const birdCount = pets.filter(p => p.type === 'bird').length;
    
    animateNumber('petCount', totalCount);
    animateNumber('dogCount', dogCount);
    animateNumber('catCount', catCount);
    animateNumber('birdCount', birdCount);
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
    `;
    
    document.getElementById('petModal').style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('petModal');
    modal.style.display = 'none';
}

function deletePet(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    if (confirm(`Are you sure you want to remove ${pet.name} from the shelter?`)) {
        const petCard = document.querySelector(`[data-pet-id="${petId}"]`);
        
        if (petCard) {
            petCard.style.animation = 'slideOutRight 0.4s ease forwards';
            
            setTimeout(() => {
                pets = pets.filter(p => p.id !== petId);
                displayPets();
                updateStats();
                showToast(`${pet.name} has been removed from the shelter.`, 'info');
            }, 400);
        }
    }
}

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
    
    // Add visual feedback
    document.querySelectorAll('.pet-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'bounce 0.6s ease';
            }, 10);
        }, index * 100);
    });
}

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

function filterPets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const petCards = document.querySelectorAll('.pet-card');
    
    petCards.forEach(card => {
        const petName = card.querySelector('h3').textContent.toLowerCase();
        const petInfo = card.querySelector('.pet-info').textContent.toLowerCase();
        
        if (petName.includes(searchTerm) || petInfo.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'slideInLeft 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

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
    }
    
    displayPets();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('petModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize stats on page load
updateStats();

// Add welcome message
window.addEventListener('load', function() {
    setTimeout(() => {
        showToast('Welcome to Pet Shelter Management System! 🐾', 'info');
    }, 500);
});