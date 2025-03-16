// Drag and drop functionality

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