// Content script for iNat2Wiki Button extension
(function() {
    'use strict';
    
    // Function to extract observation ID from URL
    function getObservationId() {
        const path = window.location.pathname;
        const match = path.match(/\/observations\/(\d+)/);
        return match ? match[1] : null;
    }
    
    // Function to create and add the button
    function addToolforgeButton() {
        const observationId = getObservationId();
        if (!observationId) return;
        
        // Check if button already exists
        if (document.getElementById('toolforge-button')) return;
        
        // Create the button
        const button = document.createElement('button');
        button.id = 'toolforge-button';
        button.innerHTML = '🔗 Open in iNat2Wiki';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #74ac00;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background 0.2s;
        `;
        
        // Add hover effect
        button.addEventListener('mouseover', () => {
            button.style.background = '#5a8000';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.background = '#74ac00';
        });
        
        // Add click handler
        button.addEventListener('click', function() {
            const toolforgeUrl = `https://inat2wiki-dev.toolforge.org/parse/${observationId}`;
            window.open(toolforgeUrl, '_blank');
        });
        
        // Add the button to the page
        document.body.appendChild(button);
    }
    
    // Wait for page to load and add button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addToolforgeButton);
    } else {
        addToolforgeButton();
    }
    
    // Watch for navigation changes (for single-page app behavior)
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Remove existing button first
            const existingButton = document.getElementById('toolforge-button');
            if (existingButton) {
                existingButton.remove();
            }
            // Add button after a small delay for page to update
            setTimeout(addToolforgeButton, 500);
        }
    });
    
    observer.observe(document, { 
        subtree: true, 
        childList: true 
    });
})();