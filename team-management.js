// Team management functionality

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

// Helper function to check if a team is a custom team
function isCustomTeam(element) {
    const className = Array.from(element.classList)
        .find(cls => cls !== 'palette-team');
    
    const standardTeams = ['KMP', 'Blockbusters', 'Sexy-Licious', 'Blockjobs', 'BaggerBuben', 'HitHappens'];
    return !standardTeams.includes(className) && customTeams.includes(className);
} 