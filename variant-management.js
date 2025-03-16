// Variant management functionality

function showVariantNamePrompt() {
    // Create a container for the variant name input
    const container = document.createElement('div');
    container.className = 'variant-name-container';
    
    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'variant-name-input';
    input.placeholder = 'Name der neuen Variante';
    input.id = 'new-variant-name';
    
    // Create confirm button
    const button = document.createElement('button');
    button.textContent = 'Erstellen';
    button.onclick = function() {
        const variantName = document.getElementById('new-variant-name').value.trim();
        if (variantName) {
            createNewVariant(variantName);
            container.remove();
        } else {
            alert('Bitte gib einen Namen für die Variante ein.');
        }
    };
    
    // Add elements to container
    container.appendChild(input);
    container.appendChild(button);
    
    // Add container before the add button
    document.querySelector('.add-variant-container').before(container);
    
    // Focus the input
    input.focus();
}

function createNewVariant(variantName, customDays) {
    customVariantCount++;
    const variantId = 'custom-variant-' + customVariantCount;
    
    // Create variant header with delete button
    const headerDiv = document.createElement('div');
    headerDiv.className = 'variant-header';
    
    // Create heading - make it editable
    const heading = document.createElement('h2');
    heading.textContent = variantName;
    heading.contentEditable = true;
    heading.spellcheck = false;
    heading.className = 'editable-variant-name';
    // Add event listeners for editing
    heading.addEventListener('focus', function() {
        // Store original text to restore if needed
        heading.dataset.originalText = heading.textContent;
    });
    heading.addEventListener('blur', function() {
        // Validate and save changes when focus is lost
        if (!heading.textContent.trim()) {
            heading.textContent = heading.dataset.originalText || variantName;
        }
        // Update any references to this variant
        updateTeamCounters();
    });
    heading.addEventListener('keydown', function(e) {
        // Save on Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            heading.blur();
        }
        // Cancel on Escape key
        if (e.key === 'Escape') {
            heading.textContent = heading.dataset.originalText || variantName;
            heading.blur();
        }
    });
    headerDiv.appendChild(heading);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-variant-btn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.setAttribute('onclick', `deleteVariant('${variantId}')`);
    headerDiv.appendChild(deleteBtn);
    
    // Create container
    const container = document.createElement('div');
    container.className = 'hall-container';
    container.id = variantId;
    
    // Use provided custom days, hallConfigurations, or default
    const days = customDays || hallConfigurations.map(hall => hall.name);
    
    // Get hall types from configurations
    const hallTypes = {};
    hallConfigurations.forEach(hall => {
        hallTypes[hall.name] = hall.type;
    });
    
    days.forEach((day) => {
        const hall = document.createElement('div');
        hall.className = 'hall';
        
        const dayHeading = document.createElement('h3');
        dayHeading.textContent = day;
        hall.appendChild(dayHeading);
        
        // Add delete hall button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-hall-btn';
        deleteButton.innerHTML = '&times;';
        deleteButton.title = 'Halle löschen';
        deleteButton.onclick = function(e) {
            e.stopPropagation();
            deleteHall(hall);
        };
        hall.appendChild(deleteButton);
        
        // Determine hall type based on the day
        const hallType = hallTypes[day] || 'Einfeldhalle';
        
        // Determine the number of fields based on hall type
        let fieldCount = 1;
        if (hallType === 'Zweifeldhalle') fieldCount = 2;
        else if (hallType === 'Dreifeldhalle') fieldCount = 3;
        else if (hallType === 'Vierfeldhalle') fieldCount = 4;
        
        // Add field containers
        for (let i = 0; i < fieldCount; i++) {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'field-container';
            fieldContainer.setAttribute('ondrop', 'drop(event)');
            fieldContainer.setAttribute('ondragover', 'allowDrop(event)');
            fieldContainer.setAttribute('ondragenter', 'dragEnter(event)');
            fieldContainer.setAttribute('ondragleave', 'dragLeave(event)');
            hall.appendChild(fieldContainer);
        }
        
        // Add hall info
        const hallInfo = document.createElement('div');
        hallInfo.className = 'hall-info';
        hallInfo.textContent = hallType;
        hall.appendChild(hallInfo);
        
        container.appendChild(hall);
    });
    
    // Add to document
    const customVariantsContainer = document.getElementById('custom-variants-container');
    customVariantsContainer.appendChild(headerDiv);
    customVariantsContainer.appendChild(container);
    
    // Update variant headers to add the "Add Day" button
    updateVariantHeaders();
}

function deleteVariant(variantId) {
    // Ask for confirmation
    if (!confirm('Möchtest du diese Variante wirklich löschen?')) {
        return;
    }
    
    // Handle default variants (A and B) differently
    if (variantId === 'variant-a' || variantId === 'variant-b') {
        // For default variants, just clear the teams but keep the structure
        const variant = document.getElementById(variantId);
        const fieldContainers = variant.querySelectorAll('.field-container');
        
        fieldContainers.forEach(container => {
            container.innerHTML = '';
        });
        
        alert('Die Teams wurden aus der Variante entfernt.');
    } else {
        // For custom variants, remove the entire variant
        const variant = document.getElementById(variantId);
        if (!variant) return;
        
        // Also remove the heading (which is the previous element)
        const heading = variant.previousElementSibling;
        if (heading && heading.classList.contains('variant-header')) {
            heading.remove();
        }
        
        // Remove the variant container
        variant.remove();
        
        alert('Variante wurde gelöscht.');
    }
}

// Function to add a new variant
function addNewVariant(variantName, customDays) {
    // Generate a unique ID for the new variant
    const variantId = 'variant-' + Date.now();
    
    // Create variant header with edit and delete buttons
    const variantHeader = document.createElement('div');
    variantHeader.className = 'variant-header';
    
    // Create heading - make it editable
    const variantTitle = document.createElement('h2');
    variantTitle.textContent = variantName;
    variantTitle.contentEditable = true;
    variantTitle.spellcheck = false;
    variantTitle.className = 'editable-variant-name';
    // Add event listeners for editing
    variantTitle.addEventListener('focus', function() {
        // Store original text to restore if needed
        variantTitle.dataset.originalText = variantTitle.textContent;
    });
    variantTitle.addEventListener('blur', function() {
        // Validate and save changes when focus is lost
        if (!variantTitle.textContent.trim()) {
            variantTitle.textContent = variantTitle.dataset.originalText || variantName;
        }
        // Update any references to this variant
        updateTeamCounters();
    });
    variantTitle.addEventListener('keydown', function(e) {
        // Save on Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            variantTitle.blur();
        }
        // Cancel on Escape key
        if (e.key === 'Escape') {
            variantTitle.textContent = variantTitle.dataset.originalText || variantName;
            variantTitle.blur();
        }
    });
    variantHeader.appendChild(variantTitle);
    
    const variantActions = document.createElement('div');
    variantActions.className = 'variant-actions';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-variant-btn';
    deleteButton.textContent = '🗑️';
    deleteButton.onclick = function() { deleteVariant(variantId); };
    variantActions.appendChild(deleteButton);
    
    variantHeader.appendChild(variantActions);
    
    // Create the hall container
    const hallContainer = document.createElement('div');
    hallContainer.className = 'hall-container';
    hallContainer.id = variantId;
    
    // Use provided custom days, hallConfigurations, or default
    const days = customDays || hallConfigurations.map(hall => hall.name);
    
    // Get hall types from configurations
    const hallTypes = {};
    hallConfigurations.forEach(hall => {
        hallTypes[hall.name] = hall.type;
    });
    
    days.forEach(day => {
        const hall = document.createElement('div');
        hall.className = 'hall';
        
        const dayTitle = document.createElement('h3');
        dayTitle.textContent = day;
        hall.appendChild(dayTitle);
        
        // Add delete hall button
        const deleteHallButton = document.createElement('button');
        deleteHallButton.className = 'delete-hall-btn';
        deleteHallButton.innerHTML = '&times;';
        deleteHallButton.title = 'Halle löschen';
        deleteHallButton.onclick = function(e) {
            e.stopPropagation();
            deleteHall(hall);
        };
        hall.appendChild(deleteHallButton);
        
        // Determine hall type based on the day
        const hallType = hallTypes[day] || 'Einfeldhalle';
        
        // Determine the number of fields based on hall type
        let fieldCount = 1;
        if (hallType === 'Zweifeldhalle') fieldCount = 2;
        else if (hallType === 'Dreifeldhalle') fieldCount = 3;
        else if (hallType === 'Vierfeldhalle') fieldCount = 4;
        
        // Add field containers
        for (let i = 0; i < fieldCount; i++) {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'field-container';
            fieldContainer.setAttribute('ondrop', 'drop(event)');
            fieldContainer.setAttribute('ondragover', 'allowDrop(event)');
            fieldContainer.setAttribute('ondragenter', 'dragEnter(event)');
            fieldContainer.setAttribute('ondragleave', 'dragLeave(event)');
            hall.appendChild(fieldContainer);
        }
        
        // Add hall info
        const hallInfo = document.createElement('div');
        hallInfo.className = 'hall-info';
        hallInfo.textContent = hallType;
        hall.appendChild(hallInfo);
        
        hallContainer.appendChild(hall);
    });
    
    // Get the container for custom variants
    const customVariantsContainer = document.getElementById('custom-variants-container');
    
    // Append the new variant header and hall container
    customVariantsContainer.appendChild(variantHeader);
    customVariantsContainer.appendChild(hallContainer);
    
    // Update team counters
    updateTeamCounters();
}

// Function to rename a variant
function renameVariant(variantId) {
    const variantHeader = document.querySelector(`#${variantId}`).previousElementSibling;
    const variantTitle = variantHeader.querySelector('h2');
    const currentName = variantTitle.textContent;
    
    // Prompt for new name
    const newName = prompt('Neuer Name für die Variante:', currentName);
    
    // Update if a name was provided
    if (newName && newName.trim() !== '') {
        variantTitle.textContent = newName;
        
        // Also update any references to this variant in the team counter table
        updateTeamCounters();
    }
}

// Function to add a custom day to a variant
function addCustomDay(variantId) {
    const variant = document.getElementById(variantId);
    if (!variant) return;
    
    // Create a prompt to ask for the day name
    const dayName = prompt('Bitte gib den Namen der Halle ein (z.B. Freitag):');
    if (!dayName || !dayName.trim()) return;
    
    // Create hall type selection dialog
    const hallTypeSelection = document.createElement('div');
    hallTypeSelection.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; width: 100%;">
                <h3>Hallentyp auswählen</h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin: 15px 0;">
                    <button class="hall-type-btn" data-type="Einfeldhalle">Einfeldhalle</button>
                    <button class="hall-type-btn" data-type="Zweifeldhalle">Zweifeldhalle</button>
                    <button class="hall-type-btn" data-type="Dreifeldhalle">Dreifeldhalle</button>
                    <button class="hall-type-btn" data-type="Vierfeldhalle">Vierfeldhalle</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(hallTypeSelection);
    
    // Add styles for the buttons
    const style = document.createElement('style');
    style.textContent = `
        .hall-type-btn {
            padding: 10px;
            border: 1px solid #ccc;
            background: #f0f0f0;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        .hall-type-btn:hover {
            background: #e0e0e0;
        }
    `;
    document.head.appendChild(style);
    
    // Add click handlers for the hall type buttons
    const buttons = hallTypeSelection.querySelectorAll('.hall-type-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const hallType = this.getAttribute('data-type');
            
            // Remove the selection dialog
            document.body.removeChild(hallTypeSelection);
            document.head.removeChild(style);
            
            // Create the new hall
            const hall = document.createElement('div');
            hall.className = 'hall';
            
            // Create day heading
            const dayHeading = document.createElement('h3');
            dayHeading.textContent = dayName.trim();
            hall.appendChild(dayHeading);
            
            // Create delete hall button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-hall-btn';
            deleteButton.innerHTML = '&times;';
            deleteButton.title = 'Halle löschen';
            deleteButton.onclick = function(e) {
                e.stopPropagation();
                deleteHall(hall);
            };
            hall.appendChild(deleteButton);
            
            // Create field containers based on hall type
            let fieldCount = 1;
            if (hallType === 'Zweifeldhalle') fieldCount = 2;
            else if (hallType === 'Dreifeldhalle') fieldCount = 3;
            else if (hallType === 'Vierfeldhalle') fieldCount = 4;
            
            for (let i = 0; i < fieldCount; i++) {
                const fieldContainer = document.createElement('div');
                fieldContainer.className = 'field-container';
                fieldContainer.setAttribute('ondrop', 'drop(event)');
                fieldContainer.setAttribute('ondragover', 'allowDrop(event)');
                fieldContainer.setAttribute('ondragenter', 'dragEnter(event)');
                fieldContainer.setAttribute('ondragleave', 'dragLeave(event)');
                hall.appendChild(fieldContainer);
            }
            
            // Add hall info
            const hallInfo = document.createElement('div');
            hallInfo.className = 'hall-info';
            hallInfo.textContent = hallType;
            hall.appendChild(hallInfo);
            
            // Add to variant
            variant.appendChild(hall);
            
            // Update team counters
            if (typeof updateTeamCounters === 'function') {
                updateTeamCounters();
            }
        });
    });
}

// Function to delete a hall
function deleteHall(hallElement) {
    if (confirm('Möchtest du diese Halle wirklich löschen?')) {
        // Check if this is the last hall in the variant
        const variant = hallElement.parentNode;
        const halls = variant.querySelectorAll('.hall');
        
        if (halls.length <= 1) {
            alert('Die letzte Halle kann nicht gelöscht werden. Löschen Sie stattdessen die gesamte Variante.');
            return;
        }
        
        // Remove the hall
        hallElement.parentNode.removeChild(hallElement);
        
        // Update team counters
        if (typeof updateTeamCounters === 'function') {
            updateTeamCounters();
        }
    }
}

// Function to add delete buttons to existing halls
function addDeleteButtonsToHalls() {
    document.querySelectorAll('.hall').forEach(hall => {
        // Check if hall already has a delete button
        if (!hall.querySelector('.delete-hall-btn')) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-hall-btn';
            deleteButton.innerHTML = '&times;';
            deleteButton.title = 'Halle löschen';
            deleteButton.onclick = function(e) {
                e.stopPropagation();
                deleteHall(hall);
            };
            hall.appendChild(deleteButton);
        }
    });
}

// Update the variant header to include an "Add Day" button
function updateVariantHeaders() {
    // First, remove any existing add buttons from all variants
    document.querySelectorAll('.add-hall-btn').forEach(btn => {
        btn.remove();
    });
    
    // Process each variant
    document.querySelectorAll('.hall-container').forEach(variant => {
        const variantId = variant.id;
        const halls = variant.querySelectorAll('.hall');
        
        // Only add the button if there's at least one hall
        if (halls.length > 0) {
            // Get the last hall
            const lastHall = halls[halls.length - 1];
            
            // Create the add hall button
            const addHallBtn = document.createElement('div');
            addHallBtn.className = 'add-hall-btn';
            addHallBtn.textContent = '+';
            addHallBtn.title = 'Halle hinzufügen';
            addHallBtn.onclick = function() { addCustomDay(variantId); };
            
            // Add button to the last hall
            lastHall.appendChild(addHallBtn);
        } else {
            // If no halls, add it directly to the variant container
            const addHallBtn = document.createElement('div');
            addHallBtn.className = 'add-hall-btn';
            addHallBtn.textContent = '+';
            addHallBtn.title = 'Halle hinzufügen';
            addHallBtn.onclick = function() { addCustomDay(variantId); };
            
            variant.appendChild(addHallBtn);
        }
    });
    
    // Remove the old buttons from variant headers
    document.querySelectorAll('.variant-header .add-day-btn').forEach(btn => {
        btn.remove();
    });
    
    // Add delete buttons to all existing halls
    addDeleteButtonsToHalls();
} 