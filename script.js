let draggedElement = null;
let customVariantCount = 0;
let customTeams = [];
let currentIcon = null;

// Initialize color picker preview
document.getElementById('new-team-color').addEventListener('input', function() {
    document.getElementById('color-preview').style.backgroundColor = this.value;
});

function addNewTeam() {
    const teamName = document.getElementById('new-team-name').value.trim();
    const teamColor = document.getElementById('new-team-color').value;
    
    if (!teamName) {
        alert('Bitte gib einen Namen für das Team ein.');
        return;
    }
    
    // Create a CSS class name from the team name (remove spaces, special chars)
    const className = teamName.replace(/[^a-zA-Z0-9]/g, '');
    
    // Check if team already exists
    if (document.querySelector(`.${className}`) || customTeams.includes(className)) {
        alert('Ein Team mit diesem Namen existiert bereits.');
        return;
    }
    
    // Add the team's style to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = `.${className} { background-color: ${teamColor}; }`;
    document.head.appendChild(styleElement);
    
    // Create the team element in the palette
    const teamElement = document.createElement('div');
    teamElement.className = `palette-team ${className}`;
    teamElement.textContent = teamName;
    teamElement.draggable = true;
    teamElement.setAttribute('ondragstart', 'drag(event)');
    
    // Add to palette
    document.getElementById('team-palette').appendChild(teamElement);
    
    // Add to custom teams list
    customTeams.push(className);
    
    // Clear the input
    document.getElementById('new-team-name').value = '';
}

function drag(ev) {
    draggedElement = ev.target;
    // Store the element's ID, class, and innerHTML
    ev.dataTransfer.setData("text/plain", draggedElement.id);
    
    // Add a slight transparency to indicate the element is being dragged
    setTimeout(() => {
        draggedElement.style.opacity = "0.4";
    }, 0);
    
    // Show trash zone when dragging any team
    if (draggedElement.classList.contains('team') || draggedElement.classList.contains('palette-team')) {
        document.getElementById('trash-zone').classList.add('visible');
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragEnter(ev) {
    // Remove any existing action icons
    removeActionIcons();
    
    // Highlight drop targets
    if (ev.target.classList.contains('field-container')) {
        ev.target.classList.add('drop-target');
        
        // Only show delete icon if we're dragging a team (not from palette)
        if (draggedElement.classList.contains('team') && !draggedElement.classList.contains('palette-team')) {
            // Show delete icon if dropping on empty space
            if (ev.target.children.length === 0) {
                showActionIcon(ev.target, 'delete');
            }
        }
    } else if (ev.target.classList.contains('team')) {
        // Show switch icon if dropping on another team
        if (draggedElement.classList.contains('team')) {
            showActionIcon(ev.target.parentNode, 'switch');
        }
    }
}

function dragLeave(ev) {
    // Remove highlight from drop targets
    if (ev.target.classList.contains('field-container')) {
        ev.target.classList.remove('drop-target');
        removeActionIcons();
    }
}

function showActionIcon(container, type) {
    // Remove any existing icons
    removeActionIcons();
    
    // Create the icon
    const icon = document.createElement('div');
    icon.className = `action-icon ${type}-icon`;
    icon.id = 'action-icon';
    
    // Add to container
    container.appendChild(icon);
    currentIcon = icon;
}

function removeActionIcons() {
    const icon = document.getElementById('action-icon');
    if (icon) {
        icon.parentNode.removeChild(icon);
        currentIcon = null;
    }
}

function dropOnTrash(ev) {
    ev.preventDefault();
    
    // Reset opacity and hide trash zone
    draggedElement.style.opacity = "1";
    document.getElementById('trash-zone').classList.remove('visible');
    
    // If it's a palette team and a custom team, delete it
    if (draggedElement.classList.contains('palette-team')) {
        const className = Array.from(draggedElement.classList)
            .find(cls => cls !== 'palette-team');
        
        // Check if it's a custom team (not one of the standard teams)
        const standardTeams = ['KMP', 'Blockbusters', 'Sexy-Licious', 'Blockjobs', 'BaggerBuben', 'HitHappens'];
        
        if (!standardTeams.includes(className) && customTeams.includes(className)) {
            // Call deleteTeam without confirmation (it will handle its own confirmation)
            deleteTeam(className, false);
        } else {
            alert('Standard-Teams können nicht gelöscht werden.');
        }
    } 
    // If it's a regular team (not from palette)
    else if (draggedElement.classList.contains('team')) {
        // Remove the team
        draggedElement.parentNode.removeChild(draggedElement);
    }
}

function drop(ev) {
    ev.preventDefault();
    
    // Remove highlight from all drop targets
    document.querySelectorAll('.drop-target').forEach(el => {
        el.classList.remove('drop-target');
    });
    
    // Remove action icons
    removeActionIcons();
    
    // Hide trash zone
    document.getElementById('trash-zone').classList.remove('visible');
    
    // Reset opacity of dragged element
    draggedElement.style.opacity = "1";
    
    // Check if we're dropping on a team or a field container
    let dropTarget = ev.target;
    
    // If we're dragging from the palette, create a new team element
    if (draggedElement.classList.contains('palette-team')) {
        const newTeam = document.createElement('div');
        // Get the team class (like KMP, Blockbusters, etc.)
        const teamClass = Array.from(draggedElement.classList)
            .find(cls => cls !== 'palette-team');
        
        newTeam.className = `team ${teamClass}`;
        newTeam.textContent = draggedElement.textContent;
        newTeam.draggable = true;
        newTeam.setAttribute('ondragstart', 'drag(event)');
        
        // If dropped on a team, find its parent container
        if (dropTarget.classList.contains('team')) {
            const parentContainer = dropTarget.parentNode;
            
            // If the container already has two teams, replace the second one
            if (parentContainer.children.length >= 2) {
                parentContainer.replaceChild(newTeam, parentContainer.children[1]);
            } else {
                parentContainer.appendChild(newTeam);
            }
        } 
        // If dropped directly on a field container
        else if (dropTarget.classList.contains('field-container')) {
            // Check if the container already has two teams
            if (dropTarget.children.length < 2) {
                // If there's space, just append
                dropTarget.appendChild(newTeam);
            } else {
                // If there are already two teams, replace the second one
                dropTarget.replaceChild(newTeam, dropTarget.children[1]);
            }
        }
        
        return;
    }
    
    // If dropped on a team, find its parent container
    if (dropTarget.classList.contains('team')) {
        // Swap the teams
        const parentContainer = dropTarget.parentNode;
        const draggedTeam = draggedElement;
        const droppedTeam = dropTarget;
        
        // Store the original parent of the dragged team
        const originalParent = draggedTeam.parentNode;
        
        // If we're dropping onto a team in a different container, move the dragged team to the new container
        if (originalParent !== parentContainer) {
            parentContainer.replaceChild(draggedTeam, droppedTeam);
            originalParent.appendChild(droppedTeam);
        }
    } 
    // If dropped directly on a field container
    else if (dropTarget.classList.contains('field-container')) {
        // Check if we're dropping on empty space (no teams in container)
        if (dropTarget.children.length === 0 && !draggedElement.classList.contains('palette-team')) {
            // Remove the team if dropped on empty space
            draggedElement.parentNode.removeChild(draggedElement);
            return;
        }
        
        // Check if the container already has two teams
        if (dropTarget.children.length < 2) {
            // If there's space, just append
            draggedElement.parentNode.removeChild(draggedElement);
            dropTarget.appendChild(draggedElement);
        } else {
            // If there are already two teams, replace the second one
            const secondTeam = dropTarget.children[1];
            const originalParent = draggedElement.parentNode;
            
            dropTarget.replaceChild(draggedElement, secondTeam);
            
            // Only append the second team back to original parent if it's not full
            if (originalParent.children.length < 2) {
                originalParent.appendChild(secondTeam);
            }
        }
    }
}

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

function createNewVariant(variantName) {
    customVariantCount++;
    const variantId = 'custom-variant-' + customVariantCount;
    
    // Create variant header with delete button
    const headerDiv = document.createElement('div');
    headerDiv.className = 'variant-header';
    
    // Create heading
    const heading = document.createElement('h2');
    heading.textContent = variantName;
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
    
    // Add days
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'];
    const hallTypes = ['Zweifeldhalle', 'Einfeldhalle', 'Einfeldhalle', 'Zweifeldhalle'];
    
    days.forEach((day, index) => {
        const hall = document.createElement('div');
        hall.className = 'hall';
        
        const dayHeading = document.createElement('h3');
        dayHeading.textContent = day;
        hall.appendChild(dayHeading);
        
        // Add field containers based on hall type
        if (hallTypes[index] === 'Zweifeldhalle') {
            // Two field containers for Zweifeldhalle
            for (let i = 0; i < 2; i++) {
                const fieldContainer = document.createElement('div');
                fieldContainer.className = 'field-container';
                fieldContainer.setAttribute('ondrop', 'drop(event)');
                fieldContainer.setAttribute('ondragover', 'allowDrop(event)');
                fieldContainer.setAttribute('ondragenter', 'dragEnter(event)');
                fieldContainer.setAttribute('ondragleave', 'dragLeave(event)');
                hall.appendChild(fieldContainer);
            }
        } else {
            // One field container for Einfeldhalle
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
        hallInfo.textContent = hallTypes[index];
        hall.appendChild(hallInfo);
        
        container.appendChild(hall);
    });
    
    // Add to document
    const customVariantsContainer = document.getElementById('custom-variants-container');
    customVariantsContainer.appendChild(headerDiv);
    customVariantsContainer.appendChild(container);
}

// Initialize drag events for the trash zone
document.addEventListener('DOMContentLoaded', function() {
    const trashZone = document.getElementById('trash-zone');
    
    // Hide trash zone when drag ends
    document.addEventListener('dragend', function() {
        trashZone.classList.remove('visible');
        removeActionIcons();
    });
});

function saveConfiguration() {
    // Collect all variants data
    const config = {
        variants: [],
        customTeams: customTeams
    };
    
    // Add variant A
    config.variants.push({
        name: "Variante A",
        days: collectDayData("variant-a")
    });
    
    // Add variant B
    config.variants.push({
        name: "Variante B",
        days: collectDayData("variant-b")
    });
    
    // Add custom variants
    const customVariantsContainer = document.getElementById('custom-variants-container');
    const customVariantHeadings = customVariantsContainer.querySelectorAll('h2');
    
    customVariantHeadings.forEach((heading, index) => {
        const variantContainer = heading.nextElementSibling;
        if (variantContainer && variantContainer.classList.contains('hall-container')) {
            config.variants.push({
                name: heading.textContent,
                days: collectDayData(variantContainer.id)
            });
        }
    });
    
    // Create and download the JSON file
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'volleyball-trainingsplan.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function collectDayData(variantId) {
    const days = [];
    const variant = document.getElementById(variantId);
    const halls = variant.querySelectorAll('.hall');
    
    halls.forEach(hall => {
        const dayName = hall.querySelector('h3').textContent;
        const hallType = hall.querySelector('.hall-info').textContent;
        const fieldContainers = hall.querySelectorAll('.field-container');
        
        const fields = [];
        fieldContainers.forEach(container => {
            const teams = [];
            const teamElements = container.querySelectorAll('.team');
            
            teamElements.forEach(team => {
                // Get the team class (like KMP, Blockbusters, etc.)
                const teamClass = Array.from(team.classList)
                    .find(cls => cls !== 'team');
                
                teams.push({
                    name: team.textContent,
                    class: teamClass
                });
            });
            
            fields.push(teams);
        });
        
        days.push({
            day: dayName,
            hallType: hallType,
            fields: fields
        });
    });
    
    return days;
}

function loadConfiguration(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            applyConfiguration(config);
        } catch (error) {
            alert('Fehler beim Laden der Konfiguration: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function applyConfiguration(config) {
    // First, clear custom variants
    const customVariantsContainer = document.getElementById('custom-variants-container');
    customVariantsContainer.innerHTML = '';
    
    // Reset custom variant count
    customVariantCount = 0;
    
    // Apply custom teams
    if (config.customTeams && Array.isArray(config.customTeams)) {
        // First, add any missing custom team styles
        config.customTeams.forEach(className => {
            if (!customTeams.includes(className) && !document.querySelector(`.${className}`)) {
                // Find the team in the config
                let teamColor = "#4CAF50"; // Default color if not found
                
                // Add the team's style to the document
                const styleElement = document.createElement('style');
                styleElement.textContent = `.${className} { background-color: ${teamColor}; }`;
                document.head.appendChild(styleElement);
                
                customTeams.push(className);
            }
        });
    }
    
    // Apply variants
    if (config.variants && Array.isArray(config.variants)) {
        // First two variants are A and B
        if (config.variants.length >= 1) {
            applyVariantData("variant-a", config.variants[0].days);
        }
        
        if (config.variants.length >= 2) {
            applyVariantData("variant-b", config.variants[1].days);
        }
        
        // Apply custom variants
        for (let i = 2; i < config.variants.length; i++) {
            createNewVariant(config.variants[i].name);
            const variantId = 'custom-variant-' + customVariantCount;
            applyVariantData(variantId, config.variants[i].days);
        }
    }
    
    // Refresh team palette
    refreshTeamPalette();
    
    alert('Konfiguration erfolgreich geladen!');
}

function applyVariantData(variantId, daysData) {
    const variant = document.getElementById(variantId);
    if (!variant) return;
    
    const halls = variant.querySelectorAll('.hall');
    
    daysData.forEach((dayData, index) => {
        if (index >= halls.length) return;
        
        const hall = halls[index];
        const fieldContainers = hall.querySelectorAll('.field-container');
        
        // Clear existing teams
        fieldContainers.forEach(container => {
            container.innerHTML = '';
        });
        
        // Add teams from config
        dayData.fields.forEach((fieldTeams, fieldIndex) => {
            if (fieldIndex >= fieldContainers.length) return;
            
            const container = fieldContainers[fieldIndex];
            
            fieldTeams.forEach(teamData => {
                const teamElement = document.createElement('div');
                teamElement.className = `team ${teamData.class}`;
                teamElement.textContent = teamData.name;
                teamElement.draggable = true;
                teamElement.setAttribute('ondragstart', 'drag(event)');
                
                container.appendChild(teamElement);
            });
        });
    });
}

function refreshTeamPalette() {
    const palette = document.getElementById('team-palette');
    
    // Clear existing teams
    palette.innerHTML = '';
    
    // Add standard teams
    const standardTeams = [
        { name: 'KMP', class: 'KMP' },
        { name: 'Blockbusters', class: 'Blockbusters' },
        { name: 'Sexy-Licious', class: 'Sexy-Licious' },
        { name: 'Blockjobs', class: 'Blockjobs' },
        { name: 'BaggerBuben', class: 'BaggerBuben' },
        { name: 'HitHappens', class: 'HitHappens' }
    ];
    
    standardTeams.forEach(team => {
        const teamElement = document.createElement('div');
        teamElement.className = `palette-team ${team.class}`;
        teamElement.textContent = team.name;
        teamElement.draggable = true;
        teamElement.setAttribute('ondragstart', 'drag(event)');
        
        palette.appendChild(teamElement);
    });
    
    // Add custom teams
    customTeams.forEach(className => {
        // Skip if it's one of the standard teams
        if (standardTeams.some(team => team.class === className)) return;
        
        const teamElement = document.createElement('div');
        teamElement.className = `palette-team ${className}`;
        teamElement.textContent = className; // Use class name as display name
        teamElement.draggable = true;
        teamElement.setAttribute('ondragstart', 'drag(event)');
        
        palette.appendChild(teamElement);
    });
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

// Modified to accept a skipConfirmation parameter
function deleteTeam(className, skipConfirmation = false) {
    // Ask for confirmation unless we're skipping it
    if (!skipConfirmation && !confirm(`Möchtest du das Team "${className}" wirklich löschen?`)) {
        return;
    }
    
    // Remove from customTeams array
    const index = customTeams.indexOf(className);
    if (index > -1) {
        customTeams.splice(index, 1);
    }
    
    // Remove all instances of this team from all variants
    const teamElements = document.querySelectorAll(`.team.${className}`);
    teamElements.forEach(element => {
        element.parentNode.removeChild(element);
    });
    
    // Refresh the team palette
    refreshTeamPalette();
    
    alert(`Team "${className}" wurde gelöscht.`);
}

// Call refreshTeamPalette on page load to ensure delete buttons are added
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Refresh team palette to add delete buttons
    refreshTeamPalette();
});

// Helper function to check if a team is a custom team
function isCustomTeam(element) {
    const className = Array.from(element.classList)
        .find(cls => cls !== 'palette-team');
    
    const standardTeams = ['KMP', 'Blockbusters', 'Sexy-Licious', 'Blockjobs', 'BaggerBuben', 'HitHappens'];
    return !standardTeams.includes(className) && customTeams.includes(className);
} 