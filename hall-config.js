// Hall configuration functionality

// Show the hall configuration popup
function showHallConfigPopup() {
    const modal = document.getElementById('hall-config-modal');
    const container = document.getElementById('hall-config-container');
    
    // Clear existing configurations
    container.innerHTML = '';
    
    // Add current hall configurations
    hallConfigurations.forEach((hall, index) => {
        addHallConfigItem(hall.name, hall.type);
    });
    
    // Show the modal
    modal.style.display = 'block';
    
    // Add event listener to close when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeHallConfigPopup();
        }
    };
}

// Close the hall configuration popup
function closeHallConfigPopup() {
    const modal = document.getElementById('hall-config-modal');
    modal.style.display = 'none';
}

// Add a new hall configuration item to the container
function addHallConfigItem(name = '', type = 'Einfeldhalle') {
    const container = document.getElementById('hall-config-container');
    const itemIndex = container.children.length;
    
    const item = document.createElement('div');
    item.className = 'hall-config-item';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Hallenname (z.B. Montag)';
    nameInput.className = 'hall-name-input';
    nameInput.value = name;
    
    const typeSelect = document.createElement('select');
    typeSelect.className = 'hall-type-select';
    
    const einfeldOption = document.createElement('option');
    einfeldOption.value = 'Einfeldhalle';
    einfeldOption.textContent = 'Einfeldhalle';
    
    const zweifeldOption = document.createElement('option');
    zweifeldOption.value = 'Zweifeldhalle';
    zweifeldOption.textContent = 'Zweifeldhalle';
    
    const dreifeldOption = document.createElement('option');
    dreifeldOption.value = 'Dreifeldhalle';
    dreifeldOption.textContent = 'Dreifeldhalle';
    
    const vierfeldOption = document.createElement('option');
    vierfeldOption.value = 'Vierfeldhalle';
    vierfeldOption.textContent = 'Vierfeldhalle';
    
    typeSelect.appendChild(einfeldOption);
    typeSelect.appendChild(zweifeldOption);
    typeSelect.appendChild(dreifeldOption);
    typeSelect.appendChild(vierfeldOption);
    typeSelect.value = type;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-hall-btn';
    removeButton.innerHTML = '&times;';
    removeButton.onclick = function() {
        container.removeChild(item);
    };
    
    item.appendChild(nameInput);
    item.appendChild(typeSelect);
    item.appendChild(removeButton);
    
    container.appendChild(item);
}

// Add a new empty hall configuration
function addHallConfig() {
    addHallConfigItem();
}

// Save the hall configurations
function saveHallConfigurations() {
    const container = document.getElementById('hall-config-container');
    const configItems = container.querySelectorAll('.hall-config-item');
    
    // Create a new array for the configurations
    const newConfigurations = [];
    
    // Collect data from each item
    configItems.forEach(item => {
        const nameInput = item.querySelector('.hall-name-input');
        const typeSelect = item.querySelector('.hall-type-select');
        
        if (nameInput.value.trim()) {
            newConfigurations.push({
                name: nameInput.value.trim(),
                type: typeSelect.value
            });
        }
    });
    
    // Update the global configurations
    hallConfigurations = newConfigurations;
    
    // Close the popup
    closeHallConfigPopup();
    
    // Alert the user
    alert('Hallenkonfiguration erfolgreich gespeichert!');
} 