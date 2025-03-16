// Global variables
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

// Initialize on page load
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
    
    // Add delete buttons to all halls
    addDeleteButtonsToHalls();
    
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
    
    // Initialize drag events for the trash zone
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