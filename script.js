let currentPetType = 'dog';
let pets = [];

function selectPetType(type) {
    currentPetType = type;
    
    document.querySelectorAll('.pet-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.specific-fields').forEach(field => {
        field.classList.remove('active');
    });
    document.getElementById(type + 'Fields').classList.add('active');
}

document.getElementById('petForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('petName').value;
    const age = parseInt(document.getElementById('petAge').value);
    const color = document.getElementById('petColor').value;
    
    let pet = {
        type: currentPetType,
        name: name,
        age: age,
        color: color
    };
    
    if (currentPetType === 'dog') {
        pet.breed = document.getElementById('dogBreed').value;
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
    
    alert(`${name} has been added to the shelter! 🎉`);
});

function displayPets() {
    const petsList = document.getElementById('petsList');
    
    if (pets.length === 0) {
        petsList.innerHTML = '<div class="empty-message">No pets in shelter yet. Add your first pet!</div>';
        return;
    }
    
    petsList.innerHTML = '';
    pets.forEach((pet, index) => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
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
                <button class="action-btn info-btn" onclick="showPetInfo(${index})">ℹ️ Info</button>
                <button class="action-btn delete-btn" onclick="deletePet(${index})">🗑️ Delete</button>
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
    document.getElementById('petCount').textContent = pets.length;
    document.getElementById('dogCount').textContent = pets.filter(p => p.type === 'dog').length;
    document.getElementById('catCount').textContent = pets.filter(p => p.type === 'cat').length;
    document.getElementById('birdCount').textContent = pets.filter(p => p.type === 'bird').length;
}

function showPetInfo(index) {
    const pet = pets[index];
    const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
    
    document.getElementById('modalTitle').textContent = `${emoji} ${pet.name}'s Details`;
    
    let specificInfo = '';
    if (pet.type === 'dog') {
        specificInfo = `<strong>Breed:</strong> ${pet.breed}<br>`;
    } else if (pet.type === 'cat') {
        specificInfo = `<strong>Type:</strong> ${pet.isIndoor ? 'Indoor' : 'Outdoor'} Cat<br>`;
    } else if (pet.type === 'bird') {
        specificInfo = `<strong>Wing Span:</strong> ${pet.wingSpan} meters<br>`;
    }
    
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Type:</strong> ${pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
        <p><strong>Name:</strong> ${pet.name}</p>
        <p><strong>Age:</strong> ${pet.age} years old</p>
        <p><strong>Color:</strong> ${pet.color}</p>
        <p>${specificInfo}</p>
        <p><strong>Sound:</strong> ${pet.sound}</p>
        <p><strong>Special Ability:</strong> ${pet.ability}</p>
    `;
    
    document.getElementById('petModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('petModal').style.display = 'none';
}

function deletePet(index) {
    const pet = pets[index];
    if (confirm(`Are you sure you want to remove ${pet.name} from the shelter?`)) {
        pets.splice(index, 1);
        displayPets();
        updateStats();
        alert(`${pet.name} has been removed from the shelter.`);
    }
}

function makeAllPetsSound() {
    if (pets.length === 0) {
        alert('No pets in the shelter yet!');
        return;
    }
    
    let sounds = '🔊 All pets making sounds:\n\n';
    pets.forEach(pet => {
        const emoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐱' : '🦜';
        sounds += `${emoji} ${pet.name}: ${pet.sound}\n`;
    });
    
    alert(sounds);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('petModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize stats on page load
updateStats();