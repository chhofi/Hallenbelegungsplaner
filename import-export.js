// Import/Export functionality

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