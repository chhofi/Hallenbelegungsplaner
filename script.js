let draggedElement = null;
let customVariantCount = 0;
let customTeams = [];
let currentIcon = null;

// Default hall configurations
let hallConfigurations = [
    { name: 'Montag', type: 'Zweifeldhalle' },
    { name: 'Dienstag', type: 'Einfeldhalle' },
    { name: 'Mittwoch', type: 'Einfeldhalle' },
    { name: 'Donnerstag', type: 'Zweifeldhalle' }
];

// Default configuration
const defaultConfig = {
  "variants": [
    {
      "name": "Variante A",
      "days": [
        {
          "day": "Montag",
          "hallType": "Zweifeldhalle",
          "fields": [
            [
              {
                "name": "KMP",
                "class": "KMP"
              },
              {
                "name": "Blockbusters",
                "class": "Blockbusters"
              }
            ],
            [
              {
                "name": "Sexy-Licious",
                "class": "Sexy-Licious"
              },
              {
                "name": "Blockjobs",
                "class": "Blockjobs"
              }
            ]
          ]
        },
        {
          "day": "Dienstag",
          "hallType": "Einfeldhalle",
          "fields": [
            [
              {
                "name": "BaggerBuben",
                "class": "BaggerBuben"
              },
              {
                "name": "HitHappens",
                "class": "HitHappens"
              }
            ]
          ]
        },
        {
          "day": "Mittwoch",
          "hallType": "Einfeldhalle",
          "fields": [
            [
              {
                "name": "Blockbusters",
                "class": "Blockbusters"
              },
              {
                "name": "Sexy-Licious",
                "class": "Sexy-Licious"
              }
            ]
          ]
        },
        {
          "day": "Donnerstag",
          "hallType": "Zweifeldhalle",
          "fields": [
            [
              {
                "name": "KMP",
                "class": "KMP"
              },
              {
                "name": "Blockjobs",
                "class": "Blockjobs"
              }
            ],
            [
              {
                "name": "HitHappens",
                "class": "HitHappens"
              },
              {
                "name": "BaggerBuben",
                "class": "BaggerBuben"
              }
            ]
          ]
        }
      ]
    },
    {
      "name": "Variante B",
      "days": [
        {
          "day": "Montag",
          "hallType": "Zweifeldhalle",
          "fields": [
            [
              {
                "name": "KMP",
                "class": "KMP"
              },
              {
                "name": "Blockbusters",
                "class": "Blockbusters"
              }
            ],
            [
              {
                "name": "Sexy-Licious",
                "class": "Sexy-Licious"
              },
              {
                "name": "Blockjobs",
                "class": "Blockjobs"
              }
            ]
          ]
        },
        {
          "day": "Dienstag",
          "hallType": "Einfeldhalle",
          "fields": [
            [
              {
                "name": "BaggerBuben",
                "class": "BaggerBuben"
              },
              {
                "name": "HitHappens",
                "class": "HitHappens"
              }
            ]
          ]
        },
        {
          "day": "Mittwoch",
          "hallType": "Einfeldhalle",
          "fields": [
            [
              {
                "name": "KMP",
                "class": "KMP"
              },
              {
                "name": "Blockjobs",
                "class": "Blockjobs"
              }
            ]
          ]
        },
        {
          "day": "Donnerstag",
          "hallType": "Zweifeldhalle",
          "fields": [
            [
              {
                "name": "Blockbusters",
                "class": "Blockbusters"
              },
              {
                "name": "Sexy-Licious",
                "class": "Sexy-Licious"
              }
            ],
            [
              {
                "name": "HitHappens",
                "class": "HitHappens"
              },
              {
                "name": "BaggerBuben",
                "class": "BaggerBuben"
              }
            ]
          ]
        }
      ]
    }
  ],
  "customTeams": [],
  "hallConfigurations": [
    {
      "name": "Montag",
      "type": "Zweifeldhalle"
    },
    {
      "name": "Dienstag",
      "type": "Einfeldhalle"
    },
    {
      "name": "Mittwoch",
      "type": "Einfeldhalle"
    },
    {
      "name": "Donnerstag",
      "type": "Zweifeldhalle"
    }
  ]
};

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
    
    // Hide trash zone
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
            // Reset opacity since we're not deleting
            draggedElement.style.opacity = "1";
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
    if (draggedElement) {
        draggedElement.style.opacity = "1";
    }
    
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
            // Move the team to the new container
            draggedElement.parentNode.removeChild(draggedElement);
            dropTarget.appendChild(draggedElement);
            return;
        }
        
        // Check if the container already has teams
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

// Initialize drag events for the trash zone
document.addEventListener('DOMContentLoaded', function() {
    const trashZone = document.getElementById('trash-zone');
    
    // Hide trash zone when drag ends and reset opacity
    document.addEventListener('dragend', function() {
        // Reset opacity of dragged element
        if (draggedElement) {
            draggedElement.style.opacity = "1";
        }
        
        trashZone.classList.remove('visible');
        removeActionIcons();
    });
});

function saveConfiguration() {
    // Collect all variants data
    const config = {
        variants: [],
        customTeams: customTeams,
        hallConfigurations: hallConfigurations
    };
    
    // Get all variant containers including custom variants
    const allVariantContainers = document.querySelectorAll('.hall-container');
    
    // Loop through all variants
    allVariantContainers.forEach(variant => {
        const variantId = variant.id;
        // Get the header (previous sibling)
        const header = variant.previousElementSibling;
        if (header && header.classList.contains('variant-header')) {
            const name = header.querySelector('h2').textContent;
            config.variants.push({
                name: name,
                days: collectDayData(variantId)
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
    // First, clear all variants
    const customVariantsContainer = document.getElementById('custom-variants-container');
    customVariantsContainer.innerHTML = '';
    
    // Remove default variants A and B
    const variantA = document.getElementById('variant-a');
    const variantB = document.getElementById('variant-b');
    
    if (variantA) {
        const variantAHeader = variantA.previousElementSibling;
        if (variantAHeader && variantAHeader.classList.contains('variant-header')) {
            variantAHeader.remove();
        }
        variantA.remove();
    }
    
    if (variantB) {
        const variantBHeader = variantB.previousElementSibling;
        if (variantBHeader && variantBHeader.classList.contains('variant-header')) {
            variantBHeader.remove();
        }
        variantB.remove();
    }
    
    // Reset custom variant count
    customVariantCount = 0;
    
    // Apply hall configurations if they exist in the config
    if (config.hallConfigurations && Array.isArray(config.hallConfigurations)) {
        hallConfigurations = config.hallConfigurations;
    }
    
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
        // Create all variants from the config
        config.variants.forEach((variant, index) => {
            // Extract days from the variant data
            const days = variant.days ? variant.days.map(day => day.day) : null;
            
            // Create a new variant with the name and days from the config
            createNewVariant(variant.name, days);
            const variantId = 'custom-variant-' + customVariantCount;
            applyVariantData(variantId, variant.days);
        });
    }
    
    // Refresh team palette
    refreshTeamPalette();
    
    // Update team counters after loading configuration
    if (typeof updateTeamCounters === 'function') {
        setTimeout(updateTeamCounters, 100); // Small delay to ensure DOM is fully updated
    }
    
    // Make all variant names editable
    document.querySelectorAll('.variant-header h2').forEach(heading => {
        if (!heading.contentEditable || heading.contentEditable === 'false') {
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
                    heading.textContent = heading.dataset.originalText;
                }
                // Update any references to this variant
                if (typeof updateTeamCounters === 'function') {
                    updateTeamCounters();
                }
            });
            heading.addEventListener('keydown', function(e) {
                // Save on Enter key
                if (e.key === 'Enter') {
                    e.preventDefault();
                    heading.blur();
                }
                // Cancel on Escape key
                if (e.key === 'Escape') {
                    heading.textContent = heading.dataset.originalText;
                    heading.blur();
                }
            });
        }
    });
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
    
    // Make sure to update team counters after applying data
    if (typeof updateTeamCounters === 'function') {
        setTimeout(updateTeamCounters, 50);
    }
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
    
    // Make all variant names editable
    document.querySelectorAll('.variant-header h2').forEach(heading => {
        if (!heading.contentEditable || heading.contentEditable === 'false') {
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
                    heading.textContent = heading.dataset.originalText;
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
                    heading.textContent = heading.dataset.originalText;
                    heading.blur();
                }
            });
        }
    });
    
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
    
    // Remove edit button since we can edit directly
    /*
    const editButton = document.createElement('button');
    editButton.className = 'edit-variant-btn';
    editButton.textContent = '✏️';
    editButton.onclick = function() { renameVariant(variantId); };
    variantActions.appendChild(editButton);
    */
    
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
    const dayName = prompt('Bitte gib den Namen des Tages ein (z.B. Freitag):');
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

// Update the variant header to include an "Add Day" button
function updateVariantHeaders() {
    document.querySelectorAll('.variant-header').forEach(header => {
        // Check if the header already has an "Add Day" button
        if (!header.querySelector('.add-day-btn')) {
            const addDayBtn = document.createElement('button');
            addDayBtn.className = 'add-day-btn';
            addDayBtn.textContent = '📅+';
            addDayBtn.title = 'Tag hinzufügen';
            
            // Find the associated variant ID
            const variantContainer = header.nextElementSibling;
            if (variantContainer && variantContainer.classList.contains('hall-container')) {
                const variantId = variantContainer.id;
                addDayBtn.onclick = function() { addCustomDay(variantId); };
                
                // Add the button to the variant actions container
                const actionsContainer = header.querySelector('.variant-actions');
                if (actionsContainer) {
                    actionsContainer.insertBefore(addDayBtn, actionsContainer.firstChild);
                }
            }
        }
    });
}

// Call this function when the page loads and after creating variants
document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // Update variant headers to add "Add Day" buttons
    updateVariantHeaders();
});

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

// Function to reset to a fresh setup
function resetToFreshSetup() {
    if (confirm('Möchten Sie wirklich alle Daten löschen und mit einer leeren Konfiguration neu starten?')) {
        // Clear all variants
        const customVariantsContainer = document.getElementById('custom-variants-container');
        customVariantsContainer.innerHTML = '';
        
        // Reset custom variant count
        customVariantCount = 0;
        
        // Reset custom teams
        customTeams = [];
        
        // Reset hall configurations to default
        hallConfigurations = [
            { name: 'Montag', type: 'Zweifeldhalle' },
            { name: 'Dienstag', type: 'Einfeldhalle' },
            { name: 'Mittwoch', type: 'Einfeldhalle' },
            { name: 'Donnerstag', type: 'Zweifeldhalle' }
        ];
        
        // Update team counters
        if (typeof updateTeamCounters === 'function') {
            updateTeamCounters();
        }
        
        // Refresh team palette
        refreshTeamPalette();
    }
}

// Load default configuration on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize color picker preview
    const colorPicker = document.getElementById('new-team-color');
    const colorPreview = document.getElementById('color-preview');
    
    colorPicker.addEventListener('input', function() {
        colorPreview.style.backgroundColor = this.value;
    });
    
    // Load default configuration
    applyConfiguration(defaultConfig);
    
    // Update variant headers to add "Add Day" buttons
    updateVariantHeaders();
    
    // Make all variant names editable
    document.querySelectorAll('.variant-header h2').forEach(heading => {
        if (!heading.contentEditable || heading.contentEditable === 'false') {
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
                    heading.textContent = heading.dataset.originalText;
                }
                // Update any references to this variant
                if (typeof updateTeamCounters === 'function') {
                    updateTeamCounters();
                }
            });
            heading.addEventListener('keydown', function(e) {
                // Save on Enter key
                if (e.key === 'Enter') {
                    e.preventDefault();
                    heading.blur();
                }
                // Cancel on Escape key
                if (e.key === 'Escape') {
                    heading.textContent = heading.dataset.originalText;
                    heading.blur();
                }
            });
        }
    });
}); 