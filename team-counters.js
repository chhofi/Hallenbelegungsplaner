// Team counter functionality

// Function to update team counters
function updateTeamCounters() {
    const counterContainer = document.getElementById('team-counter-container');
    counterContainer.innerHTML = ''; // Clear existing counters
    
    // Get all variants
    const variants = document.querySelectorAll('.hall-container');
    
    // If no variants exist yet, show a message and return
    if (variants.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Keine Varianten vorhanden. Bitte fügen Sie eine Variante hinzu.';
        message.style.textAlign = 'center';
        message.style.color = '#777';
        counterContainer.appendChild(message);
        return;
    }
    
    const teamCounts = {};
    
    // Dynamically identify all days from all variants
    const daysCounts = {};
    
    // First collect all day names from all variants
    variants.forEach(variant => {
        const dayElements = variant.querySelectorAll('.hall h3');
        dayElements.forEach(dayEl => {
            const dayName = dayEl.textContent;
            if (!daysCounts[dayName]) {
                daysCounts[dayName] = {};
            }
        });
    });
    
    // Initialize team counts for each variant
    variants.forEach(variant => {
        const variantId = variant.id;
        teamCounts[variantId] = {};
        
        // Get all teams in the palette
        const paletteTeams = document.querySelectorAll('.palette-team');
        paletteTeams.forEach(team => {
            const teamName = team.textContent;
            teamCounts[variantId][teamName] = 0;
            
            // Initialize day counts for each team
            Object.keys(daysCounts).forEach(day => {
                if (!daysCounts[day][teamName]) {
                    daysCounts[day][teamName] = 0;
                }
            });
        });
        
        // Count teams in this variant
        const teamsInVariant = variant.querySelectorAll('.team');
        teamsInVariant.forEach(team => {
            const teamName = team.textContent;
            if (teamCounts[variantId][teamName] !== undefined) {
                teamCounts[variantId][teamName]++;
                
                // Count by day too
                const hall = team.closest('.hall');
                if (hall) {
                    const day = hall.querySelector('h3').textContent;
                    if (daysCounts[day] && daysCounts[day][teamName] !== undefined) {
                        daysCounts[day][teamName]++;
                    }
                }
            }
        });
    });
    
    // Create a table for team counts
    const table = document.createElement('table');
    table.className = 'team-counter-table';
    
    // Create header row with variant names
    const headerRow = document.createElement('tr');
    const headerTeamCell = document.createElement('th');
    headerTeamCell.textContent = 'Team';
    headerRow.appendChild(headerTeamCell);
    
    // Add variant headers
    Object.keys(teamCounts).forEach(variantId => {
        const variantHeader = document.querySelector(`#${variantId}`).previousElementSibling;
        const variantName = variantHeader.querySelector('h2').textContent;
        const headerCell = document.createElement('th');
        headerCell.textContent = variantName;
        headerRow.appendChild(headerCell);
    });
    
    // Add day headers - sort them in a logical order
    const sortedDays = Object.keys(daysCounts).sort((a, b) => {
        // Define the order of days
        const dayOrder = {
            'Montag': 1,
            'Dienstag': 2,
            'Mittwoch': 3,
            'Donnerstag': 4,
            'Freitag': 5,
            'Samstag': 6,
            'Sonntag': 7
        };
        
        // If the day is in our order map, use that order, otherwise alphabetical
        return (dayOrder[a] || 100) - (dayOrder[b] || 100);
    });
    
    sortedDays.forEach(day => {
        const headerCell = document.createElement('th');
        headerCell.textContent = day;
        headerCell.classList.add('day-header');
        headerRow.appendChild(headerCell);
    });
    
    table.appendChild(headerRow);
    
    // Create rows for each team
    const teamNames = Object.keys(teamCounts[Object.keys(teamCounts)[0]] || {});
    
    // Get computed styles for each team to extract their colors
    const teamColors = {};
    teamNames.forEach(teamName => {
        // Find the team element in the palette to get its color
        const teamClass = teamName.replace(/\s+/g, '');
        const teamElement = document.querySelector(`.palette-team.${teamClass}`);
        if (teamElement) {
            const computedStyle = window.getComputedStyle(teamElement);
            teamColors[teamName] = computedStyle.backgroundColor;
        }
    });
    
    teamNames.forEach(teamName => {
        const row = document.createElement('tr');
        
        // Add team name cell
        const teamCell = document.createElement('td');
        teamCell.className = 'team-name-cell';
        teamCell.textContent = teamName;
        
        // Apply the team's color directly to the row
        if (teamColors[teamName]) {
            row.style.backgroundColor = teamColors[teamName];
        }
        
        row.appendChild(teamCell);
        
        // Add count cells for each variant
        Object.keys(teamCounts).forEach(variantId => {
            const count = teamCounts[variantId][teamName] || 0;
            const countCell = document.createElement('td');
            countCell.className = 'count-cell';
            countCell.textContent = count + 'x';
            
            // Highlight cells with higher counts
            if (count >= 2) {
                countCell.classList.add('count-high');
            } else if (count === 0) {
                countCell.classList.add('count-zero');
            }
            
            row.appendChild(countCell);
        });
        
        // Add count cells for each day
        sortedDays.forEach(day => {
            const count = daysCounts[day][teamName] || 0;
            const countCell = document.createElement('td');
            countCell.className = 'count-cell day-count-cell';
            countCell.textContent = count + 'x';
            
            // Highlight cells with higher counts
            if (count >= 2) {
                countCell.classList.add('count-high');
            } else if (count === 0) {
                countCell.classList.add('count-zero');
            }
            
            row.appendChild(countCell);
        });
        
        table.appendChild(row);
    });
    
    counterContainer.appendChild(table);
} 